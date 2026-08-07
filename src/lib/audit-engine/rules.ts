import { NormalizedAuditFeatures, ScoreContributor } from "@/types/audit";

/**
 * Deterministic rules for evaluating technical SEO audit features.
 */
export function evaluateTechnicalRules(features: NormalizedAuditFeatures): ScoreContributor[] {
  const contributors: ScoreContributor[] = [];
  const tech = features.technical;

  // Title Tag (Max +/- 20)
  if (tech.title.present) {
    if (tech.title.quality === "excellent") {
      contributors.push({
        factor: "Title Length Optimization",
        impact: 10,
        description: "Page title meta tag has an optimized length (50-60 characters) maximizing search display."
      });
    } else if (tech.title.quality === "good") {
      contributors.push({
        factor: "Title Tag Presence",
        impact: 5,
        description: "A descriptive title tag is present."
      });
    } else if (tech.title.quality === "too_short") {
      contributors.push({
        factor: "Short Title Tag",
        impact: -5,
        description: "The page title is very short, missing valuable brand and keyword context."
      });
    } else if (tech.title.quality === "too_long") {
      contributors.push({
        factor: "Long Title Tag",
        impact: -5,
        description: "The title is too long and risks truncation in chatbot and search engine results."
      });
    }
  } else {
    contributors.push({
      factor: "Missing Title Tag",
      impact: -15,
      description: "Critical: The page lacks a title tag, severely impacting brand indexing."
    });
  }

  // Meta Description (Max +/- 10)
  if (tech.metaDescription.present) {
    contributors.push({
      factor: "Meta Description Presence",
      impact: 10,
      description: "Meta description tag exists, providing helpful contextual summaries."
    });
  } else {
    contributors.push({
      factor: "Missing Meta Description",
      impact: -10,
      description: "Critical: Meta description tag is missing. Crawlers must auto-generate snippets."
    });
  }

  // Canonical URL (Max +/- 10)
  if (tech.canonical.present) {
    if (tech.canonical.correct && tech.canonical.matchesRequestedUrl) {
      contributors.push({
        factor: "Self-Referencing Canonical Tag",
        impact: 10,
        description: "A correct, matching self-referencing canonical URL prevents duplicate content issues."
      });
    } else if (!tech.canonical.matchesRequestedUrl) {
      contributors.push({
        factor: "Canonical URL Mismatch",
        impact: -5,
        description: "The canonical tag points to a different URL than requested."
      });
    }
  } else {
    contributors.push({
      factor: "Missing Canonical Tag",
      impact: -10,
      description: "Critical: Canonical URL is missing. Indexing bots may encounter duplicate crawl paths."
    });
  }

  // Robots.txt
  if (tech.robotsTxt.available) {
    contributors.push({
      factor: "Robots.txt Availability",
      impact: 5,
      description: "Valid robots.txt found with indexation directives."
    });
  } else {
    contributors.push({
      factor: "Missing Robots.txt",
      impact: -5,
      description: "No robots.txt was detected. Indexing bot boundaries are undefined."
    });
  }

  // Sitemap
  if (tech.sitemap.available) {
    contributors.push({
      factor: "XML Sitemap Presence",
      impact: 5,
      description: "XML sitemap exists, helping search robots locate internal routes."
    });
  } else {
    contributors.push({
      factor: "Missing XML Sitemap",
      impact: -5,
      description: "No XML sitemap discovered. Crawl discovery is less efficient."
    });
  }

  // Social cards (Open Graph / Twitter)
  if (tech.openGraph.complete && tech.twitterCards.complete) {
    contributors.push({
      factor: "Rich Social Metadata Complete",
      impact: 5,
      description: "Open Graph and Twitter social card meta schemas are fully complete."
    });
  } else if (!tech.openGraph.complete && !tech.twitterCards.complete) {
    contributors.push({
      factor: "Incomplete Social Card Metadata",
      impact: -2,
      description: "Both Open Graph and Twitter Card descriptive properties are missing or incomplete."
    });
  }

  // Security HTTPS & Headers (Max +/- 25)
  if (tech.security.httpsEnforced) {
    contributors.push({
      factor: "HTTPS Security Enforced",
      impact: 10,
      description: "SSL certificate active. Secure HTTPS protocol is enforced."
    });
  } else {
    contributors.push({
      factor: "Non-Secure HTTP Fallback",
      impact: -15,
      description: "Critical: Website does not enforce HTTPS. Data transfer is unencrypted."
    });
  }

  if (tech.security.hstsPresent) {
    contributors.push({
      factor: "HSTS Header Enforced",
      impact: 5,
      description: "Strict-Transport-Security (HSTS) prevents non-secure requests."
    });
  }
  if (tech.security.cspPresent) {
    contributors.push({
      factor: "Content-Security-Policy (CSP)",
      impact: 5,
      description: "CSP header is present, protecting against script injection."
    });
  }

  // Images ALT attributes
  if (tech.images.count > 0) {
    if (tech.images.missingAltRatio < 0.1) {
      contributors.push({
        factor: "Optimized Image ALT Attributes",
        impact: 5,
        description: "Over 90% of page images have descriptive ALT attributes."
      });
    } else if (tech.images.missingAltRatio > 0.4) {
      contributors.push({
        factor: "Missing Image ALT Attributes",
        impact: -5,
        description: "Over 40% of images are missing ALT attributes, harming semantic parsing."
      });
    }
  }

  // Broken link indicators
  if (tech.links.brokenIndicator) {
    contributors.push({
      factor: "Broken Link Patterns",
      impact: -5,
      description: "Empty link attributes or raw javascript links present on the page."
    });
  }

  return contributors;
}

