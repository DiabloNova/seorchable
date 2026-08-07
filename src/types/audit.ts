export interface RawCrawlData {
  url: string;
  html?: string;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    robots?: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    [key: string]: any;
  };
  headers?: Record<string, string>;
  robotsTxt?: {
    available: boolean;
    content?: string;
  };
  sitemap?: {
    available: boolean;
    content?: string;
  };
}

export interface NormalizedAuditFeatures {
  url: string;
  warnings: string[];

  technical: {
    title: {
      present: boolean;
      length: number;
      quality: "good" | "too_short" | "too_long" | "missing" | "excellent";
      value: string;
    };
    metaDescription: {
      present: boolean;
      length: number;
      value: string;
    };
    canonical: {
      present: boolean;
      correct: boolean;
      matchesRequestedUrl: boolean;
      value: string;
    };
    robotsTxt: {
      available: boolean;
      hasDirectives: boolean;
    };
    sitemap: {
      available: boolean;
      hasUrls: boolean;
    };
    openGraph: {
      complete: boolean;
      ogTitlePresent: boolean;
      ogDescriptionPresent: boolean;
    };
    twitterCards: {
      complete: boolean;
      twitterTitlePresent: boolean;
      twitterDescriptionPresent: boolean;
    };
    security: {
      httpsEnforced: boolean;
      hstsPresent: boolean;
      cspPresent: boolean;
      xContentTypeOptionsPresent: boolean;
      xFrameOptionsPresent: boolean;
    };
    images: {
      count: number;
      missingAltCount: number;
      missingAltRatio: number;
      optimizedFlags: boolean;
    };
    links: {
      internalCount: number;
      externalCount: number;
      internalRatio: number;
      externalRatio: number;
      brokenIndicator: boolean;
    };
  };

  content: {
    wordCount: number;
    contentToCodeRatio: number;
    headings: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
      hierarchyComplete: boolean;
    };
    readability: {
      score: number; // e.g. Flesch-Kincaid equivalent or custom readability proxy
      paragraphCount: number;
      avgParagraphLength: number;
      density: number; // Paragraph count to word count ratio
    };
    eeat: {
      hasAuthorInfo: boolean;
      hasPublisherInfo: boolean;
      hasContactInfo: boolean;
      trustSignalsScore: number;
    };
  };

  aeo: {
    jsonLdDetected: boolean;
    parsedJsonLdCount: number;
    schemaTypes: string[];
    faqSchema: {
      present: boolean;
      itemCount: number;
    };
    orgSchemaPresent: boolean;
    articleSchemaPresent: boolean;
    productSchemaPresent: boolean;
    knowledgeGraphReadiness: number; // score 0 to 100
    citationReadiness: number; // score 0 to 100
  };

  llmReadiness: {
    entityDensity: number; // density multiplier
    brandMentionCount: number;
    brandMentionDensity: number;
    semanticCompletenessScore: number; // 0 to 100
    topicCoverageMetrics: {
      categories: string[];
      score: number;
    };
  };
}

export interface ScoreContributor {
  factor: string;
  impact: number; // Positive or negative score contribution
  description: string;
}

export interface DomainScore {
  score: number;
  contributors: ScoreContributor[];
}

export interface AuditReportScores {
  technical: DomainScore;
  content: DomainScore;
  aeo: DomainScore;
  llmReadiness: DomainScore;
  overall: DomainScore;
}

export interface AuditRecommendation {
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  module: "AEO Insights" | "LLM Analytics" | "Prompt Intelligence" | "Content Studio" | "Technical Optimisation" | "AI Shopping" | "MCP" | "Agent";
  action: string;
  impactDescription: string;
}

export interface UnifiedAuditResponse {
  url: string;
  normalizedUrl: string;
  timestamp: string;
  features: NormalizedAuditFeatures;
  scores: AuditReportScores;
  recommendations: AuditRecommendation[];
}
