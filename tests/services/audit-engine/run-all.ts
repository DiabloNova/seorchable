/**
 * Core Intelligence Audit Engine Foundation
 * Phase 1 Master Test Suite Runner
 */

import { testUrlNormalizer } from "./url-normalizer.test";
import { testSecuritySSRF } from "./security.test";
import { testFeatureExtractor } from "./extractor.test";
import { testDeterministicScorer } from "./scorer.test";
import { testDeterministicSensitivity } from "./deterministic.test";
import { testRecommendationEngine } from "./recommendation.test";
import { testApiContractConsistency } from "./api-contract.test";
import { testUnifiedPipeline } from "./api.test";

async function main() {
  console.log("====================================================");
  console.log("🚀 Starting Core Intelligence Audit Engine Master Tests...");
  console.log("====================================================");

  try {
    await testUrlNormalizer();
    await testSecuritySSRF();
    await testFeatureExtractor();
    await testDeterministicScorer();
    await testDeterministicSensitivity();
    await testRecommendationEngine();
    await testApiContractConsistency();
    await testUnifiedPipeline();

    console.log("\n====================================================");
    console.log("🎉 ALL AUDIT ENGINE FOUNDATION TESTS PASSED!");
    console.log("====================================================");
  } catch (error) {
    console.error("\n❌ AUDIT ENGINE TEST SUITE RUNNER FAILURE:", error);
    process.exit(1);
  }
}

main();
