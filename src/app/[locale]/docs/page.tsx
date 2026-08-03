import React from "react";
import Link from "next/link";
import { DocsService } from "@/lib/docsService";
import { BookOpen, Cpu, Library, HelpCircle, ArrowRight, Shield, Database, Terminal, Settings } from "lucide-react";

interface DocsIndexPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DocsIndexPage({ params }: DocsIndexPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale || "fa") as "en" | "fa";
  const isFa = locale === "fa";

  const categories = DocsService.getCategories(locale);

  // Helper icons for categories
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "getting-started":
        return <Library size={20} className="text-sky-400" />;
      case "architecture":
        return <Cpu size={20} className="text-amber-400" />;
      case "ai-intelligence":
        return <Terminal size={20} className="text-orange-400" />;
      case "security":
        return <Shield size={20} className="text-emerald-400" />;
      case "database":
        return <Database size={20} className="text-indigo-400" />;
      case "development":
        return <Settings size={20} className="text-pink-400" />;
      default:
        return <BookOpen size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-start">
      {/* Welcome Hero Card */}
      <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-[var(--sky-blue-500)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-[var(--orange-500)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black uppercase text-sky-400">
            <Library size={12} />
            <span>{isFa ? "مرکز راهنمای فنی" : "Developer & Architecture Center"}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display leading-snug">
            {isFa ? "مستندات و معماری فنی سئورچبل" : "Seorchable Core Documentation"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {isFa
              ? "به مرکز مستندات فنی و راهنمای ساختاری خوش آمدید. در این بخش، معماری تمیز چندمستأجری، مکانیزم‌های خزش پیشرفته، طراحی گراف دانش و الگوهای امنیتی به تفکیک و به طور کاملا پویا تشریح شده است."
              : "Welcome to our technical knowledge hub. Dive deep into clean architecture specs, multi-tenant isolation layers, NLP/AEO crawlers, and event-driven data workflows."}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/10 hover:border-[var(--sky-blue-500)]/30 hover:bg-white/[0.01] transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                {getCategoryIcon(cat.id)}
              </div>
              <h2 className="text-base font-black text-white font-display">
                {isFa ? cat.titleFa : cat.titleEn}
              </h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? `بخش تخصصی ${cat.titleFa} شامل مقالات، تعاریف معماری و مستندات مربوطه.`
                  : `Technical articles, design decisions, and system references for ${cat.titleEn}.`}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                {isFa ? "سرفصل‌ها:" : "Topics:"}
              </span>
              <div className="grid gap-2 text-xs">
                {cat.articles.slice(0, 3).map((art) => (
                  <Link
                    key={art.slug}
                    href={`/${locale}/docs/${art.slug}`}
                    className="text-slate-400 hover:text-[var(--sky-blue-500)] transition-colors flex items-center gap-1"
                  >
                    <span className="text-[var(--sky-blue-500)]">•</span>
                    <span className="truncate">{art.metadata.title}</span>
                  </Link>
                ))}
                {cat.articles.length > 3 && (
                  <span className="text-[10px] text-slate-500 font-bold block pt-1">
                    +{cat.articles.length - 3} {isFa ? "موضوع دیگر" : "more topics"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start Guide Banner */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-[var(--sky-blue-500)]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            {isFa ? "چگونه مطالعه کنیم؟" : "Quick Start Guide"}
          </h3>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          {isFa
            ? "برای سهولت در مطالعه، مستندات به صورت سرفصل‌های موضوعی تقسیم شده‌اند. پیشنهاد می‌شود ابتدا مقاله معرفی پلتفرم را بررسی نموده و سپس به بخش‌های تخصصی معماری، امنیت و زیرساخت مراجعه نمایید."
            : "Use the hierarchical sidebar on the left (or mobile drawer) to navigate through standard categories. We recommend starting with the Introduction to Seorchable."}
        </p>
        <div className="pt-2">
          <Link
            href={`/${locale}/docs/introduction`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <span>{isFa ? "شروع با معرفی کلی سامانه" : "Start with Introduction"}</span>
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
