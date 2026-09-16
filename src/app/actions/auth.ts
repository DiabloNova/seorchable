/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { User, Session, UserRole } from "@/types/auth";
import { createSession, invalidateSession, getSession } from "@/services/auth/session";
import { TenantContextManager } from "@/core/database/tenant-context";
import { randomUUID } from "crypto";
import * as crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import * as argon2 from "argon2";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/services/rate-limit/auth-limiter";

const ARGON2_OPTIONS: any = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2
};

async function progressiveDelay(attempts: number): Promise<void> {
  if (attempts >= 6) {
    return; // Challenge handled elsewhere
  }
  let delay = 0;
  if (attempts === 3) delay = 20000;
  else if (attempts === 4) delay = 5 * 60 * 1000;
  else if (attempts >= 5) delay = 60 * 60 * 1000;

  if (delay > 0) {
    await new Promise(r => setTimeout(r, delay));
  }
}

/**
 * Generates a dummy hash using Argon2id with required parameters.
 * We cache it globally per process to ensure constant time execution without overhead.
 */
let dummyHash: string | null = null;
async function getDummyHash(): Promise<string> {
  if (!dummyHash) {
    dummyHash = await argon2.hash("dummy_password_for_timing", ARGON2_OPTIONS as any) as unknown as string;
  }
  return dummyHash!;
}

/**
 * Authenticates user, resolves identity/workspace strictly on the server, and establishes a secure signed session.
 */
export async function loginAction(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!password) {
    throw new Error("Password is required");
  }

  const ip = await getClientIp();
  await checkRateLimit("login", ip, 10, 60); // 10 attempts per minute per IP
  await checkRateLimit("login-email", normalizedEmail, 10, 60);

  // Step 1: Pre-auth data fetch. No locks held.
  let userRecord: any = null;
  await TenantContextManager.runWithSystemContext(null, "sys-login", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Failed to get DB client in system context");

    // Fetch the user
    const { rows } = await client.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [normalizedEmail]);
    userRecord = rows[0];
  });

  if (!userRecord) {
    // Unknown account anti-enumeration: Run dummy hash, simulate a basic user delay (0 attempts = 0 delay)
    await getDummyHash();
    await argon2.verify(dummyHash!, password);
    throw new Error("Invalid credentials or user not found.");
  }

  if (userRecord.email_verified === false || userRecord.email_verified === 0) {
    await getDummyHash();
    await argon2.verify(dummyHash!, password);
    throw new Error("Invalid credentials or user not found.");
  }

  if (userRecord.is_active === 0 || userRecord.is_active === false) {
    await getDummyHash();
    await argon2.verify(dummyHash!, password);
    throw new Error("Invalid credentials or user not found.");
  }

  // Check hard locks
  // Note: These distinct secondary messages are intentional security guardrails after the initial lookup.
  // They apply to valid users who are locked or challenged, and they do not weaken our anti-enumeration for invalid accounts.
  if (userRecord.locked_until && new Date(userRecord.locked_until) > new Date()) {
    throw new Error("Account is temporarily locked due to too many failed attempts. Please try again later.");
  }

  // Trusted IP check
  if (userRecord.trusted_ips && userRecord.trusted_ips.length > 0) {
    if (!userRecord.trusted_ips.includes(ip) && ip !== "unknown") {
      throw new Error("Login from untrusted IP address requires verification.");
    }
  }

  // Enforce Challenge
  if (userRecord.failed_login_attempts >= 6 || userRecord.challenge_required) {
    throw new Error("Challenge required before password verification.");
  }

  // Progressive Delays
  await progressiveDelay(userRecord.failed_login_attempts);

  // Argon2 Verification (outside of any DB lock/transaction)
  let isValid = false;
  if (userRecord.password_hash) {
    isValid = await argon2.verify(userRecord.password_hash, password);
  } else {
    // If user exists but has no hash (e.g. legacy/SSO only), still run dummy for anti-enumeration
    await getDummyHash();
    await argon2.verify(dummyHash!, password);
  }

  // Step 2: Post-auth state update
  return await TenantContextManager.runWithSystemContext(null, "sys-login-update", async () => {
    const client = TenantContextManager.getDbClient();

    if (!isValid) {
      // True Atomic increment of failure accounting using Postgres concurrency
      const { rows } = await client.query(
        `UPDATE users
         SET failed_login_attempts = failed_login_attempts + 1
         WHERE id = $1
         RETURNING failed_login_attempts`,
        [userRecord.id]
      );

      const newFailures = rows[0]?.failed_login_attempts || 0;

      if (newFailures >= 6) {
        const lockedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        await client.query(
          `UPDATE users
           SET challenge_required = 1, locked_until = $1
           WHERE id = $2`,
          [lockedUntil, userRecord.id]
        );
      }

      throw new Error("Invalid credentials or user not found.");
    }

    // Successful login: Reset failures and set last IP
    await client.query(
      "UPDATE users SET failed_login_attempts = 0, challenge_required = 0, locked_until = NULL, last_login_ip = $1 WHERE id = $2",
      [ip, userRecord.id]
    );

    // Fetch tenant membership
    const { rows: memberRows } = await client.query(`
        SELECT m.organization_id as "workspaceId", m.role, o.name as "workspaceName"
        FROM organization_members m
        JOIN organizations o ON m.organization_id = o.id
        WHERE m.user_id = $1 AND o.deleted_at IS NULL
        LIMIT 1
    `, [userRecord.id]);

    const memberRecord = memberRows[0];
    if (!memberRecord) {
        throw new Error("Invalid credentials or user not found.");
    }

    const authResult: User = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: memberRecord.role as UserRole,
        workspaceId: memberRecord.workspaceId,
        sessionVersion: userRecord.session_version || 1,
    };

    await createSession(authResult);
    return authResult;
  });
}

