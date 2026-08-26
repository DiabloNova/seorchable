import { inngest } from "../client";
import { crawlWebsite } from "../../crawler";
import { analyzeSeoForAEO } from "../../ai";
import { TenantContextManager } from "../../../core/database/tenant-context";
import { audits } from "../../../../database/schema/audits";
// @ts-ignore
import { eq } from "drizzle-orm";

export const runAudit = inngest.createFunction(
  { id: "run-audit", triggers: [{ event: "audit.requested" }] },
  async ({ event, step }: { event: any; step: any }) => {
    const { workspaceId, userId, url, auditId } = event.data;

    // Step 1: Update DB status to 'crawling'
    await step.run("update-status-crawling", async () => {
      await TenantContextManager.runWithTenantContext(workspaceId, userId, null, async () => {
        // @ts-ignore
        const { drizzle } = require("drizzle-orm/node-postgres");
        const db = drizzle(TenantContextManager.getDbClient());
        await db
          .update(audits)
          .set({ status: "crawling", updatedAt: new Date() })
          .where(eq(audits.id, auditId));
      });
    });

    // Step 2: Execute crawlWebsite
    const crawlResult = await step.run("execute-crawl", async () => {
      return await crawlWebsite(url);
    });

    if (!crawlResult.success || !crawlResult.data) {
      await step.run("update-status-failed-crawl", async () => {
        await TenantContextManager.runWithTenantContext(workspaceId, userId, null, async () => {
          // @ts-ignore
          const { drizzle } = require("drizzle-orm/node-postgres");
          const db = drizzle(TenantContextManager.getDbClient());
          await db
            .update(audits)
            .set({
              status: "failed",
              errorMessage: crawlResult.error || "Failed to crawl website",
              updatedAt: new Date()
            })
            .where(eq(audits.id, auditId));
        });
      });
      return { success: false, error: crawlResult.error };
    }

    // Step 3: Update DB status to 'analyzing'
    await step.run("update-status-analyzing", async () => {
      await TenantContextManager.runWithTenantContext(workspaceId, userId, null, async () => {
        // @ts-ignore
        const { drizzle } = require("drizzle-orm/node-postgres");
        const db = drizzle(TenantContextManager.getDbClient());
        await db
          .update(audits)
          .set({
            status: "analyzing",
            rawSignals: crawlResult.data,
            updatedAt: new Date()
          })
          .where(eq(audits.id, auditId));
      });
    });

    // Step 4: Execute analyzeSeoForAEO
    const analysisResult = await step.run("execute-analysis", async () => {
      return await analyzeSeoForAEO(url, crawlResult.data!);
    });

    if (!analysisResult.success || !analysisResult.data) {
       await step.run("update-status-failed-analysis", async () => {
        await TenantContextManager.runWithTenantContext(workspaceId, userId, null, async () => {
          // @ts-ignore
          const { drizzle } = require("drizzle-orm/node-postgres");
          const db = drizzle(TenantContextManager.getDbClient());
          await db
            .update(audits)
            .set({
              status: "failed",
              errorMessage: analysisResult.error || "Failed to analyze SEO",
              updatedAt: new Date()
            })
            .where(eq(audits.id, auditId));
        });
      });
      return { success: false, error: analysisResult.error };
    }

    // Step 5: Update DB status to 'completed'
    await step.run("update-status-completed", async () => {
      await TenantContextManager.runWithTenantContext(workspaceId, userId, null, async () => {
        // @ts-ignore
        const { drizzle } = require("drizzle-orm/node-postgres");
        const db = drizzle(TenantContextManager.getDbClient());
        await db
          .update(audits)
          .set({
            status: "completed",
            aiInsights: analysisResult.data,
            updatedAt: new Date()
          })
          .where(eq(audits.id, auditId));
      });
    });

    return { success: true, auditId };
  }
);
