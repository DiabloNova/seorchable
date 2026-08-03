"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import type { DocumentationCategory } from "@/lib/docsService";
import { SeorchableLogo } from "@/components/marketing/SeorchableLogo";

interface DocumentationSidebarProps {
  categories: DocumentationCategory[];
  activeSlug: string;
  locale: "en" | "fa";
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onItemClick?: () => void;
}

export function DocumentationSidebar({
  categories,
  activeSlug,
  locale,
  searchQuery,
  onSearchChange,
  onItemClick,
}: DocumentationSidebarProps) {
  const isFa = locale === "fa";

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white border-r border-l border-white/10 select-none">
      {/* Sidebar Top Branding Header */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4 group">
          <SeorchableLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm text-gradient-brand">seorchable.ir</span>
            <span className="text-[10px] text-slate-400 mt-1">
              {isFa ? "مستندات فنی سامانه" : "System Core Docs"}
            </span>
          </div>
        </Link>

        {/* Local Index Search */}
        <div className="relative">
          <Search size={14} className="absolute start-3 top-3 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isFa ? "جستجو در مستندات..." : "Search docs..."}
            className="w-full ps-9 pe-4 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/10 focus:border-[var(--sky-blue-500)]/40 focus:bg-white/[0.05] outline-none placeholder:text-slate-500 text-white transition-all"
          />
        </div>
      </div>

      {/* Categories Tree */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-none text-xs">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-start">
              {isFa ? cat.titleFa : cat.titleEn}
            </h3>
            <div className="space-y-1">
              {cat.articles.map((art) => {
                const active = art.slug === activeSlug;
                return (
                  <Link
                    key={art.slug}
                    href={`/${locale}/docs/${art.slug}`}
                    onClick={onItemClick}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all ${
                      active
                        ? "bg-gradient-to-r from-[var(--sky-blue-500)]/20 to-[var(--orange-500)]/5 border-[var(--sky-blue-500)]/40 text-white font-black"
                        : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <BookOpen size={13} className={active ? "text-[var(--sky-blue-500)]" : "text-slate-500"} />
                    <span className="truncate">{art.metadata.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-slate-500 py-8">
            {isFa ? "موردی یافت نشد." : "No categories found."}
          </p>
        )}
      </div>

      {/* Footer Navigation link */}
      <div className="p-4 border-t border-white/10 bg-slate-900/40 shrink-0">
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold"
        >
          <span>{isFa ? "ورود به پیشخوان کاربری" : "Go to Dashboard"}</span>
          <ArrowRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
