import { authDb } from "./db";

export interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

export async function checkRateLimit(key: string, options: RateLimitOptions): Promise<void> {
  const windowSeconds = Math.ceil(options.windowMs / 1000);

  try {
    // We can use postgres to store rate limits
    // First, let's create the table dynamically if it doesn't exist to ensure safety without running full migrations right now.
    // In production, this would be part of the standard migrations.
    await authDb.query(`
      CREATE TABLE IF NOT EXISTS auth_rate_limits (
        key TEXT PRIMARY KEY,
        attempts INTEGER NOT NULL DEFAULT 1,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);

    // Clean up expired limits
    await authDb.query("DELETE FROM auth_rate_limits WHERE expires_at < NOW()");

    const res = await authDb.query(
      `INSERT INTO auth_rate_limits (key, attempts, expires_at)
       VALUES ($1, 1, NOW() + interval '1 second' * $2)
       ON CONFLICT (key) DO UPDATE
       SET attempts = auth_rate_limits.attempts + 1
       RETURNING attempts`,
      [key, windowSeconds]
    );

    if (res.rowCount && res.rowCount > 0 && res.rows[0].attempts > options.maxAttempts) {
      throw new Error("Too many authentication attempts. Please try again later.");
    }
  } catch (err: any) {
    if (err.message.includes("Too many")) throw err;
    console.error("Rate limiting error (failing open for safety):", err);
    // If DB fails (other than our actual limit error), we fail open to prevent completely blocking authentication due to a cache issue.
  }
}

export async function clearRateLimit(key: string): Promise<void> {
  try {
    await authDb.query("DELETE FROM auth_rate_limits WHERE key = $1", [key]);
  } catch (err) {
    // ignore
  }
}
