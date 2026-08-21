import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";
import { TenantContextManager } from "@/core/database/tenant-context";
import { tenantSubscriptions, invoices, payments, tenantQuotas } from "../../../../database/schema";
import { SubscriptionPlanId } from "../domain/types";
import { PLANS } from "../domain/plans";

export class BillingService {
  /**
   * Generates a checkout transaction simulating payment provider session creation.
   * This handles safe upgrades/downgrades idempotently tracking invoices.
   */
  public async createCheckoutSession(planId: string): Promise<{ success: boolean; sessionId: string }> {
    const tenantId = TenantContextManager.getRequiredTenantId();

    // Verify plan exists
    if (!PLANS[planId]) {
      throw new Error("Invalid subscription plan");
    }

    // In a real integration, this calls Stripe/Zarinpal API
    // We simulate creating a session ID
    const sessionId = `chk_${Math.random().toString(36).substr(2, 9)}`;

    return { success: true, sessionId };
  }

  /**
   * Processes a successful webhook/checkout fulfillment.
   * Modifies subscription status and provisions quota/entitlements deterministically.
   */
  public async handleCheckoutSuccess(planId: string, amount: number): Promise<void> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Database client not available in TenantContext");
    const db = drizzle(client);

    const planDef = PLANS[planId];
    if (!planDef) throw new Error("Invalid plan ID during success handling");

    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // 1. Generate Invoice
    const [invoice] = await db.insert(invoices).values({
      tenantId,
      amount,
      status: "paid",
      paidAt: now
    }).returning({ id: invoices.id });

    // 2. Generate Payment Record
    await db.insert(payments).values({
      tenantId,
      invoiceId: invoice.id,
      amount,
      status: "succeeded"
    });

    // 3. Upsert Subscription State
    const existingSub = await db.select().from(tenantSubscriptions).where(eq(tenantSubscriptions.tenantId, tenantId)).limit(1);

    if (existingSub.length > 0) {
      await db.update(tenantSubscriptions).set({
        plan: planId,
        status: "active",
        startDate: now,
        endDate,
        priceAmount: amount,
        updatedAt: now
      }).where(eq(tenantSubscriptions.tenantId, tenantId));
    } else {
      await db.insert(tenantSubscriptions).values({
        tenantId,
        plan: planId,
        status: "active",
        billingCycle: "monthly",
        startDate: now,
        endDate,
        priceAmount: amount
      });
    }

    // 4. Reset / Upsert Quotas
    const existingQuota = await db.select().from(tenantQuotas).where(eq(tenantQuotas.tenantId, tenantId)).limit(1);
    if (existingQuota.length > 0) {
      await db.update(tenantQuotas).set({
        maxUsers: planDef.quotas.maxUsers,
        maxBrands: planDef.quotas.maxBrands,
        maxPrompts: planDef.quotas.maxPrompts,
        maxObservationsPerMonth: planDef.quotas.maxObservationsPerMonth,
        maxCrawlJobsPerDay: planDef.quotas.maxCrawlJobsPerDay,
        monthlyTokenLimit: planDef.quotas.monthlyTokenLimit,
        monthlyCostLimitUsd: planDef.quotas.monthlyCostLimitUsd,
        updatedAt: now
      }).where(eq(tenantQuotas.tenantId, tenantId));
    } else {
      await db.insert(tenantQuotas).values({
        tenantId,
        maxUsers: planDef.quotas.maxUsers,
        maxBrands: planDef.quotas.maxBrands,
        maxPrompts: planDef.quotas.maxPrompts,
        maxObservationsPerMonth: planDef.quotas.maxObservationsPerMonth,
        maxCrawlJobsPerDay: planDef.quotas.maxCrawlJobsPerDay,
        monthlyTokenLimit: planDef.quotas.monthlyTokenLimit,
        monthlyCostLimitUsd: planDef.quotas.monthlyCostLimitUsd,
      });
    }
  }

  /**
   * Handles explicit downgrades deterministically updating DB states.
   */
  public async downgradeSubscription(targetPlanId: string): Promise<void> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Database client not available in TenantContext");
    const db = drizzle(client);

    const planDef = PLANS[targetPlanId];
    if (!planDef) throw new Error("Invalid target plan");

    const now = new Date();

    // Set subscription to new plan, potentially keeping current cycle end
    await db.update(tenantSubscriptions).set({
      plan: targetPlanId,
      updatedAt: now
    }).where(eq(tenantSubscriptions.tenantId, tenantId));

    // Update Quotas to lower tier limits
    await db.update(tenantQuotas).set({
        maxUsers: planDef.quotas.maxUsers,
        maxBrands: planDef.quotas.maxBrands,
        maxPrompts: planDef.quotas.maxPrompts,
        maxObservationsPerMonth: planDef.quotas.maxObservationsPerMonth,
        maxCrawlJobsPerDay: planDef.quotas.maxCrawlJobsPerDay,
        monthlyTokenLimit: planDef.quotas.monthlyTokenLimit,
        monthlyCostLimitUsd: planDef.quotas.monthlyCostLimitUsd,
        updatedAt: now
    }).where(eq(tenantQuotas.tenantId, tenantId));
  }

  /**
   * Handles immediate cancellation of subscription.
   */
  public async cancelSubscription(): Promise<void> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Database client not available in TenantContext");
    const db = drizzle(client);

    await db.update(tenantSubscriptions).set({
      status: "canceled",
      updatedAt: new Date()
    }).where(eq(tenantSubscriptions.tenantId, tenantId));
  }

  /**
   * Fetches isolated historical invoices securely.
   */
  public async getInvoices() {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Database client not available in TenantContext");
    const db = drizzle(client);

    return await db.select().from(invoices).where(eq(invoices.tenantId, tenantId)).orderBy(desc(invoices.createdAt));
  }

  /**
   * Fetches isolated historical payments securely.
   */
  public async getPaymentHistory() {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const client = TenantContextManager.getDbClient();
    if (!client) throw new Error("Database client not available in TenantContext");
    const db = drizzle(client);

    return await db.select().from(payments).where(eq(payments.tenantId, tenantId)).orderBy(desc(payments.createdAt));
  }
}

export const billingService = new BillingService();
