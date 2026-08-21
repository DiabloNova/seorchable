import { tenantSubscriptions, plans } from "../../../../database/schema/subscription";
import { eq } from "drizzle-orm";
import { TenantSubscription, Plan } from "../domain/types";
import { TenantContextManager } from "../../../core/database/tenant-context";
import { PostgresClient } from "../../../features/admin/infrastructure/persistence/postgres";
import { drizzle } from "drizzle-orm/node-postgres";

export class SubscriptionService {
  private getDb() {
    // If we have a tenant context with a client, use it. Otherwise use root pool (for non-RLS tasks like getPlan)
    const client = TenantContextManager.getDbClient();
    if (client) return drizzle(client);
    return drizzle(PostgresClient.getInstance().getPool());
  }

  /**
   * Resolves the effective subscription for a given tenant.
   * Uses RLS, so TenantContext must be set prior to querying.
   */
  async getEffectiveSubscription(organizationId: string): Promise<TenantSubscription | null> {
    const db = this.getDb();
    const records = await db.select().from(tenantSubscriptions).where(eq(tenantSubscriptions.organizationId, organizationId));
    if (!records.length) return null;
    return records[0] as TenantSubscription;
  }

  /**
   * Retrieves the plan details for a specific plan ID.
   */
  async getPlan(planId: string): Promise<Plan | null> {
    const db = this.getDb();
    const records = await db.select().from(plans).where(eq(plans.id, planId as any));
    if (!records.length) return null;
    return records[0] as Plan;
  }

  /**
   * Checks if a tenant's subscription is considered active.
   */
  isSubscriptionActive(subscription: TenantSubscription | null): boolean {
    if (!subscription) return false;
    const now = new Date();
    // It must not be expired or canceled. active or trialing is allowed.
    // If it's past currentPeriodEnd, it should be marked as expired, but for robust check:
    if (now > subscription.currentPeriodEnd) return false;

    return ['active', 'trialing'].includes(subscription.status);
  }
}
