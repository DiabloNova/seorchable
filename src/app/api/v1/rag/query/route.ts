import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { answerQuestion } from '@/services/rag/query-service';
import { TenantContextManager } from '@/core/database/tenant-context';

// Input validation schema
const requestSchema = z.object({
  question: z.string().min(1, 'Question must be provided'),
  limit: z.number().int().positive().optional().default(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Bad Request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { question, limit } = parsed.data;

    // Strict Tenant Context Isolation wrapping
    // Extract tenant details from header/session mock or active parameters
    const organizationId = req.headers.get('x-tenant-id') || 'tenant-pipeline-a';
    const userId = req.headers.get('x-user-id') || 'usr-1001';
    const requestId = req.headers.get('x-request-id') || `req-rag-${Date.now()}`;

    const ragResponse = await TenantContextManager.runWithTenantContext(
      organizationId,
      userId,
      requestId,
      async () => {
        return await answerQuestion(question, organizationId, limit);
      }
    );

    return NextResponse.json(ragResponse);
  } catch (error: unknown) {
    console.error('[API RAG Query Route Error]:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
