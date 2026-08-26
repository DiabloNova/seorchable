"use server";

import { secureServerAction } from "@/lib/safe-action";
import { inngest } from "@/lib/inngest/client";
import { TenantContextManager } from "@/core/database/tenant-context";
import { drizzle } from "drizzle-orm/node-postgres";
import { audits } from "../../../database/schema";

export const triggerAuditAction = secureServerAction(
  async (url: string, ctx) => {
    return await TenantContextManager.runWithTenantContext(
      ctx.workspaceId!,
      ctx.userId,
      "trigger-audit",
      async () => {
        const client = TenantContextManager.getDbClient();
        if (!client) {
          throw new Error("Failed to get DB client in tenant context");
        }
        const db = drizzle(client);

        const [insertedAudit] = await db
          .insert(audits)
          .values({
            workspaceId: ctx.workspaceId!,
            userId: ctx.userId!,
            url,
            status: "pending",
          })
          .returning({ id: audits.id });

        if (!insertedAudit) {
          throw new Error("Failed to insert audit record");
        }

        await inngest.send({
          name: "audit.requested",
          data: {
            workspaceId: ctx.workspaceId!,
            userId: ctx.userId!,
            url,
            auditId: insertedAudit.id,
          },
        });

        return { auditId: insertedAudit.id };
      }
    );
  }
);
