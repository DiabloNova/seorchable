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
