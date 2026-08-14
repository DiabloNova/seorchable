import { ContentBriefEngine } from "../../../src/features/ai-intelligence/services/content-brief-engine";
import {
  ContentBriefInputs,
  Topic,
  Entity,
  Keyword,
  Competitor,
  FaqOpportunity,
  AeoAnalysis
} from "../../../src/features/ai-intelligence/domain/types";
import * as assert from "assert";

export async function runContentBriefTests() {
  console.log("=========================================================================");
  console.log("CONTENT BRIEF ENGINE — DETERMINISTIC DOMAIN & INTEGRATION SUITE");
  console.log("=========================================================================");

  const engine = new ContentBriefEngine();
  const tenantId = "tenant-brief-alpha-uuid";

  // Mock Fixtures
  const mockTopics: Topic[] = [
    {
      id: "top-1",
      organizationId: tenantId,
      name: "Semantic SEO",
      description: "Entity-first optimization",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "top-2",
      organizationId: tenantId,
      name: "Knowledge Graph Integration",
      description: "RDF & Schema triples",
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "top-1-dup",
      organizationId: tenantId,
      name: "semantic seo", // Duplicate with different casing
      language: "en",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const mockEntities: Entity[] = [
    {
      id: "ent-1",
      organizationId: tenantId,
      brandId: "brand-1",
      name: "Rasha Gostar",
      type: "Brand",
      confidence: { score: 0.95, rating: "high" },
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "ent-2",
      organizationId: tenantId,
      brandId: "brand-1",
      name: "Google Gemini",
      type: "AIEngine",
      confidence: { score: 0.85, rating: "high" },
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const mockKeywords: Keyword[] = [
    {
      id: "kw-1",
      organizationId: tenantId,
      name: "semantic_seo_guide",
      displayName: "Semantic SEO Guide",
      language: "en",
      intent: "Informational",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    },
    {
      id: "kw-2",
      organizationId: tenantId,
      name: "buy_aeo_tools",
      displayName: "Buy AEO Tools",
      language: "en",
      intent: "Transactional",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  const mockFaqs: FaqOpportunity[] = [
    {
      id: "faq-1",
      organizationId: tenantId,
      pageId: "page-1",
      question: "How long does Semantic SEO take?",
      sourceType: "unanswered_question",
      priority: "high",
      impactScore: 90,
      status: "active",
      createdAt: "2026-01-01"
    },
    {
      id: "faq-2",
      organizationId: tenantId,
      pageId: "page-1",
      question: "How long does Semantic SEO take?", // Duplicate question
      sourceType: "unanswered_question",
      priority: "medium",
      impactScore: 80,
      status: "active",
      createdAt: "2026-01-01"
    }
  ];

  const mockCompetitors: Competitor[] = [
    {
      id: "comp-1",
      organizationId: tenantId,
      name: "Competitor Alpha",
      domain: "competitor-alpha.com",
      status: "active",
      classification: "direct",
      monitoringStatus: "enabled",
      audit: { createdAt: "2026-01-01", updatedAt: "2026-01-01", createdBy: "sys", updatedBy: "sys", version: 1 }
    }
  ];

  try {
    // 1. Full Domain Fixture Test
    console.log("▶ TEST 1: Full domain-level intelligence input to Content Brief transformation...");
    const inputs: ContentBriefInputs = {
      organizationId: tenantId,
      targetTopic: "Semantic SEO",
      primaryIntent: "Informational",
      topics: mockTopics,
      entities: mockEntities,
      keywords: mockKeywords,
      faqOpportunities: mockFaqs,
      competitors: mockCompetitors
    };

    const brief = engine.generateBrief(inputs);

    assert.strictEqual(brief.organizationId, tenantId);
    assert.strictEqual(brief.targetTopic, "Semantic SEO");
    assert.strictEqual(brief.primaryIntent, "Informational");
    assert.strictEqual(brief.primaryTopic?.name.toLowerCase(), "semantic seo");

    // Deduplication check
    assert.strictEqual(brief.supportingTopics.length, 1);
    assert.strictEqual(brief.supportingTopics[0].name, "Knowledge Graph Integration");

    // Questions check (deduplicated & normalized ending with '?')
    assert.strictEqual(brief.questions.length, 1);
    assert.strictEqual(brief.questions[0], "How long does Semantic SEO take?");

    // Keywords grouping
    assert.strictEqual(brief.primaryKeywords.length, 1);
    assert.strictEqual(brief.primaryKeywords[0].displayName, "Semantic SEO Guide");
    assert.strictEqual(brief.secondaryKeywords.length, 1);
    assert.strictEqual(brief.secondaryKeywords[0].displayName, "Buy AEO Tools");

    // Recommended Content Structure check (Planning artifact ONLY, no prose paragraphs)
    assert.strictEqual(brief.recommendedStructure.length > 0, true);
    for (const section of brief.recommendedStructure) {
      assert.strictEqual(typeof section.sectionHeading, "string");
      assert.strictEqual(typeof section.sectionPurpose, "string");
      assert.strictEqual(Array.isArray(section.targetTopics), true);
      assert.strictEqual(Array.isArray(section.targetEntities), true);
      assert.strictEqual(Array.isArray(section.targetKeywords), true);
      assert.strictEqual(Array.isArray(section.targetQuestions), true);
    }
    console.log("  ✅ Complete Content Brief fixture output verified.");

    // 2. Strict Determinism Test
    console.log("▶ TEST 2: Proof of pure determinism via deep strict equality across repeated runs...");
    const run1 = engine.generateBrief(inputs);
    const run2 = engine.generateBrief(inputs);

    assert.deepStrictEqual(run1, run2, "Determinism failure! Two runs with identical inputs produced different output objects.");
    console.log("  ✅ Deep strict equality confirmed. Engine is 100% pure and deterministic.");

    // 3. Minimal / Partial Input Resilience
    console.log("▶ TEST 3: Partial and empty optional input handling without errors or fake data...");
    const minimalInputs: ContentBriefInputs = {
      organizationId: tenantId,
      targetTopic: "Minimal Topic"
    };

    const minimalBrief = engine.generateBrief(minimalInputs);
    assert.strictEqual(minimalBrief.targetTopic, "Minimal Topic");
    assert.strictEqual(minimalBrief.primaryIntent, "Informational");
    assert.strictEqual(minimalBrief.primaryTopic, null);
    assert.strictEqual(minimalBrief.supportingTopics.length, 0);
    assert.strictEqual(minimalBrief.entities.length, 0);
    assert.strictEqual(minimalBrief.primaryKeywords.length, 0);
    assert.strictEqual(minimalBrief.questions.length, 0);
    assert.strictEqual(minimalBrief.competitors.length, 0);
    console.log("  ✅ Minimal input resilience verified successfully.");

    // 4. Input Validation & Error Boundaries
    console.log("▶ TEST 4: Invalid input parameters fail closed with descriptive errors...");
    assert.throws(() => {
      engine.generateBrief({ organizationId: "", targetTopic: "Topic" });
    }, /Invalid inputs/);
    console.log("  ✅ Invalid input parameter handling verified.");

    console.log("=========================================================================");
    console.log("✅ ALL CONTENT BRIEF ENGINE TESTS PASSED SUCCESSFULLY!");
    console.log("=========================================================================");

  } catch (err) {
    console.error("❌ Test Suite failed:", err);
    throw err;
  }
}

// Support executing directly
if (require.main === module) {
  runContentBriefTests()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
