import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { calculateAuditScores } from "../../../src/lib/audit-engine/scorer";
import { generateRecommendations } from "../../../src/lib/audit-engine/recommendation";
import { RawCrawlData } from "../../../src/types/audit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testApiContractConsistency() {
  console.log("▶ Running API Contract Consistency Tests...");

  const rawData: RawCrawlData = {
    url: "https://seorchable.ir",
    html: `<!DOCTYPE html><html><head><title>Test Page</title></head><body><h1>Content</h1></body></html>`
  };

  const features = extractAuditFeatures(rawData);
  const scores = calculateAuditScores(features);
  const recommendations = generateRecommendations(features, scores);

  // Validate the overall contract keys
  assert("technical" in scores, "Scores payload must include 'technical' object");
  assert("content" in scores, "Scores payload must include 'content' object");
  assert("aeo" in scores, "Scores payload must include 'aeo' object");
  assert("llmReadiness" in scores, "Scores payload must include 'llmReadiness' object");
  assert("overall" in scores, "Scores payload must include 'overall' object");

  assert(Array.isArray(recommendations), "Recommendations must resolve to an array");

  if (recommendations.length > 0) {
    const rec = recommendations[0];
    assert("issue" in rec, "Recommendation must have an 'issue' parameter");
    assert("severity" in rec, "Recommendation must have a 'severity' parameter");
    assert("module" in rec, "Recommendation must have a 'module' parameter");
    assert("action" in rec, "Recommendation must have an 'action' parameter");
    assert("impactDescription" in rec, "Recommendation must have an 'impactDescription' parameter");
  }

  console.log("✓ API Contract Consistency Tests Passed.");
}

if (require.main === module) {
  testApiContractConsistency().catch(err => {
    console.error("❌ Test Failures:", err);
    process.exit(1);
  });
}
