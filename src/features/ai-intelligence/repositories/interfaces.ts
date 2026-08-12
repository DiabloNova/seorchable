/**
 * Phase 7C.1 — AI Visibility Intelligence Engine
 * Enterprise Decoupled Repository Interfaces
 * Follows the Interface Segregation & Dependency Inversion Principles.
 */

import {
  Organization,
  Brand,
  Entity,
  EntityRelationship,
  AIEngine,
  Prompt,
  AIObservation,
  BrandMention,
  Citation,
  VisibilityScore,
  Recommendation,
  RelationshipType,
  Website,
  Page,
  Keyword,
  Topic,
  Competitor,
  HistoricalMetric
} from "../domain/types";

export interface QueryParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean; // Soft deletion support
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  limit: number;
  offset: number;
}

export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  save(org: Organization): Promise<Organization>;
  deleteSoft(id: string, deletedBy: string): Promise<boolean>;
}

export interface IBrandRepository {
  findById(organizationId: string, id: string): Promise<Brand | null>;
  findByOrganizationId(organizationId: string, params?: QueryParams): Promise<PaginatedResult<Brand>>;
  save(brand: Brand): Promise<Brand>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IEntityRepository {
  findById(organizationId: string, id: string): Promise<Entity | null>;
  findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Entity>>;
  save(entity: Entity): Promise<Entity>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;

  // Semantic Relationships (Tenant-scoped)
  getRelationships(organizationId: string): Promise<EntityRelationship[]>;
  saveRelationship(relationship: EntityRelationship): Promise<EntityRelationship>;
  deleteRelationship(organizationId: string, sourceId: string, targetId: string, type: RelationshipType): Promise<boolean>;
}

export interface IAIEngineRepository {
  findById(id: string): Promise<AIEngine | null>;
  findAll(params?: QueryParams): Promise<PaginatedResult<AIEngine>>;
  save(engine: AIEngine): Promise<AIEngine>;
  deleteSoft(id: string, deletedBy: string): Promise<boolean>;
}

export interface IPromptRepository {
  findById(organizationId: string, id: string): Promise<Prompt | null>;
  findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Prompt>>;
  save(prompt: Prompt): Promise<Prompt>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IObservationRepository {
  findById(organizationId: string, id: string): Promise<AIObservation | null>;
  findByPromptId(organizationId: string, promptId: string, params?: QueryParams): Promise<PaginatedResult<AIObservation>>;
  findByEngineId(organizationId: string, engineId: string, params?: QueryParams): Promise<PaginatedResult<AIObservation>>;
  save(observation: AIObservation): Promise<AIObservation>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;

  // Extracted Mentions (Tenant-scoped)
  findMentionsByObservationId(organizationId: string, observationId: string): Promise<BrandMention[]>;
  saveMention(mention: BrandMention): Promise<BrandMention>;

  // Extracted Citations (Tenant-scoped)
  findCitationsByObservationId(organizationId: string, observationId: string): Promise<Citation[]>;
  saveCitation(citation: Citation): Promise<Citation>;
}

export interface IVisibilityScoreRepository {
  findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<VisibilityScore>>;
  save(score: VisibilityScore): Promise<VisibilityScore>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IRecommendationRepository {
  findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Recommendation>>;
  save(rec: Recommendation): Promise<Recommendation>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IWebsiteRepository {
  findById(organizationId: string, id: string): Promise<Website | null>;
  findByDomain(organizationId: string, domain: string): Promise<Website | null>;
  save(website: Website): Promise<Website>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IPageRepository {
  findById(organizationId: string, id: string): Promise<Page | null>;
  findByWebsiteId(organizationId: string, websiteId: string, params?: QueryParams): Promise<PaginatedResult<Page>>;
  findByNormalizedUrl(organizationId: string, websiteId: string, normalizedUrl: string): Promise<Page | null>;
  save(page: Page): Promise<Page>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;

  // Many-to-many associations
  linkKeyword(organizationId: string, pageId: string, keywordId: string): Promise<void>;
  linkTopic(organizationId: string, pageId: string, topicId: string): Promise<void>;
  linkEntity(organizationId: string, pageId: string, entityId: string): Promise<void>;
  getLinkedKeywords(organizationId: string, pageId: string): Promise<Keyword[]>;
  getLinkedTopics(organizationId: string, pageId: string): Promise<Topic[]>;
  getLinkedEntities(organizationId: string, pageId: string): Promise<Entity[]>;
}

export interface IKeywordRepository {
  findById(organizationId: string, id: string): Promise<Keyword | null>;
  findByName(organizationId: string, name: string): Promise<Keyword | null>;
  save(keyword: Keyword): Promise<Keyword>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
  linkTopic(organizationId: string, keywordId: string, topicId: string): Promise<void>;
  getLinkedTopics(organizationId: string, keywordId: string): Promise<Topic[]>;
}

export interface ITopicRepository {
  findById(organizationId: string, id: string): Promise<Topic | null>;
  findByName(organizationId: string, name: string): Promise<Topic | null>;
  save(topic: Topic): Promise<Topic>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
  linkEntity(organizationId: string, topicId: string, entityId: string): Promise<void>;
  getLinkedEntities(organizationId: string, topicId: string): Promise<Entity[]>;
}

export interface ICompetitorRepository {
  findById(organizationId: string, id: string): Promise<Competitor | null>;
  findByOrganizationId(organizationId: string, params?: QueryParams): Promise<PaginatedResult<Competitor>>;
  save(competitor: Competitor): Promise<Competitor>;
  deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean>;
}

export interface IHistoricalMetricRepository {
  save(metric: HistoricalMetric): Promise<HistoricalMetric>;
  findMetrics(
    organizationId: string,
    targetType: string,
    targetId: string,
    metricName?: string,
    startTime?: Date | string,
    endTime?: Date | string
  ): Promise<HistoricalMetric[]>;
}
