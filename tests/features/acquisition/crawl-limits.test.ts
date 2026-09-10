import assert from "node:assert/strict";
import {
  CRAWL_POLICY_CEILINGS,
  DEFAULT_CRAWL_POLICY,
  resolveCrawlPolicy
} from "../../../src/features/acquisition/domain/policy";

export function testCrawlPolicyLimits(): void {
  // 1. Attempt to exceed ceilings with client-provided values
  const escalated = resolveCrawlPolicy({
    maxPages: 999_999,
    maxDepth: 1000,
    maxDurationMs: 99_000_000,
    maxResponseBytes: 1_000_000_000,
    maxRedirects: 500,
    maxConcurrency: 100,
    requestTimeoutMs: 1_000_000,
    connectTimeoutMs: 500_000,
    maxAttempts: 100,
    perHostRequestsPerSecond: 1000,
    cacheTtlMs: 999_000_000
  });

  assert.equal(escalated.maxPages, CRAWL_POLICY_CEILINGS.maxPages);
  assert.equal(escalated.maxDepth, CRAWL_POLICY_CEILINGS.maxDepth);
  assert.equal(escalated.maxDurationMs, CRAWL_POLICY_CEILINGS.maxDurationMs);
  assert.equal(escalated.maxResponseBytes, CRAWL_POLICY_CEILINGS.maxResponseBytes);
  assert.equal(escalated.maxRedirects, CRAWL_POLICY_CEILINGS.maxRedirects);
  assert.equal(escalated.maxConcurrency, CRAWL_POLICY_CEILINGS.maxConcurrency);
  assert.equal(escalated.requestTimeoutMs, CRAWL_POLICY_CEILINGS.requestTimeoutMs);
  assert.equal(escalated.connectTimeoutMs, CRAWL_POLICY_CEILINGS.connectTimeoutMs);
  assert.equal(escalated.maxAttempts, CRAWL_POLICY_CEILINGS.maxAttempts);
  assert.equal(
    escalated.perHostRequestsPerSecond,
    CRAWL_POLICY_CEILINGS.perHostRequestsPerSecond
  );
  assert.equal(escalated.cacheTtlMs, CRAWL_POLICY_CEILINGS.cacheTtlMs);

  // 2. Malformed, negative, non-integer, or null values should fall back safely or be clamped
  const malformed = resolveCrawlPolicy({
    maxPages: -10 as any,
    maxDepth: 1.5 as any,
    maxDurationMs: "invalid" as any,
    allowedSchemes: ["ftp", "file", "http"] as any,
    allowedContentTypes: [] as any,
    robotsPolicy: "bypass_all" as any,
    stripTrackingParams: "false" as any
  });

  assert.equal(malformed.maxPages, 1); // clamped min is 1
  assert.equal(malformed.maxDepth, DEFAULT_CRAWL_POLICY.maxDepth); // non-integer falls back
  assert.equal(malformed.maxDurationMs, DEFAULT_CRAWL_POLICY.maxDurationMs);
  assert.deepEqual(malformed.allowedSchemes, ["http"]);
  assert.deepEqual(malformed.allowedContentTypes, DEFAULT_CRAWL_POLICY.allowedContentTypes);
  assert.equal(malformed.robotsPolicy, DEFAULT_CRAWL_POLICY.robotsPolicy);
  assert.equal(malformed.stripTrackingParams, DEFAULT_CRAWL_POLICY.stripTrackingParams);

  // 3. Null or omitted policy object falls back to trusted server default
  const emptyPolicy = resolveCrawlPolicy(null);
  assert.deepEqual(emptyPolicy, DEFAULT_CRAWL_POLICY);

  // 4. Legitimate options within ceiling are preserved
  const legitimate = resolveCrawlPolicy({
    maxPages: 50,
    maxDepth: 2,
    robotsPolicy: "ignore"
  });
  assert.equal(legitimate.maxPages, 50);
  assert.equal(legitimate.maxDepth, 2);
  assert.equal(legitimate.robotsPolicy, "ignore");
}

if (require.main === module) {
  testCrawlPolicyLimits();
  console.log("✅ Crawl policy limits test passed.");
}
