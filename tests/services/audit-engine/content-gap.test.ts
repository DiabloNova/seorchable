import { ContentGapEngine } from "../../../src/features/ai-intelligence/services/content-gap-engine";
import {
  ContentGapInputs,
  Page,
  Topic,
  Entity,
  Keyword,
  Competitor,
  FaqOpportunity,
  CitationSource,
  AeoAnalysis
} from "../../../src/features/ai-intelligence/domain/types";
import * as assert from "assert";

export async function runContentGapTests() {
  console.log("=========================================================================");
  console.log("CONTENT GAP ENGINE — COMPREHENSIVE DETECTOR & INTEGRATION SUITE");
  console.log("=========================================================================");

  const engine = new ContentGapEngine();
  const tenantId = "tenant-gap-alpha-uuid";

  // Mock Fixtures
  const projectPages: Page[] = [
    {
      id: "p1",
      organizationId: tenantId,
      websiteId: "w1",
      url: "https://secure-site.com/",
      normalizedUrl: "https://secure-site.com/",
      path: "/",
      indexability: "indexable",
      title: "Homepage",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const competitorPages: Page[] = [
    {
      id: "cp1",
      organizationId: tenantId,
      websiteId: "cw1",
      url: "https://competitor.com/technical-seo",
      normalizedUrl: "https://competitor.com/technical-seo",
      path: "/technical-seo",
      indexability: "indexable",
      title: "Technical SEO Guide",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "cp2",
      organizationId: tenantId,
      websiteId: "cw1",
      url: "https://competitor.com/", // Matches project page path "/"
      normalizedUrl: "https://competitor.com/",
      path: "/",
      indexability: "indexable",
      title: "Competitor Homepage",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const projectTopics: Topic[] = [
    {
      id: "pt1",
      organizationId: tenantId,
      name: "Keyword Research",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const competitorTopics: Topic[] = [
    {
      id: "ct1",
      organizationId: tenantId,
      name: "Technical SEO",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "ct2",
      organizationId: tenantId,
      name: "Keyword Research", // Matches project topic
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const projectEntities: Entity[] = [
    {
      id: "pe1",
      organizationId: tenantId,
      brandId: "b1",
      name: "Google Search Console",
      type: "Product",
      confidence: { score: 0.90, rating: "high" },
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const competitorEntities: Entity[] = [
    {
      id: "ce1",
      organizationId: tenantId,
      brandId: "b1",
      name: "Schema.org",
      type: "Organization",
      confidence: { score: 0.95, rating: "high" },
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "ce2",
      organizationId: tenantId,
      brandId: "b1",
      name: "Google Search Console", // Matches project entity
      type: "Product",
      confidence: { score: 0.90, rating: "high" },
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const projectKeywords: Keyword[] = [
    {
      id: "pk1",
      organizationId: tenantId,
      name: "seo",
      displayName: "SEO",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const competitorKeywords: Keyword[] = [
    {
      id: "ck1",
      organizationId: tenantId,
      name: "technical_seo_audit",
      displayName: "Technical SEO Audit",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "ck2",
      organizationId: tenantId,
      name: "seo", // Matches project keyword
      displayName: "SEO",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const mockFaqs: FaqOpportunity[] = [
    {
      id: "faq1",
      organizationId: tenantId,
      pageId: "p1",
      question: "What is Technical SEO?",
      sourceType: "unanswered_question",
      priority: "high",
      impactScore: 85,
      status: "active",
      createdAt: "2026-01-01"
    }
  ];

  const mockCitations: CitationSource[] = [
    {
      id: "cs1",
      organizationId: tenantId,
      domain: "searchengineland.com",
      classification: "publisher_media",
      qualityScore: 90,
      authorityScore: 88,
      firstSeenAt: "2026-01-01",
      lastSeenAt: "2026-01-01",
      occurrenceCount: 12,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    }
  ];

  try {
    // 1. Competitor Gap Detector
    console.log("▶ TEST 1: Competitor gap detector (Missing vs Equivalent coverage)...");
    const inputs: ContentGapInputs = {
      organizationId: tenantId,
      projectPages,
      competitorPages
    };

    const gaps = engine.analyze(inputs);
    const compGaps = gaps.filter(g => g.type === "competitor");

    assert.strictEqual(compGaps.length, 1);
    assert.strictEqual(compGaps[0].target, "/technical-seo");
    assert.strictEqual(compGaps[0].opportunityScore > 0, true);
    console.log("  ✅ Competitor page gap successfully detected.");

    // 2. Topic Gap Detector
    console.log("▶ TEST 2: Topic gap detector (Normalized topic missing vs matching)...");
    const topicInputs: ContentGapInputs = {
      organizationId: tenantId,
      projectTopics,
      competitorTopics
    };

    const topicGaps = engine.analyze(topicInputs).filter(g => g.type === "topic");
    assert.strictEqual(topicGaps.length, 1);
    assert.strictEqual(topicGaps[0].target, "Technical SEO");
    console.log("  ✅ Topic gap successfully detected.");

    // 3. Entity Gap Detector
    console.log("▶ TEST 3: Entity gap detector...");
    const entityInputs: ContentGapInputs = {
      organizationId: tenantId,
      projectEntities,
      competitorEntities
    };

    const entityGaps = engine.analyze(entityInputs).filter(g => g.type === "entity");
    assert.strictEqual(entityGaps.length, 1);
    assert.strictEqual(entityGaps[0].target, "Schema.org");
    console.log("  ✅ Entity gap successfully detected.");

    // 4. Keyword Gap Detector
    console.log("▶ TEST 4: Keyword gap detector...");
    const keywordInputs: ContentGapInputs = {
      organizationId: tenantId,
      projectKeywords,
      competitorKeywords
    };

    const keywordGaps = engine.analyze(keywordInputs).filter(g => g.type === "keyword");
    assert.strictEqual(keywordGaps.length, 1);
    assert.strictEqual(keywordGaps[0].target, "Technical SEO Audit");
    console.log("  ✅ Keyword gap successfully detected.");

    // 5. AI Answer Gap Detector
    console.log("▶ TEST 5: AI Answer gap detector...");
    const aiInputs: ContentGapInputs = {
      organizationId: tenantId,
      faqOpportunities: mockFaqs
    };

    const aiGaps = engine.analyze(aiInputs).filter(g => g.type === "ai-answer");
    assert.strictEqual(aiGaps.length, 1);
    assert.strictEqual(aiGaps[0].target, "What is Technical SEO?");
    console.log("  ✅ AI Answer gap successfully detected.");

    // 6. Citation Gap Detector
    console.log("▶ TEST 6: Citation gap detector...");
    const citationInputs: ContentGapInputs = {
      organizationId: tenantId,
      citations: mockCitations
    };

    const citationGaps = engine.analyze(citationInputs).filter(g => g.type === "citation");
    assert.strictEqual(citationGaps.length, 1);
    assert.strictEqual(citationGaps[0].target, "searchengineland.com");
    console.log("  ✅ Citation gap successfully detected.");

    // 7. Full Integration & Deduplication & Score Clamping
    console.log("▶ TEST 7: Full integration, deduplication, and score clamping (0 to 100)...");
    const fullInputs: ContentGapInputs = {
      organizationId: tenantId,
      projectPages,
      competitorPages,
      projectTopics,
      competitorTopics,
      projectEntities,
      competitorEntities,
      projectKeywords,
      competitorKeywords,
      faqOpportunities: mockFaqs,
      citations: mockCitations
    };

    const fullGaps = engine.analyze(fullInputs);
    assert.strictEqual(fullGaps.length, 6); // Exactly 1 gap of each type

    for (const gap of fullGaps) {
      assert.strictEqual(gap.opportunityScore >= 0 && gap.opportunityScore <= 100, true);
      assert.strictEqual(gap.gapMagnitude >= 0.0 && gap.gapMagnitude <= 1.0, true);
      assert.strictEqual(gap.confidence >= 0.0 && gap.confidence <= 1.0, true);
    }
    console.log("  ✅ Full gap integration and score clamping verified.");

    // 8. Deterministic Ordering and Deep Equality Test
    console.log("▶ TEST 8: Proof of pure determinism via deep strict equality across repeated runs...");
    const run1 = engine.analyze(fullInputs);
    const run2 = engine.analyze(fullInputs);

    assert.deepStrictEqual(run1, run2, "Determinism failure! Content Gap Engine outputs differ between identical executions.");
    console.log("  ✅ Deep strict equality confirmed. Engine is 100% pure and deterministic.");

    // 9. Edge Cases & Empty Input Safety
    console.log("▶ TEST 9: Empty inputs handling without errors or false positives...");
    const emptyGaps = engine.analyze({ organizationId: tenantId });
    assert.strictEqual(emptyGaps.length, 0);
    console.log("  ✅ Empty input handling verified successfully.");

    console.log("=========================================================================");
    console.log("✅ ALL CONTENT GAP ENGINE TESTS PASSED SUCCESSFULLY!");
    console.log("=========================================================================");

  } catch (err) {
    console.error("❌ Test Suite failed:", err);
    throw err;
  }
}

// Support executing directly
if (require.main === module) {
  runContentGapTests()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
