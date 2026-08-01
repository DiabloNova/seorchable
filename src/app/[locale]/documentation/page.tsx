"use client";

import React, { useState, use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import {
  Code2,
  Terminal,
  BookOpen,
  Layers,
  Play,
  Cpu,
  Network,
  ShieldAlert,
  Database,
  ArrowRight,
  GitMerge,
  CpuIcon
} from "lucide-react";

export default function DocumentationPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<"quickstart" | "pipeline" | "graph" | "security">("quickstart");
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "node">("curl");

  const curlCode = `curl -X POST "https://api.brandgraph.ai/v1/analysis/sentiment" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "domain": "brandgraph.ai",
    "competitors": ["ahrefs.com", "semrush.com"]
  }'`;

  const nodeCode = `import { BrandClient } from '@brandgraph/sdk';

const client = new BrandClient({ apiKey: 'YOUR_API_KEY' });

const analysis = await client.analyzeSentiment({
  domain: 'brandgraph.ai',
  competitors: ['ahrefs.com', 'semrush.com']
});

console.log('Semantic score:', analysis.sentimentScore);`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8]">
            <BookOpen size={12} />
            <span>{isFa ? "مرکز اسناد فنی و توسعه‌دهندگان" : "Developer Portal & Technical Specs"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            {isFa ? "مستندات و مرجع معماری هوشمندی برند" : "Documentation & Architecture Reference"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium max-w-3xl">
            {isFa
              ? "مستندات مهندسی در خصوص خط لوله پردازش مدل‌های هوش مصنوعی، ساختار گراف دانش برند، و الزامات امنیت و جداسازی مستاجرها."
              : "Complete system blueprints on multi-model pipelines, semantic graph traversal, and zero-trust database structures."}
          </p>
        </div>
      </section>

      {/* Docs Body Content */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-[260px_1fr] gap-12">

          {/* Interactive Navigation Sidebar */}
          <aside className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{isFa ? "بخش‌های مستندات" : "DOCUMENT SECTIONS"}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-[var(--text-secondary)]">

                <li>
                  <button
                    onClick={() => setActiveTab("quickstart")}
                    className={`w-full text-start block px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      activeTab === "quickstart"
                        ? "bg-slate-900 text-[#38bdf8] border border-white/5"
                        : "hover:bg-[var(--muted-surface)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Play size={14} />
                      <span>{isFa ? "راهنمای شروع سریع" : "Quick Start Guide"}</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("pipeline")}
                    className={`w-full text-start block px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      activeTab === "pipeline"
                        ? "bg-slate-900 text-[#38bdf8] border border-white/5"
                        : "hover:bg-[var(--muted-surface)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Cpu size={14} />
                      <span>{isFa ? "خط لوله پردازش مدل‌ها" : "AI Ingestion Pipeline"}</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("graph")}
                    className={`w-full text-start block px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      activeTab === "graph"
                        ? "bg-slate-900 text-[#38bdf8] border border-white/5"
                        : "hover:bg-[var(--muted-surface)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Network size={14} />
                      <span>{isFa ? "معماری گراف دانش" : "Knowledge Graph Design"}</span>
                    </span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-start block px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      activeTab === "security"
                        ? "bg-slate-900 text-[#38bdf8] border border-white/5"
                        : "hover:bg-[var(--muted-surface)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Database size={14} />
                      <span>{isFa ? "امنیت و جداسازی مستاجر" : "Tenant Security Spec"}</span>
                    </span>
                  </button>
                </li>

              </ul>
            </div>
          </aside>

          {/* Dynamic Content Panel */}
          <div className="space-y-10 min-w-0">

            {/* 1. QUICKSTART TAB */}
            {activeTab === "quickstart" && (
              <div className="space-y-6 animate-fade-in text-start">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                    <Play size={20} className="text-[#38bdf8]" />
                    <span>{isFa ? "راهنمای شروع سریع (API)" : "Quick Start API Reference"}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                    {isFa
                      ? "با فراخوانی وب‌سرویس‌های ما، شما می‌توانید سهم صدا و توصیه‌های هوش مصنوعی درباره‌ی برند خود را واکشی نمایید."
                      : "Access key semantic metrics of your company inside the model database via lightweight JSON REST interfaces."}
                  </p>
                </div>

                {/* Code Tabs */}
                <div className="rounded-2xl border border-[var(--glass-border)] bg-[#090d16] overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0c121e] border-b border-[var(--border)]">
                    <div className="flex gap-2 text-xs font-bold font-mono">
                      <button
                        onClick={() => setActiveCodeTab("curl")}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeCodeTab === "curl" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        cURL
                      </button>
                      <button
                        onClick={() => setActiveCodeTab("node")}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeCodeTab === "node" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
                      >
                        Node.js SDK
                      </button>
                    </div>
                    <Terminal size={14} className="text-slate-500" />
                  </div>
                  <div className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed text-start" dir="ltr">
                    <pre>{activeCodeTab === "curl" ? curlCode : nodeCode}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PIPELINE ARCHITECTURE TAB */}
            {activeTab === "pipeline" && (
              <div className="space-y-6 animate-fade-in text-start">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                    <Cpu size={20} className="text-[#38bdf8]" />
                    <span>{isFa ? "ساختار خط لوله پردازش چند مدل هوش مصنوعی" : "AI Processing Pipeline Architecture"}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                    {isFa
                      ? "این لایه برای پردازش، سناریوسازی و سنجش داده‌های ورودی و خروجی در ۶ مرحله مجزا طراحی گردیده است."
                      : "Abstract core pipeline coordinating multi-model query dispatching, factuality checking, and semantic calculations."}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-slate-900/40 space-y-2.5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#38bdf8]">{isFa ? "مرحله ۱: آداپتورهای مدل" : "Stage 1: IAIEngineAdapter"}</span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                      {isFa ? "ارسال و توزیع پرسش‌ها به OpenAI ChatGPT، Claude، Perplexity، و Google Gemini به‌طور کاملاً برخط." : "Handles dynamic query translation and multi-endpoint polling routines safely."}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-slate-900/40 space-y-2.5">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#f97316]">{isFa ? "مرحله ۲: پایش توهم و صحت" : "Stage 2: Factual Validation"}</span>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                      {isFa ? "کالبدشکافی داده‌های برگشتی و تخمین میزان صحت و گرامر پاسخ‌ها با لایه امتیازدهی اختصاصی." : "Sanitizes raw model outputs, masking user credentials and mapping hallucination indicators."}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-slate-900/60 font-semibold text-xs leading-relaxed text-[var(--text-secondary)] space-y-2">
                  <h4 className="text-sm font-bold text-white font-display">{isFa ? "راهبرد افزونه‌های مدل (Pluggable Adapters)" : "Pluggable Model Strategy"}</h4>
                  <p>
                    {isFa
                      ? "با واسط‌های سخت‌گیرانه تعبیه شده در پلتفرم، ما می‌توانیم در هر زمان هر مدل زبانی بزرگ بومی یا تجاری دیگر را به‌سادگی بدون تغییر منطق تجاری برنامه اضافه کنیم."
                      : "By defining solid interfaces, our platform supports seamless updates to modern LLMs (like GPT-4.5) simply by creating concrete adapter instances."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. KNOWLEDGE GRAPH DESIGN TAB */}
            {activeTab === "graph" && (
              <div className="space-y-6 animate-fade-in text-start">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                    <Network size={20} className="text-[#38bdf8]" />
                    <span>{isFa ? "طراحی و ساختار گراف روابط معنایی برند" : "Semantic Knowledge Graph Architecture"}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                    {isFa
                      ? "نگاشت شبکه‌ای موجودیت‌های برند، محصولات مرتبط، رقبای مستقیم و نوع ارجاعات موتورهای هوشمند."
                      : "How the platform maps and structures complex semantic association networks."}
                  </p>
                </div>

                <div className="p-6 rounded-3xl border border-[var(--glass-border)] bg-slate-950/60 space-y-4">
                  <h3 className="text-sm font-bold font-display text-[#38bdf8]">{isFa ? "رویکرد دیتابیس دوگانه (Relational + Graph DB)" : "Dual Database Strategy"}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                    {isFa
                      ? "۱. اطلاعات تراکنشی و لاگ‌ها درون پایگاه داده PostgreSQL نگهداری شده تا ویژگی‌های تراکنشی (ACID) و امنیت RLS در سطح فیلدها تضمین گردد."
                      : "1. Transactional Metadata: Stored securely in PostgreSQL tables supporting strict tenant boundaries and ACID transactions."}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                    {isFa
                      ? "۲. پیمایش‌های چندگانه و سنگین روابط به پایگاه داده Neo4j / Neptune سپرده می‌شود تا گراف همبستگی رقبا به‌سرعت محاسبه گردد."
                      : "2. Analytical Traversals: Synergizes with Neo4j using cypher queries to trace competitive circles and index overlap frequencies."}
                  </p>
                </div>
              </div>
            )}

            {/* 4. TENANT SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-fade-in text-start">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                    <Database size={20} className="text-[#38bdf8]" />
                    <span>{isFa ? "الزامات امنیتی و ایزوله‌سازی چندمستاجری (RLS)" : "Tenant Context & PostgreSQL RLS Spec"}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                    {isFa
                      ? "تفکیک داده‌ها به صورت کاملاً سخت‌گیرانه در سطح پایگاه داده اصلی برنامه به منظور پیشگیری از نشت اطلاعات."
                      : "Enterprise security architecture guaranteeing zero cross-contamination of competitor or corporate analysis datasets."}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[var(--glass-border)] bg-slate-900/60 font-mono text-xs text-slate-300 space-y-3" dir="ltr">
                  <span className="text-[10px] font-sans font-bold text-sky-400">SET LOCAL Current Tenant Context Pattern</span>
                  <pre className="overflow-x-auto bg-[#0a0d16] p-4 rounded-xl text-slate-400">
{`-- Transaction-Scoped Settings binding:
SET LOCAL app.current_tenant_id = 'your-tenant-uuid';

-- Enforces Row Level Security (RLS) policies dynamically:
SELECT * FROM entity_relationships
WHERE organization_id = current_setting('app.current_tenant_id');`}
                  </pre>
                </div>

                <div className="space-y-3 text-xs font-semibold text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{isFa ? "مسدودسازی نشت داده‌های مستاجر با سیاست‌های پیشرفته PostgreSQL." : "Strictly maps app session context to dynamic DB isolation policies."}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{isFa ? "تضمین ایمنی و جداسازی کامل ۱۲ جدول اطلاعاتی اصلی." : "RLS enforcement active on 12 security-critical relational tables."}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
