import { tenantQuotas, tenantUsage } from "../../../../database/schema/subscription";
import { eq, and, sql } from "drizzle-orm";
import { TenantContextManager } from "../../../core/database/tenant-context";
import { PostgresClient } from "../../../features/admin/infrastructure/persistence/postgres";
import { drizzle } from "drizzle-orm/node-postgres";

export class QuotaService {
  private getDb() {
    const client = TenantContextManager.getDbClient();
    if (client) return drizzle(client);
    return drizzle(PostgresClient.getInstance().getPool());
  }

  /**
   * Simple quota management for arbitrary resources (e.g. storage bytes, number of domains)
   */
  async enforceQuota(organizationId: string, resourceName: string, amount: number = 1): Promise<boolean> {
    if (amount < 0) throw new Error("Amount must be non-negative");
    const db = this.getDb();

    // Atomic update preventing exceeding limit_count
    const result = await db.update(tenantQuotas)
      .set({ usedCount: sql`${tenantQuotas.usedCount} + ${amount}` })
      .where(sql`${tenantQuotas.organizationId} = ${organizationId} AND ${tenantQuotas.resourceName} = ${resourceName} AND (${tenantQuotas.usedCount} + ${amount}) <= ${tenantQuotas.limitCount}`)
      .returning({ usedCount: tenantQuotas.usedCount });

    return result.length > 0;
  }

  async getQuota(organizationId: string, resourceName: string) {
    const db = this.getDb();
    const result = await db.select()
      .from(tenantQuotas)
      .where(and(eq(tenantQuotas.organizationId, organizationId), eq(tenantQuotas.resourceName, resourceName)));

    return result[0] || null;
  }

  /**
   * Usage tracking bound to a time period (e.g. monthly API calls).
   * Usually combined with EntitlementService limit.
   */
  async trackUsage(organizationId: string, featureName: string, periodStart: Date, periodEnd: Date, amount: number = 1): Promise<number> {
     const db = this.getDb();
     // Insert or increment
     const result = await db.insert(tenantUsage)
       .values({ organizationId, featureName, periodStart, periodEnd, usedCount: amount })
       .onConflictDoUpdate({
         target: [tenantUsage.organizationId, tenantUsage.featureName, tenantUsage.periodStart],
         set: { usedCount: sql`${tenantUsage.usedCount} + ${amount}` }
       })
       .returning({ usedCount: tenantUsage.usedCount });

     return result[0].usedCount;
  }
}
