import { TableDefinition } from "./types";

export const recommendationsTable: TableDefinition = {
  tableName: "recommendations",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique recommendation key"
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
      name: "website_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "websites",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Website context ownership"
    },
    {
      name: "affected_resource",
      type: "TEXT",
      nullable: false,
      description: "Affected resource path or domain"
    },
    {
      name: "source_finding_ids",
      type: "TEXT[]",
      nullable: false,
      description: "Source diagnostic finding IDs"
    },
    {
      name: "category",
      type: "TEXT",
      nullable: false,
      description: "Action focus category group"
    },
    {
      name: "title",
      type: "TEXT",
      nullable: false,
      description: "Short recommendation summary title"
    },
    {
      name: "problem_statement",
      type: "TEXT",
      nullable: false,
      description: "Concrete statement of the diagnosed issue"
    },
    {
      name: "recommended_action",
      type: "TEXT",
      nullable: false,
      description: "Clear actionable steps proposed"
    },
    {
      name: "rationale",
      type: "TEXT",
      nullable: false,
      description: "Rationale explanation of why to implement"
    },
    {
      name: "priority",
      type: "TEXT",
      nullable: false,
      description: "Priority action tier (low, medium, high)"
    },
    {
      name: "business_impact",
      type: "TEXT",
      nullable: false,
      description: "Business-specific severity impact"
    },
    {
      name: "seo_impact",
      type: "TEXT",
      nullable: false,
      description: "Traditional search impact"
    },
    {
      name: "ai_visibility_impact",
      type: "TEXT",
      nullable: false,
      description: "AI-engine visibility impact"
    },
    {
      name: "effort",
      type: "TEXT",
      nullable: false,
      description: "Implementation effort estimation"
    },
    {
      name: "confidence",
      type: "TEXT",
      nullable: false,
      description: "Diagnostic/evidence strength confidence"
    },
    {
      name: "impact_score",
      type: "INTEGER",
      nullable: false,
      description: "Predicted composite lift index score (0 to 100)"
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
      default: "'proposed'",
      description: "Implementation lifecycle state status"
    },
    {
      name: "rule_version",
      type: "TEXT",
      nullable: false,
      description: "Diagnostic rule schema execution version"
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
    "CREATE INDEX idx_recommendations_status ON recommendations(status);",
    "CREATE UNIQUE INDEX idx_recommendations_dedup ON recommendations(organization_id, website_id, category, affected_resource, rule_version) WHERE deleted_at IS NULL;"
  ],
  sql: `
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  affected_resource TEXT NOT NULL,
  source_finding_ids TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  rationale TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  business_impact TEXT NOT NULL CHECK (business_impact IN ('low', 'medium', 'high', 'critical', 'unknown')),
  seo_impact TEXT NOT NULL CHECK (seo_impact IN ('low', 'medium', 'high', 'critical', 'unknown')),
  ai_visibility_impact TEXT NOT NULL CHECK (ai_visibility_impact IN ('low', 'medium', 'high', 'critical', 'unknown')),
  effort TEXT NOT NULL CHECK (effort IN ('trivial', 'small', 'medium', 'large', 'very_large', 'unknown')),
  confidence TEXT NOT NULL CHECK (confidence IN ('low', 'medium', 'high')),
  impact_score INTEGER NOT NULL CHECK (impact_score >= 0 AND impact_score <= 100),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'in_progress', 'completed', 'rejected', 'deferred', 'blocked', 'pending', 'applied', 'ignored')),
  rule_version TEXT NOT NULL,
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_recommendations_dedup ON recommendations(organization_id, website_id, category, affected_resource, rule_version) WHERE deleted_at IS NULL;

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

export const recommendationHistoriesTable: TableDefinition = {
  tableName: "recommendation_histories",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique recommendation history entry key"
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
      name: "recommendation_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "recommendations",
        column: "id",
        onDelete: "CASCADE"
      },
      description: "Associated recommendation identifier"
    },
    {
      name: "previous_status",
      type: "TEXT",
      nullable: true,
      description: "Previous status before transition"
    },
    {
      name: "new_status",
      type: "TEXT",
      nullable: false,
      description: "New status after transition"
    },
    {
      name: "timestamp",
      type: "TIMESTAMP",
      nullable: false,
      description: "Date of status transition"
    },
    {
      name: "actor",
      type: "TEXT",
      nullable: false,
      description: "User or system service initiating change"
    },
    {
      name: "reason",
      type: "TEXT",
      nullable: true,
      description: "Optional transition explanation details"
    },
    {
      name: "metadata",
      type: "JSONB",
      nullable: false,
      default: "'{}'::jsonb",
      description: "Contextual transition metadata"
    },
    // Audit columns
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
    "CREATE INDEX idx_recommendation_histories_org ON recommendation_histories(organization_id);",
    "CREATE INDEX idx_recommendation_histories_rec ON recommendation_histories(recommendation_id);",
    "CREATE INDEX idx_recommendation_histories_time ON recommendation_histories(timestamp DESC);"
  ],
  sql: `
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
  `
};
