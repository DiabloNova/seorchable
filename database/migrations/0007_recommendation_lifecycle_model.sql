-- Migration: Recommendation Lifecycle Model Schemas
-- Expands existing recommendations table and creates append-only recommendation histories table.

-- Add new columns to existing recommendations table safely
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS website_id UUID REFERENCES websites(id) ON DELETE CASCADE;
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS affected_resource TEXT NOT NULL DEFAULT '';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS source_finding_ids TEXT[] NOT NULL DEFAULT '{}'::TEXT[];
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS problem_statement TEXT NOT NULL DEFAULT '';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS recommended_action TEXT NOT NULL DEFAULT '';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS rationale TEXT NOT NULL DEFAULT '';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS business_impact TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS seo_impact TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS ai_visibility_impact TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS effort TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS confidence TEXT NOT NULL DEFAULT 'high';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS rule_version TEXT NOT NULL DEFAULT '1.0';

-- Drop and recreate unique constraints and indices safely
DROP INDEX IF EXISTS idx_recommendations_dedup;
CREATE UNIQUE INDEX IF NOT EXISTS idx_recommendations_dedup
  ON recommendations(organization_id, website_id, category, affected_resource, rule_version)
  WHERE deleted_at IS NULL;

-- Create Recommendation Histories table
CREATE TABLE IF NOT EXISTS recommendation_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  actor TEXT NOT NULL,
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_recommendation_histories_org ON recommendation_histories(organization_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_histories_rec ON recommendation_histories(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_histories_time ON recommendation_histories(timestamp DESC);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE recommendation_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_histories FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON recommendation_histories;
CREATE POLICY select_tenant_isolation_policy ON recommendation_histories
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON recommendation_histories;
CREATE POLICY insert_tenant_isolation_policy ON recommendation_histories
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON recommendation_histories;
CREATE POLICY update_tenant_isolation_policy ON recommendation_histories
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON recommendation_histories;
CREATE POLICY delete_tenant_isolation_policy ON recommendation_histories
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
