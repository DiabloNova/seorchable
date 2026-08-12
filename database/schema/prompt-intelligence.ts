import { TableDefinition } from "./types";

export const promptDefinitionsTable: TableDefinition = {
  tableName: "prompt_definitions",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true,
      description: "Unique query prompt master key"
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
      description: "Tenant key"
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
      name: "name",
      type: "TEXT",
      nullable: false,
      description: "Friendly name of the prompt template"
    },
    {
      name: "prompt_template",
      type: "TEXT",
      nullable: false,
      description: "Parameterized query string template"
    },
    {
      name: "category",
      type: "TEXT",
      nullable: false,
      description: "Functional category context"
    },
    {
      name: "intent",
      type: "TEXT",
      nullable: false,
      description: "User Buying Intent"
    },
    {
      name: "locale",
      type: "TEXT",
      nullable: false,
      description: "locale code (e.g. en, fa)"
    },
    {
      name: "is_active",
      type: "BOOLEAN",
      nullable: false,
      default: "TRUE",
      description: "Active monitoring indicator"
    },
    {
      name: "variables",
      type: "JSONB",
      nullable: false,
      description: "Array of variable structures"
    },
    {
      name: "competitors",
      type: "TEXT[]",
      nullable: false,
      description: "Configured target competitor names to check"
    },
    {
      name: "tags",
      type: "TEXT[]",
      nullable: false,
      description: "Optional categorization tags"
    },
    {
      name: "notes",
      type: "TEXT",
      nullable: true,
      description: "UI-only description notes"
    },
    {
      name: "version",
      type: "INTEGER",
      nullable: false,
      default: "1",
      description: "Prompt template version snapshots counter"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    },
    {
      name: "created_by",
      type: "TEXT",
      nullable: false,
      default: "'system'"
    },
    {
      name: "updated_by",
      type: "TEXT",
      nullable: false,
      default: "'system'"
    },
    {
      name: "deleted_at",
      type: "TIMESTAMP",
      nullable: true
    },
    {
      name: "opt_version",
      type: "INTEGER",
      nullable: false,
      default: "1"
    }
  ],
  sql: ""
};

export const promptSchedulesTable: TableDefinition = {
  tableName: "prompt_schedules",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true
    },
    {
      name: "organization_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "prompt_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "prompt_definitions",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "enabled",
      type: "BOOLEAN",
      nullable: false,
      default: "TRUE"
    },
    {
      name: "cron_expression",
      type: "TEXT",
      nullable: false
    },
    {
      name: "timezone",
      type: "TEXT",
      nullable: false,
      default: "'UTC'"
    },
    {
      name: "next_execution_at",
      type: "TIMESTAMP",
      nullable: true
    },
    {
      name: "last_execution_at",
      type: "TIMESTAMP",
      nullable: true
    },
    {
      name: "status",
      type: "TEXT",
      nullable: false,
      default: "'IDLE'"
    },
    {
      name: "failure_reason",
      type: "TEXT",
      nullable: true
    },
    {
      name: "schedule_version",
      type: "INTEGER",
      nullable: false,
      default: "1"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    }
  ],
  sql: ""
};

export const promptExecutionsTable: TableDefinition = {
  tableName: "prompt_executions",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true
    },
    {
      name: "organization_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "prompt_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "prompt_definitions",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "prompt_version",
      type: "INTEGER",
      nullable: false
    },
    {
      name: "resolved_prompt_text",
      type: "TEXT",
      nullable: false
    },
    {
      name: "variables_values",
      type: "JSONB",
      nullable: false
    },
    {
      name: "status",
      type: "TEXT",
      nullable: false,
      default: "'queued'"
    },
    {
      name: "provider",
      type: "TEXT",
      nullable: false
    },
    {
      name: "model",
      type: "TEXT",
      nullable: false
    },
    {
      name: "model_version",
      type: "TEXT",
      nullable: true
    },
    {
      name: "response_text",
      type: "TEXT",
      nullable: true
    },
    {
      name: "latency_ms",
      type: "INTEGER",
      nullable: true
    },
    {
      name: "error_message",
      type: "TEXT",
      nullable: true
    },
    {
      name: "attempts",
      type: "INTEGER",
      nullable: false,
      default: "0"
    },
    {
      name: "max_attempts",
      type: "INTEGER",
      nullable: false,
      default: "3"
    },
    {
      name: "scheduled_for",
      type: "TIMESTAMP",
      nullable: true
    },
    {
      name: "executed_at",
      type: "TIMESTAMP",
      nullable: true
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    }
  ],
  sql: ""
};

export const positionObservationsTable: TableDefinition = {
  tableName: "position_observations",
  columns: [
    {
      name: "id",
      type: "UUID",
      nullable: false,
      primaryKey: true
    },
    {
      name: "organization_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "organizations",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "source_execution_id",
      type: "UUID",
      nullable: false,
      references: {
        table: "prompt_executions",
        column: "id",
        onDelete: "CASCADE"
      }
    },
    {
      name: "subject_entity_id",
      type: "TEXT",
      nullable: false
    },
    {
      name: "presence",
      type: "TEXT",
      nullable: false
    },
    {
      name: "numeric_position",
      type: "INTEGER",
      nullable: true
    },
    {
      name: "evidence_excerpt",
      type: "TEXT",
      nullable: false
    },
    {
      name: "evidence_structure",
      type: "TEXT",
      nullable: false
    },
    {
      name: "confidence",
      type: "DOUBLE PRECISION",
      nullable: false
    },
    {
      name: "analyzer_version",
      type: "TEXT",
      nullable: false,
      default: "'1.0.0'"
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      default: "NOW()"
    }
  ],
  sql: ""
};
