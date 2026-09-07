-- Custom SQL migration file, put you code below! --
ALTER TABLE "users" ADD COLUMN "password_hash" text;
ALTER TABLE "users" ADD COLUMN "password_reset_required" boolean DEFAULT true NOT NULL;
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;

CREATE TABLE IF NOT EXISTS "auth_locks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"normalized_email" text NOT NULL,
	"trusted_source_ip" text NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"lock_expiration" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_auth_locks_email_ip" ON "auth_locks" ("normalized_email","trusted_source_ip");
