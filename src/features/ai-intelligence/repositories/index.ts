/**
 * Phase 7C.1 — AI Visibility Intelligence Engine
 * Enterprise InMemory Database and Repository Adapters
 */

import { Pool } from "pg";
import { TenantContextManager, TenantContextViolationException } from "../../../core/database/tenant-context";
import { PostgresClient } from "../../admin/infrastructure/persistence/postgres";
import {
  Organization,
  SubscriptionPlan,
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
  AuditMetadata,
  RelationshipType
} from "../domain/types";
import {
  IOrganizationRepository,
  IBrandRepository,
  IEntityRepository,
  IAIEngineRepository,
  IPromptRepository,
  IObservationRepository,
  IVisibilityScoreRepository,
  IRecommendationRepository,
  QueryParams,
  PaginatedResult
} from "./interfaces";

function createMockAudit(createdBy = "system"): AuditMetadata {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy,
    updatedBy: createdBy,
    version: 1
  };
}

function enforceTenantContext(organizationId: string): void {
  if (TenantContextManager.isSystemMode()) {
    return;
  }
  const activeTenantId = TenantContextManager.getRequiredTenantId();
  if (activeTenantId !== organizationId) {
    throw new TenantContextViolationException(
      `Tenant Context Violation: Access Denied. Cross-tenant operation blocked. Target organization ${organizationId} does not match active tenant ${activeTenantId}.`
    );
  }
}

class InMemoryDatabase {
  public organizations: Map<string, Organization> = new Map();
  public brands: Map<string, Brand> = new Map();
  public entities: Map<string, Entity> = new Map();
  public relationships: EntityRelationship[] = [];
  public engines: Map<string, AIEngine> = new Map();
  public prompts: Map<string, Prompt> = new Map();
  public observations: Map<string, AIObservation> = new Map();
  public mentions: Map<string, BrandMention> = new Map();
  public citations: Map<string, Citation> = new Map();
  public visibilityScores: Map<string, VisibilityScore> = new Map();
  public recommendations: Map<string, Recommendation> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Organization
    const orgId = "org-enterprise-01";
    this.organizations.set(orgId, {
      id: orgId,
      name: "Acme Enterprise Corp",
      slug: "acme-corp",
      plan: "enterprise",
      audit: createMockAudit()
    });

    // 2. Seed Brand
    const brandId = "brand-acme-01";
    this.brands.set(brandId, {
      id: brandId,
      organizationId: orgId,
      name: "Acme SaaS",
      description: "Leading AI-driven Brand Intelligence & GEO Optimization SaaS",
      website: "https://acme-saas.io",
      industry: "Technology & software",
      country: "Global",
      audit: createMockAudit()
    });

    // 3. Seed AI Engines
    const engineIds = {
      chatgpt: "engine-chatgpt",
      claude: "engine-claude",
      gemini: "engine-gemini",
      perplexity: "engine-perplexity"
    };

    this.engines.set(engineIds.chatgpt, {
      id: engineIds.chatgpt,
      name: "ChatGPT",
      provider: "OpenAI",
      version: "GPT-4o",
      capabilities: ["RAG", "web_search", "code_interpreter"],
      isActive: true,
      audit: createMockAudit()
    });

    this.engines.set(engineIds.claude, {
      id: engineIds.claude,
      name: "Claude",
      provider: "Anthropic",
      version: "Claude 3.5 Sonnet",
      capabilities: ["RAG", "complex_reasoning", "multimodal"],
      isActive: true,
      audit: createMockAudit()
    });

    this.engines.set(engineIds.gemini, {
      id: engineIds.gemini,
      name: "Gemini",
      provider: "Google",
      version: "Gemini 1.5 Pro",
      capabilities: ["RAG", "web_search", "large_context"],
      isActive: true,
      audit: createMockAudit()
    });

    this.engines.set(engineIds.perplexity, {
      id: engineIds.perplexity,
      name: "Perplexity",
      provider: "Perplexity AI",
      version: "Sonar Large",
      capabilities: ["RAG", "live_web_search", "citation_parsing"],
      isActive: true,
      audit: createMockAudit()
    });

