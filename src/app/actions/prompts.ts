"use server";

import { secureServerAction } from "@/lib/safe-action";
import { z } from "zod";
import { TenantContextManager } from "@/core/database/tenant-context";
import { eq, and } from "drizzle-orm";
import { prompts, brands } from "../../../database/schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const getPromptsAction = secureServerAction
  .schema(z.object({}))
  .action(async ({ ctx }) => {
    return TenantContextManager.runWithTenantContext(ctx.workspaceId, async () => {
      const db = drizzle(TenantContextManager.getDbClient());

      const allPrompts = await db
        .select({
          id: prompts.id,
          queryText: prompts.queryText,
          category: prompts.category,
          buyingIntent: prompts.buyingIntent,
          createdAt: prompts.createdAt,
          brandName: brands.name,
        })
        .from(prompts)
        .leftJoin(brands, eq(prompts.brandId, brands.id))
        .where(eq(prompts.organizationId, ctx.workspaceId))
        .orderBy(prompts.createdAt);

      return allPrompts;
    });
  });

export const addPromptAction = secureServerAction
  .schema(z.object({
    query: z.string().min(1, "Query is required")
  }))
  .action(async ({ parsedInput, ctx }) => {
    return TenantContextManager.runWithTenantContext(ctx.workspaceId, async () => {
      const db = drizzle(TenantContextManager.getDbClient());

      // Find first brand or default brand for the tenant
      const userBrands = await db
        .select({ id: brands.id })
        .from(brands)
        .where(eq(brands.organizationId, ctx.workspaceId))
        .limit(1);

      if (userBrands.length === 0) {
        throw new Error("No active brand found for the workspace. Please register a brand first.");
      }

      const brandId = userBrands[0].id;

      const [inserted] = await db
        .insert(prompts)
        .values({
          organizationId: ctx.workspaceId,
          brandId: brandId,
          queryText: parsedInput.query,
          category: "General",
          buyingIntent: "Discovery",
          isActive: true
        })
        .returning();

      return inserted;
    });
  });

export const deletePromptAction = secureServerAction
  .schema(z.object({
    promptId: z.string().uuid()
  }))
  .action(async ({ parsedInput, ctx }) => {
    return TenantContextManager.runWithTenantContext(ctx.workspaceId, async () => {
      const db = drizzle(TenantContextManager.getDbClient());

      const [deleted] = await db
        .delete(prompts)
        .where(
          and(
            eq(prompts.id, parsedInput.promptId),
            eq(prompts.organizationId, ctx.workspaceId)
          )
        )
        .returning();

      if (!deleted) {
        throw new Error("Prompt not found or unauthorized to delete");
      }

      return deleted;
    });
  });
