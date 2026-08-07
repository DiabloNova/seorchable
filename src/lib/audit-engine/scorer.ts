import { NormalizedAuditFeatures, AuditReportScores, DomainScore, ScoreContributor } from "@/types/audit";
import {
  evaluateTechnicalRules,
  evaluateContentRules,
  evaluateAeoRules,
  evaluateLlmReadinessRules
} from "./rules";

/**
 * Deterministic Scoring Engine.
 * Converts NormalizedAuditFeatures into transparent, mathematical AuditReportScores.
 * Exposes full contribution tracking arrays with positive/negative impact values.
 * Guaranteed 100% deterministic (same input features yield identical scores).
 */
export function calculateAuditScores(features: NormalizedAuditFeatures): AuditReportScores {
  // 1. Calculate Technical Domain Score
  const technicalContributors = evaluateTechnicalRules(features);
  const technicalScore = calculateDomainScore(50, technicalContributors);

  // 2. Calculate Content Domain Score
  const contentContributors = evaluateContentRules(features);
  const contentScore = calculateDomainScore(50, contentContributors);

  // 3. Calculate AEO Domain Score
  const aeoContributors = evaluateAeoRules(features);
  const aeoScore = calculateDomainScore(40, aeoContributors);

  // 4. Calculate LLM Readiness / AI Visibility Domain Score
  const llmContributors = evaluateLlmReadinessRules(features);
  const llmScore = calculateDomainScore(30, llmContributors);

  // 5. Calculate Overall Weighted Score
  // Weights: Tech: 30%, Content: 25%, AEO: 25%, LLM: 20%
  const overallWeightedRaw =
    technicalScore.score * 0.30 +
    contentScore.score * 0.25 +
    aeoScore.score * 0.25 +
    llmScore.score * 0.20;

  const overallScoreValue = Math.min(100, Math.max(0, Math.round(overallWeightedRaw)));

  // Combine top contributors for overall transparency
  const allContributors = [
    ...technicalContributors,
    ...contentContributors,
    ...aeoContributors,
    ...llmContributors
  ];

  // Sort contributors by absolute impact size to show the most critical drivers
  const overallContributors = [...allContributors]
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 5); // Expose top 5 most impactful contributors overall

  return {
    technical: technicalScore,
    content: contentScore,
    aeo: aeoScore,
    llmReadiness: llmScore,
    overall: {
      score: overallScoreValue,
      contributors: overallContributors
    }
  };
}

/**
 * Utility helper to sum baseline score and contributors, bounded between 0 and 100.
 */
function calculateDomainScore(baseline: number, contributors: ScoreContributor[]): DomainScore {
  let scoreSum = baseline;
  contributors.forEach(c => {
    scoreSum += c.impact;
  });

  const finalScore = Math.min(100, Math.max(0, scoreSum));

  return {
    score: finalScore,
    contributors
  };
}
