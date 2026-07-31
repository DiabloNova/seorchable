import { TableDefinition } from "./types";

export const premiumAuditsTable: TableDefinition = {
  tableName: "premium_audits",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique identifier for the premium audit"
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
      description: "Organization (tenant) partition key"
    },
    {
      name: "url",
      type: "TEXT",
      nullable: false,
      description: "Root website URL audited"
    },
    {
      name: "score",
      type: "INTEGER",
      nullable: false,
      description: "Overall synthesized Premium SEO Score"
    },
    {
      name: "grade",
      type: "TEXT",
      nullable: false,
      description: "Grade assigned based on score"
    },
    {
      name: "pages_analyzed",
      type: "INTEGER",
      nullable: false,
      description: "Total number of crawled/analyzed pages"
    },
    {
      name: "metrics",
      type: "JSONB",
      nullable: false,
      description: "Individual category metrics scores"
    },
    {
      name: "issues",
      type: "JSONB",
      nullable: false,
      description: "List of critical/warning/info technical or semantic issues"
    },
    {
      name: "recommendations",
      type: "JSONB",
      nullable: false,
      description: "List of priority content or linking recommendations"
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
      name: "version",
      type: "INTEGER",
      nullable: false,
      default: "1",
      description: "Optimistic locking version counter"
    }
  ],
  indexes: [
    "CREATE INDEX idx_premium_audits_organization ON premium_audits(organization_id);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS premium_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  pages_analyzed INTEGER NOT NULL,
  metrics JSONB NOT NULL,
  issues JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_premium_audits_organization ON premium_audits(organization_id);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE premium_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_audits FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON premium_audits;
CREATE POLICY select_tenant_isolation_policy ON premium_audits
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON premium_audits;
CREATE POLICY insert_tenant_isolation_policy ON premium_audits
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON premium_audits;
CREATE POLICY update_tenant_isolation_policy ON premium_audits
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON premium_audits;
CREATE POLICY delete_tenant_isolation_policy ON premium_audits
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