    // 4. Seed Prompts
    const prompt1Id = "prompt-discover-01";
    const prompt2Id = "prompt-compare-02";

    this.prompts.set(prompt1Id, {
      id: prompt1Id,
      organizationId: orgId,
      brandId: brandId,
      text: "What are the top enterprise brand intelligence platform recommendations for 2025?",
      category: "Market Discovery",
      intent: "Discovery",
      language: "en",
      priority: "high",
      audit: createMockAudit()
    });

    this.prompts.set(prompt2Id, {
      id: prompt2Id,
      organizationId: orgId,
      brandId: brandId,
      text: "Compare Acme SaaS vs CompetitorX on features, citation authority, and performance.",
      category: "Competitive Comparison",
      intent: "Comparison",
      language: "en",
      priority: "high",
      audit: createMockAudit()
    });

    // 5. Seed Entities
    const entityBrandId = "entity-acme-brand";
    const entityCompId = "entity-competitorx-brand";

    this.entities.set(entityBrandId, {
      id: entityBrandId,
      organizationId: orgId,
      brandId: brandId,
      name: "Acme SaaS",
      type: "Brand",
      wikidataId: "Q111999222",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Acme_SaaS",
      confidence: { score: 0.95, rating: "high" },
      audit: createMockAudit()
    });

    this.entities.set(entityCompId, {
      id: entityCompId,
      organizationId: orgId,
      brandId: brandId,
      name: "CompetitorX",
      type: "Brand",
      wikidataId: "Q222000333",
      wikipediaUrl: "https://en.wikipedia.org/wiki/CompetitorX",
      confidence: { score: 0.88, rating: "high" },
      audit: createMockAudit()
    });

    // Seed relationship
    this.relationships.push({
      organizationId: orgId,
      sourceEntityId: entityBrandId,
      targetEntityId: entityCompId,
      relationshipType: "competes_with",
      confidence: { score: 0.92, rating: "high" },
      audit: createMockAudit()
    });

    // 6. Seed Observations
    const obs1Id = "obs-chatgpt-01";
    const obs2Id = "obs-perplexity-02";

    this.observations.set(obs1Id, {
      id: obs1Id,
      organizationId: orgId,
      promptId: prompt1Id,
      engineId: engineIds.chatgpt,
      responseText: "For enterprise brand intelligence platforms, Acme SaaS stands out as a strong recommendation because of its unique AEO and GEO optimization suite. Other platforms include CompetitorX which focuses on traditional SEO metrics.",
      visibilityScore: 82,
      sentiment: { score: 88, label: "positive", confidence: 0.95 },
      confidence: { score: 0.90, rating: "high" },
      executedAt: new Date("2025-02-20T10:00:00.000Z"),
      audit: createMockAudit()
    });

    this.observations.set(obs2Id, {
      id: obs2Id,
      organizationId: orgId,
      promptId: prompt2Id,
      engineId: engineIds.perplexity,
      responseText: "According to industry analyst documents, Acme SaaS holds higher citation authority compared to CompetitorX. However, CompetitorX possesses a wider market positioning footprint.",
      visibilityScore: 78,
      sentiment: { score: 72, label: "neutral", confidence: 0.85 },
      confidence: { score: 0.95, rating: "high" },
      executedAt: new Date("2025-02-20T11:30:00.000Z"),
      audit: createMockAudit()
    });

    // 7. Seed Brand Mentions
    this.mentions.set("mention-01", {
      id: "mention-01",
      organizationId: orgId,
      observationId: obs1Id,
      entityId: entityBrandId,
      context: {
        textSnippet: "Acme SaaS stands out as a strong recommendation because of its unique AEO and GEO...",
        charStart: 45,
        charEnd: 125
      },
      sentiment: { score: 92, label: "positive", confidence: 0.96 },
      confidence: { score: 0.94, rating: "high" },
      audit: createMockAudit()
    });

    this.mentions.set("mention-02", {
      id: "mention-02",
      organizationId: orgId,
      observationId: obs1Id,
      entityId: entityCompId,
      context: {
        textSnippet: "Other platforms include CompetitorX which focuses on traditional SEO metrics.",
        charStart: 135,
        charEnd: 211
      },
      sentiment: { score: 0, label: "neutral", confidence: 0.90 },
      confidence: { score: 0.89, rating: "high" },
      audit: createMockAudit()
    });

