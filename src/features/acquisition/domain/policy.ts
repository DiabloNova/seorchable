import { CrawlError } from "./errors";

export type RobotsPolicy = "respect" | "ignore";

export interface CrawlPolicy {
  maxPages: number;
  maxDepth: number;
  maxDurationMs: number;
  maxResponseBytes: number;
  maxRedirects: number;
  maxConcurrency: number;
  requestTimeoutMs: number;
  connectTimeoutMs: number;
  maxAttempts: number;
  retryBaseDelayMs: number;
  retryMaxDelayMs: number;
  allowedSchemes: string[];
  allowedContentTypes: string[];
  robotsPolicy: RobotsPolicy;
  perHostRequestsPerSecond: number;
  stripTrackingParams: boolean;
  cacheTtlMs: number;
  followRedirects: boolean;
}

export const CRAWL_POLICY_CEILINGS = {
  maxPages: 1000,
  maxDepth: 10,
  maxDurationMs: 1_800_000,
  maxResponseBytes: 25 * 1024 * 1024,
  maxRedirects: 10,
  maxConcurrency: 16,
  requestTimeoutMs: 120_000,
  connectTimeoutMs: 30_000,
  maxAttempts: 10,
  retryBaseDelayMs: 60_000,
  retryMaxDelayMs: 600_000,
  perHostRequestsPerSecond: 100,
  cacheTtlMs: 86_400_000
} as const;

export const DEFAULT_CRAWL_POLICY: CrawlPolicy = {
  maxPages: 100,
  maxDepth: 3,
  maxDurationMs: 300_000,
  maxResponseBytes: 5 * 1024 * 1024,
  maxRedirects: 5,
  maxConcurrency: 4,
  requestTimeoutMs: 30_000,
  connectTimeoutMs: 10_000,
  maxAttempts: 3,
  retryBaseDelayMs: 500,
  retryMaxDelayMs: 30_000,
  allowedSchemes: ["http", "https"],
  allowedContentTypes: ["text/html", "application/xhtml+xml", "text/plain"],
  robotsPolicy: "respect",
  perHostRequestsPerSecond: 2,
  stripTrackingParams: true,
  cacheTtlMs: 3_600_000,
  followRedirects: true
};

const integerFields = new Set<keyof CrawlPolicy>([
  "maxPages",
  "maxDepth",
  "maxDurationMs",
  "maxResponseBytes",
  "maxRedirects",
  "maxConcurrency",
  "requestTimeoutMs",
  "connectTimeoutMs",
  "maxAttempts",
  "retryBaseDelayMs",
  "retryMaxDelayMs",
  "perHostRequestsPerSecond",
  "cacheTtlMs"
]);

export interface PolicyViolation {
  field: string;
  reason: string;
  value: unknown;
}

