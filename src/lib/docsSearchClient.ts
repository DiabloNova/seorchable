import { DocumentationArticle } from "./docsService";

/**
 * Interface representing a Replaceable Search Client Engine for Seorchable Documentation.
 * Enables zero-friction future migrations to premium solutions:
 * - Algolia DocSearch
 * - Meilisearch
 * - Elasticsearch
 * - Internal AI semantic search
 */
export interface DocsSearchEngine {
  search(query: string, locale: "en" | "fa"): Promise<DocumentationArticle[]>;
}

/**
 * Default Local Indexing search engine calling our server-side API
 */
export class LocalDocsSearchEngine implements DocsSearchEngine {
  public async search(query: string, locale: "en" | "fa"): Promise<DocumentationArticle[]> {
    if (!query) return [];

    try {
      const res = await fetch(`/api/docs/search?q=${encodeURIComponent(query)}&locale=${locale}`);
      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }
      return await res.json();
    } catch (err) {
      console.error("Local search engine error:", err);
      return [];
    }
  }
}

/**
 * Algolia DocSearch placeholder engine (future migration ready)
 */
export class AlgoliaDocsSearchEngine implements DocsSearchEngine {
  public async search(query: string, _locale: "en" | "fa"): Promise<DocumentationArticle[]> {
    console.log("Future migration to Algolia DocSearch triggered with query:", query);
    return [];
  }
}

/**
 * AI Semantic Search placeholder engine (future migration ready)
 */
export class AISemanticSearchEngine implements DocsSearchEngine {
  public async search(query: string, _locale: "en" | "fa"): Promise<DocumentationArticle[]> {
    console.log("Future migration to AI Semantic Search triggered with query:", query);
    return [];
  }
}

/**
 * Global Search client selector factory
 */
export class DocsSearchClient {
  private static activeEngine: DocsSearchEngine = new LocalDocsSearchEngine();

  /**
   * Configures a custom active search engine (decoupling presentation layer from backend engine)
   */
  public static setEngine(engine: DocsSearchEngine) {
    this.activeEngine = engine;
  }

  public static async search(query: string, locale: "en" | "fa"): Promise<DocumentationArticle[]> {
    return this.activeEngine.search(query, locale);
  }
}
