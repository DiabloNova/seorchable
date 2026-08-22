import { TableDefinition } from "./types";

export const websiteMonitoringSnapshotsTable: TableDefinition = {
  tableName: "website_monitoring_snapshots",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique snapshot identifier"
    },
    {
      name: "organization_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Tenant owner partition key"
    },
    {
      name: "website_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "websites",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Website this snapshot belongs to"
    },
    {
      name: "job_id",
      type: "TEXT",
      nullable: true,
      description: "Job ID that generated this snapshot"
    },
    {
      name: "status",
      type: "TEXT",
      nullable: false,
      default: "'valid'",
      description: "Snapshot validity status (valid, failed)"
    },
    {
      name: "snapshot_data",
      type: "JSONB",
      nullable: false,
      description: "Normalized signals and metrics data (technical, content, SEO)"
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
    "CREATE INDEX idx_website_monitoring_snapshots_organization ON website_monitoring_snapshots(organization_id);",
    "CREATE INDEX idx_website_monitoring_snapshots_website ON website_monitoring_snapshots(website_id);",
    "CREATE INDEX idx_website_monitoring_snapshots_created_at ON website_monitoring_snapshots(created_at DESC);"
  ],
  sql: `
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
  `
};
