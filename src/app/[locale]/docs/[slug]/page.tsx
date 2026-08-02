import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DocsService } from "@/lib/docsService";
import { ArticleHeader } from "@/components/docs/ArticleHeader";
import { ArticleContent } from "@/components/docs/ArticleContent";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { PreviousNextNavigation } from "@/components/docs/PreviousNextNavigation";

interface DocDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Dynamic SEO metadata generation for Google and AI Search Engines
 */
export async function generateMetadata({ params }: DocDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale || "fa") as "en" | "fa";
  const slug = resolvedParams.slug;

  const article = DocsService.getArticle(slug, locale);

  if (!article) {
    return {
      title: "Page Not Found - Seorchable Docs",
    };
  }

  const keywordsList = article.metadata.keywords
    ? article.metadata.keywords.split(",").map((k) => k.trim())
    : ["seorchable", "docs", "seo", "geo", "aeo"];

  const canonicalUrl = `https://seorchable.ir/${locale}/docs/${slug}`;

  return {
    title: `${article.metadata.title} | Seorchable Documentation`,
    description: article.metadata.description,
    keywords: keywordsList,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      url: canonicalUrl,
      type: "article",
      siteName: "Seorchable Docs",
      publishedTime: article.metadata.lastUpdated,
      authors: [article.metadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metadata.title,
      description: article.metadata.description,
    },
  };
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale || "fa") as "en" | "fa";
  const slug = resolvedParams.slug;
  const isFa = locale === "fa";

  const article = DocsService.getArticle(slug, locale);

  if (!article) {
    notFound();
  }

  // Find previous and next articles on the server
  const articles = DocsService.getAllArticles().filter((art) => art.locale === locale);
  const currentIndex = articles.findIndex((art) => art.slug === slug);
  const prevArticle = currentIndex > 0 ? { title: articles[currentIndex - 1].metadata.title, slug: articles[currentIndex - 1].slug } : null;
  const nextArticle = currentIndex < articles.length - 1 ? { title: articles[currentIndex + 1].metadata.title, slug: articles[currentIndex + 1].slug } : null;

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.metadata.title,
    "description": article.metadata.description,
    "datePublished": article.metadata.lastUpdated,
    "dateModified": article.metadata.lastUpdated,
    "author": {
      "@type": "Organization",
      "name": article.metadata.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Seorchable",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seorchable.ir/logo.png",
      },
    },
    "inLanguage": locale,
    "articleSection": article.metadata.category,
  };

  return (
    <>
      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Grid Viewport - Supporting 3-column split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12 relative w-full items-start">
        {/* CENTER CONTENT COLUMN */}
        <div className="lg:col-span-3 space-y-8 min-w-0">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider" dir={isFa ? "rtl" : "ltr"}>
            <Link href={`/${locale}/docs`} className="hover:text-[var(--text-primary)] transition-colors">
              {isFa ? "مستندات" : "Docs"}
            </Link>
            <span>/</span>
            <span className="text-slate-400">
              {isFa && article.metadata.categoryFa ? article.metadata.categoryFa : article.metadata.category}
            </span>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-black truncate max-w-[200px]">
              {article.metadata.title}
            </span>
          </div>

          {/* Premium styled container */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/10 backdrop-blur-md shadow-2xl relative">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-1/4 w-40 h-40 bg-[var(--sky-blue-500)]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[var(--orange-500)]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Specialized Header */}
              <ArticleHeader metadata={article.metadata} locale={locale} />

              {/* Dynamic Content Engine */}
              <ArticleContent content={article.content} locale={locale} />

              {/* Previous / Next pagination controller */}
              <PreviousNextNavigation prevArticle={prevArticle} nextArticle={nextArticle} locale={locale} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (Table Of Contents) */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 shrink-0 overflow-hidden max-h-[calc(100vh-8rem)]">
          <div className="p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-950/20 backdrop-blur-sm shadow-sm space-y-6">
            <TableOfContents content={article.content} locale={locale} />
          </div>
        </aside>
      </div>
    </>
  );
}
