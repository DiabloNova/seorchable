import { testFetcher } from "./fetcher.test";
import { testProviders } from "./providers.test";
import { testRouter } from "./router.test";
import { testHttpProviderLimits } from "./http-provider.test";
import { testPolicyIdentity } from "./policy-identity.test";
import { testSecurity } from "./security.test";
import { testStateMachine } from "./state-machine.test";
import { testUrl } from "./url.test";

async function main(): Promise<void> {
  const suites = [
    testUrl,
    testPolicyIdentity,
    testSecurity,
    testStateMachine,
    testFetcher,
    testProviders,
    testRouter,
    testHttpProviderLimits
  ];

  let executedCount = 0;
  for (const suite of suites) {
    await suite();
    executedCount++;
  }

  console.log(`✅ acquisition suites passed (${executedCount} suites collected)`);
}

main().catch((error: unknown) => {
  console.error("❌ acquisition suite failed", error);
  process.exitCode = 1;
});
