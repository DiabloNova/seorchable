import { testFetcher } from "./fetcher.test";
import { testProviders } from "./providers.test";
import { testRouter } from "./router.test";
import { testHttpProviderLimits } from "./http-provider.test";
import { testPolicyIdentity } from "./policy-identity.test";
import { testSecurity } from "./security.test";
import { testStateMachine } from "./state-machine.test";
import { testUrl } from "./url.test";

async function main(): Promise<void> {
  testUrl();
  testPolicyIdentity();
  await testSecurity();
  testStateMachine();
  await testFetcher();
  await testProviders();
  await testRouter();
  await testHttpProviderLimits();

  // Dynamically count the number of test suites called
  const suiteCount = [
    testUrl,
    testPolicyIdentity,
    testSecurity,
    testStateMachine,
    testFetcher,
    testProviders,
    testRouter,
    testHttpProviderLimits
  ].length;

  console.log(`✅ acquisition suites passed (${suiteCount} suites collected)`);
}

main().catch((error: unknown) => {
  console.error("❌ acquisition suite failed", error);
  process.exitCode = 1;
});
