import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
  index,
  jsonb,
  pgPolicy,
  pgEnum
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const defaultUuid = sql`gen_random_uuid()`;
const defaultNow = sql`NOW()`;
const tenantAuthSql = sql`(current_setting('app.current_tenant_id', true))::uuid = organization_id`;

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'trialing',
  'past_due',
  'canceled',
  'expired'
]);

export const subscriptionPlansEnum = pgEnum('subscription_plans', [
  'free',
  'professional',
  'business',
  'enterprise'
]);

export const plans = pgTable("plans", {
  id: subscriptionPlansEnum("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  currency: text("currency").default("USD").notNull(),
  features: jsonb("features").notNull().$type<Record<string, boolean | number | 'unlimited'>>(),
  createdAt: timestamp("created_at").default(defaultNow).notNull(),
  updatedAt: timestamp("updated_at").default(defaultNow).notNull(),
});

export const tenantSubscriptions = pgTable("tenant_subscriptions", {
  id: uuid("id").primaryKey().default(defaultUuid),
  organizationId: uuid("organization_id").notNull(),
  planId: subscriptionPlansEnum("plan_id").notNull().references(() => plans.id),
  status: subscriptionStatusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").default(defaultNow).notNull(),
  updatedAt: timestamp("updated_at").default(defaultNow).notNull(),
}, (table) => [
  uniqueIndex("tenant_subscriptions_org_idx").on(table.organizationId),
  pgPolicy("tenant_subscriptions_isolation_policy", {
    for: "all",
    to: "authenticated",
    using: tenantAuthSql,
    withCheck: tenantAuthSql,
  })
]);

export const tenantCredits = pgTable("tenant_credits", {
  id: uuid("id").primaryKey().default(defaultUuid),
  organizationId: uuid("organization_id").notNull(),
  balance: integer("balance").notNull().default(0),
  createdAt: timestamp("created_at").default(defaultNow).notNull(),
  updatedAt: timestamp("updated_at").default(defaultNow).notNull(),
}, (table) => [
  uniqueIndex("tenant_credits_org_idx").on(table.organizationId),
  pgPolicy("tenant_credits_isolation_policy", {
    for: "all",
    to: "authenticated",
    using: tenantAuthSql,
    withCheck: tenantAuthSql,
  })
]);

export const tenantUsage = pgTable("tenant_usage", {
  id: uuid("id").primaryKey().default(defaultUuid),
  organizationId: uuid("organization_id").notNull(),
  featureName: text("feature_name").notNull(),
  usedCount: integer("used_count").notNull().default(0),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").default(defaultNow).notNull(),
  updatedAt: timestamp("updated_at").default(defaultNow).notNull(),
}, (table) => [
  index("tenant_usage_org_feat_idx").on(table.organizationId, table.featureName),
  uniqueIndex("tenant_usage_org_feat_period_idx").on(table.organizationId, table.featureName, table.periodStart),
  pgPolicy("tenant_usage_isolation_policy", {
    for: "all",
    to: "authenticated",
    using: tenantAuthSql,
    withCheck: tenantAuthSql,
  })
]);

export const tenantQuotas = pgTable("tenant_quotas", {
  id: uuid("id").primaryKey().default(defaultUuid),
  organizationId: uuid("organization_id").notNull(),
  resourceName: text("resource_name").notNull(),
  usedCount: integer("used_count").notNull().default(0),
  limitCount: integer("limit_count").notNull(),
  resetAt: timestamp("reset_at"),
  createdAt: timestamp("created_at").default(defaultNow).notNull(),
  updatedAt: timestamp("updated_at").default(defaultNow).notNull(),
}, (table) => [
  uniqueIndex("tenant_quotas_org_res_idx").on(table.organizationId, table.resourceName),
  pgPolicy("tenant_quotas_isolation_policy", {
    for: "all",
    to: "authenticated",
    using: tenantAuthSql,
    withCheck: tenantAuthSql,
  })
]);
