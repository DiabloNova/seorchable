CREATE TABLE "website_monitoring_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"website_id" uuid NOT NULL,
	"job_id" text,
	"status" text DEFAULT 'valid' NOT NULL,
	"snapshot_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "website_monitoring_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "websites" ADD COLUMN "monitoring_config" jsonb;--> statement-breakpoint
ALTER TABLE "website_monitoring_snapshots" ADD CONSTRAINT "website_monitoring_snapshots_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_monitoring_snapshots" ADD CONSTRAINT "website_monitoring_snapshots_website_id_websites_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_website_monitoring_snapshots_organization" ON "website_monitoring_snapshots" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_website_monitoring_snapshots_website" ON "website_monitoring_snapshots" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "idx_website_monitoring_snapshots_created_at" ON "website_monitoring_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE POLICY "select_organization_id_isolation_policy" ON "website_monitoring_snapshots" AS PERMISSIVE FOR SELECT TO public USING ("organization_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "insert_organization_id_isolation_policy" ON "website_monitoring_snapshots" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("organization_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "update_organization_id_isolation_policy" ON "website_monitoring_snapshots" AS PERMISSIVE FOR UPDATE TO public USING ("organization_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid) WITH CHECK ("organization_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "delete_organization_id_isolation_policy" ON "website_monitoring_snapshots" AS PERMISSIVE FOR DELETE TO public USING ("organization_id" = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);