export async function verifyEmailAction(token: string): Promise<boolean> {
  const ip = await getClientIp();
  await checkRateLimit("verify", ip, 5, 60); // 5 attempts per minute

  if (!token) {
    throw new Error("Invalid verification token format.");
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  return await TenantContextManager.runWithSystemContext(null, "sys-verify-email", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) {
      throw new Error("Failed to get DB client in system context");
    }

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        "SELECT * FROM verification_tokens WHERE token_hash = $1 FOR UPDATE",
        [tokenHash]
      );

      const tokenRecord = rows[0];

      if (!tokenRecord) {
        throw new Error("Invalid or expired verification token.");
      }

      if (tokenRecord.used_at) {
        throw new Error("This verification token has already been used.");
      }

      if (new Date(tokenRecord.expires_at) < new Date()) {
        throw new Error("This verification token has expired.");
      }

      // Mark token as used
      await client.query(
        "UPDATE verification_tokens SET used_at = now() WHERE id = $1",
        [tokenRecord.id]
      );

      // Verify user
      await client.query(
        "UPDATE users SET email_verified = true, email_verified_at = now() WHERE id = $1",
        [tokenRecord.user_id]
      );

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}

/**
 * Resends the verification email for the given email.
 */
export async function resendVerificationAction(email: string, locale: string = "fa"): Promise<void> {
  const ip = await getClientIp();
  await checkRateLimit("resend", ip, 3, 60); // 3 resends per minute

  const normalizedEmail = email.trim().toLowerCase();
  await checkRateLimit("resend-email", normalizedEmail, 3, 60);

  await TenantContextManager.runWithSystemContext(null, "sys-resend-verification", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) {
      throw new Error("Failed to get DB client in system context");
    }

    const { rows } = await client.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [normalizedEmail]);
    const userRecord = rows[0];

    if (!userRecord || userRecord.email_verified) {
      // Don't leak whether the account exists or is already verified to avoid enumeration
      await new Promise(r => setTimeout(r, 50));
      return;
    }

    // Generate new token and invalidate old ones or simply create a new one
    const verificationToken = crypto.randomBytes(32).toString('base64url');
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await client.query("BEGIN");

      // Soft 'invalidate' existing pending tokens for this user by marking them used
      await client.query("UPDATE verification_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL", [userRecord.id]);

      await client.query("INSERT INTO verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)", [userRecord.id, tokenHash, expiresAt.toISOString()]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.seorchable.com'}/${locale}/verify-email?token=${verificationToken}`;
    sendVerificationEmail(email, userRecord.name, verificationLink).catch((err) => {
      console.error("Failed to resend verification email:", err);
    });
  });
}

/**
 * Requests a password reset and sends a password reset email to the user.
 */
export async function requestPasswordResetAction(email: string, locale: string = "fa"): Promise<void> {
  const ip = await getClientIp();
  await checkRateLimit("req-reset", ip, 3, 60); // 3 requests per minute

  const normalizedEmail = email.trim().toLowerCase();
  await checkRateLimit("req-reset-email", normalizedEmail, 3, 60);
  await TenantContextManager.runWithSystemContext(null, "sys-password-reset", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) {
        throw new Error("Failed to get DB client in system context");
    }

    const { rows: userRows } = await client.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [normalizedEmail]);
    const userRecord = userRows[0];

    if (userRecord) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await client.query("INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)", [userRecord.id, tokenHash, expiresAt.toISOString()]);

      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.seorchable.com'}/${locale}/reset-password?token=${resetToken}`;

      sendPasswordResetEmail(email, resetLink).catch((err) => {
        console.error("Failed to send password reset email:", err);
      });
    } else {
      // Mock constant time for anti-enumeration
      await new Promise(r => setTimeout(r, 50));
    }
  });
}