export function validateCrawlPolicy(
  policy: CrawlPolicy
):
  | { ok: true; policy: CrawlPolicy }
  | { ok: false; error: CrawlError; violations: PolicyViolation[] } {
  const violations: PolicyViolation[] = [];
  for (const field of integerFields) {
    const value = policy[field];
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      violations.push({
        field,
        reason: "must be a non-negative integer",
        value
      });
    }
    const ceiling =
      CRAWL_POLICY_CEILINGS[field as keyof typeof CRAWL_POLICY_CEILINGS];
    if (typeof value === "number" && value > ceiling) {
      violations.push({
        field,
        reason: `exceeds ceiling ${ceiling}`,
        value
      });
    }
  }
  for (const field of [
    "maxPages",
    "maxDurationMs",
    "maxResponseBytes",
    "maxConcurrency",
    "requestTimeoutMs",
    "connectTimeoutMs",
    "maxAttempts",
    "perHostRequestsPerSecond"
  ] as const) {
    if (policy[field] === 0) {
      violations.push({
        field,
        reason: "must be greater than zero",
        value: policy[field]
      });
    }
  }
  if (
    !Array.isArray(policy.allowedSchemes) ||
    policy.allowedSchemes.length === 0 ||
    policy.allowedSchemes.some(s => !["http", "https"].includes(s.toLowerCase()))
  ) {
    violations.push({
      field: "allowedSchemes",
      reason: "contains unknown or no schemes",
      value: policy.allowedSchemes
    });
  }
  if (
    !Array.isArray(policy.allowedContentTypes) ||
    policy.allowedContentTypes.length === 0
  ) {
    violations.push({
      field: "allowedContentTypes",
      reason: "must not be empty",
      value: policy.allowedContentTypes
    });
  }
  if (
    policy.robotsPolicy !== "respect" &&
    policy.robotsPolicy !== "ignore"
  ) {
    violations.push({
      field: "robotsPolicy",
      reason: "unknown policy",
      value: policy.robotsPolicy
    });
  }
  if (typeof policy.stripTrackingParams !== "boolean") {
    violations.push({
      field: "stripTrackingParams",
      reason: "must be boolean",
      value: policy.stripTrackingParams
    });
  }
  if (typeof policy.followRedirects !== "boolean") {
    violations.push({
      field: "followRedirects",
      reason: "must be boolean",
      value: policy.followRedirects
    });
  }
  if (policy.retryMaxDelayMs < policy.retryBaseDelayMs) {
    violations.push({
      field: "retryMaxDelayMs",
      reason: "must be at least retryBaseDelayMs",
      value: policy.retryMaxDelayMs
    });
  }
  return violations.length
    ? {
        ok: false,
        violations,
        error: new CrawlError(
          "POLICY_VIOLATION",
          "Invalid crawl policy",
          { violationCount: violations.length }
        )
      }
    : { ok: true, policy };
}

