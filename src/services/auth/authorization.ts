import { NextRequest } from "next/server";
import { requireSession, getSession } from "./session";
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

/**
 * Validates and resolves the authoritative user and tenant identity for API routes.
 * If an active signed server session is present, its identity overrides all client-provided headers.
 * Otherwise, falls closed if neither valid session nor proper headers are present.
 */
export async function authorizeApiRequest(req: NextRequest): Promise<{ userId: string; tenantId: string }> {
  const session = await getSession();

  if (session && session.user) {
    return {
      userId: session.user.id,
      tenantId: session.user.workspaceId
    };
  }

  // Fallback to headers for developer API integration, with validation
  const headerUserId = req.headers.get("x-user-id");
  const headerTenantId = req.headers.get("x-tenant-id");

  if (!headerUserId || headerUserId.trim() === "" || !headerTenantId || headerTenantId.trim() === "") {
    throw new AuthorizationError(401, "Unauthorized: Valid session or API headers required.");
  }

  return {
    userId: headerUserId,
    tenantId: headerTenantId
  };
}
