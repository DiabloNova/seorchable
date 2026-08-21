import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
  pgPolicy,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const defaultUuid = sql`gen_random_uuid()`;
const defaultNow = sql`NOW()`;

// RLS Policy Helper for tenant isolation based on tenant_id
function tenantPolicy(colName: "tenant_id" = "tenant_id") {
  return [
    pgPolicy(`select_${colName}_isolation_policy`, {
      for: "select",
      using: sql`${sql.identifier(colName)} = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`
    }),
    pgPolicy(`insert_${colName}_isolation_policy`, {
      for: "insert",
      withCheck: sql`${sql.identifier(colName)} = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`
    }),
    pgPolicy(`update_${colName}_isolation_policy`, {
      for: "update",
      using: sql`${sql.identifier(colName)} = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`,
      withCheck: sql`${sql.identifier(colName)} = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`
    }),
    pgPolicy(`delete_${colName}_isolation_policy`, {
      for: "delete",
      using: sql`${sql.identifier(colName)} = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid`
    })
  ];
}

export const integrationConnections = pgTable("integration_connections", {
  id: uuid("id").primaryKey().default(defaultUuid),
  tenantId: uuid("tenant_id").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull().default('disconnected'),
  externalResourceId: text("external_resource_id"),
  metadata: jsonb("metadata").notNull().default({}),
  credentialReference: text("credential_reference"),
  lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(defaultNow),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(defaultNow),
}, (table) => [
  index("idx_integration_connections_tenant").on(table.tenantId),
  uniqueIndex("idx_integration_connections_tenant_provider").on(table.tenantId, table.provider),
  ...tenantPolicy("tenant_id")
]);

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().default(defaultUuid),
  tenantId: uuid("tenant_id").notNull(),
  provider: text("provider").notNull(),
  eventId: text("event_id").notNull(),
  payload: jsonb("payload").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().default(defaultNow),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  status: text("status").notNull().default('pending'),
}, (table) => [
  index("idx_webhook_events_tenant").on(table.tenantId),
  uniqueIndex("idx_webhook_events_idempotency").on(table.tenantId, table.provider, table.eventId),
  ...tenantPolicy("tenant_id")
]);
