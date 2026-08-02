"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleLink {
  title: string;
  slug: string;
}

interface PreviousNextNavigationProps {
  prevArticle?: ArticleLink | null;
  nextArticle?: ArticleLink | null;
  locale: "en" | "fa";
}

export function PreviousNextNavigation({ prevArticle, nextArticle, locale }: PreviousNextNavigationProps) {
  const isFa = locale === "fa";

  return (
    <div className="grid sm:grid-cols-2 gap-4 pt-10 mt-10 border-t border-white/10 dark:border-white/10 light:border-slate-200" dir={isFa ? "rtl" : "ltr"}>
      {/* Previous Article Link */}
      {prevArticle ? (
        <Link
          href={`/${locale}/docs/${prevArticle.slug}`}
          className="group flex flex-col items-start p-5 rounded-2xl border border-white/10 bg-slate-900/10 hover:border-[var(--sky-blue-500)]/40 hover:bg-white/[0.02] transition-all text-start"
        >
          <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 group-hover:text-slate-400 transition-colors">
            {isFa ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            <span>{isFa ? "مبحث قبلی" : "Previous Topic"}</span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-white mt-2 group-hover:text-[var(--sky-blue-500)] transition-colors line-clamp-1">
            {prevArticle.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Article Link */}
      {nextArticle ? (
        <Link
          href={`/${locale}/docs/${nextArticle.slug}`}
          className="group flex flex-col items-end p-5 rounded-2xl border border-white/10 bg-slate-900/10 hover:border-[var(--orange-500)]/40 hover:bg-white/[0.02] transition-all text-end"
        >
          <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 group-hover:text-slate-400 transition-colors">
            <span>{isFa ? "مبحث بعدی" : "Next Topic"}</span>
            {isFa ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </span>
          <span className="text-xs sm:text-sm font-bold text-white mt-2 group-hover:text-[var(--orange-500)] transition-colors line-clamp-1">
            {nextArticle.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
