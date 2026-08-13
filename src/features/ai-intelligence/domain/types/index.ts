/**
 * Phase 7C.1 — AI Visibility Intelligence Engine
 * Enterprise SaaS Multi-Tenant Domain Type Definitions & Value Objects
 */

export type SubscriptionPlan = "free" | "growth" | "enterprise";

/**
 * Value Object: Audit Metadata
 * Captures lifecycle, ownership, and soft deletion information for compliance and security
 */
export interface AuditMetadata {
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string; // User ID or system service identifier
  updatedBy: string; // User ID or system service identifier
  deletedAt?: Date | string; // Soft deletion support
  version: number; // Optimistic locking version
}

/**
 * Value Object: Sentiment
 * Captures granular sentiment indicators for brand mentions or AI observations
 */
export interface SentimentVO {
  score: number; // Normalized -100 (negative) to 100 (positive)
  label: "positive" | "negative" | "neutral";
  confidence: number; // 0.0 to 1.0 confidence of sentiment classifier
}

/**
 * Value Object: Confidence
 * Captures statistical confidence ratings
 */
export interface ConfidenceVO {
  score: number; // 0.0 to 1.0
  rating: "high" | "medium" | "low";
}

/**
 * Entity: Organization
 * Aggregate Root representing the Multi-Tenant subscription holder.
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: SubscriptionPlan;
  audit: AuditMetadata;
}

/**
 * Entity: Brand
 * Represents a company/brand monitored inside a Tenant/Organization.
 */
export interface Brand {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  name: string;
  description?: string;
  website: string;
  industry?: string;
  country?: string;
  audit: AuditMetadata;
}

/**
 * Entity: Entity
 * Represents a semantic entity extracted from AI ecosystems (Wikidata/Knowledge Graphs).
 */
export interface Entity {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  brandId: string;
  name: string;
  type: string; // e.g., "Brand", "Product", "Competitor", "Person", "Organization"
  wikidataId?: string;
  wikipediaUrl?: string;
  confidence: ConfidenceVO; // Rich Value Object
  audit: AuditMetadata;
}

export type RelationshipType = "owns" | "creates" | "competes_with" | "related_to" | "mentioned_with";

/**
 * Entity: EntityRelationship
 * Defines direct semantic connections within the client's Knowledge Graph.
 */
export interface EntityRelationship {
  organizationId: string; // strict multi-tenant partition key
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  confidence: ConfidenceVO; // Rich Value Object
  audit: AuditMetadata;
}

export type AIEngineName = "ChatGPT" | "Claude" | "Gemini" | "Perplexity";

/**
 * Entity: AIEngine
 * Represents an external generative engine / platform being analyzed.
 */
export interface AIEngine {
  id: string; // e.g. "engine-chatgpt-4o"
  name: AIEngineName;
  provider: string; // e.g., "OpenAI"
  version: string; // e.g., "gpt-4o"
  capabilities: string[]; // e.g. ["RAG", "web_search", "citations"]
  isActive: boolean;
  audit: AuditMetadata;
}

export type PromptIntent = "Discovery" | "Comparison" | "Recommendation" | "Purchase" | "Research" | "Authority";

export type PriorityLevel = "low" | "medium" | "high";

/**
 * Entity: Prompt
 * Represents an AEO trackable query formulated to evaluate generative responses.
 */
export interface Prompt {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  brandId: string;
  text: string;
  category: string;
  intent: PromptIntent;
  language: "en" | "fa" | string;
  priority: PriorityLevel;
  audit: AuditMetadata;
}

/**
 * Entity: AIObservation
 * Represents a captured generative response run.
 */
export interface AIObservation {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  promptId: string;
  engineId: string;
  responseText: string;
  visibilityScore: number; // 0 to 100 AEO composite score
  sentiment: SentimentVO; // Rich Value Object
  confidence: ConfidenceVO; // Rich Value Object
  executedAt: Date | string;
  audit: AuditMetadata;
}

export interface TextContextVO {
  textSnippet: string;
  charStart: number;
  charEnd: number;
}

/**
 * Entity: BrandMention
 * Represents a resolved brand presence mapped within an AIObservation.
 */
