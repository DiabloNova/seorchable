"use client";

import React, { use } from "react";
import Link from "next/link";
import { DOCS_TOPICS } from "@/lib/docsData";
import { BookOpen, ShieldCheck, Cpu, Library, HelpCircle, ArrowRight } from "lucide-react";

export default function DocsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const adminTopics = DOCS_TOPICS.filter((t) => t.category === "admin");
  const aiTopics = DOCS_TOPICS.filter((t) => t.category === "ai-intelligence");

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Hero */}
      <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/80 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-[var(--sky-blue-500)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-[var(--orange-500)]/10 rounded-full blur-3xl" />

        <div className="space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black uppercase text-sky-400">
            <Library size={12} />
            <span>{isFa ? "مرکز راهنمای فنی" : "Developer & Architecture Center"}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display leading-snug">
            {isFa ? "مستندات و معماری فنی seorchable.ir" : "seorchable.ir Core Documentation"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {isFa
              ? "به مرکز مستندات فنی و راهنمای ساختاری خوش آمدید. در این بخش، معماری تمیز چندمستأجری، مکانیزم‌های خزش پیشرفته، طراحی گراف دانش و الگوهای امنیتی به تفکیک و در قالب ۲۱ موضوع تشریح شده است."
              : "Welcome to our technical knowledge hub. Dive deep into clean architecture specs, multi-tenant isolation layers, NLP/AEO crawlers, and event-driven data workflows."}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category 1 Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/20 hover:border-[var(--sky-blue-500)]/30 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-base font-black text-white font-display">
              {isFa ? "زیرساخت و مدیریت سازمانی" : "Enterprise Admin & Infrastructure"}
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isFa
                ? "بررسی مفاهیم کنترل دسترسی مبتنی بر نقش (RBAC)، ایزولاسیون کامل چندمستأجری، حسابرسی رویدادها، خط لوله پردازش ناهمگام و الگوهای ماندگاری داده."
                : "Explore RBAC, multi-tenant organization boundary models, audit event trails, asynchronous task queues, and DB indexing configurations."}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">{isFa ? "سرفصل‌ها:" : "Topics:"}</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {adminTopics.slice(0, 4).map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/${locale}/docs/${topic.slug}`}
                  className="text-slate-400 hover:text-[var(--sky-blue-500)] truncate transition-colors"
                >
                  • {isFa ? topic.titleFa : topic.titleEn}
                </Link>
              ))}
              {adminTopics.length > 4 && (
                <span className="text-slate-500 font-bold">+{adminTopics.length - 4} {isFa ? "موضوع دیگر" : "more"}</span>
              )}
            </div>
          </div>
        </div>

        {/* Category 2 Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/20 hover:border-[var(--orange-500)]/30 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cpu size={20} />
            </div>
            <h2 className="text-base font-black text-white font-display">
              {isFa ? "هوشمندی و تحلیل معنایی" : "AI Core & Semantic Analytics"}
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isFa
                ? "جزئیات فنی مربوط به خط لوله پردازش متون، استخراج بردار احساسات با LLM، طراحی و مدل‌سازی گراف دانش اختصاصی برند و رفع خطاهای توهم حافظه معنایی."
                : "Examine text parsing pipelines, LLM sentiment extraction, active entity relationship graphing, and answer engine optimization rules."}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">{isFa ? "سرفصل‌ها:" : "Topics:"}</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {aiTopics.slice(0, 4).map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/${locale}/docs/${topic.slug}`}
                  className="text-slate-400 hover:text-[var(--orange-500)] truncate transition-colors"
                >
                  • {isFa ? topic.titleFa : topic.titleEn}
                </Link>
              ))}
              {aiTopics.length > 4 && (
                <span className="text-slate-500 font-bold">+{aiTopics.length - 4} {isFa ? "موضوع دیگر" : "more"}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick start instructions */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-[var(--sky-blue-500)]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">{isFa ? "چگونه مطالعه کنیم؟" : "Quick Start Guide"}</h3>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          {isFa
            ? "شما می‌توانید با استفاده از منوی ناوبری اختصاصی مستقر در سمت چپ صفحه (یا دکمه همبرگر بالا در موبایل) به سرعت بین ۲۱ سرفصل فنی جابجا شوید. برای شروع مطالعه سرفصل‌ها، پیشنهاد می‌شود از بخش معماری کلی سامانه شروع نمایید."
            : "Use the dedicated sidebar on the left (or hamburger overlay on mobile) to navigate seamlessly between the 21 comprehensive topics. We recommend starting with the overall AI Architecture Specification."}
        </p>
        <div className="pt-2">
          <Link
            href={`/${locale}/docs/architecture`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <span>{isFa ? "شروع با معماری کلی سامانه" : "Start with AI Core Architecture"}</span>
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
