import { generateEmbedding, generateDeterministicMockEmbedding } from './embed-client';

export interface EmbeddingModelInfo {
  provider: string;
  model: string;
  dimension: number;
  version: string;
}

export interface IEmbeddingProvider {
  embedChunks(chunks: string[]): Promise<number[][]>;
  embedQuery(query: string): Promise<number[]>;
  getModelInfo(): EmbeddingModelInfo;
}

export class StandardEmbeddingProvider implements IEmbeddingProvider {
  private readonly expectedDimension = 768;
  private readonly providerName: string;
  private readonly modelName: string;
  private readonly version: string;

  constructor(
    providerName = 'Google/VercelSDK',
    modelName = 'text-embedding-004',
    version = '1.0.0'
  ) {
    this.providerName = providerName;
    this.modelName = modelName;
    this.version = version;
  }

  public getModelInfo(): EmbeddingModelInfo {
    return {
      provider: this.providerName,
      model: this.modelName,
      dimension: this.expectedDimension,
      version: this.version
    };
  }

  private validateVectorDimension(vector: number[], sourceContext: string): number[] {
    if (!vector || !Array.isArray(vector)) {
      throw new Error(`Embedding Error: ${sourceContext} returned invalid non-array vector`);
    }

    if (vector.length !== this.expectedDimension) {
      throw new Error(
        `Incompatible Embedding Dimension Error: Expected ${this.expectedDimension}-dimensional vector for ${this.modelName}, but got ${vector.length} dimensions (${sourceContext})`
      );
    }

    return vector;
  }

  public async embedQuery(query: string): Promise<number[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Validation Error: Query text cannot be empty for embedding generation');
    }

    try {
      const vector = await generateEmbedding(query.trim());
      return this.validateVectorDimension(vector, 'embedQuery');
    } catch (err: unknown) {
      console.warn('[StandardEmbeddingProvider.embedQuery] Real provider error, using deterministic fallback', err);
      const mockVector = generateDeterministicMockEmbedding(query.trim());
      return this.validateVectorDimension(mockVector, 'embedQuery-fallback');
    }
  }

  public async embedChunks(chunks: string[]): Promise<number[][]> {
    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return [];
    }

    const embeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk || chunk.trim().length === 0) {
        throw new Error(`Validation Error: Chunk at index ${i} is empty or blank`);
      }

      try {
        const vector = await generateEmbedding(chunk);
        embeddings.push(this.validateVectorDimension(vector, `embedChunk[${i}]`));
      } catch (err: unknown) {
        console.warn(`[StandardEmbeddingProvider.embedChunks] Error embedding chunk ${i}, using fallback`, err);
        const mockVector = generateDeterministicMockEmbedding(chunk);
        embeddings.push(this.validateVectorDimension(mockVector, `embedChunk-fallback[${i}]`));
      }
    }

    return embeddings;
  }
}
