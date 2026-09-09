import { NextRequest } from "next/server";
import { PostgresClient } from "../../features/admin/infrastructure/persistence/postgres";

export interface RateLimitResult {
  allowed: boolean;
  reason?: "rate_limit" | "quota" | "unidentifiable";
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in ms
  retryAfterSeconds: number;
}

export interface LimiterOptions {
  nowMs?: number; // Optional simulated time for deterministic tests
}

export const FREE_AUDIT_LIMITS = {
  SHORT_WINDOW_MS: 60 * 1000, // 60 seconds
  SHORT_LIMIT: 5, // 5 requests per 60 seconds
  DAILY_WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
  DAILY_LIMIT: 10, // 10 requests per 24 hours
};

interface LimitState {
  shortWindowStart: number;
  shortWindowCount: number;
  dailyWindowStart: number;
  dailyWindowCount: number;
}

// In-memory backing store reserved strictly for unit testing environment (NODE_ENV === "test")
const testInMemoryStore = new Map<string, LimitState>();

export class FreeAuditLimiter {
  private static testNowMs: number | null = null;

  /**
   * Resets in-memory store and test clock (strictly for testing).
   */
  public static resetTestStore(): void {
    testInMemoryStore.clear();
    this.testNowMs = null;
  }

  /**
   * Sets simulated clock time (strictly for testing).
   */
  public static setTestTime(nowMs: number | null): void {
    this.testNowMs = nowMs;
  }

  /**
   * Extracts trusted client IP identifier.
   * In production (NODE_ENV === "production"):
   *   Strictly uses req.ip (provided authoritatively by Next.js edge platform runtime).
   *   Client-supplied X-Forwarded-For is NEVER trusted in production.
   *   If req.ip is undefined or blank in production, throws UNIDENTIFIABLE_CLIENT to fail closed safely
   *   and prevent unsafe client collapse into a shared bucket.
   * In test environment (NODE_ENV === "test"):
   *   If req.ip is undefined, permits reading x-forwarded-for or falling back to "127.0.0.1" for Node unit tests.
   */
  public static getClientIdentifier(req: NextRequest): string {
    const isTestEnv = process.env.NODE_ENV === "test";

    // Standard NextRequest req.ip (server-derived from trusted platform runtime socket/edge)
    const reqIp = (req as unknown as { ip?: string }).ip;
    if (reqIp && reqIp.trim().length > 0) {
      return reqIp.trim();
    }

    if (isTestEnv) {
      const forwarded = req.headers.get("x-forwarded-for");
      if (forwarded) {
        const firstIp = forwarded.split(",")[0]?.trim();
        if (firstIp && firstIp.length > 0) {
          return firstIp;
        }
      }
      return "127.0.0.1";
    }

    // In production, missing req.ip fails closed to prevent unsafe IP collapse
    throw new Error("UNIDENTIFIABLE_CLIENT");
  }

  /**
   * Atomically evaluates and consumes rate limit & daily quota for the given request.
   */
  public static async checkAndConsume(
    req: NextRequest,
    options?: LimiterOptions
  ): Promise<RateLimitResult> {
    const now = options?.nowMs ?? this.testNowMs ?? Date.now();
    const isTestEnv = process.env.NODE_ENV === "test";

    let identifier: string;
    try {
      identifier = this.getClientIdentifier(req);
    } catch (err) {
      if ((err as Error).message === "UNIDENTIFIABLE_CLIENT") {
        return {
          allowed: false,
          reason: "unidentifiable",
          limit: FREE_AUDIT_LIMITS.SHORT_LIMIT,
          remaining: 0,
          resetAt: now + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS,
          retryAfterSeconds: Math.ceil(FREE_AUDIT_LIMITS.SHORT_WINDOW_MS / 1000),
        };
      }
      throw err;
    }

    // In unit testing environment, use atomic memory store logic
    if (isTestEnv) {
      return this.evaluateInMemory(identifier, now);
    }

    // In production, execute atomic transaction against PostgreSQL
    try {
      return await this.evaluateInPostgres(identifier, now);
    } catch (err) {
      console.error("[FreeAuditLimiter] PostgreSQL persistence error:", err);
      // Fail closed in production according to security contract
      throw new Error("RATE_LIMIT_PERSISTENCE_FAILURE");
    }
  }

