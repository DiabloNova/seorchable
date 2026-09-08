ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp with time zone;
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "org_members_role_check" CHECK (role IN ('super_admin', 'workspace_admin', 'viewer'));
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
