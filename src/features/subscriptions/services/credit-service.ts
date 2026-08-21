import { tenantCredits } from "../../../../database/schema/subscription";
import { eq, sql } from "drizzle-orm";
import { TenantContextManager } from "../../../core/database/tenant-context";
import { PostgresClient } from "../../../features/admin/infrastructure/persistence/postgres";
import { drizzle } from "drizzle-orm/node-postgres";

export class CreditService {
  private getDb() {
    const client = TenantContextManager.getDbClient();
    if (client) return drizzle(client);
    return drizzle(PostgresClient.getInstance().getPool());
  }

  async getBalance(organizationId: string): Promise<number> {
    const db = this.getDb();
    const records = await db.select({ balance: tenantCredits.balance })
      .from(tenantCredits)
      .where(eq(tenantCredits.organizationId, organizationId));

    if (!records.length) return 0;
    return records[0].balance;
  }

  async addCredits(organizationId: string, amount: number): Promise<number> {
    if (amount <= 0) throw new Error("Amount to add must be positive");
    const db = this.getDb();

    const result = await db.update(tenantCredits)
      .set({ balance: sql`${tenantCredits.balance} + ${amount}` })
      .where(eq(tenantCredits.organizationId, organizationId))
      .returning({ balance: tenantCredits.balance });

    if (!result.length) {
      // If row doesn't exist, insert it. This handles the initial credit grant.
      const insertResult = await db.insert(tenantCredits)
        .values({ organizationId, balance: amount })
        .onConflictDoUpdate({
           target: tenantCredits.organizationId,
           set: { balance: sql`${tenantCredits.balance} + ${amount}` }
        })
        .returning({ balance: tenantCredits.balance });
      return insertResult[0].balance;
    }
    return result[0].balance;
  }

  async deductCredits(organizationId: string, amount: number): Promise<boolean> {
    if (amount <= 0) throw new Error("Amount to deduct must be positive");
    const db = this.getDb();

    // Atomic deduction preventing negative balance
    const result = await db.update(tenantCredits)
      .set({ balance: sql`${tenantCredits.balance} - ${amount}` })
      .where(sql`${tenantCredits.organizationId} = ${organizationId} AND ${tenantCredits.balance} >= ${amount}`)
      .returning({ balance: tenantCredits.balance });

    return result.length > 0;
  }
}
