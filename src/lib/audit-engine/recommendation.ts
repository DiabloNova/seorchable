import { NormalizedAuditFeatures, AuditReportScores, AuditRecommendation } from "@/types/audit";

/**
 * Recommendation Engine for BrandGraph.
 * Analyzes extracted features and calculated scores to produce prioritized,
 * actionable recommendations mapped directly to the responsible product module.
 */
export function generateRecommendations(
  features: NormalizedAuditFeatures,
  scores: AuditReportScores
): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = [];

  // --- 1. Technical Optimisation Module ---
  const tech = features.technical;

  if (!tech.security.httpsEnforced) {
    recommendations.push({
      issue: "Website does not enforce HTTPS secure protocol",
      severity: "critical",
      module: "Technical Optimisation",
      action: "Install a valid SSL/TLS certificate and configure full-domain HTTPS redirection.",
      impactDescription: "Establishes a secure web session, preventing search engines and chat crawlers from blocking your domain due to non-secure alerts."
    });
  }

  if (!tech.title.present) {
    recommendations.push({
      issue: "Page title meta tag is missing entirely",
      severity: "critical",
      module: "Technical Optimisation",
      action: "Create a unique, descriptive `<title>` tag containing 50-60 characters.",
      impactDescription: "Title metadata serves as the primary identifier in model memory arrays."
    });
  } else if (tech.title.quality === "too_short") {
    recommendations.push({
      issue: "Page title tag is extremely short",
      severity: "medium",
      module: "Technical Optimisation",
      action: "Extend title to 50-60 characters, naturally integrating primary brand name and keywords.",
      impactDescription: "Maximizes keyword weight and context indexing inside LLM embeddings."
    });
  }

  if (tech.links.brokenIndicator) {
    recommendations.push({
      issue: "Empty or void link references discovered on page",
      severity: "medium",
      module: "Technical Optimisation",
      action: "Replace empty, hash-only, or void javascript href attributes with valid canonical paths.",
      impactDescription: "Eliminates trap loops that exhaust crawling budgets and raise bot crawling exceptions."
    });
  }

  if (!tech.canonical.present) {
    recommendations.push({
      issue: "Canonical tag (<link rel=\"canonical\">) is missing",
      severity: "high",
      module: "Technical Optimisation",
      action: "Inject a self-referencing canonical URL tag into the head section.",
      impactDescription: "Aids search indexers in resolving matching routes and avoids link authority dilution across duplicate URL forms."
    });
  }

  // --- 2. Content Studio Module ---
  const content = features.content;

  if (content.headings.h1Count === 0) {
    recommendations.push({
      issue: "No H1 heading tag declared on page",
      severity: "critical",
      module: "Content Studio",
      action: "Declare exactly one H1 heading at the top of the body containing your primary keyword.",
      impactDescription: "Provides an explicit primary topic outline for semantic paragraph crawlers."
    });
  } else if (content.headings.h1Count > 1) {
    recommendations.push({
      issue: "Multiple top-level H1 tags present on page",
      severity: "medium",
      module: "Content Studio",
      action: "Restructure heading layers so there is exactly one H1 tag, nesting sub-topics in H2 and H3 elements.",
      impactDescription: "Prevents semantic focus dilution, allowing parsers to easily weigh the core theme."
    });
  }

  if (content.wordCount < 300) {
    recommendations.push({
      issue: "Thin content depth with under 300 words",
      severity: "high",
      module: "Content Studio",
      action: "Flesh out page sections with high-quality, comprehensive paragraphs exceeding 600 words.",
      impactDescription: "Hinders semantic engines which penalize thin text resources during model training sequences."
    });
  }

  // --- 3. AEO Insights Module ---
  const aeo = features.aeo;

  if (!aeo.orgSchemaPresent) {
    recommendations.push({
      issue: "Missing Organization metadata schema",
      severity: "high",
      module: "AEO Insights",
      action: "Inject Organization schema markup defining official name, URL, logo, and social handles.",
      impactDescription: "Establishes a solid, verifiable entity node inside the chatbot's Knowledge Graph."
    });
  }

  if (!aeo.faqSchema.present) {
    recommendations.push({
      issue: "No FAQPage structured schema detected",
      severity: "medium",
      module: "AEO Insights",
      action: "Construct FAQPage schema representing common user question-and-answer pairs in your sector.",
      impactDescription: "Allows chatbot encoders to directly parse query answers, significantly raising direct reference probability."
    });
  }

  // --- 4. LLM Analytics Module ---
  const llm = features.llmReadiness;

  if (llm.brandMentionCount === 0) {
    recommendations.push({
      issue: "No brand name keyword mentions found in text",
      severity: "high",
      module: "LLM Analytics",
      action: "Naturally weave your exact brand name keyword into body texts and summaries.",
      impactDescription: "Strengthens semantic links between commercial industry terms and your brand."
    });
  }

  if (llm.entityDensity < 0.5) {
    recommendations.push({
      issue: "Extremely low entity density",
      severity: "medium",
      module: "LLM Analytics",
      action: "Revise copy to use explicit, named entities and concrete terms rather than vague pronouns.",
      impactDescription: "Enables LLMs to map definite nouns and concepts to your core brand products."
    });
  }

  // --- 5. Prompt Intelligence Module ---
  if (llm.topicCoverageMetrics.score < 50) {
    recommendations.push({
      issue: "Narrow topic coverage score",
      severity: "medium",
      module: "Prompt Intelligence",
      action: "Expand topics to include background, commercial pricing, and security segments.",
      impactDescription: "Broadens the query categories that can trigger and justify your brand as an organic recommendation."
    });
  }

  // --- 6. AI Shopping Module ---
  if (!aeo.productSchemaPresent && !aeo.articleSchemaPresent) {
    recommendations.push({
      issue: "No Product, Article, or offer schema detected",
      severity: "low",
      module: "AI Shopping",
      action: "Declare Product/Offer schemas including pricing, stock status, and review rating bounds.",
      impactDescription: "Enables automated AI shopping agents and price-comparison assistants to index your products."
    });
  }

  // --- 7. MCP (Model Context Protocol) ---
  if (!aeo.jsonLdDetected) {
    recommendations.push({
      issue: "No JSON-LD structured data detected",
      severity: "low",
      module: "MCP",
      action: "Implement correct, JSON-formatted structured schemas in your page template heads.",
      impactDescription: "Ensures seamless API and structure data integration across Model Context Protocol server stacks."
    });
  }

  // --- 8. Agent Module ---
  if (features.warnings.length > 0) {
    recommendations.push({
      issue: "Crawl parser warnings or missing HTML structures present",
      severity: "low",
      module: "Agent",
      action: "Address missing structural elements and clear crawler warnings.",
      impactDescription: "Creates clean, normalized diagnostic payloads optimized for downstream autonomous AI agents."
    });
  }

  // Prioritization & Sorting logic:
  // Order: critical -> high -> medium -> low
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

  return [...recommendations].sort((a, b) => {
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}
