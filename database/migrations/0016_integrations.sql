CREATE TABLE "integration_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"status" text DEFAULT 'disconnected' NOT NULL,
	"external_resource_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"credential_reference" text,
	"last_validated_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_connections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"event_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"processed_at" timestamp with time zone,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "idx_integration_connections_tenant" ON "integration_connections" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_integration_connections_tenant_provider" ON "integration_connections" USING btree ("tenant_id","provider");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_tenant" ON "webhook_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_webhook_events_idempotency" ON "webhook_events" USING btree ("tenant_id","provider","event_id");--> statement-breakpoint
CREATE POLICY "select_tenant_id_isolation_policy" ON "integration_connections" AS PERMISSIVE FOR SELECT TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "insert_tenant_id_isolation_policy" ON "integration_connections" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "update_tenant_id_isolation_policy" ON "integration_connections" AS PERMISSIVE FOR UPDATE TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "delete_tenant_id_isolation_policy" ON "integration_connections" AS PERMISSIVE FOR DELETE TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "select_tenant_id_isolation_policy" ON "webhook_events" AS PERMISSIVE FOR SELECT TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "insert_tenant_id_isolation_policy" ON "webhook_events" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "update_tenant_id_isolation_policy" ON "webhook_events" AS PERMISSIVE FOR UPDATE TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "delete_tenant_id_isolation_policy" ON "webhook_events" AS PERMISSIVE FOR DELETE TO public USING ("tenant_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);