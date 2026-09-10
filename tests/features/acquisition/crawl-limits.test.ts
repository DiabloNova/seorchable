import assert from "node:assert/strict";
import {
  CRAWL_POLICY_CEILINGS,
  DEFAULT_CRAWL_POLICY,
  resolveCrawlPolicy
} from "../../../src/features/acquisition/domain/policy";
import { CrawlOrchestrator } from "../../../src/features/acquisition/application/orchestrator";

export async function testCrawlPolicyLimits(): Promise<void> {
  // 1. Attempt to exceed ceilings with client-provided values (including required specific examples)
  const escalated = resolveCrawlPolicy({
    maxPages: 999999,
    maxDepth: 100,
    maxConcurrency: 1000,
    maxDurationMs: 99_000_000,
    maxResponseBytes: 1_000_000_000,
    maxRedirects: 500,
    requestTimeoutMs: 1_000_000,
    connectTimeoutMs: 500_000,
    maxAttempts: 100,
    perHostRequestsPerSecond: 1000,
    cacheTtlMs: 999_000_000
  });

  assert.equal(escalated.maxPages, CRAWL_POLICY_CEILINGS.maxPages);
  assert.equal(escalated.maxDepth, CRAWL_POLICY_CEILINGS.maxDepth);
  assert.equal(escalated.maxConcurrency, CRAWL_POLICY_CEILINGS.maxConcurrency);
  assert.equal(escalated.maxDurationMs, CRAWL_POLICY_CEILINGS.maxDurationMs);
  assert.equal(escalated.maxResponseBytes, CRAWL_POLICY_CEILINGS.maxResponseBytes);
  assert.equal(escalated.maxRedirects, CRAWL_POLICY_CEILINGS.maxRedirects);
  assert.equal(escalated.requestTimeoutMs, CRAWL_POLICY_CEILINGS.requestTimeoutMs);
  assert.equal(escalated.connectTimeoutMs, CRAWL_POLICY_CEILINGS.connectTimeoutMs);
  assert.equal(escalated.maxAttempts, CRAWL_POLICY_CEILINGS.maxAttempts);
  assert.equal(
    escalated.perHostRequestsPerSecond,
    CRAWL_POLICY_CEILINGS.perHostRequestsPerSecond
  );
  assert.equal(escalated.cacheTtlMs, CRAWL_POLICY_CEILINGS.cacheTtlMs);

  // 2. Malformed, negative, non-integer, or null values fall back safely or are clamped
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

  // 3. Null, undefined, or nested/malicious invalid structures fall back to trusted server defaults
  const emptyPolicy = resolveCrawlPolicy(null);
  assert.deepEqual(emptyPolicy, DEFAULT_CRAWL_POLICY);

  const nestedMalicious = resolveCrawlPolicy({
    maxPages: { $gt: 0 } as any,
    maxDepth: [1000] as any,
    robotsPolicy: { override: true } as any
  });
  assert.equal(nestedMalicious.maxPages, DEFAULT_CRAWL_POLICY.maxPages);
  assert.equal(nestedMalicious.maxDepth, DEFAULT_CRAWL_POLICY.maxDepth);
  assert.equal(nestedMalicious.robotsPolicy, DEFAULT_CRAWL_POLICY.robotsPolicy);

  // 4. Legitimate options within ceiling are preserved
  const legitimate = resolveCrawlPolicy({
    maxPages: 50,
    maxDepth: 2,
    robotsPolicy: "ignore"
  });
  assert.equal(legitimate.maxPages, 50);
  assert.equal(legitimate.maxDepth, 2);
  assert.equal(legitimate.robotsPolicy, "ignore");

  // 5. Verify server boundary (CrawlOrchestrator.submit) enforces policy resolution directly for oversized inputs
  let capturedJobPolicy: any = null;
  const fakeJobsRepo: any = {
    createOrGetByDedupWithOutcome: async ({ request }: any) => {
      capturedJobPolicy = request.policy;
      return {
        created: true,
        job: { id: "job-123", policy: request.policy, version: 1, status: "PENDING" }
      };
    },
    transition: async (id: string, fromStatus: string, version: number, toStatus: string) => {
      return { id, policy: capturedJobPolicy, status: toStatus, version: version + 1 };
    }
  };
  const fakeCacheRepo: any = {
    get: async () => ({ outcome: "MISS" })
  };
  const fakeResultsRepo: any = {};
  const fakeRouter: any = {};
  const fakeValidateHost = async () => ({ ok: true as const, host: "example.com", addresses: ["93.184.216.34"] });

  const orchestrator = new CrawlOrchestrator(
    fakeJobsRepo,
    fakeCacheRepo,
    fakeResultsRepo,
    fakeRouter,
    fakeValidateHost as any
  );

  const submission = await orchestrator.submit(
    "tenant-1",
    "https://example.com",
    {
      maxPages: 999999,
      maxDepth: 100,
      maxConcurrency: 1000
    }
  );

  assert.ok(submission.job);
  assert.equal(submission.job.policy.maxPages, CRAWL_POLICY_CEILINGS.maxPages);
  assert.equal(submission.job.policy.maxDepth, CRAWL_POLICY_CEILINGS.maxDepth);
  assert.equal(submission.job.policy.maxConcurrency, CRAWL_POLICY_CEILINGS.maxConcurrency);

  // 6. Verify direct CrawlOrchestrator.submit() boundary enforcement for malformed/nested policy inputs
  let malformedCapturedPolicy: any = null;
  const fakeJobsRepoMalformed: any = {
    createOrGetByDedupWithOutcome: async ({ request }: any) => {
      malformedCapturedPolicy = request.policy;
      return {
        created: true,
        job: { id: "job-456", policy: request.policy, version: 1, status: "PENDING" }
      };
    },
    transition: async (id: string, fromStatus: string, version: number, toStatus: string) => {
      return { id, policy: malformedCapturedPolicy, status: toStatus, version: version + 1 };
    }
  };

  const orchestratorMalformed = new CrawlOrchestrator(
    fakeJobsRepoMalformed,
    fakeCacheRepo,
    fakeResultsRepo,
    fakeRouter,
    fakeValidateHost as any
  );

  const malformedSubmission = await orchestratorMalformed.submit(
    "tenant-1",
    "https://example.com",
    {
      maxPages: { $gt: 0 } as any,
      maxDepth: [1000] as any,
      robotsPolicy: { override: true } as any,
      stripTrackingParams: "false" as any
    }
  );

  assert.ok(malformedSubmission.job);
  assert.ok(malformedCapturedPolicy);

  // Assert malformed numeric/enum/boolean values resolve to trusted defaults
  assert.equal(malformedCapturedPolicy.maxPages, DEFAULT_CRAWL_POLICY.maxPages);
  assert.equal(malformedCapturedPolicy.maxDepth, DEFAULT_CRAWL_POLICY.maxDepth);
  assert.equal(malformedCapturedPolicy.robotsPolicy, DEFAULT_CRAWL_POLICY.robotsPolicy);
  assert.equal(malformedCapturedPolicy.stripTrackingParams, DEFAULT_CRAWL_POLICY.stripTrackingParams);

  // Assert no nested objects, arrays, or invalid primitive types survived into the stored/request policy
  assert.equal(typeof malformedCapturedPolicy.maxPages, "number");
  assert.equal(typeof malformedCapturedPolicy.maxDepth, "number");
  assert.equal(typeof malformedCapturedPolicy.robotsPolicy, "string");
  assert.equal(typeof malformedCapturedPolicy.stripTrackingParams, "boolean");
}

if (require.main === module) {
  testCrawlPolicyLimits().then(() => {
    console.log("✅ Crawl policy limits test passed.");
  });
}
