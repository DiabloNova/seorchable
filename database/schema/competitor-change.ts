import { TableDefinition } from "./types";

export const competitorChangesTable: TableDefinition = {
  tableName: "competitor_changes",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique change log identifier"
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
      name: "competitor_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "competitors",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Target competitor identifier"
    },
    {
      name: "changed_field",
      type: "TEXT",
      nullable: false,
      description: "The name of the field that changed"
    },
    {
      name: "previous_value",
      type: "TEXT",
      nullable: true,
      description: "The previous value before this observation"
    },
    {
      name: "new_value",
      type: "TEXT",
      nullable: true,
      description: "The newly observed value"
    },
    {
      name: "change_type",
      type: "TEXT",
      nullable: false,
      description: "Category of change (e.g. status, classification, name, domain)"
    },
    {
      name: "observed_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the observation was recorded"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Audit trail timestamp"
    }
  ],
  indexes: [
    "CREATE INDEX idx_competitor_changes_organization ON competitor_changes(organization_id);",
    "CREATE INDEX idx_competitor_changes_competitor ON competitor_changes(competitor_id);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS competitor_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  changed_field TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  change_type TEXT NOT NULL,
  observed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitor_changes_organization ON competitor_changes(organization_id);
CREATE INDEX IF NOT EXISTS idx_competitor_changes_competitor ON competitor_changes(competitor_id);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE competitor_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_changes FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON competitor_changes;
CREATE POLICY select_tenant_isolation_policy ON competitor_changes
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON competitor_changes;
CREATE POLICY insert_tenant_isolation_policy ON competitor_changes
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON competitor_changes;
CREATE POLICY update_tenant_isolation_policy ON competitor_changes
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON competitor_changes;
CREATE POLICY delete_tenant_isolation_policy ON competitor_changes
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
