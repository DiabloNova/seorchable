import { Entity, EntityRelationship, RelationshipType } from "../domain/types";
import { IEntityRepository } from "../repositories/interfaces";
import { EntityRepository } from "../repositories";

export class EntityService {
  private entityRepo: IEntityRepository;

  constructor(entityRepo?: IEntityRepository) {
    this.entityRepo = entityRepo || new EntityRepository();
  }

  /**
   * Look up a semantic entity by its unique ID inside a tenant boundary
   */
  public async getEntityById(organizationId: string, id: string): Promise<Entity | null> {
    return this.entityRepo.findById(organizationId, id);
  }

  /**
   * Retrieve all semantic entities associated with a specific brand inside a tenant boundary
   */
  public async getEntitiesByBrand(organizationId: string, brandId: string): Promise<Entity[]> {
    const result = await this.entityRepo.findByBrandId(organizationId, brandId);
    return result.data;
  }

  /**
   * Register a new semantic brand entity inside a tenant boundary
   */
  public async createEntity(
    organizationId: string,
    brandId: string,
    name: string,
    type: string,
    wikidataId?: string,
    wikipediaUrl?: string,
    confidenceScore: number = 1.0,
    actorId = "system"
  ): Promise<Entity> {
    const scoreVal = Math.min(Math.max(confidenceScore, 0), 1);
    const entity: Entity = {
      id: `entity-${Math.random().toString(36).substr(2, 9)}`,
      organizationId,
      brandId,
      name,
      type,
      wikidataId,
      wikipediaUrl,
      confidence: {
        score: scoreVal,
        rating: scoreVal >= 0.8 ? "high" : scoreVal >= 0.5 ? "medium" : "low"
      },
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: actorId,
        updatedBy: actorId,
        version: 1
      }
    };

    return this.entityRepo.save(entity);
  }

  /**
   * Establish a semantic relation mapping between two concepts/brands inside a tenant boundary
   */
  public async addRelationship(
    organizationId: string,
    sourceEntityId: string,
    targetEntityId: string,
    relationshipType: RelationshipType,
    confidenceScore: number = 1.0,
    actorId = "system"
  ): Promise<EntityRelationship> {
    // Validate existence of source and target entities inside tenant boundaries
    const source = await this.entityRepo.findById(organizationId, sourceEntityId);
    const target = await this.entityRepo.findById(organizationId, targetEntityId);

    if (!source || !target) {
      throw new Error("Invalid relationship mapping: Source or Target entity does not exist in your organization");
    }

    const scoreVal = Math.min(Math.max(confidenceScore, 0), 1);
    const relationship: EntityRelationship = {
      organizationId,
      sourceEntityId,
      targetEntityId,
      relationshipType,
      confidence: {
        score: scoreVal,
        rating: scoreVal >= 0.8 ? "high" : scoreVal >= 0.5 ? "medium" : "low"
      },
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: actorId,
        updatedBy: actorId,
        version: 1
      }
    };

    return this.entityRepo.saveRelationship(relationship);
  }

  /**
   * List all semantic entity relationships within a tenant boundary
   */
  public async getRelationships(organizationId: string): Promise<EntityRelationship[]> {
    return this.entityRepo.getRelationships(organizationId);
  }

  /**
   * Adjust semantic linking confidence rating inside a tenant boundary
   */
  public async updateConfidenceScore(
    organizationId: string,
    entityId: string,
    newScore: number,
    actorId = "system"
  ): Promise<Entity> {
    const entity = await this.entityRepo.findById(organizationId, entityId);
    if (!entity) {
      throw new Error(`Entity with ID ${entityId} not found in your organization`);
    }

    const scoreVal = Math.min(Math.max(newScore, 0), 1);
    const updated: Entity = {
      ...entity,
      confidence: {
        score: scoreVal,
        rating: scoreVal >= 0.8 ? "high" : scoreVal >= 0.5 ? "medium" : "low"
      },
      audit: {
        ...entity.audit,
        updatedAt: new Date().toISOString(),
        updatedBy: actorId,
        version: entity.audit.version + 1
      }
    };

    return this.entityRepo.save(updated);
  }
}