/**
 * Deterministic rules for evaluating content readability and E-E-A-T.
 */
export function evaluateContentRules(features: NormalizedAuditFeatures): ScoreContributor[] {
  const contributors: ScoreContributor[] = [];
  const content = features.content;

  // Word count (Max +/- 15)
  if (content.wordCount > 1000) {
    contributors.push({
      factor: "Substantial Content Depth",
      impact: 15,
      description: "Rich body copy (1000+ words) provides ample context for entity indexing."
    });
  } else if (content.wordCount > 500) {
    contributors.push({
      factor: "Moderate Content Depth",
      impact: 10,
      description: "Good word count (500+ words) covering essential brand claims."
    });
  } else if (content.wordCount < 200) {
    contributors.push({
      factor: "Thin Content Risk",
      impact: -15,
      description: "Page contains less than 200 words. Insufficient context for LLM training."
    });
  }

  // Headings & nesting (Max +/- 15)
  if (content.headings.h1Count === 1) {
    contributors.push({
      factor: "Single Heading H1 Enforced",
      impact: 10,
      description: "Perfect heading structural focus with exactly one H1."
    });
  } else if (content.headings.h1Count > 1) {
    contributors.push({
      factor: "Multiple H1 Headers",
      impact: -5,
      description: "diluted page focus due to multiple top-level H1 tags."
    });
  } else {
    contributors.push({
      factor: "Missing H1 Heading Tag",
      impact: -15,
      description: "Critical: No H1 header tag found. Page has no clear primary topic."
    });
  }

  if (content.headings.hierarchyComplete) {
    contributors.push({
      factor: "Logical Heading Nesting",
      impact: 5,
      description: "Heading layers follow logical, consistent hierarchy nesting."
    });
  }

  // Readability Index
  if (content.readability.score > 70) {
    contributors.push({
      factor: "High Readability Index",
      impact: 5,
      description: "Clear, fluent writing with optimized paragraph word densities."
    });
  } else if (content.readability.score < 40) {
    contributors.push({
      factor: "Complex Document Structure",
      impact: -5,
      description: "Sentence or paragraph structures are complex, hampering natural reading."
    });
  }

  // E-E-A-T Trust Score
  if (content.eeat.hasAuthorInfo) {
    contributors.push({
      factor: "Author Credentials Declared",
      impact: 5,
      description: "Clear author info, bio, or credentials detected."
    });
  }
  if (content.eeat.hasPublisherInfo) {
    contributors.push({
      factor: "Publisher Trust Signals",
      impact: 5,
      description: "Publisher brand metadata and copyright claims verified."
    });
  }
  if (content.eeat.hasContactInfo) {
    contributors.push({
      factor: "Contact / Transparency Declared",
      impact: 10,
      description: "Contact channels, addresses, or phone points explicitly declared."
    });
  }

  return contributors;
}

