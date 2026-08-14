-- Migration: Knowledge Graph Foundation (Task 8.0)
-- Sets up the extended entities and entity_relationships tables with complete RLS.

-- Make sure organizations and brands tables exist (for reference in local development if needed)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT NOT NULL,
  industry TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

-- ==========================================
-- 1. ENTITIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  wikidata_id TEXT,
  wikipedia_url TEXT,
  confidence_score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  confidence_rating TEXT NOT NULL DEFAULT 'high',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

-- Add extended columns safely if they do not exist
ALTER TABLE entities ADD COLUMN IF NOT EXISTS aliases TEXT[];
ALTER TABLE entities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS provenance JSONB;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS authority_score DOUBLE PRECISION NOT NULL DEFAULT 0.0;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS completeness_score DOUBLE PRECISION NOT NULL DEFAULT 0.0;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

CREATE INDEX IF NOT EXISTS idx_entities_organization ON entities(organization_id);
CREATE INDEX IF NOT EXISTS idx_entities_brand ON entities(brand_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_entities_wikidata ON entities(wikidata_id) WHERE wikidata_id IS NOT NULL AND deleted_at IS NULL;

-- Enable Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON entities;
CREATE POLICY select_tenant_isolation_policy ON entities
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON entities;
CREATE POLICY insert_tenant_isolation_policy ON entities
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON entities;
CREATE POLICY update_tenant_isolation_policy ON entities
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON entities;
CREATE POLICY delete_tenant_isolation_policy ON entities
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);


-- ==========================================
-- 2. ENTITY RELATIONSHIPS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS entity_relationships (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  confidence_score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  confidence_rating TEXT NOT NULL DEFAULT 'high',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (source_entity_id, target_entity_id, relationship_type)
);

-- Add extended columns safely if they do not exist
ALTER TABLE entity_relationships ADD COLUMN IF NOT EXISTS direction TEXT NOT NULL DEFAULT 'directed';
ALTER TABLE entity_relationships ADD COLUMN IF NOT EXISTS provenance JSONB;
ALTER TABLE entity_relationships ADD COLUMN IF NOT EXISTS metadata JSONB;

CREATE INDEX IF NOT EXISTS idx_relationships_organization ON entity_relationships(organization_id);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON entity_relationships(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON entity_relationships(target_entity_id);

-- Enable Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE entity_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_relationships FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON entity_relationships;
CREATE POLICY select_tenant_isolation_policy ON entity_relationships
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON entity_relationships;
CREATE POLICY insert_tenant_isolation_policy ON entity_relationships
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON entity_relationships;
CREATE POLICY update_tenant_isolation_policy ON entity_relationships
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON entity_relationships;
CREATE POLICY delete_tenant_isolation_policy ON entity_relationships
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
