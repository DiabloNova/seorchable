import { inngest } from "./client";
import { RunMonitoring } from "../../features/monitoring/application/run-monitoring";
import { MonitoringConfigRepository } from "../../features/monitoring/repositories/monitoring-config-repository";
import { CrawlSnapshotRepository } from "../../features/monitoring/repositories/crawl-snapshot-repository";
import { MonitoringAlertRepository } from "../../features/monitoring/repositories/monitoring-alert-repository";
import { ChangeDetectionService } from "../../features/monitoring/services/change-detection-service";
import { RegressionDetectionService } from "../../features/monitoring/services/regression-detection-service";
import { ContentChangeDetectionService } from "../../features/monitoring/services/content-change-detection-service";
import { AlertGenerationService } from "../../features/monitoring/services/alert-generation-service";
import { FirecrawlCrawlProvider } from "../../features/acquisition/infrastructure/providers/firecrawl/firecrawl-crawl-provider";
import { RecommendationEngineService } from "../../features/recommendations/services/recommendation-engine-service";
import { AIVisibilityMonitoringService } from "../../features/monitoring/services/ai-visibility-monitoring-service";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

export const scheduledMonitoring = inngest.createFunction(
  { id: "scheduled-ai-visibility-monitoring", triggers: [{ cron: "0 * * * *" }] },
  async ({ step }) => {
    await step.run("execute-ai-visibility-monitoring", async () => {
      console.log("Starting scheduled AI Visibility Monitoring job...");
      const service = new AIVisibilityMonitoringService();
      await service.runScheduledMonitoring();
      return { status: "success", timestamp: new Date().toISOString() };
    });
    return { message: "Scheduled AI Visibility monitoring completed" };
  },
);

export const automatedRecommendationsDiagnosis = inngest.createFunction(
  { id: "automated-recommendations-diagnosis", triggers: [{ cron: "0 2 * * *" }] },
  async ({ step }) => {
    await step.run("execute-recommendations-diagnosis", async () => {
      console.log("Starting Automated Recommendations Diagnosis job...");
      const service = new RecommendationEngineService();

      // Import the proper database instance from the core connection manager rather than relying on global.pgClient.
      const { TenantContextManager } = require("../../core/database/tenant-context");
      const { drizzle } = require("drizzle-orm/node-postgres");
      const db = drizzle(TenantContextManager.getDbClient());
      const res = await db.execute('SELECT id FROM organizations');

      for (const row of res.rows) {
        await service.runDiagnosisForTenant(row.id as string);
      }

      return { status: "success", timestamp: new Date().toISOString() };
    });
    return { message: "Automated Recommendations diagnosis completed" };
  },
);
