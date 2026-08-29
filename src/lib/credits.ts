import { TenantContextManager } from "../core/database/tenant-context";
import { credits } from "../../database/schema/credits";
import { creditTransactions } from "../../database/schema/credit-transactions";
import { eq, sql } from "drizzle-orm";
// @ts-ignore
import { drizzle } from "drizzle-orm/node-postgres";

export async function checkCredits(workspaceId: string, requiredAmount: number): Promise<boolean> {
  return await TenantContextManager.runWithTenantContext(workspaceId, null, null, async () => {
    const db = drizzle(TenantContextManager.getDbClient());

    const [result] = await db
      .select({ availableCredits: credits.availableCredits })
      .from(credits)
      .where(eq(credits.organizationId, workspaceId))
      .limit(1);

    if (!result) return false;

    return result.availableCredits >= requiredAmount;
  });
}

export async function deductCredits(
  workspaceId: string,
  amount: number,
  feature: string,
  description: string
): Promise<boolean> {
  return await TenantContextManager.runWithTenantContext(workspaceId, null, null, async () => {
    const db = drizzle(TenantContextManager.getDbClient());

    return await db.transaction(async (tx: any) => {
      const [updatedCredit] = await tx
        .update(credits)
        .set({
          availableCredits: sql`${credits.availableCredits} - ${amount}`,
          usedCredits: sql`${credits.usedCredits} + ${amount}`,
          updatedAt: new Date(),
        })
        .where(
          sql`${credits.organizationId} = ${workspaceId} AND ${credits.availableCredits} >= ${amount}`
        )
        .returning();

      if (!updatedCredit) {
        return false; // Insufficient credits or record doesn't exist
      }

      await tx.insert(creditTransactions).values({
        organizationId: workspaceId,
        amount: -amount, // Negative to indicate deduction
        feature,
        description,
      });

      return true;
    });
  });
}


export async function addCredits(
  workspaceId: string,
  amount: number,
  feature: string,
  description: string
): Promise<boolean> {
  return await TenantContextManager.runWithTenantContext(workspaceId, null, null, async () => {
    const db = drizzle(TenantContextManager.getDbClient());

    return await db.transaction(async (tx: any) => {
      // Upsert the credits record
      const [updatedCredit] = await tx
        .insert(credits)
        .values({
          organizationId: workspaceId,
          availableCredits: amount,
          usedCredits: 0,
        })
        .onConflictDoUpdate({
          target: credits.organizationId,
          set: {
            availableCredits: sql`${credits.availableCredits} + ${amount}`,
            updatedAt: new Date(),
          },
        })
        .returning();

      if (!updatedCredit) {
        return false;
      }

      await tx.insert(creditTransactions).values({
        organizationId: workspaceId,
        amount: amount, // Positive to indicate addition
        feature,
        description,
      });

      return true;
    });
  });
}
