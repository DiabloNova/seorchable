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
