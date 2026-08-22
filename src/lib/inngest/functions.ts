import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello, World!" };
  },
);

export const scheduledMonitoring = inngest.createFunction(
  { id: "scheduled-monitoring-placeholder", triggers: [{ cron: "0 * * * *" }] },
  async ({ step }) => {
    await step.run("execute-monitoring", async () => {
      // Placeholder for future Website Monitoring job implementation
      console.log("Running scheduled monitoring placeholder...");
      return { status: "success", timestamp: new Date().toISOString() };
    });
    return { message: "Scheduled monitoring completed" };
  },
);
