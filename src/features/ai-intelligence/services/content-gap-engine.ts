import {
  ContentGapResult,
  ContentGapInputs,
  ContentGapType,
  ContentGapEvidence,
  FindingSeverity
} from "../domain/types";

export class ContentGapEngine {
  private readonly engineVersion = "1.0.0";

  /**
   * Evaluates canonical intelligence signals to deterministically detect content gaps and prioritize opportunities.
   * Pure function: guaranteed to produce identical results for identical inputs.
   */
  public analyze(inputs: ContentGapInputs): ContentGapResult[] {
    if (!inputs.organizationId) {
      throw new Error("Invalid inputs: organizationId is required.");
    }

    const unrankedGaps: ContentGapResult[] = [];

    // 1. Detect Competitor Gaps
    unrankedGaps.push(...this.detectCompetitorGaps(inputs));

    // 2. Detect Topic Gaps
    unrankedGaps.push(...this.detectTopicGaps(inputs));

    // 3. Detect Entity Gaps
    unrankedGaps.push(...this.detectEntityGaps(inputs));

    // 4. Detect Keyword Gaps
    unrankedGaps.push(...this.detectKeywordGaps(inputs));

    // 5. Detect AI Answer Gaps
    unrankedGaps.push(...this.detectAiAnswerGaps(inputs));

    // 6. Detect Citation Gaps
    unrankedGaps.push(...this.detectCitationGaps(inputs));

    // 7. Deduplicate Gaps by Deterministic ID
    const deduplicatedMap = new Map<string, ContentGapResult>();
    for (const gap of unrankedGaps) {
      if (!deduplicatedMap.has(gap.id)) {
        deduplicatedMap.set(gap.id, gap);
      }
    }

    // 8. Deterministic Ordering: opportunityScore DESC, confidence DESC, severity DESC, type ASC, target ASC
    const finalGaps = Array.from(deduplicatedMap.values()).sort((a, b) => {
      if (b.opportunityScore !== a.opportunityScore) {
        return b.opportunityScore - a.opportunityScore;
      }
      if (b.confidence !== a.confidence) {
        return b.confidence - a.confidence;
      }
      const sevOrder: Record<FindingSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      if (sevOrder[b.severity] !== sevOrder[a.severity]) {
        return sevOrder[b.severity] - sevOrder[a.severity];
      }
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.target.localeCompare(b.target);
    });

    return finalGaps;
  }

