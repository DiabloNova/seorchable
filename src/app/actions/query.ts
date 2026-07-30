"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { answerQuestion } from "@/services/rag/query-service";
import { TenantContextManager } from "@/core/database/tenant-context";

const querySchema = z.object({
  question: z.string().min(1, "Question must be provided"),
  limit: z.number().int().positive().optional().default(5),
});

export async function queryKnowledgeGraphAction(data: {
  question: string;
  limit?: number;
}) {
  const parsed = querySchema.safeParse(data);
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
    const requestId = `req-act-query-${Date.now()}`;

    const result = await TenantContextManager.runWithTenantContext(
      tenantId,
      userId,
      requestId,
      async () => {
        return await answerQuestion(parsed.data.question, tenantId, parsed.data.limit);
      }
    );

    return { success: true, result };
  } catch (err: unknown) {
    console.error("[queryKnowledgeGraphAction Error]:", err);
    return { success: false, error: err instanceof Error ? err.message : "Internal Server Error" };
  }
}
