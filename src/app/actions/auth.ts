"use server";

import { cookies } from "next/headers";

/**
 * Sets secure, server-readable httpOnly cookies for the active tenant and user session.
 */
export async function loginAction(email: string, workspaceId: string = "ws-tehran", userId: string = "usr-1001") {
  const cookieStore = await cookies();

  cookieStore.set("tenant_id", workspaceId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  cookieStore.set("user_id", userId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

/**
 * Clears secure cookies on logout.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("tenant_id");
  cookieStore.delete("user_id");
}
