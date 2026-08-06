import { extractAuditFeatures } from "../../../src/lib/audit-engine/extractor";
import { RawCrawlData } from "../../../src/types/audit";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testFeatureExtractor() {
  console.log("▶ Running Feature Extraction Engine Tests...");

  // Test 1: Complete and rich crawl data
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

  assert(features.url === "https://seorchable.ir", "URL should be seorchable.ir");
  assert(features.warnings.length === 0, "There should be no warnings for complete data");
  assert(features.technical.title.present === true, "Title should be present");
  assert(features.technical.title.length === 53, "Title length should be 53");
  assert(features.technical.title.quality === "excellent", "Title quality should be excellent");
  assert(features.technical.metaDescription.present === true, "Meta description should be present");
  assert(features.technical.canonical.present === true, "Canonical should be present");
  assert(features.technical.canonical.matchesRequestedUrl === true, "Canonical should match requested URL");
  assert(features.technical.robotsTxt.available === true, "Robots.txt available should be true");
  assert(features.technical.robotsTxt.hasDirectives === true, "Robots.txt should have directives");
  assert(features.technical.sitemap.available === true, "Sitemap available should be true");
  assert(features.technical.sitemap.hasUrls === true, "Sitemap should have URLs");
  expectOgAndTwitter(features);
  expectSecurityAndImages(features);
  expectContentAndAeo(features);

  // Test 2: Malformed or sparse data
  const sparseData: RawCrawlData = {
    url: "http://malformed-site.ir",
    html: "Unparseable malformed HTML script block <script> {",
    metadata: {}
  };

  const sparseFeatures = extractAuditFeatures(sparseData);

  assert(sparseFeatures.url === "http://malformed-site.ir", "URL should match raw url");
  assert(sparseFeatures.warnings.length > 0, "Malformed script should trigger warnings");
  assert(sparseFeatures.technical.title.present === false, "Title should be missing");
  assert(sparseFeatures.technical.title.quality === "missing", "Title quality should be missing");
  assert(sparseFeatures.technical.security.httpsEnforced === false, "HTTP url should not enforce HTTPS");
  assert(sparseFeatures.technical.security.cspPresent === false, "CSP should be missing");
  assert(sparseFeatures.technical.images.count === 0, "No images should be present");
  assert(sparseFeatures.technical.links.internalCount === 0, "No internal links should be present");
  assert(sparseFeatures.aeo.jsonLdDetected === false, "No JSON-LD should be detected");
  assert(sparseFeatures.llmReadiness.brandMentionCount === 0, "No brand mentions should be present");

  console.log("✅ All Feature Extraction Engine Tests Passed Successfully!");
}

function expectOgAndTwitter(features: any) {
  assert(features.technical.openGraph.complete === true, "OG should be complete");
  assert(features.technical.twitterCards.complete === true, "Twitter Cards should be complete");
}

function expectSecurityAndImages(features: any) {
  assert(features.technical.security.httpsEnforced === true, "HTTPS should be enforced");
  assert(features.technical.security.hstsPresent === true, "HSTS should be present");
  assert(features.technical.security.cspPresent === true, "CSP should be present");
  assert(features.technical.images.count === 1, "There should be 1 image");
  assert(features.technical.images.missingAltCount === 0, "There should be 0 missing alt tags");
  assert(features.technical.links.internalCount === 2, "There should be 2 internal links");
  assert(features.technical.links.externalCount === 1, "There should be 1 external link");
}

function expectContentAndAeo(features: any) {
  assert(features.content.headings.h1Count === 1, "There should be 1 H1");
  assert(features.content.headings.h2Count === 1, "There should be 1 H2");
  assert(features.content.headings.hierarchyComplete === true, "Heading hierarchy should be complete");
  assert(features.content.eeat.hasContactInfo === true, "EEAT contact info should be detected");
  assert(features.aeo.jsonLdDetected === true, "JSON-LD should be detected");
  assert(features.aeo.parsedJsonLdCount === 1, "JSON-LD count should be 1");
  assert(features.aeo.orgSchemaPresent === true, "Organization schema should be present");
  assert(features.llmReadiness.brandMentionCount > 0, "Brand mentions count should be positive");
}

// Inline runner so it can be run standalone
if (require.main === module) {
  testFeatureExtractor().catch(err => {
    console.error("❌ Tests Failed:", err);
    process.exit(1);
  });
}
