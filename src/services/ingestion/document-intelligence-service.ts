import { TenantContextManager } from '../../core/database/tenant-context';
import { chunkText } from '../ai/text-chunker';
import { IEmbeddingProvider, StandardEmbeddingProvider } from '../ai/embedding-provider';
import { VectorStoreService } from '../knowledge-graph/vector-store';
import { DefaultDocumentParser, IDocumentParser, DocumentFile, ParsedDocument } from './document-parser';

export interface ChunkIngestionRecord {
  chunkId: string;
  chunkIndex: number;
  content: string;
  characterCount: number;
}

export interface DocumentIngestionResult {
  success: boolean;
  docId: string;
  docHash: string;
  tenantId: string;
  fileName: string;
  totalChunks: number;
  processedChunks: number;
  failedChunks: number;
  chunks: ChunkIngestionRecord[];
  errors: Array<{ chunkIndex: number; error: string }>;
}

export class DocumentIntelligenceService {
  private parser: IDocumentParser;
  private embeddingProvider: IEmbeddingProvider;
  private vectorStore: VectorStoreService;

  constructor(
    parser: IDocumentParser = new DefaultDocumentParser(),
    embeddingProvider: IEmbeddingProvider = new StandardEmbeddingProvider(),
    vectorStore: VectorStoreService = new VectorStoreService()
  ) {
    this.parser = parser;
    this.embeddingProvider = embeddingProvider;
    this.vectorStore = vectorStore;
  }

  /**
   * Primary Document Intelligence Ingestion Pipeline
   */
  public async ingestDocumentFile(
    file: DocumentFile,
    chunkingOptions?: { maxChunkSize?: number; overlap?: number }
  ): Promise<DocumentIngestionResult> {
    const tenantId = TenantContextManager.getRequiredTenantId();

    // 1. Parse and normalize file
    const parsedDoc = await this.parser.parseDocument(file);

    return this.ingestParsedDocument(tenantId, parsedDoc, chunkingOptions);
  }

  /**
   * Direct text ingestion adapter
   */
  public async ingestRawText(
    rawText: string,
    fileName = 'unnamed_document.txt',
    metadata: Record<string, unknown> = {},
    chunkingOptions?: { maxChunkSize?: number; overlap?: number }
  ): Promise<DocumentIngestionResult> {
    return this.ingestDocumentFile(
      {
        fileName,
        mediaType: 'text/plain',
        content: rawText,
        metadata
      },
      chunkingOptions
    );
  }

  /**
   * Internal pipeline executing chunking, embedding, vector persistence, and idempotency
   */
  private async ingestParsedDocument(
    tenantId: string,
    doc: ParsedDocument,
    chunkingOptions?: { maxChunkSize?: number; overlap?: number }
  ): Promise<DocumentIngestionResult> {
    const maxChunkSize = chunkingOptions?.maxChunkSize ?? 500;
    const overlap = chunkingOptions?.overlap ?? 50;

    // 2. Deterministic chunking
    const rawChunks = chunkText(doc.normalizedText, maxChunkSize, overlap);

    if (rawChunks.length === 0) {
      throw new Error(`Empty Content Error: No valid chunks generated for document '${doc.fileName}'`);
    }

    const modelInfo = this.embeddingProvider.getModelInfo();

    // Generate embeddings via provider
    const embeddings = await this.embeddingProvider.embedChunks(rawChunks);

    let processedCount = 0;
    let failedCount = 0;
    const chunkRecords: ChunkIngestionRecord[] = [];
    const errors: Array<{ chunkIndex: number; error: string }> = [];

    for (let i = 0; i < rawChunks.length; i++) {
      const chunkContent = rawChunks[i];
      // STABLE, DETERMINISTIC CHUNK ID (No timestamps, No random values)
      const chunkId = `chk_${doc.docHash.substring(0, 12)}_${i}`;

      try {
        const chunkEmbedding = embeddings[i];

        const chunkMetadata: Record<string, unknown> = {
          ...(doc.metadata || {}),
          docId: doc.docId,
          docHash: doc.docHash,
          fileName: doc.fileName,
          chunkId,
          chunkIndex: i,
          totalChunks: rawChunks.length,
          modelProvider: modelInfo.provider,
          modelName: modelInfo.model,
          dimension: modelInfo.dimension
        };

        // Insert vector chunk into tenant-scoped database store
        await this.vectorStore.insertEmbedding(
          tenantId,
          chunkContent,
          chunkEmbedding,
          chunkMetadata
        );

        chunkRecords.push({
          chunkId,
          chunkIndex: i,
          content: chunkContent,
          characterCount: chunkContent.length
        });

        processedCount++;
      } catch (err: unknown) {
        failedCount++;
        errors.push({
          chunkIndex: i,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    return {
      success: processedCount > 0,
      docId: doc.docId,
      docHash: doc.docHash,
      tenantId,
      fileName: doc.fileName,
      totalChunks: rawChunks.length,
      processedChunks: processedCount,
      failedChunks: failedCount,
      chunks: chunkRecords,
      errors
    };
  }
}
