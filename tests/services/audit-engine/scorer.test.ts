import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { calculateAuditScores } from "../../../src/lib/audit-engine/scorer";
import { RawCrawlData } from "../../../src/types/audit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testDeterministicScorer() {
  console.log("▶ Running Deterministic Scoring Engine Tests...");

  // Ingest perfect crawl mock
  const richData: RawCrawlData = {
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

  const features = extractAuditFeatures(richData);

  // Run scoring twice on identical features to verify determinism
  const scoresRun1 = calculateAuditScores(features);
  const scoresRun2 = calculateAuditScores(features);

  // Verification 1: Absolute Determinism
  assert(scoresRun1.overall.score === scoresRun2.overall.score, "Scores must be identical between runs");
  assert(scoresRun1.technical.score === scoresRun2.technical.score, "Technical scores must be identical");
  assert(scoresRun1.content.score === scoresRun2.content.score, "Content scores must be identical");
  assert(scoresRun1.aeo.score === scoresRun2.aeo.score, "AEO scores must be identical");
  assert(scoresRun1.llmReadiness.score === scoresRun2.llmReadiness.score, "LLM scores must be identical");

  // Verification 2: Weighted Formula bounds [0, 100]
  assert(scoresRun1.overall.score >= 0 && scoresRun1.overall.score <= 100, "Overall score must be bounded in [0, 100]");
  assert(scoresRun1.technical.score >= 0 && scoresRun1.technical.score <= 100, "Technical score must be bounded in [0, 100]");

  // Verification 3: Exposes transparent contributor arrays
  assert(scoresRun1.technical.contributors.length > 0, "Technical contributors must be listed");
  assert(scoresRun1.overall.contributors.length === 5, "Overall contributors must expose top 5 impactful factors");

  // Ensure factors contain readable labels and descriptions
  scoresRun1.technical.contributors.forEach(c => {
    assert(c.factor.length > 0, "Contributor factor name must be non-empty");
    assert(c.description.length > 0, "Contributor description must be non-empty");
  });

  console.log("✅ All Deterministic Scoring Engine Tests Passed Successfully!");
}

if (require.main === module) {
  testDeterministicScorer().catch(err => {
    console.error("❌ Scorer Tests Failed:", err);
    process.exit(1);
  });
}
