import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { calculateAuditScores } from "../../../src/lib/audit-engine/scorer";
import { generateRecommendations } from "../../../src/lib/audit-engine/recommendation";
import { RawCrawlData } from "../../../src/types/audit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testRecommendationEngine() {
  console.log("▶ Running Recommendation Engine Tests...");

  // Ingest highly incomplete crawl data to trigger multiple recommendations
  const rawData: RawCrawlData = {
    url: "http://poor-site.ir",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <!-- Title and description are missing -->
      </head>
      <body>
        <!-- Missing H1 and thin body -->
        <p>This is extremely thin content.</p>
      </body>
      </html>
    `,
    metadata: {}
  };

  const features = extractAuditFeatures(rawData);
  const scores = calculateAuditScores(features);

  const recommendations = generateRecommendations(features, scores);

  // Verification 1: Correct Prioritisation (Critical first, then High, then Medium, then Low)
  assert(recommendations.length > 0, "Recommendations should be generated");

  let previousSeverityWeight = 5; // higher than critical
  const severityWeights: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  recommendations.forEach(rec => {
    const currentWeight = severityWeights[rec.severity];
    assert(currentWeight <= previousSeverityWeight, "Recommendations must be prioritized by severity descending");
    previousSeverityWeight = currentWeight;

    // Verification 2: Maps strictly to one of the 8 designated product modules
    const validModules = [
      "AEO Insights",
      "LLM Analytics",
      "Prompt Intelligence",
      "Content Studio",
      "Technical Optimisation",
      "AI Shopping",
      "MCP",
      "Agent"
    ];
    assert(validModules.includes(rec.module), `Module name '${rec.module}' must be one of the 8 valid platform modules`);
  });

  // Verify specific critical issues are mapped correctly
  const httpsRec = recommendations.find(r => r.issue.includes("HTTPS"));
  assert(httpsRec !== undefined, "HTTPS issue should be detected");
  assert(httpsRec?.severity === "critical", "HTTPS issue should be critical severity");
  assert(httpsRec?.module === "Technical Optimisation", "HTTPS issue should map to Technical Optimisation");

  const h1Rec = recommendations.find(r => r.issue.toLowerCase().includes("h1"));
  assert(h1Rec !== undefined, "H1 issue should be detected");
  assert(h1Rec?.severity === "critical", "H1 issue should be critical severity");
  assert(h1Rec?.module === "Content Studio", "H1 issue should map to Content Studio");

  console.log("✅ All Recommendation Engine Tests Passed Successfully!");
}

if (require.main === module) {
  testRecommendationEngine().catch(err => {
    console.error("❌ Recommendation Engine Tests Failed:", err);
    process.exit(1);
  });
}