export interface BrandMention {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  observationId: string;
  entityId: string;
  context: TextContextVO; // Rich Value Object
  sentiment: SentimentVO; // Rich Value Object
  confidence: ConfidenceVO; // Rich Value Object
  audit: AuditMetadata;
}

/**
 * Entity: Citation
 * Represents a cited source/link resolved within an AIObservation response.
 */
export interface Citation {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  observationId: string;
  url: string;
  domain: string;
  title: string;
  authorityScore: number; // 0 to 100 (Domain Trust)
  relevanceScore: number; // 0 to 100 (Topic Similarity)
  audit: AuditMetadata;
}

/**
 * Entity: VisibilityScore
 * Aggregated analytics snapshot representing engine-specific brand visibility over time.
 */
export interface VisibilityScore {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  brandId: string;
  engineId: string;
  overallScore: number;
  mentionScore: number;
  citationScore: number;
  authorityScore: number;
  sentimentScore: number;
  positionScore: number;
  date: Date | string;
  audit: AuditMetadata;
}

export type RecommendationStatus = "pending" | "applied" | "ignored";

/**
 * Entity: Recommendation
 * Represents an autonomous recommendation action proposed to boost brand visibility.
 */
export interface Recommendation {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  brandId: string;
  category: string;
  priority: PriorityLevel;
  impactScore: number; // Predicted lift (0-100)
  description: string;
  status: RecommendationStatus;
  audit: AuditMetadata;
}

/**
 * Entity: DocumentEmbedding
 * Represents stored text chunks along with dense high-dimensional semantic vector embeddings.
 */
export interface DocumentEmbedding {
  id: string;
  tenantId: string; // strict multi-tenant partition key
  contentChunk: string;
  metadata: Record<string, unknown>;
  embedding: number[];
  createdAt: Date | string;
}

/**
 * Entity: KgEntity
 * Represents a semantic entity inside the Optimus AI Persian Knowledge Graph.
 */
