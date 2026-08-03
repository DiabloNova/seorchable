"use client";

import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { DocumentationArticle } from "@/lib/docsService";

interface SearchResultsProps {
  results: DocumentationArticle[];
  locale: "en" | "fa";
  onSelect?: () => void;
  query: string;
}

export function SearchResults({ results, locale, onSelect, query }: SearchResultsProps) {
  const isFa = locale === "fa";

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 space-y-2">
        <p className="text-xs font-bold">
          {isFa ? "موردی یافت نشد." : "No matching documentation found."}
        </p>
        <p className="text-[10px]">
          {isFa
            ? `عبارت "${query}" در هیچ‌کدام از عناوین یا متون فنی پیدا نشد.`
            : `Could not find any matches for "${query}".`}
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[350px] overflow-y-auto divide-y divide-white/5 font-sans" dir={isFa ? "rtl" : "ltr"}>
      {results.map((art) => (
        <Link
          key={art.slug}
          href={`/${locale}/docs/${art.slug}`}
          onClick={onSelect}
          className="block p-4 hover:bg-white/[0.03] transition-colors group text-start"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 shrink-0 group-hover:text-[var(--sky-blue-500)] group-hover:border-[var(--sky-blue-500)]/30 transition-colors">
                <FileText size={14} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white group-hover:text-[var(--sky-blue-500)] transition-colors truncate">
                  {art.metadata.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {art.metadata.description}
                </p>
              </div>
            </div>

            <span className="text-[9px] bg-slate-900 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-bold shrink-0">
              {isFa && art.metadata.categoryFa ? art.metadata.categoryFa : art.metadata.category}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
