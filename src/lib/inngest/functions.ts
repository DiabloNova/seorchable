import { inngest } from "./client";
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
