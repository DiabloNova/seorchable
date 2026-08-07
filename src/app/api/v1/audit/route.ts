import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeAndValidateUrl } from "@/lib/audit-engine/url-normalizer";
import { verifyUrlSafety } from "@/lib/audit-engine/security";
import { executeCrawl } from "@/lib/audit-engine/crawler";
import { extractAuditFeatures } from "@/lib/audit-engine/extractor";
import { calculateAuditScores } from "@/lib/audit-engine/scorer";
import { generateRecommendations } from "@/lib/audit-engine/recommendation";
import { UnifiedAuditResponse } from "@/types/audit";

// Request Validator Schema
const requestSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

// Response Schema Validator (Zod) to ensure runtime type safety and schema contracts
const responseValidator = z.object({
  url: z.string(),
  normalizedUrl: z.string(),
  timestamp: z.string(),
  features: z.object({
    url: z.string(),
    warnings: z.array(z.string()),
    technical: z.object({
      title: z.object({
        present: z.boolean(),
        length: z.number(),
        quality: z.enum(["good", "too_short", "too_long", "missing", "excellent"]),
        value: z.string(),
      }),
      metaDescription: z.object({
        present: z.boolean(),
        length: z.number(),
        value: z.string(),
      }),
      canonical: z.object({
        present: z.boolean(),
        correct: z.boolean(),
        matchesRequestedUrl: z.boolean(),
        value: z.string(),
      }),
      robotsTxt: z.object({
        available: z.boolean(),
        hasDirectives: z.boolean(),
      }),
      sitemap: z.object({
        available: z.boolean(),
        hasUrls: z.boolean(),
      }),
      openGraph: z.object({
        complete: z.boolean(),
        ogTitlePresent: z.boolean(),
        ogDescriptionPresent: z.boolean(),
      }),
      twitterCards: z.object({
        complete: z.boolean(),
        twitterTitlePresent: z.boolean(),
        twitterDescriptionPresent: z.boolean(),
      }),
      security: z.object({
        httpsEnforced: z.boolean(),
        hstsPresent: z.boolean(),
        cspPresent: z.boolean(),
        xContentTypeOptionsPresent: z.boolean(),
        xFrameOptionsPresent: z.boolean(),
      }),
      images: z.object({
        count: z.number(),
        missingAltCount: z.number(),
        missingAltRatio: z.number(),
        optimizedFlags: z.boolean(),
      }),
      links: z.object({
        internalCount: z.number(),
        externalCount: z.number(),
        internalRatio: z.number(),
        externalRatio: z.number(),
        brokenIndicator: z.boolean(),
      }),
    }),
    content: z.object({
      wordCount: z.number(),
      contentToCodeRatio: z.number(),
      headings: z.object({
        h1Count: z.number(),
        h2Count: z.number(),
        h3Count: z.number(),
        hierarchyComplete: z.boolean(),
      }),
      readability: z.object({
        score: z.number(),
        paragraphCount: z.number(),
        avgParagraphLength: z.number(),
        density: z.number(),
      }),
      eeat: z.object({
        hasAuthorInfo: z.boolean(),
        hasPublisherInfo: z.boolean(),
        hasContactInfo: z.boolean(),
        trustSignalsScore: z.number(),
      }),
    }),
    aeo: z.object({
      jsonLdDetected: z.boolean(),
      parsedJsonLdCount: z.number(),
      schemaTypes: z.array(z.string()),
      faqSchema: z.object({
        present: z.boolean(),
        itemCount: z.number(),
      }),
      orgSchemaPresent: z.boolean(),
      articleSchemaPresent: z.boolean(),
      productSchemaPresent: z.boolean(),
      knowledgeGraphReadiness: z.number(),
      citationReadiness: z.number(),
    }),
    llmReadiness: z.object({
      entityDensity: z.number(),
      brandMentionCount: z.number(),
      brandMentionDensity: z.number(),
      semanticCompletenessScore: z.number(),
      topicCoverageMetrics: z.object({
        categories: z.array(z.string()),
        score: z.number(),
      }),
    }),
  }),
  scores: z.object({
    technical: z.object({
      score: z.number(),
      contributors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        description: z.string(),
      })),
    }),
    content: z.object({
      score: z.number(),
      contributors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        description: z.string(),
      })),
    }),
    aeo: z.object({
      score: z.number(),
      contributors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        description: z.string(),
      })),
    }),
    llmReadiness: z.object({
      score: z.number(),
      contributors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        description: z.string(),
      })),
    }),
    overall: z.object({
      score: z.number(),
      contributors: z.array(z.object({
        factor: z.string(),
        impact: z.number(),
        description: z.string(),
      })),
    }),
  }),
  recommendations: z.array(z.object({
    issue: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    module: z.enum([
      "AEO Insights",
      "LLM Analytics",
      "Prompt Intelligence",
      "Content Studio",
      "Technical Optimisation",
      "AI Shopping",
      "MCP",
      "Agent"
    ]),
    action: z.string(),
    impactDescription: z.string(),
  })),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Extract Input URL from Request Payload
    const body = await req.json().catch(() => ({}));
    const requestParsed = requestSchema.safeParse(body);

    if (!requestParsed.success) {
      return NextResponse.json(
        { error: "Bad Request", message: requestParsed.error.issues[0]?.message || "URL parameter is missing or empty." },
        { status: 400 }
      );
    }

    const { url } = requestParsed.data;

    // 2. Normalize and Validate URL
    const normalizedUrl = normalizeAndValidateUrl(url);
    if (!normalizedUrl) {
      return NextResponse.json(
        { error: "Malformed URL", message: "The provided URL is invalid or has an unsupported protocol. Please use a valid HTTP/HTTPS absolute link." },
        { status: 400 }
      );
    }

    // 3. Safety Verification & SSRF Checks
    const safetyCheck = verifyUrlSafety(normalizedUrl);
    if (!safetyCheck.safe) {
      return NextResponse.json(
        { error: "Forbidden URL Target", message: safetyCheck.reason || "The target URL hostname resolves to a protected local or loopback range (SSRF Guard)." },
        { status: 403 }
      );
    }

    // 4. Secure Crawling Sequence
    let rawCrawlData;
    try {
      rawCrawlData = await executeCrawl(normalizedUrl);
    } catch (crawlErr: any) {
      console.error("[Crawl Phase Failure]:", crawlErr);
      return NextResponse.json(
        { error: "Ingestion Failure", message: crawlErr.message || "An error occurred during site crawler retrieval. Please verify site accessibility." },
        { status: 422 }
      );
    }

    // 5. Feature Extraction
    const features = extractAuditFeatures(rawCrawlData);

    // 6. Score Mapping
    const scores = calculateAuditScores(features);

    // 7. Actionable Recommendations Generation
    const recommendations = generateRecommendations(features, scores);

    // 8. Construct Final Payload
    const responsePayload: UnifiedAuditResponse = {
      url,
      normalizedUrl,
      timestamp: new Date().toISOString(),
      features,
      scores,
      recommendations
    };

    // 9. Runtime Schema Validation
    const runtimeParsed = responseValidator.safeParse(responsePayload);
    if (!runtimeParsed.success) {
      console.error("[Response Runtime Schema Validation Error]:", runtimeParsed.error.format());
      return NextResponse.json(
        { error: "Response Contract Violation", message: "Calculated audit payload broke internal schema contracts." },
        { status: 500 }
      );
    }

    // 10. Return Structured Audit Payload with Success 200
    return NextResponse.json(runtimeParsed.data);

  } catch (error: any) {
    console.error("[Unified API execution crash handler]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "An unexpected error occurred during pipeline execution." },
      { status: 500 }
    );
  }
}