export interface KgEntity {
  id: string;
  tenantId: string; // strict multi-tenant partition key
  name: string;
  type: string;
  properties: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * AI Visibility Audit Types
 */
export type AIVisibilityAuditStatus = "PENDING" | "RUNNING" | "ANALYZING" | "COMPLETED" | "FAILED";

export interface AIVisibilityAuditMetrics {
  answerVisibilityScore: number;
  brandMentionScore: number;
  entityRecognitionScore: number;
  citationPresenceScore: number;
  sourceAuthorityScore: number;
  answerInclusionScore: number;
}

export interface AIVisibilityAudit {
  id: string;
  organizationId: string;
  brandId: string;
  status: AIVisibilityAuditStatus;
  overallScore: number | null;
  metrics: Partial<AIVisibilityAuditMetrics>;
  promptsCoverage: {
    total: number;
    executed: number;
    analyzed: number;
    failed: number;
    skipped: number;
  };
  evidenceSummary: {
    mentions: Array<{ promptId: string; count: number; snippet: string; level: string }>;
    citations: Array<{ promptId: string; url: string; domain: string; authority: string | number }>;
    entityRecognition: Array<{ promptId: string; status: string }>;
    answerInclusion: Array<{ promptId: string; status: string }>;
  };
  scoringVersion: string;
  analyzerVersion: string;
  audit: AuditMetadata;
}

export type AuditPromptStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export interface AuditPromptAnalysis {
  answerVisibility: {
    level: "not_mentioned" | "indirectly_referenced" | "directly_mentioned" | "prominently_included" | "recommended_preferred";
    evidence: string;
    confidence: number;
  };
  brandMentions: {
    detected: boolean;
    count: number;
    type: string;
    evidence: string;
    confidence: number;
  };
  entityRecognition: {
    status: "not_recognized" | "ambiguously_recognized" | "correctly_recognized" | "strongly_associated";
    evidence: string;
    confidence: number;
  };
  citationPresence: {
    present: boolean;
    count: number;
    citations: Array<{
      url: string;
      domain: string;
      title: string;
      isTargetDomain: boolean;
      authority: string | number; // number or "unknown"
    }>;
    confidence: number;
  };
  sourceAuthority: {
    status: "unknown" | "resolved";
    averageScore?: number;
    evidence: string;
  };
  answerInclusion: {
    status: "absent" | "mentioned_but_not_included" | "included" | "prominently_included" | "recommended_preferred";
    evidence: string;
    confidence: number;
  };
  scoreContribution: number;
}

export interface AuditPrompt {
  id: string;
  organizationId: string;
  auditId: string;
  promptText: string;
  category: string;
  targetEntity: string;
  locale: string;
  status: AuditPromptStatus;
  errorMessage?: string;
  latencyMs?: number;
  executedAt?: string;
  responseText?: string;
  analysis: Partial<AuditPromptAnalysis>;
  audit: AuditMetadata;
}

/**
 * AI Prompt Intelligence Types (Task 5.1)
 */
export type PromptCategory =
  | "Brand Discovery"
  | "Product/Service Discovery"
  | "Category"
  | "Recommendation"
  | "Comparison"
  | "Problem/Solution"
  | "Local/Geographic"
  | "Entity"
  | "Informational"
  | "Transactional"
  | "Navigational";

export type PromptIntentType = "Discovery" | "Comparison" | "Recommendation" | "Purchase" | "Research" | "Authority" | "Informational" | "Transactional" | "Navigational";

export interface PromptVariable {
  name: string;
  defaultValue: string;
  description?: string;
}

export interface PromptDefinition {
  id: string;
  organizationId: string; // Tenant context
  brandId: string; // Target brand
  name: string; // friendly name
  promptTemplate: string; // parameterized string with {varName} placeholders
  category: PromptCategory;
  intent: PromptIntentType;
  locale: string;
  isActive: boolean;
  variables: PromptVariable[];
  competitors: string[]; // configured target competitors
  tags: string[];
  notes?: string;
  version: number; // Snapshot template version
  audit: AuditMetadata;
}

export interface PromptSchedule {
  id: string;
  organizationId: string;
  promptId: string;
  enabled: boolean;
  cronExpression: string; // cron syntax
  timezone: string; // e.g. "Asia/Tehran" or "UTC"
  nextExecutionAt?: Date | string;
  lastExecutionAt?: Date | string;
  status: "IDLE" | "QUEUED" | "RUNNING" | "FAILED";
  failureReason?: string;
  scheduleVersion: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type PromptExecutionStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "cancelled";

export interface PromptExecution {
  id: string;
  organizationId: string;
  promptId: string;
  promptVersion: number;
  resolvedPromptText: string;
  variablesValues: Record<string, string>;
  status: PromptExecutionStatus;
  provider: string;
  model: string;
  modelVersion?: string;
  responseText?: string;
  latencyMs?: number;
  errorMessage?: string;
  attempts: number;
  maxAttempts: number;
  scheduledFor?: Date | string;
  executedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type PositionPresence = "not_present" | "mentioned" | "recommended" | "ranked" | "unknown";
export type EvidenceStructureType = "numbered_list" | "bullet_list" | "table" | "prose" | "unknown";

export interface PositionObservation {
  id: string;
  organizationId: string;
  sourceExecutionId: string;
  subjectEntityId: string; // Target brand Name or competitor name
  presence: PositionPresence;
  numericPosition?: number; // numbered list index (1-based)
  evidenceExcerpt: string;
  evidenceStructure: EvidenceStructureType;
  confidence: number;
  analyzerVersion: string;
  createdAt: Date | string;
}

/**
 * AI Citation Intelligence Types (Task 5.2)
 */
export type CitationSourceClassification =
  | "owned"
  | "competitor"
  | "third_party"
  | "publisher_media"
  | "government"
  | "academic_research"
  | "directory"
  | "marketplace"
  | "social"
  | "forum_community"
  | "documentation"
  | "reference_encyclopedia"
  | "other"
  | "unknown";

export interface CitationSource {
  id: string;
  organizationId: string;
  domain: string; // unique normalized lowercased domain (e.g. "wikipedia.org")
  canonicalUrl?: string;
  classification: CitationSourceClassification;
  qualityScore: number; // calculated deterministic quality
  authorityScore: number; // calculated independently evaluated authority
  firstSeenAt: Date | string;
  lastSeenAt: Date | string;
  occurrenceCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CitationOccurrence {
  id: string;
  organizationId: string;
  sourceId: string; // links to citation_sources
  auditId?: string; // links to ai_visibility_audits (nullable)
  executionId?: string; // links to prompt_executions (nullable)
  promptId?: string; // links to prompts (nullable)
  observationId?: string; // links to ai_observations (nullable)
  url: string; // exact matched raw URL
  title?: string;
  snippet?: string; // surrounding text context excerpt
  position?: number; // list index position of this citation in the response
  confidence: number; // extraction confidence (0.0 to 1.0)
  createdAt: Date | string;
}

/**
 * Entity: Website
 * Represents the analyzed/canonical website within a tenant/organization.
 */
export interface Website {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  domain: string; // canonical domain/origin
  normalizedUrl: string; // standardized URL
  status: "active" | "archived" | string;
  lastCrawledAt?: Date | string;
  lastAnalyzedAt?: Date | string;
  audit: AuditMetadata;
}

/**
 * Entity: Page
 * Represents a crawlable/indexable website resource.
 */
export interface Page {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  websiteId: string; // website container ownership
  url: string; // original canonical URL
  normalizedUrl: string; // standardized unique URL
  path: string; // relative path
  statusCode?: number;
  indexability: "indexable" | "noindex" | "blocked_by_robots" | "non_200_status" | "canonical_mismatch" | "undetermined" | string;
  title?: string;
  description?: string;
  audit: AuditMetadata;
}

/**
 * Entity: Keyword
 * Represents a normalized search/query term.
 */
export interface Keyword {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  name: string; // normalized lowercased name (uniqueness index key)
  displayName: string; // original search/query term
  language: "en" | "fa" | string;
  intent?: string;
  audit: AuditMetadata;
}

/**
 * Entity: Topic
 * Represents a semantic/content topic.
 */
export interface Topic {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  name: string; // canonical name (uniqueness index key)
  description?: string;
  language: "en" | "fa" | string;
  parentTopicId?: string; // parent relationship
  audit: AuditMetadata;
}

/**
 * Entity: Competitor
 * Represents a monitored competitive brand/entity.
 */
export interface Competitor {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  name: string;
  domain: string;
  status: "active" | "archived" | string;
  audit: AuditMetadata;
}

/**
 * Entity: HistoricalMetric
 * General-purpose time-series log for trend-lines, visibility, and tracking indices.
 */
export interface HistoricalMetric {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  targetType: "website" | "page" | "brand" | "competitor" | string;
  targetId: string;
  metricName: string; // e.g. "visibility_score", "word_count"
  metricValue: number;
  dimensions: Record<string, unknown>;
  timestamp: Date | string;
  audit: AuditMetadata;
}

export type DiagnosticCategory = "technical" | "content" | "seo" | "aeo" | "entity" | "citation" | "competitive";

export type FindingSeverity = "low" | "medium" | "high" | "critical";

export type FindingConfidence = "low" | "medium" | "high";

export type FindingStatus = "active" | "resolved" | "ignored";

export type FindingRelationshipType = "caused_by" | "contributes_to" | "depends_on" | "duplicate_of" | "related_to" | "affects" | "supported_by";

/**
 * Entity: DiagnosticFinding
 * Represents one evidence-backed diagnostic result.
 */
export interface DiagnosticFinding {
  id: string;
  organizationId: string; // strict multi-tenant partition key
  websiteId: string; // website context
  category: DiagnosticCategory;
  code: string; // machine-readable diagnostic code, e.g. "ERR_DUPLICATE_TITLE", "ERR_AEO_BRAND_ABSENT"
  title: string;
  explanation: string;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  status: FindingStatus;
  affectedResource: string; // affected page URL, sitemap URL, or entity name
  evidence: Record<string, unknown>; // structured evidence bag
  audit: AuditMetadata;
}

/**
 * Entity: DiagnosticFindingRelationship
 * Defines directional semantic dependencies between findings (e.g. root cause -> symptom).
 */
export interface DiagnosticFindingRelationship {
  organizationId: string; // strict multi-tenant partition key
  sourceFindingId: string;
  targetFindingId: string;
  relationshipType: FindingRelationshipType;
  audit: AuditMetadata;
}

/**
 * Entity: KgRelationship
 * Represents a directed typed semantic relation link mapping between two KG nodes.
 */
export interface KgRelationship {
  id: string;
  tenantId: string; // strict multi-tenant partition key
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  properties: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
}
