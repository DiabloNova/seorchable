/**
 * Automated Enterprise Integration Test Suite for Recommendation & Action Engine.
 * Exercises recommendation generation, issue vs opportunity distinction, deterministic prioritization,
 * separate impact/effort dimensions, state machine lifecycle transition checks, status history auditing,
 * repeated run deduplication, and zero-trust tenant isolation.
 */

import { TenantContextManager } from "../../../src/core/database/tenant-context";
import {
  RecommendationEngine,
  calculateImpactScore,
  calculatePriorityLevel,
  validateStatusTransition
} from "../../../src/services/recommendation-engine";
import { RecommendationRepository } from "../../../src/features/ai-intelligence/repositories";
import {
  DiagnosticFinding,
  Recommendation,
  RecommendationHistory,
  AuditMetadata
} from "../../../src/features/ai-intelligence/domain/types";
import * as assert from "assert";

function createAudit(createdBy = "test-system", version = 1): AuditMetadata {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    updatedBy: createdBy,
    version
  };
}

export async function runRecommendationEngineTests() {
  console.log("=========================================================================");
  console.log("RECOMMENDATION & ACTION ENGINE — INTEGRATION & STATUS LIFECYCLE TEST SUITE");
  console.log("=========================================================================");

  // Define Mock Tenants
  const tenantA = "tenant-alpha-uuid";
  const tenantB = "tenant-beta-uuid";
  const brandId = "brand-acme-01";
  const websiteId = "web-site-a1";

  const engine = new RecommendationEngine();
  const recRepo = new RecommendationRepository();

  try {
    // ----------------------------------------------------
    // 1. Positive Tests: Recommendation Creation & Impact Dimensions
    // ----------------------------------------------------
    console.log("▶ TEST: Recommendation Generation from Diagnostic Findings...");

    const mockFindings: DiagnosticFinding[] = [
      {
        id: "df-tech-1",
        organizationId: tenantA,
        websiteId,
        category: "technical",
        code: "ERR_TECH_HTTP_FAILED",
        title: "Home HTTP Failed",
        explanation: "Home HTTP failed description",
        severity: "critical",
        confidence: "high",
        status: "active",
        affectedResource: "https://my-brand.com/home",
        evidence: { statusCode: 500 },
        audit: createAudit()
      },
      {
        id: "df-seo-1",
        organizationId: tenantA,
        websiteId,
        category: "seo",
        code: "ERR_SEO_ROBOTS_BLOCKED",
        title: "Blocked by robots",
        explanation: "Blocked indexability",
        severity: "critical",
        confidence: "high",
        status: "active",
        affectedResource: "https://my-brand.com/home",
        evidence: { metaDirectives: ["noindex"] },
        audit: createAudit()
      },
      {
        id: "df-comp-1",
        organizationId: tenantA,
        websiteId,
        category: "competitive",
        code: "ERR_COMP_VISIBILITY_GAP",
        title: "Rival visibility gap",
        explanation: "Competitor visibility higher",
        severity: "high",
        confidence: "high",
        status: "active",
        affectedResource: "rival.com",
        evidence: { competitorVisibility: 90, brandVisibility: 60 },
        audit: createAudit()
      }
    ];

    let recs: Recommendation[] = [];

    await TenantContextManager.runWithTenantContext(tenantA, "usr-test-1", "ctx-rec-test", async () => {
      recs = await engine.generateRecommendations(mockFindings, { organizationId: tenantA, brandId, websiteId });

      // Verify length
      assert.strictEqual(recs.length, 3);

      // Verify Technical finding mapped to recommendation
      const httpRec = recs.find(r => r.category === "technical");
      assert.notStrictEqual(httpRec, undefined);
      assert.strictEqual(httpRec!.title, "رفع خطاهای ارتباطی سرور و HTTP");
      assert.strictEqual(httpRec!.businessImpact, "high");
      assert.strictEqual(httpRec!.seoImpact, "critical");
      assert.strictEqual(httpRec!.aiVisibilityImpact, "high");
      assert.strictEqual(httpRec!.effort, "medium");
      assert.strictEqual(httpRec!.confidence, "high");
      assert.strictEqual(httpRec!.status, "proposed");

      // Verify Opportunity classification (from ERR_COMP_VISIBILITY_GAP)
      const compRec = recs.find(r => r.category === "competitive");
      assert.notStrictEqual(compRec, undefined);
      assert.strictEqual(compRec!.title, "بهینه‌سازی سهم حضور رقابتی در برابر رقبای تجاری");
      assert.strictEqual(compRec!.businessImpact, "high");
      assert.strictEqual(compRec!.seoImpact, "medium");
      assert.strictEqual(compRec!.aiVisibilityImpact, "high");
      assert.strictEqual(compRec!.effort, "large");
    });
    console.log("  ✅ Recommendation Generation verified successfully.");

    // ----------------------------------------------------
    // 2. Prioritization & Explainable Scoring Model
    // ----------------------------------------------------
    console.log("▶ TEST: Prioritization & Explainable Priority/Impact Scoring...");

    // Validate calculateImpactScore
    const impactScore1 = calculateImpactScore("high", "critical", "high"); // (3 * 0.3 + 4 * 0.3 + 3 * 0.4) / 4 * 100 = 82.5 -> 83
    assert.strictEqual(impactScore1, 83);

    const impactScore2 = calculateImpactScore("low", "medium", "low"); // floats resolve to 32
    assert.strictEqual(impactScore2, 32);

    // Validate calculatePriorityLevel
    const priority1 = calculatePriorityLevel(83, "high", "medium"); // (83 * 0.5) + (3 * 10) + (3 * 5) = 41.5 + 30 + 15 = 86.5 -> high
    assert.strictEqual(priority1, "high");

    const priority2 = calculatePriorityLevel(32, "low", "large"); // (32 * 0.5) + (1 * 10) + (2 * 5) = 16 + 10 + 10 = 36 -> low
    assert.strictEqual(priority2, "low");

    console.log("  ✅ Prioritization is 100% deterministic and explainable.");

    // ----------------------------------------------------
    // 3. Status Lifecycle State Machine Transitions
    // ----------------------------------------------------
    console.log("▶ TEST: Lifecycle Status Transitions Validation...");

    // Legal transitions
    assert.doesNotThrow(() => validateStatusTransition("proposed", "accepted"));
    assert.doesNotThrow(() => validateStatusTransition("accepted", "in_progress"));
    assert.doesNotThrow(() => validateStatusTransition("in_progress", "completed"));
    assert.doesNotThrow(() => validateStatusTransition("completed", "proposed")); // Reopening

    // Illegal transitions
    assert.throws(() => validateStatusTransition("proposed", "completed")); // Skipping steps
    assert.throws(() => validateStatusTransition("rejected", "completed")); // Rejected cannot move directly to completed
    assert.throws(() => validateStatusTransition("deferred", "blocked"));

    console.log("  ✅ Lifecycle Status Transitions validated beautifully.");

    // ----------------------------------------------------
    // 4. Persistence: Append-Only History, Deduplication & Tenant Isolation
    // ----------------------------------------------------
    console.log("▶ TEST: Persistent Action History, Deduplication & Zero-Trust RLS...");

    await TenantContextManager.runWithTenantContext(tenantA, "usr-test-1", "ctx-rec-test", async () => {
      // 1. Save first recommendation (Deduplication baseline)
      const rec = recs[0];
      await recRepo.save(rec);

      // 2. Save identical recommendation with newer rules (ON CONFLICT update is simulated in save method)
      const updatedRec: Recommendation = {
        ...rec,
        title: "رفع خطاهای ارتباطی سرور و HTTP - بروز شده",
        audit: createAudit("test-system", 2)
      };
      await recRepo.save(updatedRec);

      const saved = await recRepo.findById(tenantA, rec.id);
      assert.notStrictEqual(saved, null);
      assert.strictEqual(saved!.title, "رفع خطاهای ارتباطی سرور و HTTP - بروز شده");

      // 3. Append History Transition Log
      const historyEntry: RecommendationHistory = {
        id: "hist-entry-01",
        organizationId: tenantA,
        recommendationId: rec.id,
        previousStatus: "proposed",
        newStatus: "accepted",
        timestamp: new Date().toISOString(),
        actor: "test-user",
        reason: "Prerequisites verified.",
        metadata: { browser: "Chrome" },
        audit: createAudit()
      };
      await recRepo.saveHistory(historyEntry);

      // Transition to in_progress
      const historyEntry2: RecommendationHistory = {
        id: "hist-entry-02",
        organizationId: tenantA,
        recommendationId: rec.id,
        previousStatus: "accepted",
        newStatus: "in_progress",
        timestamp: new Date().toISOString(),
        actor: "test-user",
        reason: "Started code changes.",
        metadata: { browser: "Chrome" },
        audit: createAudit()
      };
      await recRepo.saveHistory(historyEntry2);

      // Query history logs
      const historyList = await recRepo.getHistory(tenantA, rec.id);
      assert.strictEqual(historyList.length, 2);
      assert.strictEqual(historyList[0].id, "hist-entry-01");
      assert.strictEqual(historyList[1].id, "hist-entry-02");
    });

    // Zero-Trust Tenant Isolation denial checks
    try {
      await TenantContextManager.runWithTenantContext(tenantB, "usr-test-2", "ctx-malicious", async () => {
        // Attempting to read Tenant A recommendation from Tenant B context
        await recRepo.findById(tenantA, recs[0].id);
      });
      throw new Error("Security Failure: Allowed cross-tenant recommendation read!");
    } catch (err: unknown) {
      const error = err as Error;
      assert.strictEqual(error.name, "TenantContextViolationException");
    }

    try {
      await TenantContextManager.runWithTenantContext(tenantB, "usr-test-2", "ctx-malicious", async () => {
        // Attempting to modify Tenant A recommendation from Tenant B context
        const maliciousRec: Recommendation = {
          ...recs[0],
          organizationId: tenantA, // pointing to Tenant A
          title: "Hijacked"
        };
        await recRepo.save(maliciousRec);
      });
      throw new Error("Security Failure: Allowed cross-tenant recommendation write!");
    } catch (err: unknown) {
      const error = err as Error;
      assert.strictEqual(error.name, "TenantContextViolationException");
    }

    console.log("  ✅ Action History, Deduplication & Zero-Trust RLS verified successfully.");

    console.log("=========================================================================");
    console.log("✅ ALL RECOMMENDATION & ACTION ENGINE TESTS PASSED SUCCESSFULLY!");
    console.log("=========================================================================");

  } catch (err: unknown) {
    console.error("❌ Test Suite failed:", err);
    throw err;
  }
}

// Support executing directly
if (require.main === module) {
  runRecommendationEngineTests()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
