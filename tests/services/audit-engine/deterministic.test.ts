import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { calculateAuditScores } from "../../../src/lib/audit-engine/scorer";
import { RawCrawlData } from "../../../src/types/audit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testDeterministicSensitivity() {
  console.log("▶ Running Deterministic Score Sensitivity Tests...");

  const baseCrawl: RawCrawlData = {
    url: "https://seorchable.ir",
    html: `
      <!DOCTYPE html>
      <html lang="fa">
      <head>
        <title>تحلیل پیشرفته سئو معنایی و هوشمندسازی کسب‌وکار آنلاین</title>
        <meta name="description" content="تحلیل جامع ساختار سئو معنایی، پایش سلامت احساسات برند، استخراج تخصصی گراف دانش و بررسی بهینه‌سازی موتورهای پاسخ‌دهی هوشمند به زبان فارسی انجام می‌گردد.">
        <link rel="canonical" href="https://seorchable.ir" />
        <meta property="og:title" content="تحلیل پیشرفته سئو معنایی" />
        <meta property="og:description" content="تحلیل جامع ساختار سئو معنایی" />
        <meta name="twitter:title" content="تحلیل پیشرفته سئو" />
        <meta name="twitter:description" content="تحلیل جامع ساختار سئو" />
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "seorchable.ir"
          }
        </script>
      </head>
      <body>
        <h1>بهترین ابزار سئو معنایی</h1>
        <h2>موتور مانیتورینگ برند و بهینه‌سازی GEO</h2>
        <p>seorchable is the best tool. سئورچبل بهترین ابزار بهینه‌سازی است. این برند امنیت بالایی دارد.</p>
        <img src="optimized-image.webp" alt="لوگو سئورچبل" />
        <a href="/docs/knowledge-graph">مستندات ما</a>
        <a href="https://google.com">گوگل</a>
        <a href="/contact">تماس با ما</a>
      </body>
      </html>
    `,
    headers: {
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "Content-Security-Policy": "default-src 'self'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY"
    },
    robotsTxt: {
      available: true,
      content: "User-agent: *\nDisallow: /admin"
    },
    sitemap: {
      available: true,
      content: "<urlset><url><loc>https://seorchable.ir/</loc></url></urlset>"
    }
  };

  // 1. Calculate base highly-optimized scores
  const baseFeatures = extractAuditFeatures(baseCrawl);
  const baseScores = calculateAuditScores(baseFeatures);

  // 2. Simulate removing critical security/SEO elements (HTTPS and Title tag)
  const weakCrawl: RawCrawlData = {
    ...baseCrawl,
    url: "http://seorchable.ir", // non-HTTPS
    html: baseCrawl.html?.replace("<title>", "<!--").replace("</title>", "-->"), // remove title
    headers: {} // remove security headers
  };

  const weakFeatures = extractAuditFeatures(weakCrawl);
  const weakScores = calculateAuditScores(weakFeatures);

  // Assert Technical Score is measurably lower due to removed indicators
  assert(weakScores.technical.score < baseScores.technical.score, "Technical score must decline when SSL and Title are missing");

  // 3. Simulate removing structured schema context
  const nonSchemaCrawl: RawCrawlData = {
    ...baseCrawl,
    html: baseCrawl.html?.replace('type="application/ld+json"', 'type="text/plain"') // break JSON-LD scripts
  };

  const nonSchemaFeatures = extractAuditFeatures(nonSchemaCrawl);
  const nonSchemaScores = calculateAuditScores(nonSchemaFeatures);

  // Assert AEO score drops significantly when structured metadata is broken
  assert(nonSchemaScores.aeo.score < baseScores.aeo.score, "AEO score must drop when JSON-LD is missing/broken");

  console.log("✓ Deterministic Score Sensitivity Tests Passed.");
}

if (require.main === module) {
  testDeterministicSensitivity().catch(err => {
    console.error("❌ Test Failures:", err);
    process.exit(1);
  });
}
