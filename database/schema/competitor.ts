import { TableDefinition } from "./types";

export const competitorsTable: TableDefinition = {
  tableName: "competitors",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique competitor identifier"
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
      name: "name",
      type: "TEXT",
      nullable: false,
      description: "Competitor brand display name"
    },
    {
      name: "domain",
      type: "TEXT",
      nullable: false,
      description: "Competitor canonical domain name"
    },
    {
      name: "status",
      type: "TEXT",
      nullable: false,
      default: "'candidate'",
      description: "Competitor lifecycle status flag ('candidate', 'active', 'inactive', 'rejected')"
    },
    {
      name: "brand_name",
      type: "TEXT",
      nullable: true,
      description: "Competitor brand/entity name if available"
    },
    {
      name: "classification",
      type: "TEXT",
      nullable: false,
      default: "'unknown'",
      description: "Competitor classification ('direct', 'indirect', 'marketplace_aggregator', 'content_authority', 'unknown')"
    },
    {
      name: "discovery_source",
      type: "TEXT",
      nullable: true,
      description: "Discovery source description"
    },
    {
      name: "discovery_evidence",
      type: "JSONB",
      nullable: true,
      description: "Structured evidence tracing candidates"
    },
    {
      name: "confidence",
      type: "DOUBLE PRECISION",
      nullable: true,
      description: "Detection confidence (0.0 to 1.0)"
    },
    {
      name: "first_discovered_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the candidate was first identified"
    },
    {
      name: "last_observed_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the competitor was last observed"
    },
    {
      name: "last_monitored_at",
      type: "TIMESTAMP",
      nullable: true,
      description: "Timestamp when the competitor was last monitored"
    },
    {
      name: "monitoring_status",
      type: "TEXT",
      nullable: false,
      default: "'idle'",
      description: "Active monitoring status code ('idle', 'enabled', 'disabled', 'failed')"
    },
    {
      name: "notes_metadata",
      type: "JSONB",
      nullable: true,
      description: "Notes or auxiliary metadata"
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
    },
    {
      name: "created_by",
      type: "TEXT",
      nullable: false,
      default: "'system'",
      description: "User or service that created the record"
    },
    {
      name: "updated_by",
      type: "TEXT",
      nullable: false,
      default: "'system'",
      description: "User or service that last updated the record"
    },
    {
      name: "deleted_at",
      type: "TIMESTAMP",
      nullable: true,
      description: "Timestamp when soft-deletion occurred"
    },
    {
      name: "version",
      type: "INTEGER",
      nullable: false,
      default: "1",
      description: "Optimistic locking version counter"
    }
  ],
  indexes: [
    "CREATE INDEX idx_competitors_organization ON competitors(organization_id);",
    "CREATE UNIQUE INDEX idx_competitors_domain_org ON competitors(organization_id, domain) WHERE deleted_at IS NULL;"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'candidate',
  brand_name TEXT,
  classification TEXT NOT NULL DEFAULT 'unknown',
  discovery_source TEXT,
  discovery_evidence JSONB,
  confidence DOUBLE PRECISION,
  first_discovered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_observed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_monitored_at TIMESTAMP WITH TIME ZONE,
  monitoring_status TEXT NOT NULL DEFAULT 'idle',
  notes_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_competitors_organization ON competitors(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_competitors_domain_org ON competitors(organization_id, domain) WHERE deleted_at IS NULL;

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON competitors;
CREATE POLICY select_tenant_isolation_policy ON competitors
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON competitors;
CREATE POLICY insert_tenant_isolation_policy ON competitors
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON competitors;
CREATE POLICY update_tenant_isolation_policy ON competitors
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON competitors;
CREATE POLICY delete_tenant_isolation_policy ON competitors
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
