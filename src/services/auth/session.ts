import { cookies as nextCookies } from "next/headers";
import crypto from "crypto";
import { User, Session, UserRole } from "@/types/auth";
import { TenantContextManager } from "@/core/database/tenant-context";
import { getCachedData, setCachedData } from "@/lib/redis";

let cookiesFn = nextCookies;

type CookieStoreLike = {
  get: (name: string) => { value?: string } | undefined;
  set: (name: string, value: string, options?: Record<string, unknown>) => void;
  delete: (name: string) => void;
};

/**
 * Utility to override cookies function for unit testing environments.
 */
export function setCookiesMock(mockFn: () => Promise<CookieStoreLike>) {
  cookiesFn = mockFn as unknown as typeof nextCookies;
}

const COOKIE_NAME = "seorchable_session";
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const VALID_ROLES = new Set<UserRole>(["super_admin", "workspace_admin", "viewer"]);

let devFallbackSecret: string | null = null;

// Server-side set of invalidated session identifiers (in-memory registry + Redis fallback)
const invalidatedSessionIds = new Set<string>();

/**
 * Resolves the session secret.
 * Enforces SESSION_SECRET in production and fails closed if missing.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.trim().length > 0) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is missing in production.");
  }
  if (!devFallbackSecret) {
    devFallbackSecret = crypto.randomBytes(32).toString("hex");
  }
  return devFallbackSecret;
}

interface SessionPayload {
  sessionId: string;
  userId: string;
  expiresAt: string;
}

export function signPayload(payloadStr: string): string {
  const secret = getSessionSecret();
  return crypto.createHmac("sha256", secret).update(payloadStr).digest("hex");
}

export function verifyPayload(payloadStr: string, signature: string): boolean {
  const expected = signPayload(payloadStr);
  if (signature.length !== expected.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed, integrity-protected server session and sets secure cookies.
 */
export async function createSession(user: User): Promise<void> {
  if (
    !user ||
    typeof user.id !== "string" ||
    !user.id ||
    typeof user.email !== "string" ||
    !user.email ||
    typeof user.workspaceId !== "string" ||
    !user.workspaceId ||
    typeof user.role !== "string" ||
    !VALID_ROLES.has(user.role)
  ) {
    throw new Error("Invalid user data for session creation.");
  }

  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
  const sessionId = `sess_${crypto.randomBytes(24).toString("hex")}`;

  const payload: SessionPayload = {
    sessionId,
    userId: user.id,
    expiresAt: expiresAt.toISOString(),
  };

  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadStr).toString("base64url");
  const signature = signPayload(payloadBase64);
  const cookieValue = `${payloadBase64}.${signature}`;

  const cookieStore = await cookiesFn();
  cookieStore.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  // Set plain cookies strictly as compatibility headers; NOT treated as authoritative on the server
  cookieStore.set("tenant_id", user.workspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  cookieStore.set("user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

/**
 * Checks whether a session ID has been invalidated on the server.
 */
async function isSessionInvalidated(sessionId: string): Promise<boolean> {
  if (invalidatedSessionIds.has(sessionId)) {
    return true;
  }
  const redisRevoked = await getCachedData<boolean>(`revoked_session:${sessionId}`);
  return redisRevoked === true;
}

/**
 * Parses and verifies the signed server session cookie.
 * Ensures session expiration and invalidation are enforced server-side.
 * Resolves user identity, role, and workspace authoritatively from persistent server-side state.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookiesFn();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return null;
    }

    const parts = cookie.value.split(".");
    if (parts.length !== 2) {
      return null;
    }

    const [payloadBase64, signature] = parts;
    if (!verifyPayload(payloadBase64, signature)) {
      return null;
    }

    const payloadStr = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadStr) as SessionPayload;

    if (!payload || typeof payload !== "object") {
      return null;
    }
    if (typeof payload.sessionId !== "string" || !payload.sessionId) {
      return null;
    }
    if (typeof payload.userId !== "string" || !payload.userId) {
      return null;
    }
    if (typeof payload.expiresAt !== "string" || isNaN(Date.parse(payload.expiresAt))) {
      return null;
    }

    // 1. Enforce server-side session expiration
    if (new Date(payload.expiresAt) <= new Date()) {
      return null; // Expired
    }

    // 2. Enforce server-side session invalidation
    if (await isSessionInvalidated(payload.sessionId)) {
      return null; // Invalidation requested
    }

    // 3. Resolve identity authoritatively from persistent server-side state (database)
    const resolvedUser = await TenantContextManager.runWithSystemContext(
      payload.userId,
      "sys-session-resolve",
      async () => {
        const client = TenantContextManager.getDbClient();
        if (!client) {
          return null;
        }

        // Authoritatively fetch active persistent user and their organization member record
        const { rows } = await client.query(
          `SELECT u.id, u.name, u.email, u.is_active, m.organization_id as "workspaceId", m.role
           FROM users u
           LEFT JOIN organization_members m ON u.id = m.user_id
           LEFT JOIN organizations o ON m.organization_id = o.id AND o.deleted_at IS NULL
           WHERE u.id = $1 AND u.deleted_at IS NULL AND u.is_active = true
           LIMIT 1`,
          [payload.userId]
        );

        if (rows.length === 0) {
          return null;
        }

        const row = rows[0];
        if (!row.workspaceId || !row.role) {
          // User exists but has no active workspace membership
          return null;
        }

        return {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role as UserRole,
          workspaceId: row.workspaceId,
        };
      }
    ).catch(() => null);

    if (!resolvedUser) {
      return null;
    }

    return {
      user: resolvedUser,
      expiresAt: payload.expiresAt,
      status: "authenticated",
    };
  } catch {
    return null;
  }
}

/**
 * Asserts that an active, valid session exists on the server, otherwise fails closed by throwing an error.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: Active session is missing, invalid or expired.");
  }
  return session;
}

/**
 * Helper to retrieve only the User entity from a validated session.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const session = await getSession();
  return session ? session.user : null;
}

/**
 * Invalidates the authoritative session on the server and expires the cookies.
 */
export async function invalidateSession(): Promise<void> {
  try {
    const cookieStore = await cookiesFn();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (cookie && cookie.value) {
      const parts = cookie.value.split(".");
      if (parts.length === 2) {
        const [payloadBase64, signature] = parts;
        if (verifyPayload(payloadBase64, signature)) {
          const payloadStr = Buffer.from(payloadBase64, "base64url").toString("utf8");
          const payload = JSON.parse(payloadStr) as SessionPayload;
          if (payload.sessionId) {
            // Record server-side invalidation
            invalidatedSessionIds.add(payload.sessionId);
            await setCachedData(`revoked_session:${payload.sessionId}`, true, 86400);
          }
        }
      }
    }
    cookieStore.delete(COOKIE_NAME);
    cookieStore.delete("tenant_id");
    cookieStore.delete("user_id");
  } catch {
    // Fail closed safely
  }
}
