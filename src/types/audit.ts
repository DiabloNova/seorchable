export type AuditStatus = "idle" | "invalid-url" | "loading" | "auth-required" | "processing" | "completed" | "error";

export interface FirecrawlLog {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export interface LLMProviderInsight {
  providerName: string;
  sentimentScore: number; // 0-100
  visibilityIndex: number; // 0-100
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
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  analysis: AIAnalysisResult;
  recommendations: RecommendationResult;
}

/**
 * Interface definition for a future backend API Client or service.
 * Separating provider business logic from the React UI components.
 */
export interface IAiAuditService {
  validateUrl: (url: string) => boolean;
  provisionAuditJob: (url: string) => Promise<AuditJob>;
  simulateCrawlingAndAnalysis: (job: AuditJob, onProgress: (log: string) => void) => Promise<AuditJob>;
}
