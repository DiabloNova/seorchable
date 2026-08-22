-- Migration: Add website monitoring configuration and snapshots

-- Add monitoring_config to websites table
ALTER TABLE websites ADD COLUMN IF NOT EXISTS monitoring_config JSONB;

-- Create website_monitoring_snapshots table
CREATE TABLE IF NOT EXISTS website_monitoring_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  job_id TEXT,
  status TEXT NOT NULL DEFAULT 'valid',
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_website_monitoring_snapshots_organization ON website_monitoring_snapshots(organization_id);
CREATE INDEX IF NOT EXISTS idx_website_monitoring_snapshots_website ON website_monitoring_snapshots(website_id);
CREATE INDEX IF NOT EXISTS idx_website_monitoring_snapshots_created_at ON website_monitoring_snapshots(created_at DESC);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE website_monitoring_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_monitoring_snapshots FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON website_monitoring_snapshots;
CREATE POLICY select_tenant_isolation_policy ON website_monitoring_snapshots
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON website_monitoring_snapshots;
CREATE POLICY insert_tenant_isolation_policy ON website_monitoring_snapshots
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON website_monitoring_snapshots;
CREATE POLICY update_tenant_isolation_policy ON website_monitoring_snapshots
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON website_monitoring_snapshots;
CREATE POLICY delete_tenant_isolation_policy ON website_monitoring_snapshots
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
