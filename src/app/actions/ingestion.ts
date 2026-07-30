"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { DocumentIngestionService } from "@/services/ingestion/document-ingestion";
import { TenantContextManager } from "@/core/database/tenant-context";

const ingestSchema = z.object({
  text: z.string().min(1, "Text to ingest must be provided"),
  metadata: z.record(z.string(), z.unknown()).optional().default(() => ({})),
  chunkingOptions: z
    .object({
      maxChunkSize: z.number().int().positive().optional(),
      overlap: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export async function ingestDocumentAction(data: {
  text: string;
  metadata?: Record<string, unknown>;
  chunkingOptions?: { maxChunkSize?: number; overlap?: number };
}) {
  const parsed = ingestSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.format() };
  }

  const cookieStore = await cookies();
  const tenantId = cookieStore.get("tenant_id")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!tenantId || !userId) {
    return { success: false, error: "Unauthorized: Missing secure tenant or user credentials on server." };
  }

  try {
    const ingestionService = new DocumentIngestionService();
    const requestId = `req-act-ingest-${Date.now()}`;

    const result = await TenantContextManager.runWithTenantContext(
      tenantId,
      userId,
      requestId,
      async () => {
        return await ingestionService.ingestDocument(
          parsed.data.text,
          parsed.data.metadata,
          parsed.data.chunkingOptions
        );
      }
    );

    return { success: true, result };
  } catch (err: unknown) {
    console.error("[ingestDocumentAction Error]:", err);
    return { success: false, error: err instanceof Error ? err.message : "Internal Server Error" };
  }
}
