"use server";

import { User, Session } from "@/types/auth";
import { createSession, invalidateSession, getSession } from "@/services/auth/session";

/**
 * Sets secure, server-readable httpOnly cookies and establishes an authoritative server session.
 */
export async function loginAction(user: User) {
  await createSession(user);
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