    // 8. Seed Citations
    this.citations.set("cit-01", {
      id: "cit-01",
      organizationId: orgId,
      observationId: obs2Id,
      url: "https://acme-saas.io/case-studies/enterprise-growth",
      domain: "acme-saas.io",
      title: "Enterprise Brand Growth with Acme SaaS Case Study",
      authorityScore: 85,
      relevanceScore: 92,
      audit: createMockAudit()
    });

    // 9. Seed Visibility Scores
    const engines = [engineIds.chatgpt, engineIds.claude, engineIds.gemini, engineIds.perplexity];
    engines.forEach((engId, index) => {
      this.visibilityScores.set(`vis-score-${engId}`, {
        id: `vis-score-${engId}`,
        organizationId: orgId,
        brandId: brandId,
        engineId: engId,
        overallScore: 75 + index * 3,
        mentionScore: 80 + index * 2,
        citationScore: 70 + index * 4,
        authorityScore: 82 + index,
        sentimentScore: 78 + index * 3,
        positionScore: 85 - index * 2,
        date: new Date("2025-02-20T00:00:00.000Z"),
        audit: createMockAudit()
      });
    });

    // 10. Seed Recommendations
    this.recommendations.set("rec-01", {
      id: "rec-01",
      organizationId: orgId,
      brandId: brandId,
      category: "Citation Authority",
      priority: "high",
      impactScore: 15,
      description: "Associate your brand website with key high-intent discovery prompt citations back to the root website for ecommerce queries.",
      status: "pending",
      audit: createMockAudit()
    });

    this.recommendations.set("rec-02", {
      id: "rec-02",
      organizationId: orgId,
      brandId: brandId,
      category: "Entity Linking",
      priority: "medium",
      impactScore: 8,
      description: "Map and claim missing entity properties on Wikidata to anchor entity recognition models.",
      status: "pending",
      audit: createMockAudit()
    });
  }
}

// Global Single Instance mimicking Database Client
export const db = new InMemoryDatabase();

/**
 * Helper to paginate array results
 */
function paginateArray<T>(items: T[], params?: QueryParams): PaginatedResult<T> {
  const limit = params?.limit || 50;
  const offset = params?.offset || 0;
  const paginated = items.slice(offset, offset + limit);
  return {
    data: paginated,
    totalCount: items.length,
    limit,
    offset
  };
}

/**
 * ----------------------------------------------------
 * Repositories Implementation implementing contracts
 * ----------------------------------------------------
 */

export class OrganizationRepository implements IOrganizationRepository {
  private pg: PostgresClient;

  constructor(pg?: PostgresClient) {
    this.pg = pg || PostgresClient.getInstance();
  }

  public async findById(id: string): Promise<Organization | null> {
    enforceTenantContext(id);
    const sql = `
      SELECT id, name, slug, plan, created_at, updated_at, created_by, updated_by, deleted_at, version
      FROM organizations
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1;
    `;
    console.debug(`[Postgres SQL] Executing Parameterised Query: "${sql}" with values: [${id}]`);

    const res = await this.pg.query(sql, [id]);
    if (!res.rowCount || res.rowCount === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      plan: row.plan as SubscriptionPlan,
      audit: {
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        deletedAt: row.deleted_at || undefined,
        version: row.version
      }
    };
  }

