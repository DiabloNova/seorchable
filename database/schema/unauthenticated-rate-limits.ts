import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const defaultNow = sql`NOW()`;

export const unauthenticatedAuditRateLimits = pgTable("unauthenticated_audit_rate_limits", {
  identifier: text("identifier").primaryKey(),
  shortWindowStart: timestamp("short_window_start", { withTimezone: true }).notNull().default(defaultNow),
  shortWindowCount: integer("short_window_count").notNull().default(0),
  dailyWindowStart: timestamp("daily_window_start", { withTimezone: true }).notNull().default(defaultNow),
  dailyWindowCount: integer("daily_window_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(defaultNow),
});
