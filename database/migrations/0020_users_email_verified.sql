-- Migration: Add email_verified columns to users table
-- These columns are required by loginAction and registerAction in src/app/actions/auth.ts

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp with time zone;
