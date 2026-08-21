"use server";

import { User, Session } from "@/types/auth";
import { createSession, invalidateSession, getSession } from "@/services/auth/session";
import { checkRateLimit, clearRateLimit } from "@/services/auth/rate-limiter";
import { getUser, createUser } from "@/services/auth/user-store";
import { verifyPassword, hashPassword } from "@/services/auth/password";

/**
 * Authenticates user, resolves identity/workspace strictly on the server, and establishes a secure signed session.
 */
export async function loginAction(email: string, password?: string): Promise<User> {
  // Rate limit: 5 attempts per 15 minutes per email
  await checkRateLimit(`login:${email}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });

  if (!password) {
    throw new Error("Invalid credentials");
  }

  let user = await getUser(email);

  if (!user) {
    // Fail securely and generically if user doesn't exist, to prevent account enumeration
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Clean up user object before sending it to the client
  const safeUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
  };

  await createSession(safeUser);
  await clearRateLimit(`login:${email}`);
  return safeUser;
}

/**
 * Registers user, resolves identity/workspace strictly on the server, and establishes a secure signed session.
 */
export async function registerAction(name: string, email: string, password?: string): Promise<User> {
  // Rate limit: 5 attempts per 15 minutes per email
  await checkRateLimit(`register:${email}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });

  if (!password) {
    throw new Error("Password is required for registration");
  }

  const existingUser = await getUser(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = {
    id: `usr-${Math.random().toString(36).substring(2, 11)}`,
    name,
    email,
    role: "workspace_admin" as const,
    workspaceId: "ws-default",
    passwordHash
  };

  await createUser(user);

  const safeUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
  };

  await createSession(safeUser);
  await clearRateLimit(`register:${email}`);
  return safeUser;
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
