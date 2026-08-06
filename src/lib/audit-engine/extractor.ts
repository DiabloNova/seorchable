import * as cheerio from "cheerio";
import { RawCrawlData, NormalizedAuditFeatures } from "@/types/audit";

/**
 * Feature Extraction Engine for BrandGraph.
 * Defensive, high-fidelity extractor parsing RawCrawlData into NormalizedAuditFeatures.
 * Guarantees zero crashes and populates sensible default/fallback values on partial crawlbills.
 */
export function extractAuditFeatures(raw: RawCrawlData): NormalizedAuditFeatures {
  const warnings: string[] = [];
  const url = raw.url || "";

  if (!url) {
    warnings.push("Requested scan URL is empty or undefined.");
  }

  const html = raw.html || "";
  const markdown = raw.markdown || "";
  const metadata = raw.metadata || {};
  const headers = raw.headers || {};

  // 1. Initialise Cheerio Defensively
  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(html);
  } catch (err: any) {
    warnings.push(`Cheerio HTML parser initialization failed: ${err.message || String(err)}`);
    $ = cheerio.load("");
  }

  // --- Technical SEO Signals ---

  // Title Tags
  const titleTag = $("title").text().trim();
  const metaTitle = metadata.title || "";
  const finalTitle = titleTag || metaTitle || "";
  const titlePresent = finalTitle.length > 0;
  const titleLen = finalTitle.length;

  let titleQuality: "good" | "too_short" | "too_long" | "missing" | "excellent" = "missing";
  if (!titlePresent) {
    titleQuality = "missing";
    warnings.push("Title meta tag is completely missing from the crawl data.");
  } else if (titleLen < 40) {
    titleQuality = "too_short";
  } else if (titleLen > 65) {
    titleQuality = "too_long";
  } else if (titleLen >= 50 && titleLen <= 60) {
    titleQuality = "excellent";
  } else {
    titleQuality = "good";
  }

  // Meta Description
  const metaDescAttr = $('meta[name="description"]').attr("content")?.trim() ||
                        $('meta[property="og:description"]').attr("content")?.trim() || "";
  const metadataDesc = metadata.description || "";
  const finalDesc = metaDescAttr || metadataDesc || "";
  const descPresent = finalDesc.length > 0;

  // Canonical
  const canonicalAttr = $('link[rel="canonical"]').attr("href")?.trim() || "";
  const metadataCanonical = metadata.canonical || "";
  const finalCanonical = canonicalAttr || metadataCanonical || "";
  const canonicalPresent = finalCanonical.length > 0;

  const matchesRequestedUrl = canonicalPresent &&
    (finalCanonical.replace(/\/$/, "").toLowerCase() === url.replace(/\/$/, "").toLowerCase());

  const isCorrectCanonical = canonicalPresent &&
    (finalCanonical.startsWith("http://") || finalCanonical.startsWith("https://"));

  // Robots.txt & Sitemap
  const robotsAvailable = raw.robotsTxt?.available ?? false;
  const robotsTxtContent = raw.robotsTxt?.content || "";
  const robotsDirectivesPresent = robotsTxtContent.toLowerCase().includes("user-agent:") ||
                                  robotsTxtContent.toLowerCase().includes("disallow:");

  const sitemapAvailable = raw.sitemap?.available ?? false;
  const sitemapContent = raw.sitemap?.content || "";
  const sitemapUrlsPresent = sitemapContent.toLowerCase().includes("<loc>") ||
                             sitemapContent.toLowerCase().includes("http");

  // Open Graph & Twitter
  const ogTitle = $('meta[property="og:title"]').attr("content") || metadata.ogTitle || "";
  const ogDesc = $('meta[property="og:description"]').attr("content") || metadata.ogDescription || "";
  const ogTitlePresent = ogTitle.length > 0;
  const ogDescriptionPresent = ogDesc.length > 0;
  const ogComplete = ogTitlePresent && ogDescriptionPresent;

  const twTitle = $('meta[name="twitter:title"]').attr("content") || metadata.twitterTitle || "";
  const twDesc = $('meta[name="twitter:description"]').attr("content") || metadata.twitterDescription || "";
  const twitterTitlePresent = twTitle.length > 0;
  const twitterDescriptionPresent = twDesc.length > 0;
  const twComplete = twitterTitlePresent && twitterDescriptionPresent;

  // Security Headers
  const httpsEnforced = url.toLowerCase().startsWith("https://");

  // Normalize headers keys to lowercase
  const normHeaders: Record<string, string> = {};
  Object.keys(headers).forEach(k => {
    normHeaders[k.toLowerCase()] = String(headers[k]);
  });

  const hstsPresent = !!normHeaders["strict-transport-security"];
  const cspPresent = !!normHeaders["content-security-policy"];
  const xContentTypeOptionsPresent = !!normHeaders["x-content-type-options"];
  const xFrameOptionsPresent = !!normHeaders["x-frame-options"];

  // Image Optimization
  const imgs = $("img");
  const imgCount = imgs.length;
  let missingAltCount = 0;
  imgs.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") {
      missingAltCount++;
    }
  });
  const missingAltRatio = imgCount > 0 ? missingAltCount / imgCount : 0;
  // Heuristic: check if image filename contains common optimization suffixes or uses modern webp/svg extensions
  let optimizedFlagsCount = 0;
  imgs.each((_, el) => {
    const src = $(el).attr("src") || "";
    if (src.endsWith(".webp") || src.endsWith(".svg") || src.includes("opt-") || src.includes("optimized")) {
      optimizedFlagsCount++;
    }
  });
  const optimizedFlags = imgCount > 0 ? (optimizedFlagsCount / imgCount) > 0.5 : false;

  // Link Ratios
  let internalCount = 0;
  let externalCount = 0;
  let brokenIndicator = false;

  // Parse host for internal matching
  let host = "";
  try {
    if (url) host = new URL(url).hostname;
  } catch (_) {}

  $("a").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.trim() === "" || href.startsWith("javascript:") || href === "#") {
      brokenIndicator = true;
      return;
    }
    if (href.startsWith("/") || href.startsWith("./") || href.startsWith("../") || (host && href.includes(host))) {
      internalCount++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      externalCount++;
    }
  });

  const totalLinks = internalCount + externalCount;
  const internalRatio = totalLinks > 0 ? internalCount / totalLinks : 0;
  const externalRatio = totalLinks > 0 ? externalCount / totalLinks : 0;

  // --- Content & Readability Signals ---

  // Word Count & Code Ratio
  const bodyText = $("body").text() || markdown || "";
  const cleanedText = bodyText.replace(/\s+/g, " ").trim();
  const wordCount = cleanedText === "" ? 0 : cleanedText.split(" ").length;

  const totalHtmlLength = html.length;
  const contentToCodeRatio = totalHtmlLength > 0 ? bodyText.length / totalHtmlLength : 0;

  // Heading hierarchy
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const hierarchyComplete = h1Count === 1 && (h2Count > 0 || h3Count === 0);

  // Readability proxy
  const paragraphs = $("p");
  const paragraphCount = paragraphs.length;
  let totalParagraphWords = 0;
  paragraphs.each((_, el) => {
    const txt = $(el).text().trim().replace(/\s+/g, " ");
    if (txt) totalParagraphWords += txt.split(" ").length;
  });
  const avgParagraphLength = paragraphCount > 0 ? totalParagraphWords / paragraphCount : 0;
  const density = wordCount > 0 ? paragraphCount / wordCount : 0;

  // Simple readability index scaled 0-100 (Proxy Flesch formula)
  let readabilityScore = 50; // default
  if (wordCount > 0 && paragraphCount > 0) {
    const avgWordsPerSentence = wordCount / (paragraphCount * 3); // mock proxy for sentences
    readabilityScore = Math.max(0, Math.min(100, Math.round(100 - (avgWordsPerSentence * 1.5))));
  }

  // EEAT Signals
  // Heuristic matching in footer, sidebar, about text, etc.
  const authorTags = $('[class*="author"], [id*="author"], [rel="author"]').length > 0 ||
                     bodyText.toLowerCase().includes("written by") ||
                     bodyText.includes("نویسنده");
  const publisherTags = $('[class*="publisher"], [id*="publisher"], [class*="copyright"]').length > 0 ||
                        bodyText.toLowerCase().includes("copyright") ||
                        bodyText.includes("حقوق محفوظ");
  const contactTags = $('[href*="contact"], [class*="contact"], [id*="contact"]').length > 0 ||
                      bodyText.toLowerCase().includes("contact us") ||
                      bodyText.includes("تماس با ما") ||
                      bodyText.includes("تلفن");

  let trustSignalsScore = 0;
  if (authorTags) trustSignalsScore += 30;
  if (publisherTags) trustSignalsScore += 35;
  if (contactTags) trustSignalsScore += 35;

  // --- AEO & Schema Signals ---

  let jsonLdDetected = false;
  let parsedJsonLdCount = 0;
  const schemaTypes: string[] = [];

  const scriptJsonLds = $('script[type="application/ld+json"]');
  if (scriptJsonLds.length > 0) {
    jsonLdDetected = true;
    scriptJsonLds.each((_, el) => {
      try {
        const text = $(el).html();
        if (text) {
          const parsed = JSON.parse(text);
          parsedJsonLdCount++;

          // Deep inspect schema objects to extract @type recursively
          const inspectTypes = (obj: any) => {
            if (!obj || typeof obj !== "object") return;
            if (Array.isArray(obj)) {
              obj.forEach(inspectTypes);
              return;
            }
            if (obj["@type"]) {
              schemaTypes.push(String(obj["@type"]));
            }
            Object.keys(obj).forEach(k => {
              if (typeof obj[k] === "object") inspectTypes(obj[k]);
            });
          };

          inspectTypes(parsed);
        }
      } catch (e) {
        // Safe catch for parsing errors of individual JSON-LD script blocks
        warnings.push("A JSON-LD schema block contains malformed or unparseable JSON.");
      }
    });
  }

  const faqSchemaPresent = schemaTypes.some(t => t.toLowerCase() === "faqpage" || t.toLowerCase() === "question");
  const orgSchemaPresent = schemaTypes.some(t => t.toLowerCase() === "organization" || t.toLowerCase() === "brand");
  const articleSchemaPresent = schemaTypes.some(t => t.toLowerCase() === "article" || t.toLowerCase() === "blogposting");
  const productSchemaPresent = schemaTypes.some(t => t.toLowerCase() === "product");

  // Heuristic scores
  let knowledgeGraphReadiness = 10; // baseline
  if (jsonLdDetected) knowledgeGraphReadiness += 30;
  if (orgSchemaPresent) knowledgeGraphReadiness += 30;
  if (schemaTypes.length > 3) knowledgeGraphReadiness += 30;
  knowledgeGraphReadiness = Math.min(100, knowledgeGraphReadiness);

  let citationReadiness = 10; // baseline
  if (canonicalPresent && matchesRequestedUrl) citationReadiness += 30;
  if (h1Count === 1) citationReadiness += 20;
  if (internalCount > 5) citationReadiness += 20;
  if (externalCount > 2) citationReadiness += 20;
  citationReadiness = Math.min(100, citationReadiness);

  // --- LLM Readiness Signals ---

  // Infer target brand from the URL hostname
  let brandKeyword = "brand";
  if (host) {
    const parts = host.replace("www.", "").split(".");
    if (parts[0]) brandKeyword = parts[0];
  }

  // Brand Mentions
  const regexBrand = new RegExp(`\\b${brandKeyword}\\b`, "gi");
  const brandMentionCount = (bodyText.match(regexBrand) || []).length;
  const brandMentionDensity = wordCount > 0 ? brandMentionCount / wordCount : 0;

  // Topic Coverage & Semantic density
  const categories: string[] = [];
  const textLower = bodyText.toLowerCase();

  // Basic categorization rules
  if (textLower.includes("pricing") || textLower.includes("تعرفه") || textLower.includes("خرید")) categories.push("Commercial");
  if (textLower.includes("api") || textLower.includes("developer") || textLower.includes("کد")) categories.push("Technical / Developer");
  if (textLower.includes("about") || textLower.includes("درباره") || textLower.includes("تیم")) categories.push("Corporate Background");
  if (textLower.includes("security") || textLower.includes("امنیت") || textLower.includes("حفاظت")) categories.push("Information Security");

  let topicCoverageScore = categories.length * 25;
  topicCoverageScore = Math.min(100, Math.max(10, topicCoverageScore));

  let semanticCompletenessScore = 15; // baseline
  if (wordCount > 600) semanticCompletenessScore += 30;
  if (h1Count > 0 && h2Count > 1) semanticCompletenessScore += 25;
  if (topicCoverageScore > 50) semanticCompletenessScore += 30;
  semanticCompletenessScore = Math.min(100, semanticCompletenessScore);

  const entityDensity = wordCount > 0 ? Math.min(2.5, (h1Count + h2Count + h3Count + schemaTypes.length + 1) / (wordCount / 100)) : 0;

  return {
    url,
    warnings,
    technical: {
      title: {
        present: titlePresent,
        length: titleLen,
        quality: titleQuality,
        value: finalTitle
      },
      metaDescription: {
        present: descPresent,
        length: finalDesc.length,
        value: finalDesc
      },
      canonical: {
        present: canonicalPresent,
        correct: isCorrectCanonical,
        matchesRequestedUrl,
        value: finalCanonical
      },
      robotsTxt: {
        available: robotsAvailable,
        hasDirectives: robotsDirectivesPresent
      },
      sitemap: {
        available: sitemapAvailable,
        hasUrls: sitemapUrlsPresent
      },
      openGraph: {
        complete: ogComplete,
        ogTitlePresent,
        ogDescriptionPresent
      },
      twitterCards: {
        complete: twComplete,
        twitterTitlePresent,
        twitterDescriptionPresent
      },
      security: {
        httpsEnforced,
        hstsPresent,
        cspPresent,
        xContentTypeOptionsPresent,
        xFrameOptionsPresent
      },
      images: {
        count: imgCount,
        missingAltCount,
        missingAltRatio,
        optimizedFlags
      },
      links: {
        internalCount,
        externalCount,
        internalRatio,
        externalRatio,
        brokenIndicator
      }
    },
    content: {
      wordCount,
      contentToCodeRatio,
      headings: {
        h1Count,
        h2Count,
        h3Count,
        hierarchyComplete
      },
      readability: {
        score: readabilityScore,
        paragraphCount,
        avgParagraphLength,
        density
      },
      eeat: {
        hasAuthorInfo: authorTags,
        hasPublisherInfo: publisherTags,
        hasContactInfo: contactTags,
        trustSignalsScore
      }
    },
    aeo: {
      jsonLdDetected,
      parsedJsonLdCount,
      schemaTypes,
      faqSchema: {
        present: faqSchemaPresent,
        itemCount: faqSchemaPresent ? schemaTypes.filter(t => t.toLowerCase() === "question").length || 1 : 0
      },
      orgSchemaPresent,
      articleSchemaPresent,
      productSchemaPresent,
      knowledgeGraphReadiness,
      citationReadiness
    },
    llmReadiness: {
      entityDensity,
      brandMentionCount,
      brandMentionDensity,
      semanticCompletenessScore,
      topicCoverageMetrics: {
        categories,
        score: topicCoverageScore
      }
    }
  };
}