/**
 * Deterministic rules for evaluating AEO (Answer Engine Optimization) & schema integrations.
 */
export function evaluateAeoRules(features: NormalizedAuditFeatures): ScoreContributor[] {
  const contributors: ScoreContributor[] = [];
  const aeo = features.aeo;

  // JSON-LD (Max +/- 20)
  if (aeo.jsonLdDetected) {
    contributors.push({
      factor: "JSON-LD Schema Markup",
      impact: 15,
      description: "Structured metadata (JSON-LD) detected on page."
    });
    if (aeo.parsedJsonLdCount > 1) {
      contributors.push({
        factor: "Rich Schema Ecosystem",
        impact: 5,
        description: "Multiple structured entity metadata blocks found."
      });
    }
  } else {
    contributors.push({
      factor: "Missing Structured Data",
      impact: -15,
      description: "No JSON-LD metadata schemas detected. Bots must parse unstructured markup."
    });
  }

  // FAQ Schema
  if (aeo.faqSchema.present) {
    contributors.push({
      factor: "FAQ Schema Integration",
      impact: 10,
      description: "FAQPage schema declared, enabling direct indexing of answer boxes."
    });
  }

  // Organization Schema
  if (aeo.orgSchemaPresent) {
    contributors.push({
      factor: "Organization Schema Active",
      impact: 15,
      description: "Declares core corporate entity parameters, establishing brand trust."
    });
  }

  // Rich metadata templates
  if (aeo.articleSchemaPresent || aeo.productSchemaPresent) {
    contributors.push({
      factor: "Semantic Document Schema Present",
      impact: 10,
      description: "Article or Product schema present, defining item profiles."
    });
  }

  // Knowledge Graph Proximity
  if (aeo.knowledgeGraphReadiness > 70) {
    contributors.push({
      factor: "KG Proximity Readiness",
      impact: 10,
      description: "Superior schema and tag compliance for corporate entity graphs."
    });
  }

  return contributors;
}

/**
 * Deterministic rules for evaluating LLM Readiness / AI Visibility.
 */
export function evaluateLlmReadinessRules(features: NormalizedAuditFeatures): ScoreContributor[] {
  const contributors: ScoreContributor[] = [];
  const llm = features.llmReadiness;

  // Brand Mentions (Max +/- 15)
  if (llm.brandMentionCount > 2) {
    contributors.push({
      factor: "Healthy Brand Context Reinforcement",
      impact: 15,
      description: "The brand keyword occurs 3+ times, reinforcing semantic association."
    });
  } else if (llm.brandMentionCount === 0) {
    contributors.push({
      factor: "No Exact Brand Mentions",
      impact: -10,
      description: "The brand name keyword does not explicitly occur in the text body."
    });
  }

  // Entity density (Max +/- 15)
  if (llm.entityDensity > 1.5) {
    contributors.push({
      factor: "Dense Entity Mapping",
      impact: 15,
      description: "Rich, noun-dense concept structures are present for LLM ingestion."
    });
  } else if (llm.entityDensity < 0.5) {
    contributors.push({
      factor: "Sparse Entity Density",
      impact: -5,
      description: "Few entities or nouns extracted per word block, content is generic."
    });
  }

  // Semantic completeness
  if (llm.semanticCompletenessScore > 75) {
    contributors.push({
      factor: "Semantic Completeness Synthesis",
      impact: 15,
      description: "Excellent topic structure and heading depth for foundational learning."
    });
  }

  // Topic coverage
  if (llm.topicCoverageMetrics.score > 50) {
    contributors.push({
      factor: "Broad Topic Coverage Categories",
      impact: 15,
      description: "Body context spans multiple relevant corporate category groups."
    });
  }

  // Tech baseline synergy additions
  const tech = features.technical;
  if (tech.security.httpsEnforced && tech.canonical.present && tech.robotsTxt.available) {
    contributors.push({
      factor: "Solid Tech Indexability Baseline",
      impact: 10,
      description: "Enforces a secure, clear, crawling-ready structural index."
    });
  }

  return contributors;
}
