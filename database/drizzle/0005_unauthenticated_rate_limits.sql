CREATE TABLE IF NOT EXISTS "unauthenticated_audit_rate_limits" (
	"identifier" text PRIMARY KEY NOT NULL,
	"short_window_start" timestamp with time zone DEFAULT NOW() NOT NULL,
	"short_window_count" integer DEFAULT 0 NOT NULL,
	"daily_window_start" timestamp with time zone DEFAULT NOW() NOT NULL,
	"daily_window_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NOW() NOT NULL
);
