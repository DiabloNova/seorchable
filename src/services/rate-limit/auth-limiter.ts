import { headers } from "next/headers";

let redis: any = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    // Dynamically import @upstash/redis so that the process doesn't crash
    // or fail to build if the package is missing when Redis isn't explicitly configured.
    const { Redis } = require("@upstash/redis");
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (err) {
    console.error("[RateLimiter] Failed to initialize Upstash Redis despite env vars being present. Falling back to memory store.", err);
    redis = null;
  }
}

// In-memory fallback for local dev, missing dependencies, or when Redis is not configured
const memoryStore = new Map<string, { count: number, resetAt: number }>();

export async function checkRateLimit(action: string, identifier: string, limit: number, windowSecs: number): Promise<void> {
  const key = `rl:${action}:${identifier}`;
  const now = Date.now();

  if (redis) {
    const multi = redis.multi();
    multi.incr(key);
    multi.pttl(key);
    const results = await multi.exec() as [number, number];
    let count = results[0];
    const pttl = results[1];

    if (pttl === -1 || pttl === -2) {
      await redis.expire(key, windowSecs);
      count = 1; // It was just created
    }

    if (count > limit) {
      throw new Error("Too many requests. Please try again later.");
    }
  } else {
    const record = memoryStore.get(key);
    if (!record || record.resetAt < now) {
      memoryStore.set(key, { count: 1, resetAt: now + windowSecs * 1000 });
    } else {
      record.count++;
      if (record.count > limit) {
        throw new Error("Too many requests. Please try again later.");
      }
    }
  }
}

export async function getClientIp(): Promise<string> {
  const reqHeaders = await headers();
  return reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function resetRateLimitStore(): void {
  memoryStore.clear();
}
