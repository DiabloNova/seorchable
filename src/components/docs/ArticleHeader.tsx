"use client";

import React from "react";
import { Clock, User, Calendar, Folder } from "lucide-react";
import { DocumentationMetadata } from "@/lib/docsService";

interface ArticleHeaderProps {
  metadata: DocumentationMetadata;
  locale: "en" | "fa";
}

export function ArticleHeader({ metadata, locale }: ArticleHeaderProps) {
  const isFa = locale === "fa";

  return (
    <header className="space-y-4 pb-6 border-b border-white/10 dark:border-white/10 light:border-slate-200">
      {/* Category Tag */}
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[var(--sky-blue-500)] uppercase tracking-wider">
        <Folder size={14} />
        <span>{isFa && metadata.categoryFa ? metadata.categoryFa : metadata.category}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-primary)] font-display tracking-tight leading-snug">
        {metadata.title}
      </h1>

      {/* Description */}
      {metadata.description && (
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-balance">
          {metadata.description}
        </p>
      )}

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[10px] sm:text-xs text-[var(--text-muted)] font-mono">
        <span className="flex items-center gap-1.5">
          <User size={13} className="text-slate-400" />
          <span>{metadata.author}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>{isFa ? "بروزرسانی: " + metadata.lastUpdated : "Updated: " + metadata.lastUpdated}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          <span>{isFa ? "مطالعه: ۵ دقیقه" : "5 min read"}</span>
        </span>
      </div>
    </header>
  );
}