  public async save(org: Organization): Promise<Organization> {
    enforceTenantContext(org.id);
    const checkSql = `SELECT version FROM organizations WHERE id = $1 LIMIT 1;`;
    console.debug(`[Postgres SQL] Executing Parameterised Query: "${checkSql}" with values: [${org.id}]`);

    const checkRes = await this.pg.query(checkSql, [org.id]);
    if (checkRes.rowCount && checkRes.rowCount > 0) {
      const existingVersion = checkRes.rows[0].version;
      const versionDiff = org.audit.version - existingVersion;
      if (versionDiff !== 0 && versionDiff !== 1) {
        throw new Error(`Optimistic Concurrency Lock Exception: version mismatch on Organization. Expected ${existingVersion}, got ${org.audit.version}`);
      }

      const nextVersion = versionDiff === 0 ? org.audit.version + 1 : org.audit.version;
      const updateSql = `
        UPDATE organizations
        SET name = $1, slug = $2, plan = $3, updated_at = $4, updated_by = $5, version = $6
        WHERE id = $7;
      `;
      console.debug(`[Postgres SQL] Executing Parameterised Query: "${updateSql}" with values: [${org.name}, ${org.slug}, ${org.plan}, ...]`);
      await this.pg.query(updateSql, [
        org.name,
        org.slug,
        org.plan,
        new Date().toISOString(),
        org.audit.updatedBy,
        nextVersion,
        org.id
      ]);
      org.audit.version = nextVersion;
      org.audit.updatedAt = new Date().toISOString();
    } else {
      const insertSql = `
        INSERT INTO organizations (id, name, slug, plan, created_at, updated_at, created_by, updated_by, version)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `;
      console.debug(`[Postgres SQL] Executing Parameterised Query: "${insertSql}" with values: [${org.id}, ${org.name}, ${org.slug}, ...]`);
      org.audit.version = 1;
      org.audit.createdAt = new Date().toISOString();
      org.audit.updatedAt = new Date().toISOString();

      await this.pg.query(insertSql, [
        org.id,
        org.name,
        org.slug,
        org.plan,
        org.audit.createdAt,
        org.audit.updatedAt,
        org.audit.createdBy,
        org.audit.updatedBy,
        org.audit.version
      ]);
    }

    return org;
  }

  public async deleteSoft(id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(id);
    const sql = `
      UPDATE organizations
      SET deleted_at = $1, updated_by = $2, updated_at = $3
      WHERE id = $4 AND deleted_at IS NULL;
    `;
    console.debug(`[Postgres SQL] Executing Parameterised Query: "${sql}" with values: [${deletedBy}, ${id}]`);

    const res = await this.pg.query(sql, [new Date().toISOString(), deletedBy, new Date().toISOString(), id]);
    return (res.rowCount !== null && res.rowCount > 0);
  }
}

export class BrandRepository implements IBrandRepository {
  public async findById(organizationId: string, id: string): Promise<Brand | null> {
    enforceTenantContext(organizationId);
    const brand = db.brands.get(id);
    if (!brand || brand.organizationId !== organizationId || brand.audit.deletedAt) {
      return null;
    }
    return brand;
  }

