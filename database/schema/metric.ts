import { TableDefinition } from "./types";

export const historicalMetricsTable: TableDefinition = {
  tableName: "historical_metrics",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique historical metric record log key"
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
      name: "target_type",
      type: "TEXT",
      nullable: false,
      description: "Dimension classifier (website, page, brand, competitor)"
    },
    {
      name: "target_id",
      type: "UUID",
      nullable: false,
      description: "Polymorphic target log identifier"
    },
    {
      name: "metric_name",
      type: "TEXT",
      nullable: false,
      description: "Unique metric catalog logging identifier"
    },
    {
      name: "metric_value",
      type: "DOUBLE PRECISION",
      nullable: false,
      description: "Extracted scalar measure value"
    },
    {
      name: "dimensions",
      type: "JSONB",
      nullable: false,
      default: "'{}'::jsonb",
      description: "JSON-structured dimensions bag metadata"
    },
    {
      name: "timestamp",
      type: "TIMESTAMP",
      nullable: false,
      description: "Verbatim measure capture instant"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()",
      description: "Timestamp when the record was created"
    },
    {
      name: "created_by",
      type: "TEXT",
      nullable: false,
      default: "'system'",
      description: "User or service that created the record"
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
    "CREATE INDEX idx_historical_metrics_organization ON historical_metrics(organization_id);",
    "CREATE INDEX idx_historical_metrics_target ON historical_metrics(target_type, target_id);",
    "CREATE INDEX idx_historical_metrics_name_time ON historical_metrics(metric_name, timestamp DESC);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS historical_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  dimensions JSONB NOT NULL DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_historical_metrics_organization ON historical_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_historical_metrics_target ON historical_metrics(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_historical_metrics_name_time ON historical_metrics(metric_name, timestamp DESC);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE historical_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_metrics FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON historical_metrics;
CREATE POLICY select_tenant_isolation_policy ON historical_metrics
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON historical_metrics;
CREATE POLICY insert_tenant_isolation_policy ON historical_metrics
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON historical_metrics;
CREATE POLICY update_tenant_isolation_policy ON historical_metrics
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON historical_metrics;
CREATE POLICY delete_tenant_isolation_policy ON historical_metrics
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
