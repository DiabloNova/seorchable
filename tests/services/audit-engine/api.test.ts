import { normalizeAndValidateUrl } from "../../../src/lib/audit-engine/url-normalizer";
import { verifyUrlSafety } from "../../../src/lib/audit-engine/security";
import { executeCrawl } from "../../../src/lib/audit-engine/crawler";
import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { calculateAuditScores } from "../../../src/lib/audit-engine/scorer";
import { generateRecommendations } from "../../../src/lib/audit-engine/recommendation";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testUnifiedPipeline() {
  console.log("▶ Running End-to-End Unified API Pipeline Tests...");

  const rawUrl = "   seorchable.ir  ";

  // Step 1: URL Normalizer
  const normalized = normalizeAndValidateUrl(rawUrl);
  assert(normalized === "https://seorchable.ir/", "Url should be normalized properly with slash and schema");

  // Step 2: SSRF safety check
  const safety = verifyUrlSafety(normalized);
  assert(safety.safe === true, "Public seorchable.ir domain must pass safety checks");

  // Local/SSRF attack verification
  const unsafeUrl = "http://127.0.0.1/admin";
  const unsafeSafety = verifyUrlSafety(unsafeUrl);
  assert(unsafeSafety.safe === false, "Local IP target must be blocked with safe: false");

  // Step 3: Crawler Execution
  const rawData = await executeCrawl(normalized);
  assert(rawData.url === normalized, "Crawler url must match normalized target");

  // Step 4: Feature Extraction
  const features = extractAuditFeatures(rawData);
  assert(features.url === normalized, "Extracted features URL must match target");

  // Step 5: Scoring Rules Evaluation
  const scores = calculateAuditScores(features);
  assert(scores.overall.score >= 0 && scores.overall.score <= 100, "Calculated weighted overall score must be valid");

  // Step 6: Recommendation Generation
  const recommendations = generateRecommendations(features, scores);
  assert(recommendations.length > 0, "Pipeline recommendations must be generated successfully");

  console.log("✅ All Unified API Pipeline Tests Passed Successfully!");
}

if (require.main === module) {
  testUnifiedPipeline().catch(err => {
    console.error("❌ Pipeline API Tests Failed:", err);
    process.exit(1);
  });
}
