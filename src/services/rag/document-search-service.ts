import { TenantContextManager } from '../../core/database/tenant-context';
import { IEmbeddingProvider, StandardEmbeddingProvider } from '../ai/embedding-provider';
import { VectorStoreService } from '../knowledge-graph/vector-store';

export interface DocumentSearchQueryOptions {
  limit?: number;
  minSimilarityScore?: number;
}

export interface DocumentRef {
  docId: string;
  docHash?: string;
  fileName?: string;
}

export interface ChunkRef {
  chunkId: string;
  chunkIndex?: number;
}

export interface DocumentSearchResultItem {
  rankingPosition: number;
  similarityScore: number;
  documentRef: DocumentRef;
  chunkRef: ChunkRef;
  matchedContent: string;
  metadata: Record<string, unknown>;
}

export interface DocumentSearchResult {
  success: boolean;
  tenantId: string;
  query: string;
  totalResults: number;
  results: DocumentSearchResultItem[];
}

export class DocumentSearchService {
  private embeddingProvider: IEmbeddingProvider;
  private vectorStore: VectorStoreService;

  constructor(
    embeddingProvider: IEmbeddingProvider = new StandardEmbeddingProvider(),
    vectorStore: VectorStoreService = new VectorStoreService()
  ) {
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
  }

  /**
   * Executes tenant-safe semantic document search without prose generation
   */
  public async searchDocuments(
    queryText: string,
    options?: DocumentSearchQueryOptions
  ): Promise<DocumentSearchResult> {
    const tenantId = TenantContextManager.getRequiredTenantId();

    if (!queryText || queryText.trim().length === 0) {
      throw new Error('Validation Error: Query text cannot be empty for document search');
    }

    const limit = Math.min(Math.max(options?.limit ?? 5, 1), 100);
    const minSimilarity = options?.minSimilarityScore ?? 0.0;

    // 1. Generate query embedding vector
    const queryEmbedding = await this.embeddingProvider.embedQuery(queryText.trim());

    // 2. Query tenant-isolated vector store
    const similarEmbeddings = await this.vectorStore.findSimilarEmbeddings(tenantId, queryEmbedding, limit * 2);

    // 3. Transform and calculate similarity scores
    const items = similarEmbeddings.map(item => {
      // similarityScore = 1 - distance
      const similarityScore = parseFloat((1 - item.distance).toFixed(6));
      const meta = (item.metadata || {}) as Record<string, unknown>;

      const docId = (meta.docId as string) || `doc_${item.id.substring(0, 8)}`;
      const docHash = meta.docHash as string | undefined;
      const fileName = meta.fileName as string | undefined;
      const chunkId = (meta.chunkId as string) || `chk_${item.id.substring(0, 8)}`;
      const chunkIndex = typeof meta.chunkIndex === 'number' ? meta.chunkIndex : undefined;

      return {
        similarityScore,
        documentRef: {
          docId,
          docHash,
          fileName
        },
        chunkRef: {
          chunkId,
          chunkIndex
        },
        matchedContent: item.contentChunk,
        metadata: meta
      };
    });

    // 4. Filter by minimum similarity score
    const filtered = items.filter(item => item.similarityScore >= minSimilarity);

    // 5. Deterministic sorting & tie-breaking
    // Primary sort: similarityScore DESC
    // Secondary tie-breaker: chunkId ASC
    // Tertiary tie-breaker: matchedContent ASC
    filtered.sort((a, b) => {
      if (Math.abs(b.similarityScore - a.similarityScore) > 1e-6) {
        return b.similarityScore - a.similarityScore;
      }
      const chunkCmp = a.chunkRef.chunkId.localeCompare(b.chunkRef.chunkId);
      if (chunkCmp !== 0) return chunkCmp;
      return a.matchedContent.localeCompare(b.matchedContent);
    });

    // Capped to limit
    const sliced = filtered.slice(0, limit);

    // 6. Assign rankingPosition (1-based)
    const results: DocumentSearchResultItem[] = sliced.map((item, idx) => ({
      rankingPosition: idx + 1,
      similarityScore: item.similarityScore,
      documentRef: item.documentRef,
      chunkRef: item.chunkRef,
      matchedContent: item.matchedContent,
      metadata: item.metadata
    }));

    return {
      success: true,
      tenantId,
      query: queryText,
      totalResults: results.length,
      results
    };
  }
}