  /**
   * In-memory atomic evaluation for NODE_ENV === "test"
   */
  private static evaluateInMemory(identifier: string, now: number): RateLimitResult {
    let state = testInMemoryStore.get(identifier);

    if (!state) {
      state = {
        shortWindowStart: now,
        shortWindowCount: 0,
        dailyWindowStart: now,
        dailyWindowCount: 0,
      };
    }

    let shortStart = state.shortWindowStart;
    let shortCount = state.shortWindowCount;
    let dailyStart = state.dailyWindowStart;
    let dailyCount = state.dailyWindowCount;

    // Check if short window expired
    if (now >= shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS) {
      shortStart = now;
      shortCount = 0;
    }

    // Check if daily window expired
    if (now >= dailyStart + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS) {
      dailyStart = now;
      dailyCount = 0;
    }

    // Check short window limit
    if (shortCount >= FREE_AUDIT_LIMITS.SHORT_LIMIT) {
      const resetAt = shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
      return {
        allowed: false,
        reason: "rate_limit",
        limit: FREE_AUDIT_LIMITS.SHORT_LIMIT,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
      };
    }

    // Check daily quota limit
    if (dailyCount >= FREE_AUDIT_LIMITS.DAILY_LIMIT) {
      const resetAt = dailyStart + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
      return {
        allowed: false,
        reason: "quota",
        limit: FREE_AUDIT_LIMITS.DAILY_LIMIT,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
      };
    }

    // Allowed: Increment counters and persist state
    const newShortCount = shortCount + 1;
    const newDailyCount = dailyCount + 1;

    testInMemoryStore.set(identifier, {
      shortWindowStart: shortStart,
      shortWindowCount: newShortCount,
      dailyWindowStart: dailyStart,
      dailyWindowCount: newDailyCount,
    });

    const remainingShort = FREE_AUDIT_LIMITS.SHORT_LIMIT - newShortCount;
    const remainingDaily = FREE_AUDIT_LIMITS.DAILY_LIMIT - newDailyCount;
    const remaining = Math.max(0, Math.min(remainingShort, remainingDaily));
    const shortResetAt = shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS;
    const retryAfterSeconds = Math.max(1, Math.ceil((shortResetAt - now) / 1000));

    return {
      allowed: true,
      limit: FREE_AUDIT_LIMITS.SHORT_LIMIT,
      remaining,
      resetAt: shortResetAt,
      retryAfterSeconds,
    };
  }

  /**
   * Atomic evaluation using PostgreSQL SELECT ... FOR UPDATE transaction
   */
  private static async evaluateInPostgres(
    identifier: string,
    now: number
  ): Promise<RateLimitResult> {
    const pg = PostgresClient.getInstance();

    // Execute single atomic SQL transaction (no runtime DDL)
    const client = await pg.getPool().connect();
    try {
      await client.query("BEGIN;");

      // Insert row if not exists
      await client.query(
        `INSERT INTO unauthenticated_audit_rate_limits
         (identifier, short_window_start, short_window_count, daily_window_start, daily_window_count, updated_at)
         VALUES ($1, TO_TIMESTAMP($2 / 1000.0), 0, TO_TIMESTAMP($2 / 1000.0), 0, TO_TIMESTAMP($2 / 1000.0))
         ON CONFLICT (identifier) DO NOTHING;`,
        [identifier, now]
      );

      // Lock row FOR UPDATE
      const res = await client.query(
        `SELECT
           EXTRACT(EPOCH FROM short_window_start) * 1000 AS short_start_ms,
           short_window_count,
           EXTRACT(EPOCH FROM daily_window_start) * 1000 AS daily_start_ms,
           daily_window_count
         FROM unauthenticated_audit_rate_limits
         WHERE identifier = $1 FOR UPDATE;`,
        [identifier]
      );

      const row = res.rows[0];
      let shortStart = Number(row.short_start_ms);
      let shortCount = Number(row.short_window_count);
      let dailyStart = Number(row.daily_start_ms);
      let dailyCount = Number(row.daily_window_count);

      // Check window expirations
      if (now >= shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS) {
        shortStart = now;
        shortCount = 0;
      }

      if (now >= dailyStart + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS) {
        dailyStart = now;
        dailyCount = 0;
      }

      // Check short window limit
      if (shortCount >= FREE_AUDIT_LIMITS.SHORT_LIMIT) {
        await client.query("COMMIT;");
        const resetAt = shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS;
        const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
        return {
          allowed: false,
          reason: "rate_limit",
          limit: FREE_AUDIT_LIMITS.SHORT_LIMIT,
          remaining: 0,
          resetAt,
          retryAfterSeconds,
        };
      }

      // Check daily quota limit
      if (dailyCount >= FREE_AUDIT_LIMITS.DAILY_LIMIT) {
        await client.query("COMMIT;");
        const resetAt = dailyStart + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS;
        const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
        return {
          allowed: false,
          reason: "quota",
          limit: FREE_AUDIT_LIMITS.DAILY_LIMIT,
          remaining: 0,
          resetAt,
          retryAfterSeconds,
        };
      }

      // Allowed: Update row atomically
      const newShortCount = shortCount + 1;
      const newDailyCount = dailyCount + 1;

      await client.query(
        `UPDATE unauthenticated_audit_rate_limits
         SET short_window_start = TO_TIMESTAMP($1 / 1000.0),
             short_window_count = $2,
             daily_window_start = TO_TIMESTAMP($3 / 1000.0),
             daily_window_count = $4,
             updated_at = TO_TIMESTAMP($5 / 1000.0)
         WHERE identifier = $6;`,
        [shortStart, newShortCount, dailyStart, newDailyCount, now, identifier]
      );

      await client.query("COMMIT;");

      const remainingShort = FREE_AUDIT_LIMITS.SHORT_LIMIT - newShortCount;
      const remainingDaily = FREE_AUDIT_LIMITS.DAILY_LIMIT - newDailyCount;
      const remaining = Math.max(0, Math.min(remainingShort, remainingDaily));
      const shortResetAt = shortStart + FREE_AUDIT_LIMITS.SHORT_WINDOW_MS;
      const retryAfterSeconds = Math.max(1, Math.ceil((shortResetAt - now) / 1000));

      return {
        allowed: true,
        limit: FREE_AUDIT_LIMITS.SHORT_LIMIT,
        remaining,
        resetAt: shortResetAt,
        retryAfterSeconds,
      };
    } catch (err) {
      await client.query("ROLLBACK;");
      throw err;
    } finally {
      client.release();
    }
  }
}