  /**
   * Detects competitor content coverage gaps.
   */
  private detectCompetitorGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];
    const competitorPages = inputs.competitorPages || [];
    const projectPages = inputs.projectPages || [];

    const projectPaths = new Set(projectPages.map(p => p.path.toLowerCase()));

    for (const compPage of competitorPages) {
      const normalizedPath = compPage.path.toLowerCase();
      const hasProjectMatch = projectPaths.has(normalizedPath);

      if (!hasProjectMatch) {
        const gapMagnitude = 1.0; // Completely missing path
        const confidence = 0.90;
        const target = compPage.path;
        const id = this.generateDeterministicId(inputs.organizationId, "competitor", target);

        results.push({
          id,
          organizationId: inputs.organizationId,
          type: "competitor",
          target,
          evidence: [
            {
              source: "competitor",
              signal: "competitor_page_exists",
              value: compPage.url,
              comparator: "missing_in_project",
              reference: compPage.title || compPage.path
            }
          ],
          confidence,
          gapMagnitude,
          opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
          severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
          rationale: `Competitors provide content at '${compPage.path}' while the project currently has no page coverage.`
        });
      }
    }

    return results;
  }

  /**
   * Detects missing or underrepresented topics.
   */
  private detectTopicGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];
    const competitorTopics = inputs.competitorTopics || [];
    const projectTopics = inputs.projectTopics || [];

    const projectTopicNames = new Set(projectTopics.map(t => t.name.trim().toLowerCase()));

    for (const compTopic of competitorTopics) {
      const normalizedName = compTopic.name.trim().toLowerCase();
      if (!projectTopicNames.has(normalizedName)) {
        const gapMagnitude = 1.0;
        const confidence = 0.85;
        const target = compTopic.name;
        const id = this.generateDeterministicId(inputs.organizationId, "topic", target);

        results.push({
          id,
          organizationId: inputs.organizationId,
          type: "topic",
          target,
          evidence: [
            {
              source: "competitor",
              signal: "competitor_topic_covered",
              value: compTopic.name,
              comparator: "absent_in_project_topics",
              reference: compTopic.description || compTopic.name
            }
          ],
          confidence,
          gapMagnitude,
          opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
          severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
          rationale: `The topic '${compTopic.name}' is covered by competitors but absent from the project topic map.`
        });
      }
    }

    return results;
  }

  /**
   * Detects missing or underrepresented semantic entities.
   */
  private detectEntityGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];
    const competitorEntities = inputs.competitorEntities || [];
    const projectEntities = inputs.projectEntities || [];

    const projectEntityNames = new Set(projectEntities.map(e => e.name.trim().toLowerCase()));

    for (const compEnt of competitorEntities) {
      const normalizedName = compEnt.name.trim().toLowerCase();
      if (!projectEntityNames.has(normalizedName)) {
        const gapMagnitude = 1.0;
        const confidence = compEnt.confidence?.score ?? 0.80;
        const target = compEnt.name;
        const id = this.generateDeterministicId(inputs.organizationId, "entity", target);

        results.push({
          id,
          organizationId: inputs.organizationId,
          type: "entity",
          target,
          evidence: [
            {
              source: "competitor",
              signal: "competitor_entity_presence",
              value: compEnt.name,
              comparator: "absent_in_project_entities",
              reference: compEnt.type
            }
          ],
          confidence,
          gapMagnitude,
          opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
          severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
          rationale: `The semantic entity '${compEnt.name}' (${compEnt.type}) is established in competitor intelligence but missing from project content.`
        });
      }
    }

    // Also inspect AEO entity coverage if present
    if (inputs.aeoAnalysis && inputs.aeoAnalysis.entityCoverage) {
      for (const cov of inputs.aeoAnalysis.entityCoverage) {
        if (cov.status === "not_covered" || cov.status === "mentioned_only") {
          const normalizedName = cov.name.trim().toLowerCase();
          if (!projectEntityNames.has(normalizedName)) {
            const gapMagnitude = cov.status === "not_covered" ? 1.0 : 0.5;
            const confidence = cov.confidence || 0.85;
            const target = cov.name;
            const id = this.generateDeterministicId(inputs.organizationId, "entity", target);

            results.push({
              id,
              organizationId: inputs.organizationId,
              type: "entity",
              target,
              evidence: [
                {
                  source: "ai",
                  signal: "aeo_entity_coverage_gap",
                  value: cov.status,
                  comparator: "weak_or_missing",
                  reference: cov.evidence
                }
              ],
              confidence,
              gapMagnitude,
              opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
              severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
              rationale: `AI entity coverage evaluation indicates entity '${cov.name}' is ${cov.status.replace("_", " ")}.`
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Detects missing strategic keywords.
   */
  private detectKeywordGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];
    const competitorKeywords = inputs.competitorKeywords || [];
    const projectKeywords = inputs.projectKeywords || [];

    const projectKwNames = new Set(projectKeywords.map(k => k.name.trim().toLowerCase()));

    for (const compKw of competitorKeywords) {
      const normalizedName = compKw.name.trim().toLowerCase();
      if (!projectKwNames.has(normalizedName)) {
        const gapMagnitude = 1.0;
        const confidence = 0.85;
        const target = compKw.displayName || compKw.name;
        const id = this.generateDeterministicId(inputs.organizationId, "keyword", target);

        results.push({
          id,
          organizationId: inputs.organizationId,
          type: "keyword",
          target,
          evidence: [
            {
              source: "competitor",
              signal: "competitor_keyword_target",
              value: compKw.displayName,
              comparator: "absent_in_project_keywords",
              reference: compKw.intent || "general"
            }
          ],
          confidence,
          gapMagnitude,
          opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
          severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
          rationale: `The keyword '${compKw.displayName}' is targeted by competitors but not present in project keyword targets.`
        });
      }
    }

    return results;
  }

  /**
   * Detects AI answer coverage gaps from Phase 5 AEO intelligence.
   */
  private detectAiAnswerGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];

    if (inputs.faqOpportunities) {
      for (const faq of inputs.faqOpportunities) {
        if (faq.status === "active") {
          const gapMagnitude = 1.0;
          const confidence = 0.90;
          const target = faq.question;
          const id = this.generateDeterministicId(inputs.organizationId, "ai-answer", target);

          results.push({
            id,
            organizationId: inputs.organizationId,
            type: "ai-answer",
            target,
            evidence: [
              {
                source: "ai",
                signal: "unanswered_aeo_question",
                value: faq.question,
                comparator: "unanswered",
                reference: faq.sourceType
              }
            ],
            confidence,
            gapMagnitude,
            opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
            severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
            rationale: `The conversational query '${faq.question}' was evaluated as unanswered in AI visibility audits.`
          });
        }
      }
    }

    if (inputs.aeoAnalysis && inputs.aeoAnalysis.questionCoverage) {
      for (const item of inputs.aeoAnalysis.questionCoverage.items) {
        if (item.status === "unanswered" || item.status === "partially_answered") {
          const gapMagnitude = item.status === "unanswered" ? 1.0 : 0.5;
          const confidence = 0.88;
          const target = item.question;
          const id = this.generateDeterministicId(inputs.organizationId, "ai-answer", target);

          results.push({
            id,
            organizationId: inputs.organizationId,
            type: "ai-answer",
            target,
            evidence: [
              {
                source: "ai",
                signal: "aeo_question_coverage_status",
                value: item.status,
                comparator: "insufficient_answer_coverage",
                reference: item.evidence
              }
            ],
            confidence,
            gapMagnitude,
            opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
            severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
            rationale: `AI Question Coverage evaluation indicates query '${item.question}' is ${item.status.replace("_", " ")}.`
          });
        }
      }
    }

    return results;
  }

  /**
   * Detects citation coverage gaps from Phase 5 Citation Intelligence.
   */
  private detectCitationGaps(inputs: ContentGapInputs): ContentGapResult[] {
    const results: ContentGapResult[] = [];
    const citationSources = inputs.citations || [];

    for (const source of citationSources) {
      if (source.classification === "competitor" || source.classification === "publisher_media" || source.classification === "third_party") {
        if (source.authorityScore >= 70) {
          const gapMagnitude = 0.8;
          const confidence = 0.85;
          const target = source.domain;
          const id = this.generateDeterministicId(inputs.organizationId, "citation", target);

          results.push({
            id,
            organizationId: inputs.organizationId,
            type: "citation",
            target,
            evidence: [
              {
                source: "citation",
                signal: "authoritative_source_uncited",
                value: source.authorityScore,
                comparator: "high_authority_uncited_by_project",
                reference: source.classification
              }
            ],
            confidence,
            gapMagnitude,
            opportunityScore: this.calculateOpportunityScore(gapMagnitude, confidence),
            severity: this.deriveSeverity(this.calculateOpportunityScore(gapMagnitude, confidence)),
            rationale: `Authoritative citation source '${source.domain}' (${source.classification}, Authority: ${source.authorityScore}) lacks project citation coverage.`
          });
        }
      }
    }

    return results;
  }

  /**
   * Deterministically calculates opportunity score (0 to 100 clamped).
   */
  private calculateOpportunityScore(gapMagnitude: number, confidence: number): number {
    const raw = (gapMagnitude * 0.6 + confidence * 0.4) * 100;
    return Math.min(100, Math.max(0, Math.round(raw)));
  }

  /**
   * Derives severity deterministically from opportunity score.
   */
  private deriveSeverity(opportunityScore: number): FindingSeverity {
    if (opportunityScore >= 75) return "critical";
    if (opportunityScore >= 50) return "high";
    if (opportunityScore >= 25) return "medium";
    return "low";
  }

  /**
   * Generates a deterministic ID string without Date.now() or Math.random().
   */
  private generateDeterministicId(orgId: string, type: ContentGapType, target: string): string {
    const cleanTarget = target.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    return `gap-${orgId}-${type}-${cleanTarget}`;
  }
}
