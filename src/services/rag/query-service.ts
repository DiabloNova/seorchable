/**
 * Optimus AI — RAG Query Service
 * Orchestrates query embedding, multi-tenant context retrieval, prompt construction, and LLM query answering.
 * Delegated to RAGIntelligenceService for Phase 8 Task 8.2 with full backward compatibility.
 */

import { embedQuery } from "../ai/query-embedding";
import { retrieveRelevantContext, RetrievedChunk } from "./context-retrieval";
import { RAGIntelligenceService } from "./rag-intelligence-service";

export interface RAGResponse {
  answer: string;
  sources: RetrievedChunk[];
  confidence: number; // 0 to 1, based on similarity scores
}

export const RAG_SYSTEM_PROMPT = `You are an expert brand intelligence analyst for Optimus AI.

Your task is to answer the user's question based ONLY on the provided context from brand intelligence data.

Rules:
1. If the answer is not in the context, say "I don't have enough information to answer this question based on the available data."
2. Cite the source chunks by their IDs when making specific claims.
3. If the context contains conflicting information, mention the different perspectives.
4. Maintain a professional, analytical tone.
5. Answer in the same language as the question (Persian or English).

Context:
{context}

Question: {question}

Answer:`;

/**
 * Answers a user's question using Retrieval-Augmented Generation (RAG).
 * Fully respects tenant isolation boundaries.
 */
export async function answerQuestion(
  question: string,
  organizationId: string,
  limit: number = 5
): Promise<RAGResponse> {
  if (!organizationId) {
    throw new Error("Tenant context violation: organizationId must be provided for RAG Query Service");
  }

  const ragService = new RAGIntelligenceService();
  const result = await ragService.executeRAGQuery({
    query: question,
    options: { topK: limit }
  });

  // Calculate top similarity confidence
  const queryEmbedding = await embedQuery(question);
  const sources = await retrieveRelevantContext(queryEmbedding, organizationId, limit);
  const confidence = sources.length > 0 ? Math.max(0, Math.min(1, sources[0].similarityScore)) : 0;

  return {
    answer: result.answer || "I don't have enough information to answer this question based on the available data.",
    sources,
    confidence
  };
}
