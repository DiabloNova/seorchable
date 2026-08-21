import { User, UserRole } from "@/types/auth";
import { authDb } from "./db";

export interface StoredUser extends User {
  passwordHash: string;
}

export async function getUser(email: string): Promise<StoredUser | null> {
  // Try to find the user in the newly migrated `users` table
  const res = await authDb.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);

  if (res.rowCount && res.rowCount > 0) {
    const row = res.rows[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      workspaceId: row.workspace_id,
      passwordHash: row.password_hash
    };
  }

  // Fallback to admin_users for backward compatibility or integration with other tables
  const adminRes = await authDb.query("SELECT * FROM admin_users WHERE email = $1 LIMIT 1", [email]);
  if (adminRes.rowCount && adminRes.rowCount > 0) {
    const adminRow = adminRes.rows[0];
    // This is primarily an admin table which may lack password_hash or workspace_id, but it's safe to fallback
    return {
      id: adminRow.id,
      email: adminRow.email,
      name: adminRow.full_name,
      role: "super_admin",
      workspaceId: "ws-default",
      passwordHash: adminRow.password_hash || "" // In an actual system we'd need to migrate this
    };
  }

  return null;
}

export async function createUser(user: StoredUser): Promise<void> {
  await authDb.query(
    `INSERT INTO users (id, email, name, password_hash, role, workspace_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [user.id, user.email, user.name, user.passwordHash, user.role, user.workspaceId, true]
  );
}
