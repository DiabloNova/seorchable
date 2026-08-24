import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerQuestion } from "@/services/rag/query-service";
import { TenantContextManager } from "@/core/database/tenant-context";
import { authorizeApiRequest } from "@/services/auth/authorization";

// Input validation schema
const requestSchema = z.object({
  question: z.string().min(1, "Question must be provided"),
  limit: z.number().int().positive().optional().default(5),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authoritative API identity resolution (session overrides client headers)
    let userId: string;
    let tenantId: string;
    try {
      const auth = await authorizeApiRequest(req);
      userId = auth.userId;
      tenantId = auth.tenantId;
    } catch (err: unknown) {
      const errorObj = err as { message?: string; statusCode?: number };
      return NextResponse.json(
        { error: "Unauthorized", message: errorObj.message || (err instanceof Error ? err.message : "Authentication failed") },
        { status: errorObj.statusCode || 401 }
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Bad Request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { question, limit } = parsed.data;

    // Strict Tenant Context Isolation wrapping
    const requestId = req.headers.get("x-request-id") || `req-rag-${Date.now()}`;

    const ragResponse = await TenantContextManager.runWithTenantContext(
      tenantId,
      userId,
      requestId,
      async () => {
        return await answerQuestion(question, tenantId, limit);
      }
    );

    return NextResponse.json(ragResponse);
  } catch (error: unknown) {
    console.error("[API RAG Query Route Error]:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
