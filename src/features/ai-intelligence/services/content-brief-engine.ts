import {
  ContentBrief,
  ContentBriefInputs,
  ContentBriefSection,
  Topic,
  Entity,
  Keyword,
  Competitor,
  PromptIntentType
} from "../domain/types";

export class ContentBriefEngine {
  private readonly version = "1.0.0";

  /**
   * Generates a pure, deterministic Content Brief from existing canonical intelligence signals.
   * Guaranteed to produce deeply equal outputs for identical inputs.
   */
  public generateBrief(inputs: ContentBriefInputs): ContentBrief {
    if (!inputs.organizationId || !inputs.targetTopic) {
      throw new Error("Invalid inputs: organizationId and targetTopic are required.");
    }

    const rulesApplied: string[] = [];

    // 1. Resolve Primary & Secondary Intents
    const primaryIntent = this.resolvePrimaryIntent(inputs);
    const secondaryIntents = this.resolveSecondaryIntents(inputs, primaryIntent);
    rulesApplied.push("CANONICAL_INTENT_RESOLUTION");

    // 2. Resolve Topics (Deduplicated & Deterministically Ordered)
    const { primaryTopic, supportingTopics } = this.resolveTopics(inputs);
    rulesApplied.push("DETERMINISTIC_TOPIC_EXTRACTION");

    // 3. Resolve Entities (Deduplicated & Deterministically Ordered)
    const entities = this.resolveEntities(inputs);
    rulesApplied.push("DETERMINISTIC_ENTITY_EXTRACTION");

    // 4. Resolve Keywords (Primary / Secondary Split & Deterministically Ordered)
    const { primaryKeywords, secondaryKeywords } = this.resolveKeywords(inputs, primaryIntent);
    rulesApplied.push("DETERMINISTIC_KEYWORD_GROUPING");

    // 5. Resolve Questions (Deduplicated & Deterministically Ordered)
    const questions = this.resolveQuestions(inputs);
    rulesApplied.push("DETERMINISTIC_QUESTION_EXTRACTION");

    // 6. Resolve Competitors (Deduplicated & Deterministically Ordered)
    const competitors = this.resolveCompetitors(inputs);
    rulesApplied.push("DETERMINISTIC_COMPETITOR_SELECTION");

    // 7. Derive Recommended Content Structure (Planning Artifact ONLY, NO Prose)
    const recommendedStructure = this.deriveContentStructure({
      targetTopic: inputs.targetTopic,
      primaryTopic,
      supportingTopics,
      entities,
      primaryKeywords,
      secondaryKeywords,
      questions,
      competitors
    });
    rulesApplied.push("STRUCTURE_DERIVATION_RULES_APPLIED");

    // Deterministic ID derivation (no Date.now() or Math.random())
    const deterministicId = `brief-${inputs.organizationId}-${inputs.targetTopic.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

    return {
      id: deterministicId,
      organizationId: inputs.organizationId,
      targetTopic: inputs.targetTopic,
      primaryIntent,
      secondaryIntents,
      primaryTopic,
      supportingTopics,
      entities,
      primaryKeywords,
      secondaryKeywords,
      questions,
      competitors,
      recommendedStructure,
      provenance: {
        engineVersion: this.version,
        deterministicRulesApplied: rulesApplied
      }
    };
  }

  /**
   * Resolves primary search intent using existing canonical intent representations.
   */
  private resolvePrimaryIntent(inputs: ContentBriefInputs): PromptIntentType | string {
    if (inputs.primaryIntent) {
      return inputs.primaryIntent;
    }

    if (inputs.keywords && inputs.keywords.length > 0) {
      const matchWithIntent = inputs.keywords.find(k => k.intent);
      if (matchWithIntent && matchWithIntent.intent) {
        return matchWithIntent.intent;
      }
    }

    return "Informational";
  }

  /**
   * Resolves secondary search intents, normalized, deduplicated, and sorted alphabetically.
   */
  private resolveSecondaryIntents(
    inputs: ContentBriefInputs,
    primaryIntent: PromptIntentType | string
  ): (PromptIntentType | string)[] {
    const raw = inputs.secondaryIntents || [];
    const set = new Set<string>();

    for (const intent of raw) {
      if (intent && intent !== primaryIntent) {
        set.add(intent);
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  /**
   * Resolves primary and supporting topics from input topic signals.
   */
  private resolveTopics(inputs: ContentBriefInputs): {
    primaryTopic: Topic | null;
    supportingTopics: Topic[];
  } {
    const rawTopics = inputs.topics || [];
    const topicMap = new Map<string, Topic>();

    for (const top of rawTopics) {
      const normalizedKey = top.name.trim().toLowerCase();
      if (!topicMap.has(normalizedKey)) {
        topicMap.set(normalizedKey, top);
      }
    }

    const uniqueTopics = Array.from(topicMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    if (uniqueTopics.length === 0) {
      return { primaryTopic: null, supportingTopics: [] };
    }

    // Exact match or fallback to first alphabetical topic as primary
    const targetLower = inputs.targetTopic.trim().toLowerCase();
    let primary = uniqueTopics.find(t => t.name.trim().toLowerCase() === targetLower) || null;

    if (!primary && uniqueTopics.length > 0) {
      primary = uniqueTopics[0];
    }

    const supporting = uniqueTopics.filter(t => t.id !== primary?.id);

    return {
      primaryTopic: primary,
      supportingTopics: supporting
    };
  }

  /**
   * Resolves entity recommendations from canonical entity signals.
   * Sorted deterministically by confidence score descending, then by name alphabetically as tie-breaker.
   */
  private resolveEntities(inputs: ContentBriefInputs): Entity[] {
    const rawEntities = inputs.entities || [];
    const entityMap = new Map<string, Entity>();

    for (const ent of rawEntities) {
      const normalizedKey = ent.name.trim().toLowerCase();
      if (!entityMap.has(normalizedKey)) {
        entityMap.set(normalizedKey, ent);
      }
    }

    // Additional entities from AEO Analysis
    if (inputs.aeoAnalysis && inputs.aeoAnalysis.entityCoverage) {
      for (const cov of inputs.aeoAnalysis.entityCoverage) {
        const normalizedKey = cov.name.trim().toLowerCase();
        if (!entityMap.has(normalizedKey)) {
          entityMap.set(normalizedKey, {
            id: cov.entityId || `entity-${normalizedKey.replace(/[^a-z0-9]/g, "")}`,
            organizationId: inputs.organizationId,
            brandId: "brand-extracted",
            name: cov.name,
            type: cov.type,
            confidence: { score: cov.confidence, rating: cov.confidence >= 0.8 ? "high" : "medium" },
            audit: {
              createdAt: new Date("2026-01-01").toISOString(),
              updatedAt: new Date("2026-01-01").toISOString(),
              createdBy: "system",
              updatedBy: "system",
              version: 1
            }
          });
        }
      }
    }

    return Array.from(entityMap.values()).sort((a, b) => {
      const confA = a.confidence?.score ?? 0;
      const confB = b.confidence?.score ?? 0;
      if (confB !== confA) {
        return confB - confA;
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Resolves primary and secondary keywords from canonical keyword signals.
   */
  private resolveKeywords(
    inputs: ContentBriefInputs,
    primaryIntent: PromptIntentType | string
  ): {
    primaryKeywords: Keyword[];
    secondaryKeywords: Keyword[];
  } {
    const rawKeywords = inputs.keywords || [];
    const keywordMap = new Map<string, Keyword>();

    for (const kw of rawKeywords) {
      const normalizedKey = kw.name.trim().toLowerCase();
      if (!keywordMap.has(normalizedKey)) {
        keywordMap.set(normalizedKey, kw);
      }
    }

    const uniqueKeywords = Array.from(keywordMap.values()).sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );

    const primary: Keyword[] = [];
    const secondary: Keyword[] = [];

    for (const kw of uniqueKeywords) {
      if (kw.intent && kw.intent.toLowerCase() === String(primaryIntent).toLowerCase()) {
        primary.push(kw);
      } else {
        secondary.push(kw);
      }
    }

    // If no keyword matches intent, elevate first keyword to primary
    if (primary.length === 0 && uniqueKeywords.length > 0) {
      primary.push(uniqueKeywords[0]);
      secondary.shift();
    }

    return {
      primaryKeywords: primary,
      secondaryKeywords: secondary
    };
  }

  /**
   * Resolves question recommendations from canonical questions, FAQ opportunities, and AEO analysis.
   */
  private resolveQuestions(inputs: ContentBriefInputs): string[] {
    const questionSet = new Set<string>();

    if (inputs.faqOpportunities) {
      for (const faq of inputs.faqOpportunities) {
        if (faq.question) {
          questionSet.add(this.normalizeQuestion(faq.question));
        }
      }
    }

    if (inputs.aeoAnalysis && inputs.aeoAnalysis.questionCoverage) {
      for (const item of inputs.aeoAnalysis.questionCoverage.items) {
        if (item.question) {
          questionSet.add(this.normalizeQuestion(item.question));
        }
      }
    }

    return Array.from(questionSet).sort((a, b) => a.localeCompare(b));
  }

  private normalizeQuestion(q: string): string {
    let trimmed = q.trim();
    if (!trimmed.endsWith("?") && !trimmed.endsWith("؟")) {
      trimmed += "؟";
    }
    return trimmed;
  }

  /**
   * Resolves competitor references from existing canonical competitor data.
   */
  private resolveCompetitors(inputs: ContentBriefInputs): Competitor[] {
    const rawCompetitors = inputs.competitors || [];
    const compMap = new Map<string, Competitor>();

    for (const comp of rawCompetitors) {
      const normalizedKey = comp.domain.trim().toLowerCase();
      if (!compMap.has(normalizedKey) && comp.status === "active") {
        compMap.set(normalizedKey, comp);
      }
    }

    return Array.from(compMap.values()).sort((a, b) => a.domain.localeCompare(b.domain));
  }

  /**
   * Derives a deterministic recommended content structure (Planning Artifact ONLY).
   */
  private deriveContentStructure(params: {
    targetTopic: string;
    primaryTopic: Topic | null;
    supportingTopics: Topic[];
    entities: Entity[];
    primaryKeywords: Keyword[];
    secondaryKeywords: Keyword[];
    questions: string[];
    competitors: Competitor[];
  }): ContentBriefSection[] {
    const sections: ContentBriefSection[] = [];

    // Section 1: Overview & Primary Topic Definition
    sections.push({
      sectionHeading: `Overview & Definition of ${params.targetTopic}`,
      sectionPurpose: "Establish core terminology, state primary entities, and anchor topic identity for answer engines.",
      targetTopics: params.primaryTopic ? [params.primaryTopic.name] : [params.targetTopic],
      targetEntities: params.entities.slice(0, 2).map(e => e.name),
      targetKeywords: params.primaryKeywords.map(k => k.displayName),
      targetQuestions: params.questions.slice(0, 1)
    });

    // Section 2: Architectural Mechanism & Subtopics
    if (params.supportingTopics.length > 0 || params.secondaryKeywords.length > 0) {
      sections.push({
        sectionHeading: `Architectural Principles and Subtopic Breakdown`,
        sectionPurpose: "Examine core operational concepts, supporting topic mechanics, and related semantic keywords.",
        targetTopics: params.supportingTopics.map(t => t.name),
        targetEntities: params.entities.slice(2, 5).map(e => e.name),
        targetKeywords: params.secondaryKeywords.map(k => k.displayName),
        targetQuestions: []
      });
    }

    // Section 3: Frequently Asked Questions (AEO Snippet Optimization)
    if (params.questions.length > 0) {
      sections.push({
        sectionHeading: `Frequently Asked Questions & Direct Answers (AEO Optimization)`,
        sectionPurpose: "Provide direct, concise Q&A blocks answering conversational queries for LLM citation and snippet retrieval.",
        targetTopics: [params.targetTopic],
        targetEntities: params.entities.slice(0, 3).map(e => e.name),
        targetKeywords: params.primaryKeywords.slice(0, 2).map(k => k.displayName),
        targetQuestions: params.questions
      });
    }

    // Section 4: Competitive Analysis & Conclusion
    if (params.competitors.length > 0) {
      sections.push({
        sectionHeading: "Competitive Positioning and Summary Conclusion",
        sectionPurpose: "Contrast differentiators against key industry competitors and summarize key actionable takeaways.",
        targetTopics: [params.targetTopic],
        targetEntities: params.competitors.map(c => c.name),
        targetKeywords: [],
        targetQuestions: []
      });
    }

    return sections;
  }
}
