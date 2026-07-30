import { TableDefinition } from "./types";

export const documentEmbeddingsTable: TableDefinition = {
  tableName: "document_embeddings",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique identifier for the document chunk embedding"
    },
    {
      name: "tenant_id",
      type: "UUID",
      nullable: false,
      description: "Tenant (organization) partition key"
    },
    {
      name: "content_chunk",
      type: "TEXT",
      nullable: false,
      description: "Clean text payload of the parsed chunk"
    },
    {
      name: "metadata",
      type: "JSONB",
      nullable: false,
      default: "'{}'::jsonb",
      description: "Contextual and source metadata"
    },
    {
      name: "embedding",
      type: "VECTOR",
      nullable: false,
      description: "Dense semantic vector representation (768 dimensions)"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was created"
    }
  ],
  indexes: [
    "CREATE INDEX idx_document_embeddings_tenant ON document_embeddings(tenant_id);",
    "CREATE INDEX idx_document_embeddings_embedding ON document_embeddings USING hnsw (embedding vector_cosine_ops);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  content_chunk TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_embeddings_tenant ON document_embeddings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_embedding ON document_embeddings USING hnsw (embedding vector_cosine_ops);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON document_embeddings;
CREATE POLICY select_tenant_isolation_policy ON document_embeddings
  FOR SELECT
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON document_embeddings;
CREATE POLICY insert_tenant_isolation_policy ON document_embeddings
  FOR INSERT
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON document_embeddings;
CREATE POLICY update_tenant_isolation_policy ON document_embeddings
  FOR UPDATE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON document_embeddings;
CREATE POLICY delete_tenant_isolation_policy ON document_embeddings
  FOR DELETE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};

export const kgEntitiesTable: TableDefinition = {
  tableName: "kg_entities",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique identifier for the Persian KG Entity"
    },
    {
      name: "tenant_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Tenant (organization) partition key"
    },
    {
      name: "name",
      type: "TEXT",
      nullable: false,
      description: "Farsi / English concept name"
    },
    {
      name: "type",
      type: "TEXT",
      nullable: false,
      description: "Entity type (e.g. Brand, Product, Concept, Person)"
    },
    {
      name: "properties",
      type: "JSONB",
      nullable: false,
      default: "'{}'::jsonb",
      description: "Custom key-value metadata properties"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was created"
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was last updated"
    }
  ],
  indexes: [
    "CREATE INDEX idx_kg_entities_tenant ON kg_entities(tenant_id);",
    "CREATE INDEX idx_kg_entities_name ON kg_entities(name);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS kg_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kg_entities_tenant ON kg_entities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kg_entities_name ON kg_entities(name);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE kg_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE kg_entities FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON kg_entities;
CREATE POLICY select_tenant_isolation_policy ON kg_entities
  FOR SELECT
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON kg_entities;
CREATE POLICY insert_tenant_isolation_policy ON kg_entities
  FOR INSERT
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON kg_entities;
CREATE POLICY update_tenant_isolation_policy ON kg_entities
  FOR UPDATE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON kg_entities;
CREATE POLICY delete_tenant_isolation_policy ON kg_entities
  FOR DELETE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};

export const kgRelationshipsTable: TableDefinition = {
  tableName: "kg_relationships",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique identifier for the Persian KG Relationship link"
    },
    {
      name: "tenant_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Tenant (organization) partition key"
    },
    {
      name: "source_entity_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "kg_entities",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Focal node source key"
    },
    {
      name: "target_entity_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "kg_entities",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Target node destination key"
    },
    {
      name: "relationship_type",
      type: "TEXT",
      nullable: false,
      description: "Predicate link type (e.g. references, collaborates_with, competitor)"
    },
    {
      name: "properties",
      type: "JSONB",
      nullable: false,
      default: "'{}'::jsonb",
      description: "Custom link properties and scores"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was created"
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was last updated"
    }
  ],
  indexes: [
    "CREATE INDEX idx_kg_relationships_tenant ON kg_relationships(tenant_id);",
    "CREATE INDEX idx_kg_relationships_source ON kg_relationships(source_entity_id);",
    "CREATE INDEX idx_kg_relationships_target ON kg_relationships(target_entity_id);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS kg_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_entity_id UUID NOT NULL REFERENCES kg_entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES kg_entities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kg_relationships_tenant ON kg_relationships(tenant_id);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_source ON kg_relationships(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_kg_relationships_target ON kg_relationships(target_entity_id);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE kg_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE kg_relationships FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON kg_relationships;
CREATE POLICY select_tenant_isolation_policy ON kg_relationships
  FOR SELECT
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON kg_relationships;
CREATE POLICY insert_tenant_isolation_policy ON kg_relationships
  FOR INSERT
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON kg_relationships;
CREATE POLICY update_tenant_isolation_policy ON kg_relationships
  FOR UPDATE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON kg_relationships;
CREATE POLICY delete_tenant_isolation_policy ON kg_relationships
  FOR DELETE
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
