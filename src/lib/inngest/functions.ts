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
  { id: "scheduled-monitoring", triggers: [{ event: "monitoring/run.scheduled" }] },
  async ({ event, step }) => {
    const { monitoringConfigId } = event.data;

    await step.run("execute-monitoring", async () => {
      // Setup dependencies (in a real app this might use a DI container)
      const configRepo = new MonitoringConfigRepository();
      const snapshotRepo = new CrawlSnapshotRepository();
      const alertRepo = new MonitoringAlertRepository();
      const changeDetection = new ChangeDetectionService();
      const regressionDetection = new RegressionDetectionService();
      const contentDetection = new ContentChangeDetectionService();
      const alertGeneration = new AlertGenerationService();

      const firecrawlProvider = new FirecrawlCrawlProvider();

      const runMonitoring = new RunMonitoring(
        configRepo,
        snapshotRepo,
        alertRepo,
        changeDetection,
        regressionDetection,
        contentDetection,
        alertGeneration,
        firecrawlProvider
      );

      await runMonitoring.execute({ monitoringConfigId });

      return { status: "success", timestamp: new Date().toISOString() };
    });

    return { message: "Scheduled monitoring completed" };
  }
);