/**
 * Resets the user's password using a valid reset token.
 */
export async function resetPasswordAction(token: string, newPassword: string): Promise<boolean> {
  const ip = await getClientIp();
  await checkRateLimit("reset-pw", ip, 5, 60);

  if (!token || !newPassword) {
    throw new Error("Token and new password are required.");
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const hashedPassword = await argon2.hash(newPassword, ARGON2_OPTIONS as any) as unknown as string;

  return await TenantContextManager.runWithSystemContext(null, "sys-reset-password", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) {
      throw new Error("Failed to get DB client in system context");
    }

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        "SELECT * FROM password_reset_tokens WHERE token_hash = $1 FOR UPDATE",
        [tokenHash]
      );

      const tokenRecord = rows[0];

      if (!tokenRecord) {
        throw new Error("Invalid or expired password reset token.");
      }

      if (tokenRecord.used_at) {
        throw new Error("This password reset token has already been used.");
      }

      if (new Date(tokenRecord.expires_at) < new Date()) {
        throw new Error("This password reset token has expired.");
      }

      // Mark token as used
      await client.query(
        "UPDATE password_reset_tokens SET used_at = now() WHERE id = $1",
        [tokenRecord.id]
      );

      // Update user password, unlock if locked, and bump session_version to globally invalidate existing sessions
      await client.query(
        "UPDATE users SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL, challenge_required = 0, session_version = session_version + 1 WHERE id = $2",
        [hashedPassword, tokenRecord.user_id]
      );

      // Clear the current active session cookie for this device
      await invalidateSession();

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}

/**
 * Registers user and resolves identity/workspace strictly on the server.
 */
export async function registerAction(name: string, email: string, password: string, workspaceName: string, locale: string = "fa"): Promise<{ success: boolean; email: string }> {
  const ip = await getClientIp();
  await checkRateLimit("register", ip, 5, 60);

  const normalizedEmail = email.trim().toLowerCase();
  if (!password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await argon2.hash(password, ARGON2_OPTIONS as any) as unknown as string;

  // Generate a secure random high-entropy token
  const verificationToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const accountCreated = await TenantContextManager.runWithSystemContext(null, "sys-register", async () => {
    const client = TenantContextManager.getDbClient();
    if (!client) {
        throw new Error("Failed to get DB client in system context");
    }

    // Check if user exists
    const { rows: existingUser } = await client.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
    if (existingUser.length > 0) {
        // Run dummy hash to equalize timing before returning false
        await getDummyHash();
        await argon2.verify(dummyHash!, password);
        return false;
    }

    const userId = randomUUID();

    try {
      await client.query("BEGIN");

      // Create User (active but unverified)
      await client.query("INSERT INTO users (id, name, email, password_hash, is_active, email_verified, email_verified_at) VALUES ($1, $2, $3, $4, true, false, null)", [userId, name, normalizedEmail, hashedPassword]);

      // Create Organization (Workspace)
      const orgId = randomUUID();
      const orgSlug = `${workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomUUID().slice(0,4)}`;

      await client.query("INSERT INTO organizations (id, name, slug) VALUES ($1, $2, $3)", [orgId, workspaceName, orgSlug]);

      // Create Membership
      await client.query("INSERT INTO organization_members (organization_id, user_id, role) VALUES ($1, $2, $3)", [orgId, userId, "super_admin"]);

      // Create Verification Token
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await client.query("INSERT INTO verification_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)", [userId, tokenHash, expiresAt.toISOString()]);

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

  if (accountCreated) {
    // Send email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.seorchable.com'}/${locale}/verify-email?token=${verificationToken}`;
    sendVerificationEmail(email, name, verificationLink).catch((err) => {
      console.error("Failed to send verification email:", err);
    });
  } else {
    // We already returned a generic success. Let's send an email out of band so we don't leak info through timing.
    // Technically, to have identical timing, we would do an Argon2 dummy hash inside the query context if it exists.
    // We will do that right above this in the query execution.
    const { sendAccountExistsEmail } = await import("@/lib/email");
    const loginLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.seorchable.com'}/${locale}/login`;
    sendAccountExistsEmail(email, loginLink).catch(err => {
      console.error("Failed to send generic account existing email:", err);
    });
  }

  return { success: true, email: normalizedEmail };
}

/**
 * Clears secure cookies and invalidates the session on logout.
 */
export async function logoutAction() {
  await invalidateSession();
}

/**
 * Securely verifies and returns the current server-validated session state for client synchronization.
 */
export async function getServerSessionAction(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    return { user: null, expiresAt: null, status: "unauthenticated" };
  }
  return session;
}
