import { authDb } from "./db";

export async function revokeSessionToken(jti: string, expiresAt: Date): Promise<void> {
  try {
    await authDb.query(
      "INSERT INTO session_revocations (jti, expires_at) VALUES ($1, $2) ON CONFLICT (jti) DO NOTHING",
      [jti, expiresAt]
    );
  } catch (err: any) {
    // Graceful fallback if table is somehow not created yet
    if (err.code !== '42P01') {
      throw err;
    }
  }
}

export async function isSessionRevoked(jti: string): Promise<boolean> {
  try {
    const res = await authDb.query("SELECT 1 FROM session_revocations WHERE jti = $1 LIMIT 1", [jti]);
    return res.rowCount !== null && res.rowCount > 0;
  } catch (err: any) {
    // If table not found, treat as not revoked
    if (err.code === '42P01') {
      return false;
    }
    throw err;
  }
}