export function resolveCrawlPolicy(
  partial?: Partial<CrawlPolicy> | null
): CrawlPolicy {
  const input = partial && typeof partial === "object" ? partial : {};

  const sanitizeInt = (
    val: unknown,
    min: number,
    ceiling: number,
    fallback: number
  ): number => {
    if (
      typeof val !== "number" ||
      !Number.isInteger(val) ||
      !Number.isFinite(val)
    ) {
      return fallback;
    }
    if (val < min) {
      return min;
    }
    if (val > ceiling) {
      return ceiling;
    }
    return val;
  };

  const maxPages = sanitizeInt(
    input.maxPages,
    1,
    CRAWL_POLICY_CEILINGS.maxPages,
    DEFAULT_CRAWL_POLICY.maxPages
  );
  const maxDepth = sanitizeInt(
    input.maxDepth,
    0,
    CRAWL_POLICY_CEILINGS.maxDepth,
    DEFAULT_CRAWL_POLICY.maxDepth
  );
  const maxDurationMs = sanitizeInt(
    input.maxDurationMs,
    1,
    CRAWL_POLICY_CEILINGS.maxDurationMs,
    DEFAULT_CRAWL_POLICY.maxDurationMs
  );
  const maxResponseBytes = sanitizeInt(
    input.maxResponseBytes,
    1,
    CRAWL_POLICY_CEILINGS.maxResponseBytes,
    DEFAULT_CRAWL_POLICY.maxResponseBytes
  );
  const maxRedirects = sanitizeInt(
    input.maxRedirects,
    0,
    CRAWL_POLICY_CEILINGS.maxRedirects,
    DEFAULT_CRAWL_POLICY.maxRedirects
  );
  const maxConcurrency = sanitizeInt(
    input.maxConcurrency,
    1,
    CRAWL_POLICY_CEILINGS.maxConcurrency,
    DEFAULT_CRAWL_POLICY.maxConcurrency
  );
  const requestTimeoutMs = sanitizeInt(
    input.requestTimeoutMs,
    1,
    CRAWL_POLICY_CEILINGS.requestTimeoutMs,
    DEFAULT_CRAWL_POLICY.requestTimeoutMs
  );
  const connectTimeoutMs = sanitizeInt(
    input.connectTimeoutMs,
    1,
    CRAWL_POLICY_CEILINGS.connectTimeoutMs,
    DEFAULT_CRAWL_POLICY.connectTimeoutMs
  );
  const maxAttempts = sanitizeInt(
    input.maxAttempts,
    1,
    CRAWL_POLICY_CEILINGS.maxAttempts,
    DEFAULT_CRAWL_POLICY.maxAttempts
  );
  const retryBaseDelayMs = sanitizeInt(
    input.retryBaseDelayMs,
    0,
    CRAWL_POLICY_CEILINGS.retryBaseDelayMs,
    DEFAULT_CRAWL_POLICY.retryBaseDelayMs
  );
  let retryMaxDelayMs = sanitizeInt(
    input.retryMaxDelayMs,
    0,
    CRAWL_POLICY_CEILINGS.retryMaxDelayMs,
    DEFAULT_CRAWL_POLICY.retryMaxDelayMs
  );

  if (retryMaxDelayMs < retryBaseDelayMs) {
    retryMaxDelayMs = Math.min(
      retryBaseDelayMs,
      CRAWL_POLICY_CEILINGS.retryMaxDelayMs
    );
  }

  const perHostRequestsPerSecond = sanitizeInt(
    input.perHostRequestsPerSecond,
    1,
    CRAWL_POLICY_CEILINGS.perHostRequestsPerSecond,
    DEFAULT_CRAWL_POLICY.perHostRequestsPerSecond
  );
  const cacheTtlMs = sanitizeInt(
    input.cacheTtlMs,
    0,
    CRAWL_POLICY_CEILINGS.cacheTtlMs,
    DEFAULT_CRAWL_POLICY.cacheTtlMs
  );

  let allowedSchemes = DEFAULT_CRAWL_POLICY.allowedSchemes;
  if (Array.isArray(input.allowedSchemes)) {
    const filtered = input.allowedSchemes
      .filter((s): s is string => typeof s === "string")
      .map(s => s.toLowerCase())
      .filter(s => ["http", "https"].includes(s));
    if (filtered.length > 0) {
      allowedSchemes = Array.from(new Set(filtered));
    }
  }

  let allowedContentTypes = DEFAULT_CRAWL_POLICY.allowedContentTypes;
  if (Array.isArray(input.allowedContentTypes)) {
    const filtered = input.allowedContentTypes.filter(
      (c): c is string => typeof c === "string" && c.trim().length > 0
    );
    if (filtered.length > 0) {
      allowedContentTypes = Array.from(new Set(filtered));
    }
  }

  const robotsPolicy: RobotsPolicy =
    input.robotsPolicy === "respect" || input.robotsPolicy === "ignore"
      ? input.robotsPolicy
      : DEFAULT_CRAWL_POLICY.robotsPolicy;

  const stripTrackingParams =
    typeof input.stripTrackingParams === "boolean"
      ? input.stripTrackingParams
      : DEFAULT_CRAWL_POLICY.stripTrackingParams;

  const followRedirects =
    typeof input.followRedirects === "boolean"
      ? input.followRedirects
      : DEFAULT_CRAWL_POLICY.followRedirects;

  const policy: CrawlPolicy = {
    maxPages,
    maxDepth,
    maxDurationMs,
    maxResponseBytes,
    maxRedirects,
    maxConcurrency,
    requestTimeoutMs,
    connectTimeoutMs,
    maxAttempts,
    retryBaseDelayMs,
    retryMaxDelayMs,
    allowedSchemes,
    allowedContentTypes,
    robotsPolicy,
    perHostRequestsPerSecond,
    stripTrackingParams,
    cacheTtlMs,
    followRedirects
  };

  const result = validateCrawlPolicy(policy);
  if (!result.ok) {
    throw result.error;
  }
  return result.policy;
}