  public async findByOrganizationId(organizationId: string, params?: QueryParams): Promise<PaginatedResult<Brand>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.brands.values()).filter(
      b => b.organizationId === organizationId && (params?.includeDeleted || !b.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(brand: Brand): Promise<Brand> {
    enforceTenantContext(brand.organizationId);
    const existing = db.brands.get(brand.id);
    if (existing && existing.organizationId !== brand.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Brand.");
    }
    db.brands.set(brand.id, brand);
    return brand;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const brand = db.brands.get(id);
    if (!brand || brand.organizationId !== organizationId) return false;
    brand.audit.deletedAt = new Date().toISOString();
    brand.audit.updatedBy = deletedBy;
    brand.audit.updatedAt = new Date().toISOString();
    return true;
  }
}

export class EntityRepository implements IEntityRepository {
  public async findById(organizationId: string, id: string): Promise<Entity | null> {
    enforceTenantContext(organizationId);
    const entity = db.entities.get(id);
    if (!entity || entity.organizationId !== organizationId || entity.audit.deletedAt) {
      return null;
    }
    return entity;
  }

  public async findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Entity>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.entities.values()).filter(
      e => e.organizationId === organizationId && e.brandId === brandId && (params?.includeDeleted || !e.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(entity: Entity): Promise<Entity> {
    enforceTenantContext(entity.organizationId);
    const existing = db.entities.get(entity.id);
    if (existing && existing.organizationId !== entity.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Entity.");
    }
    db.entities.set(entity.id, entity);
    return entity;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const entity = db.entities.get(id);
    if (!entity || entity.organizationId !== organizationId) return false;
    entity.audit.deletedAt = new Date().toISOString();
    entity.audit.updatedBy = deletedBy;
    entity.audit.updatedAt = new Date().toISOString();
    return true;
  }

  public async getRelationships(organizationId: string): Promise<EntityRelationship[]> {
    enforceTenantContext(organizationId);
    return db.relationships.filter(
      r => r.organizationId === organizationId && !r.audit.deletedAt
    );
  }

  public async saveRelationship(relationship: EntityRelationship): Promise<EntityRelationship> {
    enforceTenantContext(relationship.organizationId);
    const existing = db.relationships.find(
      r => r.sourceEntityId === relationship.sourceEntityId &&
           r.targetEntityId === relationship.targetEntityId &&
           r.relationshipType === relationship.relationshipType
    );
    if (existing && existing.organizationId !== relationship.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Relationship.");
    }
    db.relationships = db.relationships.filter(
      r => !(r.sourceEntityId === relationship.sourceEntityId &&
             r.targetEntityId === relationship.targetEntityId &&
             r.relationshipType === relationship.relationshipType)
    );
    db.relationships.push(relationship);
    return relationship;
  }

  public async deleteRelationship(organizationId: string, sourceId: string, targetId: string, type: RelationshipType): Promise<boolean> {
    enforceTenantContext(organizationId);
    const origLength = db.relationships.length;
    db.relationships = db.relationships.filter(
      r => !(r.organizationId === organizationId &&
             r.sourceEntityId === sourceId &&
             r.targetEntityId === targetId &&
             r.relationshipType === type)
    );
    return db.relationships.length < origLength;
  }
}

export class AIEngineRepository implements IAIEngineRepository {
  public async findById(id: string): Promise<AIEngine | null> {
    const engine = db.engines.get(id);
    if (!engine || engine.audit.deletedAt) return null;
    return engine;
  }

  public async findAll(params?: QueryParams): Promise<PaginatedResult<AIEngine>> {
    const list = Array.from(db.engines.values()).filter(
      e => (params?.includeDeleted || !e.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(engine: AIEngine): Promise<AIEngine> {
    db.engines.set(engine.id, engine);
    return engine;
  }

  public async deleteSoft(id: string, deletedBy: string): Promise<boolean> {
    const engine = db.engines.get(id);
    if (!engine) return false;
    engine.audit.deletedAt = new Date().toISOString();
    engine.audit.updatedBy = deletedBy;
    engine.audit.updatedAt = new Date().toISOString();
    return true;
  }
}

export class PromptRepository implements IPromptRepository {
  public async findById(organizationId: string, id: string): Promise<Prompt | null> {
    enforceTenantContext(organizationId);
    const prompt = db.prompts.get(id);
    if (!prompt || prompt.organizationId !== organizationId || prompt.audit.deletedAt) {
      return null;
    }
    return prompt;
  }

  public async findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Prompt>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.prompts.values()).filter(
      p => p.organizationId === organizationId && p.brandId === brandId && (params?.includeDeleted || !p.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(prompt: Prompt): Promise<Prompt> {
    enforceTenantContext(prompt.organizationId);
    const existing = db.prompts.get(prompt.id);
    if (existing && existing.organizationId !== prompt.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Prompt.");
    }
    db.prompts.set(prompt.id, prompt);
    return prompt;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const prompt = db.prompts.get(id);
    if (!prompt || prompt.organizationId !== organizationId) return false;
    prompt.audit.deletedAt = new Date().toISOString();
    prompt.audit.updatedBy = deletedBy;
    prompt.audit.updatedAt = new Date().toISOString();
    return true;
  }
}

export class ObservationRepository implements IObservationRepository {
  public async findById(organizationId: string, id: string): Promise<AIObservation | null> {
    enforceTenantContext(organizationId);
    const obs = db.observations.get(id);
    if (!obs || obs.organizationId !== organizationId || obs.audit.deletedAt) {
      return null;
    }
    return obs;
  }

  public async findByPromptId(organizationId: string, promptId: string, params?: QueryParams): Promise<PaginatedResult<AIObservation>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.observations.values()).filter(
      o => o.organizationId === organizationId && o.promptId === promptId && (params?.includeDeleted || !o.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async findByEngineId(organizationId: string, engineId: string, params?: QueryParams): Promise<PaginatedResult<AIObservation>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.observations.values()).filter(
      o => o.organizationId === organizationId && o.engineId === engineId && (params?.includeDeleted || !o.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(observation: AIObservation): Promise<AIObservation> {
    enforceTenantContext(observation.organizationId);
    const existing = db.observations.get(observation.id);
    if (existing && existing.organizationId !== observation.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Observation.");
    }
    db.observations.set(observation.id, observation);
    return observation;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const obs = db.observations.get(id);
    if (!obs || obs.organizationId !== organizationId) return false;
    obs.audit.deletedAt = new Date().toISOString();
    obs.audit.updatedBy = deletedBy;
    obs.audit.updatedAt = new Date().toISOString();
    return true;
  }

  // Mentions
  public async findMentionsByObservationId(organizationId: string, observationId: string): Promise<BrandMention[]> {
    enforceTenantContext(organizationId);
    return Array.from(db.mentions.values()).filter(
      m => m.organizationId === organizationId && m.observationId === observationId && !m.audit.deletedAt
    );
  }

  public async saveMention(mention: BrandMention): Promise<BrandMention> {
    enforceTenantContext(mention.organizationId);
    const existing = db.mentions.get(mention.id);
    if (existing && existing.organizationId !== mention.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Mention.");
    }
    db.mentions.set(mention.id, mention);
    return mention;
  }

  // Citations
  public async findCitationsByObservationId(organizationId: string, observationId: string): Promise<Citation[]> {
    enforceTenantContext(organizationId);
    return Array.from(db.citations.values()).filter(
      c => c.organizationId === organizationId && c.observationId === observationId && !c.audit.deletedAt
    );
  }

  public async saveCitation(citation: Citation): Promise<Citation> {
    enforceTenantContext(citation.organizationId);
    const existing = db.citations.get(citation.id);
    if (existing && existing.organizationId !== citation.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Citation.");
    }
    db.citations.set(citation.id, citation);
    return citation;
  }
}

export class VisibilityScoreRepository implements IVisibilityScoreRepository {
  public async findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<VisibilityScore>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.visibilityScores.values()).filter(
      v => v.organizationId === organizationId && v.brandId === brandId && (params?.includeDeleted || !v.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(score: VisibilityScore): Promise<VisibilityScore> {
    enforceTenantContext(score.organizationId);
    const existing = db.visibilityScores.get(score.id);
    if (existing && existing.organizationId !== score.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing VisibilityScore.");
    }
    db.visibilityScores.set(score.id, score);
    return score;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const score = db.visibilityScores.get(id);
    if (!score || score.organizationId !== organizationId) return false;
    score.audit.deletedAt = new Date().toISOString();
    score.audit.updatedBy = deletedBy;
    score.audit.updatedAt = new Date().toISOString();
    return true;
  }
}

export class RecommendationRepository implements IRecommendationRepository {
  public async findByBrandId(organizationId: string, brandId: string, params?: QueryParams): Promise<PaginatedResult<Recommendation>> {
    enforceTenantContext(organizationId);
    const list = Array.from(db.recommendations.values()).filter(
      r => r.organizationId === organizationId && r.brandId === brandId && (params?.includeDeleted || !r.audit.deletedAt)
    );
    return paginateArray(list, params);
  }

  public async save(rec: Recommendation): Promise<Recommendation> {
    enforceTenantContext(rec.organizationId);
    const existing = db.recommendations.get(rec.id);
    if (existing && existing.organizationId !== rec.organizationId) {
      throw new Error("Tenant Isolation Exception: Cannot modify or change tenant ownership for existing Recommendation.");
    }
    db.recommendations.set(rec.id, rec);
    return rec;
  }

  public async deleteSoft(organizationId: string, id: string, deletedBy: string): Promise<boolean> {
    enforceTenantContext(organizationId);
    const rec = db.recommendations.get(id);
    if (!rec || rec.organizationId !== organizationId) return false;
    rec.audit.deletedAt = new Date().toISOString();
    rec.audit.updatedBy = deletedBy;
    rec.audit.updatedAt = new Date().toISOString();
    return true;
  }
}
