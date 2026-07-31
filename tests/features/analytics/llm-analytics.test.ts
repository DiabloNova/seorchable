/**
 * Automated Test Suite for LLM Analytics (Share of Voice + Simulated Queries)
 * Verifies robust payload validation, x-tenant-id context isolation, and dynamic mock LLM metric calculations.
 */

import { NextRequest } from "next/server";
import { POST, LlmAnalyticsResponse } from "../../../src/app/api/v1/analytics/llm/route";

export async function testLlmAnalytics() {
  console.log("▶ Running LLM Analytics Module Tests...");

  try {
    // 1. Scenario A: Successful Simulation & Metrics Calculation
    console.log("  * Scenario A: Testing successful analysis simulation...");
    const reqA = new NextRequest("http://localhost/api/v1/analytics/llm", {
      method: "POST",
      headers: {
        "x-tenant-id": "org-enterprise-01",
        "x-user-id": "usr-test-101"
      },
      body: JSON.stringify({
        brandName: "خانه خلاق هوش مصنوعی",
        competitorNames: ["دیجی‌کالا", "اسنپ"],
        queries: [
          "آیا خانه خلاق هوش مصنوعی جایگزین مناسبی برای رقبایش است؟",
          "نقاط قوت خانه خلاق هوش مصنوعی چیست؟"
        ]
      }),
    });

    const resA = await POST(reqA);
    const payloadA = (await resA.json()) as any;

    if (resA.status !== 200) {
      throw new Error(`Scenario A Failed: Expected status 200, got ${resA.status} - Payload: ${JSON.stringify(payloadA)}`);
    }

    // Verify SOV
    if (!payloadA.shareOfVoice || payloadA.shareOfVoice.yourBrand < 0 || payloadA.shareOfVoice.yourBrand > 100) {
      throw new Error(`Scenario A Failed: yourBrand SOV percentage out of bounds: ${payloadA.shareOfVoice.yourBrand}`);
    }

    const totalSOV = payloadA.shareOfVoice.yourBrand + payloadA.shareOfVoice.competitors.reduce((acc, c) => acc + c.percentage, 0);
    if (totalSOV !== 100) {
      throw new Error(`Scenario A Failed: Share of voice percentages do not sum to 100, got total: ${totalSOV}`);
    }

    // Verify Sentiment
    if (payloadA.sentimentScore < 0 || payloadA.sentimentScore > 100) {
      throw new Error(`Scenario A Failed: Sentiment index out of bounds: ${payloadA.sentimentScore}`);
    }

    // Verify Query results
    if (payloadA.queryResults.length !== 2) {
      throw new Error(`Scenario A Failed: Expected 2 query results, got ${payloadA.queryResults.length}`);
    }

    // Verify insights
    if (payloadA.actionableInsights.length === 0) {
      throw new Error(`Scenario A Failed: Actionable insights list is empty.`);
    }

    console.log(`  * Success: Generated ${payloadA.queryResults.length} responses. Brand SOV: ${payloadA.shareOfVoice.yourBrand}%. Sentiment score: ${payloadA.sentimentScore}%.`);

    // 2. Scenario B: Tenant Isolation Boundary check (No tenant header)
    console.log("  * Scenario B: Testing Tenant Context boundary check...");
    const reqB = new NextRequest("http://localhost/api/v1/analytics/llm", {
      method: "POST",
      body: JSON.stringify({
        brandName: "خانه خلاق هوش مصنوعی",
        competitorNames: ["دیجی‌کالا"],
        queries: ["تست"]
      }),
    });

    const resB = await POST(reqB);
    const payloadB = (await resB.json()) as { error: string; message: string };

    if (resB.status !== 401) {
      throw new Error(`Scenario B Failed: Expected status 401, got ${resB.status}`);
    }

    if (!payloadB.message.includes("مستأجر")) {
      throw new Error(`Scenario B Failed: Expected tenant authentication warning in Persian, got: ${payloadB.message}`);
    }

    console.log("  * Success: Unauthorized requests blocked correctly.");

    // 3. Scenario C: Missing inputs validation check
    console.log("  * Scenario C: Testing validation failures...");
    const reqC = new NextRequest("http://localhost/api/v1/analytics/llm", {
      method: "POST",
      headers: {
        "x-tenant-id": "org-enterprise-01"
      },
      body: JSON.stringify({
        brandName: "", // invalid empty name
        competitorNames: [],
        queries: []
      }),
    });

    const resC = await POST(reqC);
    const payloadC = (await resC.json()) as { error: string; message: string };

    if (resC.status !== 400) {
      throw new Error(`Scenario C Failed: Expected status 400, got ${resC.status}`);
    }

    console.log("  * Success: Invalid empty inputs validation rejected correctly.");

  } finally {
    // Cleanup if needed
  }

  console.log("✅ LLM Analytics Module Tests Passed Successfully!");
}

// Run directly if called
if (require.main === module) {
  testLlmAnalytics().catch((err) => {
    console.error("❌ LLM Analytics Tests failed:", err);
    process.exit(1);
  });
}
