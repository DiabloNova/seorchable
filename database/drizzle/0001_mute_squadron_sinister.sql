CREATE TYPE "public"."subscription_plans" AS ENUM('free', 'professional', 'business', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'expired');--> statement-breakpoint
CREATE TABLE "plans" (
	"id" "subscription_plans" PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"features" jsonb NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenant_credits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tenant_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"feature_name" text NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenant_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_credits_org_idx" ON "tenant_credits" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "tenant_usage_org_feat_idx" ON "tenant_usage" USING btree ("organization_id","feature_name");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_usage_org_feat_period_idx" ON "tenant_usage" USING btree ("organization_id","feature_name","period_start");--> statement-breakpoint
CREATE POLICY "tenant_credits_isolation_policy" ON "tenant_credits" AS PERMISSIVE FOR ALL TO "authenticated" USING ((current_setting('app.current_tenant_id', true))::uuid = organization_id) WITH CHECK ((current_setting('app.current_tenant_id', true))::uuid = organization_id);--> statement-breakpoint
CREATE POLICY "tenant_usage_isolation_policy" ON "tenant_usage" AS PERMISSIVE FOR ALL TO "authenticated" USING ((current_setting('app.current_tenant_id', true))::uuid = organization_id) WITH CHECK ((current_setting('app.current_tenant_id', true))::uuid = organization_id);