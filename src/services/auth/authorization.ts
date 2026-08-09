import { requireSession } from "./session";
import { UserRole } from "@/types/auth";

export class AuthorizationError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Asserts that the authenticated user has workspace membership access for the target workspaceId.
 * Under Task 2.1 specifications:
 * - A super_admin can access any workspace.
 * - Other roles are strictly restricted to their own session workspaceId.
 * - This prevents any cross-tenant workspace membership bypass.
 */
export async function requireWorkspaceMembership(userId: string, workspaceId: string): Promise<void> {
  const session = await requireSession();

  if (!session.user) {
    throw new AuthorizationError(401, "Unauthorized: No active session user.");
  }

  // A super_admin has access to all tenants/workspaces
  if (session.user.role === "super_admin") {
    return;
  }

  // Cross-tenant protection: If user's workspaceId doesn't match the requested workspaceId, deny access (IDOR / Spoof prevention)
  if (session.user.workspaceId !== workspaceId) {
    throw new AuthorizationError(403, "Forbidden: User is not a member of the requested workspace.");
  }
}

/**
 * Enforces RBAC permissions on the server.
 * Maps required roles to a hierarchy where:
 * - super_admin = 3
 * - workspace_admin = 2
 * - viewer = 1
 */
export async function requireRole(requiredRole: UserRole): Promise<void> {
  const session = await requireSession();
  if (!session.user) {
    throw new AuthorizationError(401, "Unauthorized: No active session user.");
  }

  const roleHierarchy: Record<UserRole, number> = {
    super_admin: 3,
    workspace_admin: 2,
    viewer: 1,
  };

  const userRoleValue = roleHierarchy[session.user.role] || 0;
  const requiredRoleValue = roleHierarchy[requiredRole] || 0;

  if (userRoleValue < requiredRoleValue) {
    throw new AuthorizationError(403, `Forbidden: Insufficient privileges. Required role: "${requiredRole}".`);
  }
}
