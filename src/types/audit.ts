// ==========================================
// Core Audit Engine Contracts (Foundation)
// ==========================================

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
      score: number;
      paragraphCount: number;
      avgParagraphLength: number;
      density: number;
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
    knowledgeGraphReadiness: number;
    citationReadiness: number;
  };

  llmReadiness: {
    entityDensity: number;
    brandMentionCount: number;
    brandMentionDensity: number;
    semanticCompletenessScore: number;
    topicCoverageMetrics: {
      categories: string[];
      score: number;
    };
  };
}

export interface ScoreContributor {
  factor: string;
  impact: number;
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

export type PlatformModule =
  | "AEO Insights"
  | "LLM Analytics"
  | "Prompt Intelligence"
  | "Content Studio"
  | "Technical Optimisation"
  | "AI Shopping"
  | "MCP"
  | "Agent";

export interface AuditRecommendation {
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  module: PlatformModule;
  action: string;
  impactDescription?: string;
}

export interface UnifiedAuditResponse {
  auditId: string;
  url: string;
  normalizedUrl: string;
  timestamp: string;
  data: NormalizedAuditFeatures;
  scores: AuditReportScores;
  recommendations: AuditRecommendation[];
  warnings: string[];
}

// ==========================================
// Legacy / UI Integration State Contracts
// ==========================================

export type AuditStatus =
  | "idle"
  | "invalid-url"
  | "loading"
  | "auth-required"
  | "processing"
  | "completed"
  | "error";

export interface FirecrawlLog {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface LLMProviderInsight {
  providerName: string;
  sentimentScore: number;
  visibilityIndex: number;
  recommendation: string;
}

export interface AIAnalysisResult {
  geminiScore: number;
  geminiInsights: string;
  firecrawlCrawledPagesCount: number;
  firecrawlLogs: FirecrawlLog[];
  llmProviderInsights: LLMProviderInsight[];
}

export interface RecommendationItem {
  issue: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
}

export interface RecommendationResult {
  contentGaps: RecommendationItem[];
  missingEntities: string[];
  brandPositioningImprovements: string[];
  aiDiscoverabilityRecommendations: string[];
}

export interface AuditJob {
  id: string;
  url: string;
  status: AuditStatus;
  createdAt: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  analysis: AIAnalysisResult;
  recommendations: RecommendationResult;
}

export interface IAiAuditService {
  validateUrl: (url: string) => boolean;
  provisionAuditJob: (url: string) => Promise<AuditJob>;
  simulateCrawlingAndAnalysis: (
    job: AuditJob,
    onProgress: (log: string) => void
  ) => Promise<AuditJob>;
} main
}
