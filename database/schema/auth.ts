import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const defaultUuid = sql`gen_random_uuid()`;
const defaultNow = sql`NOW()`;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(defaultUuid),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("viewer"),
  workspaceId: text("workspace_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(defaultNow),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(defaultNow),
}, (table) => [
  index("idx_users_email").on(table.email),
]);

export const sessionRevocations = pgTable("session_revocations", {
  jti: text("jti").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(defaultNow),
}, (table) => [
  index("idx_session_revocations_expires").on(table.expiresAt),
]);

export const authRateLimits = pgTable("auth_rate_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(1),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
