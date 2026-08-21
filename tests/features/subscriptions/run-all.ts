import { runSubscriptionTests } from "./subscription.test";

async function main(): Promise<void> {
  await runSubscriptionTests();
}

main().catch((error: unknown) => {
  console.error("❌ Subscription suite failed", error);
  process.exitCode = 1;
});
