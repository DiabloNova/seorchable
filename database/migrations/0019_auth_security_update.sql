ALTER TABLE "users" ADD COLUMN "password_hash" text;
ALTER TABLE "users" ADD COLUMN "is_active" integer DEFAULT 1 NOT NULL;
ALTER TABLE "users" ADD COLUMN "failed_login_attempts" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN "locked_until" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN "challenge_required" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN "trusted_ips" text[];
ALTER TABLE "users" ADD COLUMN "last_login_ip" text;
