import { TableDefinition } from "./types";

export const visibilityScoresTable: TableDefinition = {
  tableName: "visibility_scores",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique metric log ID"
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
      description: "Monitored brand reference"
    },
    {
      name: "engine_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "ai_engines",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "AI platform engine identifier"
    },
    {
      name: "overall_score",
      type: "INTEGER",
      nullable: false,
      description: "Composite metric overall score (0 to 100)"
    },
    {
      name: "mention_score",
      type: "INTEGER",
      nullable: false,
      description: "Mention metric component score (0 to 100)"
    },
    {
      name: "citation_score",
      type: "INTEGER",
      nullable: false,
      description: "Citation metric component score (0 to 100)"
    },
    {
      name: "authority_score",
      type: "INTEGER",
      nullable: false,
      description: "Citation Domain Authority component score (0 to 100)"
    },
    {
      name: "sentiment_score",
      type: "INTEGER",
      nullable: false,
      description: "Sentiment metric component score (0 to 100)"
    },
    {
      name: "position_score",
      type: "INTEGER",
      nullable: false,
      description: "Response structural layout component score (0 to 100)"
    },
    {
      name: "date",
      type: "TIMESTAMP",
      nullable: false,
      description: "Analysis record date timestamp"
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
    "CREATE INDEX idx_visibility_organization ON visibility_scores(organization_id);",
    "CREATE INDEX idx_visibility_brand ON visibility_scores(brand_id);",
    "CREATE INDEX idx_visibility_engine ON visibility_scores(engine_id);",
    "CREATE INDEX idx_visibility_date ON visibility_scores(date);"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS visibility_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  engine_id UUID NOT NULL REFERENCES ai_engines(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  mention_score INTEGER NOT NULL CHECK (mention_score >= 0 AND mention_score <= 100),
  citation_score INTEGER NOT NULL CHECK (citation_score >= 0 AND citation_score <= 100),
  authority_score INTEGER NOT NULL CHECK (authority_score >= 0 AND authority_score <= 100),
  sentiment_score INTEGER NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
  position_score INTEGER NOT NULL CHECK (position_score >= 0 AND position_score <= 100),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'system',
  updated_by TEXT NOT NULL DEFAULT 'system',
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_visibility_organization ON visibility_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_visibility_brand ON visibility_scores(brand_id);
CREATE INDEX IF NOT EXISTS idx_visibility_engine ON visibility_scores(engine_id);
CREATE INDEX IF NOT EXISTS idx_visibility_date ON visibility_scores(date);

-- Enable PostgreSQL Row Level Security (RLS) for zero-trust tenant isolation
ALTER TABLE visibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE visibility_scores FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON visibility_scores;

DROP POLICY IF EXISTS select_tenant_isolation_policy ON visibility_scores;
CREATE POLICY select_tenant_isolation_policy ON visibility_scores
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS insert_tenant_isolation_policy ON visibility_scores;
CREATE POLICY insert_tenant_isolation_policy ON visibility_scores
  FOR INSERT
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS update_tenant_isolation_policy ON visibility_scores;
CREATE POLICY update_tenant_isolation_policy ON visibility_scores
  FOR UPDATE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
  WITH CHECK (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS delete_tenant_isolation_policy ON visibility_scores;
CREATE POLICY delete_tenant_isolation_policy ON visibility_scores
  FOR DELETE
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
  `
};
