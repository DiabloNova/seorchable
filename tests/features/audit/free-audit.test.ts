/**
 * Automated Test Suite for Free SEO Audit (Firecrawl Lead Magnet Module)
 * Verifies precise scoring heuristics, Persian quick-tip generation,
 * Grade boundaries, mock-based Firecrawl App scraping,
 * and Server-Side Rate Limits & Usage Quotas.
 */

import { NextRequest } from "next/server";
import { POST, FreeAuditResponse } from "../../../src/app/api/v1/audit/free/route";
import { firecrawlApp } from "../../../src/lib/firecrawl";
import { FreeAuditLimiter, FREE_AUDIT_LIMITS } from "../../../src/services/rate-limit/free-audit-limiter";

export async function testFreeAudit() {
  process.env.NODE_ENV = "test";
  console.log("▶ Running Free SEO Audit Lead Magnet Tests...");

  // Save original scrapeUrl method
  const originalScrapeUrl = firecrawlApp.scrapeUrl;

  try {
    // ----------------------------------------------------
    // 1. Scenario A: Perfect Scrape (Score 100, Grade A)
    // ----------------------------------------------------
    FreeAuditLimiter.resetTestStore();
    console.log("  * Scenario A: Testing Perfect Score (100) & Grade A...");
    (firecrawlApp as any).scrapeUrl = async (url: string, options?: any): Promise<any> => {
      if (!url || !options) return null;
      return {
        success: true,
        markdown: "# Welcome to Optimus AI\nThis is a beautiful page content.",
        metadata: {
          title: "تحلیل پیشرفته سئو معنایی و هوشمندسازی کسب‌وکار آنلاین", // 53 chars
          description: "تحلیل جامع ساختار سئو معنایی، پایش سلامت احساسات برند، استخراج تخصصی گراف دانش و بررسی بهینه‌سازی موتورهای پاسخ‌دهی هوشمند به زبان فارسی انجام می‌گردد.", // 152 chars
          language: "fa",
          robots: "index, follow",
        },
      };
    };

    const reqA = new NextRequest("http://localhost/api/v1/audit/free", {
      method: "POST",
      headers: { "x-forwarded-for": "198.51.100.1" },
      body: JSON.stringify({ url: "https://optimus.ai" }),
    });

    const resA = await POST(reqA);
    const perfectPayload = (await resA.json()) as FreeAuditResponse;

    if (resA.status !== 200) {
      throw new Error(`Scenario A Failed: Expected status 200, got ${resA.status}`);
    }

    if (perfectPayload.score !== 100) {
      throw new Error(`Scenario A Failed: Expected score 100, got ${perfectPayload.score}`);
    }

    if (perfectPayload.grade !== "A") {
      throw new Error(`Scenario A Failed: Expected grade A, got ${perfectPayload.grade}`);
    }

    if (perfectPayload.quickTips.length < 2) {
      throw new Error(`Scenario A Failed: Expected perfect general Pro Tips fallback to be added, got ${perfectPayload.quickTips.length} tips`);
    }

    console.log(`  * Success: Perfect page scored ${perfectPayload.score} with Grade ${perfectPayload.grade} and perfect general Persian tips.`);

    // ----------------------------------------------------
    // 2. Scenario B: Imperfect/Poor Scrape (Missing tags, HTTP, noindex -> score 0, Grade F)
    // ----------------------------------------------------
    FreeAuditLimiter.resetTestStore();
    console.log("  * Scenario B: Testing Poor Score & Grade F...");
    (firecrawlApp as any).scrapeUrl = async (url: string, options?: any): Promise<any> => {
      if (!url || !options) return null;
      return {
        success: true,
        markdown: "No header content at all.",
        metadata: {
          title: "",
          description: "",
          language: "",
          robots: "noindex, nofollow",
        },
      };
    };

    const reqB = new NextRequest("http://localhost/api/v1/audit/free", {
      method: "POST",
      headers: { "x-forwarded-for": "198.51.100.2" },
      body: JSON.stringify({ url: "http://poor-site.com" }),
    });

    const resB = await POST(reqB);
    const poorPayload = (await resB.json()) as FreeAuditResponse;

    if (resB.status !== 200) {
      throw new Error(`Scenario B Failed: Expected status 200, got ${resB.status}`);
    }

    if (poorPayload.score !== 0) {
      throw new Error(`Scenario B Failed: Expected score 0, got ${poorPayload.score}`);
    }

    if (poorPayload.grade !== "F") {
      throw new Error(`Scenario B Failed: Expected grade F, got ${poorPayload.grade}`);
    }

    const { checks } = poorPayload;
    if (checks.hasTitle || checks.hasMetaDescription || checks.hasH1 || checks.isHttps || checks.hasLanguage || checks.isIndexable) {
      throw new Error(`Scenario B Failed: Expected all checks to be false, got ${JSON.stringify(checks)}`);
    }

    const hasTitleTip = (poorPayload.quickTips as Array<{ issue: string; recommendation: string }>).some((tip) => tip.issue.includes("عنوان"));
    const hasMetaTip = (poorPayload.quickTips as Array<{ issue: string; recommendation: string }>).some((tip) => tip.issue.includes("توضیحات"));
    const hasH1Tip = (poorPayload.quickTips as Array<{ issue: string; recommendation: string }>).some((tip) => tip.issue.includes("H1"));
    if (!hasTitleTip || !hasMetaTip || !hasH1Tip) {
      throw new Error(`Scenario B Failed: Expected critical warning tips for Title, Meta Description and H1, got ${JSON.stringify(poorPayload.quickTips)}`);
    }

    console.log(`  * Success: Non-optimized page scored ${poorPayload.score} with Grade ${poorPayload.grade} and custom warning tips.`);

    // ----------------------------------------------------
    // 3. Scenario C: Invalid URL rejection
    // ----------------------------------------------------
    FreeAuditLimiter.resetTestStore();
    console.log("  * Scenario C: Testing Invalid URL rejection...");
    const reqC = new NextRequest("http://localhost/api/v1/audit/free", {
      method: "POST",
      headers: { "x-forwarded-for": "198.51.100.3" },
      body: JSON.stringify({ url: "not-a-valid-url" }),
    });

    const resC = await POST(reqC);
    const badUrlPayload = (await resC.json()) as { error: string; message: string };

    if (resC.status !== 400) {
      throw new Error(`Scenario C Failed: Expected status 400, got ${resC.status}`);
    }

    if (!badUrlPayload.message.includes("لطفاً")) {
      throw new Error(`Scenario C Failed: Expected Persian validation error message, got: ${badUrlPayload.message}`);
    }

    console.log("  * Success: Invalid URL rejected correctly with Persian instructions.");

    // ----------------------------------------------------
    // 4. Scenario D: Rate Limiting & Daily Quota Deterministic Clock Control
    // ----------------------------------------------------
    FreeAuditLimiter.resetTestStore();
    process.env.FIRECRAWL_API_KEY = "fc-real-test-key";
    console.log("  * Scenario D: Testing Short-Window Rate Limits, Daily Quotas & Reset Semantics...");

    let scrapeCalls = 0;
    (firecrawlApp as any).scrapeUrl = async (): Promise<any> => {
      scrapeCalls++;
      return {
        success: true,
        markdown: "# Title\nContent",
        metadata: { title: "Title", description: "Desc", language: "fa", robots: "index" },
      };
    };

    const testClientIp = "203.0.113.100";
    const T0 = 1700000000000; // Fixed base timestamp (ms)

    // Helper to send POST request with simulated clock
    const sendRequestAt = async (nowMs: number) => {
      FreeAuditLimiter.setTestTime(nowMs);
      const req = new NextRequest("http://localhost/api/v1/audit/free", {
        method: "POST",
        headers: { "x-forwarded-for": testClientIp },
        body: JSON.stringify({ url: "https://limiter-test.com" }),
      });
      const routeRes = await POST(req);
      return {
        status: routeRes.status,
        headers: routeRes.headers,
        body: await routeRes.json(),
      };
    };

    // Step D1: Send requests 1 to 5 at T0
    console.log("    - Testing Batch 1 (Requests 1 to 5 at T0)...");
    for (let i = 1; i <= 5; i++) {
      const res = await sendRequestAt(T0);
      if (res.status !== 200) {
        throw new Error(`Scenario D1 Failed: Request ${i} expected 200, got ${res.status}`);
      }
      const remainingHeader = res.headers.get("X-RateLimit-Remaining");
      const expectedRemaining = (5 - i).toString();
      if (remainingHeader !== expectedRemaining) {
        throw new Error(`Scenario D1 Failed: Request ${i} expected X-RateLimit-Remaining ${expectedRemaining}, got ${remainingHeader}`);
      }
    }
    if (scrapeCalls !== 5) {
      throw new Error(`Scenario D1 Failed: Expected 5 scrape calls, got ${scrapeCalls}`);
    }

    // Step D2: 6th request sent immediately at T0 is rejected by short window
    console.log("    - Testing 6th request at T0 (Short-window breach)...");
    const res6 = await sendRequestAt(T0);
    if (res6.status !== 429) {
      throw new Error(`Scenario D2 Failed: Expected 429 for 6th request, got ${res6.status}`);
    }
    if (res6.body.reason !== "rate_limit") {
      throw new Error(`Scenario D2 Failed: Expected reason 'rate_limit', got ${res6.body.reason}`);
    }
    if (res6.headers.get("X-RateLimit-Limit") !== "5") {
      throw new Error(`Scenario D2 Failed: Expected X-RateLimit-Limit 5, got ${res6.headers.get("X-RateLimit-Limit")}`);
    }
    if (res6.headers.get("X-RateLimit-Remaining") !== "0") {
      throw new Error(`Scenario D2 Failed: Expected X-RateLimit-Remaining 0, got ${res6.headers.get("X-RateLimit-Remaining")}`);
    }
    if (res6.headers.get("Retry-After") !== "60") {
      throw new Error(`Scenario D2 Failed: Expected Retry-After 60, got ${res6.headers.get("Retry-After")}`);
    }
    if (scrapeCalls !== 5) {
      throw new Error(`Scenario D2 Failed: Rejected request 6 should NOT call scrape. Scrape calls is ${scrapeCalls}`);
    }

    // Step D3: Advance fake clock by 61 seconds (T0 + 61,000ms) -> Short window resets, daily count stays 5/10
    console.log("    - Testing Batch 2 (Requests 6 to 10 at T0 + 61s)...");
    const T1 = T0 + 61 * 1000;
    for (let i = 6; i <= 10; i++) {
      const res = await sendRequestAt(T1);
      if (res.status !== 200) {
        throw new Error(`Scenario D3 Failed: Request ${i} expected 200, got ${res.status}`);
      }
    }
    if (scrapeCalls !== 10) {
      throw new Error(`Scenario D3 Failed: Expected 10 scrape calls total, got ${scrapeCalls}`);
    }

    // Step D4: Advance fake clock by another 61 seconds (T0 + 122,000ms) -> Short window resets to 0, but daily count is 10/10
    console.log("    - Testing 11th request at T0 + 122s (Daily Quota breach)...");
    const T2 = T0 + 122 * 1000;
    const res11 = await sendRequestAt(T2);

    if (res11.status !== 429) {
      throw new Error(`Scenario D4 Failed: Expected status 429 for 11th request, got ${res11.status}`);
    }
    if (res11.body.reason !== "quota") {
      throw new Error(`Scenario D4 Failed: Expected reason 'quota', got ${res11.body.reason}`);
    }
    if (res11.headers.get("X-RateLimit-Limit") !== "10") {
      throw new Error(`Scenario D4 Failed: Expected X-RateLimit-Limit 10 for daily quota breach, got ${res11.headers.get("X-RateLimit-Limit")}`);
    }
    if (res11.headers.get("X-RateLimit-Remaining") !== "0") {
      throw new Error(`Scenario D4 Failed: Expected X-RateLimit-Remaining 0, got ${res11.headers.get("X-RateLimit-Remaining")}`);
    }

    // Verify resetAt and Retry-After reflect daily window reset (T0 + 24 hours = T0 + 86,400,000ms)
    const expectedDailyResetSec = Math.floor((T0 + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS) / 1000);
    const actualResetSec = Number(res11.headers.get("X-RateLimit-Reset"));
    if (actualResetSec !== expectedDailyResetSec) {
      throw new Error(`Scenario D4 Failed: Expected X-RateLimit-Reset ${expectedDailyResetSec}, got ${actualResetSec}`);
    }

    const expectedRetryAfterSec = Math.ceil((T0 + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS - T2) / 1000);
    const actualRetryAfterSec = Number(res11.headers.get("Retry-After"));
    if (actualRetryAfterSec !== expectedRetryAfterSec) {
      throw new Error(`Scenario D4 Failed: Expected Retry-After ${expectedRetryAfterSec}, got ${actualRetryAfterSec}`);
    }

    if (scrapeCalls !== 10) {
      throw new Error(`Scenario D4 Failed: Rejected 11th request should NOT call scrape. Scrape calls is ${scrapeCalls}`);
    }

    // Step D5: Advance fake clock by 24 hours + 1 second (T0 + 86,401,000ms) -> Daily quota resets to 0
    console.log("    - Testing 12th request after 24h reset (T0 + 24h + 1s)...");
    const T3 = T0 + FREE_AUDIT_LIMITS.DAILY_WINDOW_MS + 1000;
    const res12 = await sendRequestAt(T3);

    if (res12.status !== 200) {
      throw new Error(`Scenario D5 Failed: Request 12 expected 200 after 24h reset, got ${res12.status}`);
    }
    if (scrapeCalls !== 11) {
      throw new Error(`Scenario D5 Failed: Expected 11 scrape calls total after 12th request, got ${scrapeCalls}`);
    }

    console.log("  * Success: Short-window rate limit, daily quota enforcement, reset headers & deterministic clock control verified.");

  } finally {
    // Restore original scrape implementation
    firecrawlApp.scrapeUrl = originalScrapeUrl;
  }

  console.log("✅ Free SEO Audit Lead Magnet Tests Passed Successfully!");
}

// Run directly if called
if (require.main === module) {
  testFreeAudit().catch((err) => {
    console.error("❌ Free SEO Audit Tests failed:", err);
    process.exit(1);
  });
}
