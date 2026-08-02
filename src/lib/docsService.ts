import fs from "fs";
import path from "path";

export interface DocumentationMetadata {
  title: string;
  description: string;
  category: string;
  categoryFa?: string;
  lastUpdated: string;
  author: string;
  keywords: string;
  slug?: string;
}

export interface DocumentationArticle {
  slug: string;
  locale: "en" | "fa";
  metadata: DocumentationMetadata;
  content: string;
}

export interface DocumentationCategory {
  id: string;
  titleEn: string;
  titleFa: string;
  articles: DocumentationArticle[];
}

const CATEGORY_MAP: Record<string, { titleEn: string; titleFa: string }> = {
  "getting-started": {
    titleEn: "Getting Started",
    titleFa: "شروع کار با سامانه",
  },
  "architecture": {
    titleEn: "Platform Architecture",
    titleFa: "معماری پلتفرم",
  },
  "ai-intelligence": {
    titleEn: "AI Intelligence Platform",
    titleFa: "هوشمندی و تحلیل معنایی",
  },
  "security": {
    titleEn: "Security & Governance",
    titleFa: "امنیت و حاکمیت داده‌ها",
  },
  "database": {
    titleEn: "Database & Infrastructure",
    titleFa: "پایگاه داده و زیرساخت",
  },
  "development": {
    titleEn: "Development Guide",
    titleFa: "راهنمای توسعه‌دهندگان",
  },
  "api": {
    titleEn: "API Reference",
    titleFa: "مرجع خطوط ارتباطی API",
  },
  "design-system": {
    titleEn: "Design System",
    titleFa: "سیستم طراحی بصری",
  },
};

/**
 * Custom lightweight Frontmatter parser
 */
function parseFrontmatter(fileContent: string): { metadata: Partial<DocumentationMetadata>; content: string } {
  const frontmatterRegex = /^---\s*[\r\n]([\s\S]*?)[\r\n]---\s*[\r\n]?([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: fileContent };
  }

  const rawYaml = match[1];
  const content = match[2];
  const metadata: Partial<DocumentationMetadata> = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let val = line.substring(colonIndex + 1).trim();
      // Remove surrounding quotes if any
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any)[key] = val;
    }
  }

  return { metadata, content };
}

/**
 * Docs Service Layer for Repository-Based Content Architecture
 */
export class DocsService {
  private static docsDirectory = path.join(process.cwd(), "content", "docs");

  /**
   * Reads all articles from disk
   */
  public static getAllArticles(): DocumentationArticle[] {
    const articles: DocumentationArticle[] = [];

    if (!fs.existsSync(this.docsDirectory)) {
      return [];
    }

    const categories = fs.readdirSync(this.docsDirectory);

    for (const cat of categories) {
      const catPath = path.join(this.docsDirectory, cat);
      if (!fs.statSync(catPath).isDirectory()) {
        continue;
      }

      const files = fs.readdirSync(catPath);
      for (const file of files) {
        if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
          continue;
        }

        // Detect language suffix, e.g., slug.fa.md or slug.en.md
        let slug = "";
        let locale: "en" | "fa" = "en";

        const parts = file.split(".");
        if (parts.length >= 3) {
          const suffix = parts[parts.length - 2];
          if (suffix === "fa" || suffix === "en") {
            locale = suffix;
            slug = parts.slice(0, parts.length - 2).join(".");
          } else {
            slug = parts.slice(0, parts.length - 1).join(".");
          }
        } else {
          slug = parts.slice(0, parts.length - 1).join(".");
        }

        const filePath = path.join(catPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { metadata, content } = parseFrontmatter(fileContent);

        const categoryInfo = CATEGORY_MAP[cat] || { titleEn: cat, titleFa: cat };

        const finalMetadata: DocumentationMetadata = {
          title: metadata.title || slug,
          description: metadata.description || "",
          category: categoryInfo.titleEn,
          categoryFa: categoryInfo.titleFa,
          lastUpdated: metadata.lastUpdated || new Date().toISOString().split("T")[0],
          author: metadata.author || "Seorchable Team",
          keywords: metadata.keywords || "",
        };

        articles.push({
          slug,
          locale,
          metadata: finalMetadata,
          content,
        });
      }
    }

    return articles;
  }

  /**
   * Retrieves single article by slug and locale
   */
  public static getArticle(slug: string, locale: "en" | "fa"): DocumentationArticle | null {
    const articles = this.getAllArticles();
    const found = articles.find((art) => art.slug === slug && art.locale === locale);
    return found || null;
  }

  /**
   * Groups articles by category
   */
  public static getCategories(locale: "en" | "fa"): DocumentationCategory[] {
    const articles = this.getAllArticles().filter((art) => art.locale === locale);
    const categories: Record<string, DocumentationArticle[]> = {};

    for (const art of articles) {
      // Find category folder name from slug / map
      const catId = Object.keys(CATEGORY_MAP).find(
        (key) => CATEGORY_MAP[key].titleEn === art.metadata.category
      ) || "getting-started";

      if (!categories[catId]) {
        categories[catId] = [];
      }
      categories[catId].push(art);
    }

    return Object.keys(CATEGORY_MAP).map((catId) => {
      const info = CATEGORY_MAP[catId];
      return {
        id: catId,
        titleEn: info.titleEn,
        titleFa: info.titleFa,
        articles: categories[catId] || [],
      };
    }).filter((cat) => cat.articles.length > 0);
  }

  /**
   * Abstracted search client
   */
  public static search(query: string, locale: "en" | "fa"): DocumentationArticle[] {
    if (!query) return [];
    const normalizedQuery = query.toLowerCase();
    const articles = this.getAllArticles().filter((art) => art.locale === locale);

    return articles.filter((art) => {
      return (
        art.metadata.title.toLowerCase().includes(normalizedQuery) ||
        art.metadata.description.toLowerCase().includes(normalizedQuery) ||
        art.content.toLowerCase().includes(normalizedQuery) ||
        art.metadata.keywords.toLowerCase().includes(normalizedQuery)
      );
    });
  }
}
