import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { CrawlerOrchestrator } from "@/services/crawler/crawler-orchestrator";
import { authorizeApiRequest, AuthorizationError } from "@/services/auth/authorization";
import { isSafeUrlAsync } from "@/services/crawler/url-validator";

// Request body validation schema
const requestSchema = z.object({
  seedUrls: z
    .array(z.string().url("Each seed URL must be a valid URL"))
    .min(1, "At least one seed URL is required"),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate and extract identity securely
    const identity = await authorizeApiRequest(req);
    const { tenantId, userId } = identity;

    // 2. Extract request ID from request headers
    const requestId = req.headers.get("x-request-id") || randomUUID();

    // 3. Parse and validate JSON request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid JSON body structure." },
        { status: 400 }
      );
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad Request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { seedUrls } = parsed.data;

    // Validate SSRF safely with async DNS resolution
    for (const url of seedUrls) {
      const isSafe = await isSafeUrlAsync(url);
      if (!isSafe) {
         return NextResponse.json(
           { error: "Bad Request", message: `URL ${url} is not allowed. Unsafe SSRF targets are blocked.` },
           { status: 400 }
         );
      }
    }

    // 4. Initialize the Crawler Orchestrator and run the campaign
    const orchestrator = new CrawlerOrchestrator();
    const result = await orchestrator.runCrawlerCampaign(
      seedUrls,
      tenantId,
      userId,
      requestId
    );

    // 5. Return success result with status 200 OK
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: "Unauthorized", message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API Crawler Campaign Start Route Error]:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
