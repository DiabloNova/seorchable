import { TableDefinition } from "./types";

export const recommendationsTable: TableDefinition = {
  tableName: "recommendations",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique action recommendation key"
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
      name: "brand_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "brands",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Target brand referenced"
    },
    {
      name: "category",
      type: "TEXT",
      nullable: false,
      description: "Action focus category group"
    },
    {
      name: "priority",
      type: "TEXT",
      nullable: false,
      description: "Priority action tier (low, medium, high)"
    },
    {
      name: "impact_score",
      type: "INTEGER",
      nullable: false,
      description: "Predicted lift index score (0 to 100)"
    },
    {
      name: "description",
      type: "TEXT",
      nullable: false,
      description: "Action description details text"
    },
    {
      name: "status",
      type: "TEXT",
      nullable: false,
      default: "'pending'",
      description: "Implementation state status (pending, applied, ignored)"
    },
    // Audit & Lifecycle columns
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
    "CREATE INDEX idx_recommendations_organization ON recommendations(organization_id);",
    "CREATE INDEX idx_recommendations_brand ON recommendations(brand_id);",
    "CREATE INDEX idx_recommendations_status ON recommendations(status);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  impact_score INTEGER NOT NULL CHECK (impact_score >= 0 AND impact_score <= 100),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_recommendations_organization ON recommendations(organization_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_brand ON recommendations(brand_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON recommendations;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON recommendations;
CREATE POLICY select_tenant_isolation_policy ON recommendations
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON recommendations;
CREATE POLICY insert_tenant_isolation_policy ON recommendations
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON recommendations;
CREATE POLICY update_tenant_isolation_policy ON recommendations
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON recommendations;
CREATE POLICY delete_tenant_isolation_policy ON recommendations
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
