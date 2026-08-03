"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, Users, Award, ShieldCheck, Milestone, Cpu, Database, Network,
  CheckCircle2, Building, Flame, Zap, ArrowRight
} from "lucide-react";

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const faTechStack = [
    { label: "Next.js 16 (App Router)", desc: "رابط کاربری فوق سریع و رندرینگ سمت سرور (SSR) بهینه" },
    { label: "PostgreSQL & pgvector", desc: "مدیریت تراکنش‌های ایزوله دیتابیس و ذخیره‌سازی بردارهای جاسازی‌ معنایی" },
    { label: "Firecrawl Crawler Core", desc: "خزش عمیق و بدون تاخیر کدهای کانسپت سایت با IP Rotation" },
    { label: "OpenAI & Anthropic APIs", desc: "شبیه‌سازی و آنالیز پاسخ‌ها بر روی مدل‌های زبانی تراز اول دنیا" }
  ];

  const enTechStack = [
    { label: "Next.js 16 (App Router)", desc: "Hyper-fast server-rendered rendering architecture" },
    { label: "PostgreSQL & pgvector", desc: "Strictly isolated multi-tenant records with vector embeddings" },
    { label: "Firecrawl Crawler Core", desc: "Deep asynchronous on-demand scraping with premium IP rotation proxies" },
    { label: "OpenAI & Anthropic APIs", desc: "Real-time query simulations across elite global model layers" }
  ];

  const faValues = [
    { title: "دقت علمی و تجربی", desc: "جلوگیری از حدس و گمان در سنجش دیده‌شدن برند." },
    { title: "حریم خصوصی مطلق", desc: "ایزولاسیون کامل دیتای سازمان‌ها در بستر RLS دیتابیس." },
    { title: "نوآوری مستمر", desc: "همگام‌سازی روزانه الگوریتم‌های پایش با آخرین بروزرسانی مدل‌های زبانی." }
  ];

  const enValues = [
    { title: "Scientific Rigor", desc: "Eliminating guesswork in conversational share tracking." },
    { title: "Absolute Data Isolation", desc: "Enforcing hard tenant isolation across logical database boundaries." },
    { title: "Continuous Adaptability", desc: "Instantly updating scanning prompts as new LLMs are released." }
  ];

  const techStack = isFa ? faTechStack : enTechStack;
  const values = isFa ? faValues : enValues;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <AppSidebar />
      <LandingHeader />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Header Title */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "درباره‌ی سئورچبل" : "About Seorchable"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "پیشگامان بازاریابی و مانیتورینگ معنایی هوش مصنوعی" : "Pioneering Conversational Search Intelligence"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "سئورچبل (seorchable.ir) اولین پلتفرم جامع ایرانی برای بهینه‌سازی موتورهای پاسخگوی مولد (GEO & AEO) و پایش سهم صدای برندها در کانون مدل‌های زبانی بزرگ است."
                : "Seorchable is the leading software platform for Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO), tracking and maximizing brand citations in LLM responses."}
            </p>
          </div>

          {/* Vision & Mission Row */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-4 text-start">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Milestone size={20} />
              </div>
              <h3 className="text-lg font-black font-display text-white">{isFa ? "چشم‌انداز ما" : "Our Vision"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "جهانی را متصوریم که در آن پاسخ‌های دستیارهای صوتی و چت‌بات‌ها کاملاً معتبر، واقعی و عاری از توهم یا سوگیری مغرضانه باشد. ما در تلاشیم مرجعیت داده‌های شرکت‌ها را در الگوهای RAG تحکیم کنیم."
                  : "We envision a future where conversational AI answers are factual, reliable, and completely free from brand hallucinations. Our goal is to anchor every business to verified, linkable records."}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-4 text-start">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-black font-display text-white">{isFa ? "ماموریت ما" : "Our Mission"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "ماموریت ما تجهیز مدیران بازاریابی، روابط عمومی و سئو به ابزارهای رادار پایش سهم صدا و متدهای بهینه‌سازی کدهای اسکیما است تا وزن استناد خود را تا ۳۰۰٪ افزایش دهند."
                  : "Our mission is to arm CMOs, PR executives, and SEO leaders with precise share-of-voice data and structured entity schemas to secure clickable, authoritative citations inside LLM responses."}
              </p>
            </div>
          </div>

          {/* Product Philosophy & AI Expertise */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 text-start space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Cpu className="text-orange-400" size={24} />
              <span>{isFa ? "فلسفه محصول و تخصص هوش مصنوعی ما" : "Product Philosophy & AI Expertise"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
              {isFa
                ? "سئورچبل بر پایه‌ی اصول مهندسی عمیق داده و تخصص ویژه در مدل‌سازی برداری (Vector Embeddings) و پردازش طبیعی زبان (NLP) بنا شده است. فلسفه محصول ما، ارائه‌ی داده‌های فوق‌العاده شفاف، بلادرنگ و کاربردی است. ما معتقدیم در عصر چت‌بات‌ها، ابزارهای قدیمی رتبه‌بندی کلمات دیگر پاسخگوی مقتضیات سازمان‌ها نیستند و به یک پلتفرم جامع برای حفاظت، بهینه‌سازی و سنجش سهم صدای برندها نیاز است."
                : "At Seorchable, product development is steered by deep mathematical rigor and extensive expertise in vector database scaling, context parsing, and Natural Language Processing. Our philosophy centers on supplying actionable, real-time metrics. We believe old keyword tracking methodologies are inadequate in a zero-click, chatbot-dominated search landscape. Modern enterprise groups require comprehensive defensive shielding, factual validation, and real-time citation analysis."}
            </p>
          </div>

          {/* Why Customers Choose Seorchable */}
          <div className="space-y-6 text-start">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Flame className="text-red-500 animate-pulse" size={24} />
              <span>{isFa ? "چرا هلدینگ‌ها و سازمان‌ها سئورچبل را انتخاب می‌کنند؟" : "Why Enterprises Choose Seorchable"}</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-3">
                <h3 className="text-sm font-black text-[#38bdf8] flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{isFa ? "دقت آماری منحصربه‌فرد" : "Data Accuracy & Factual Correctness"}</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {isFa
                    ? "شبیه‌سازی سناریوها روی ۲۱ شاخص کلیدی با خطای آماری نزدیک به صفر."
                    : "Simulating queries across 21 core risk factors with near-zero mathematical error rates."}
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-3">
                <h3 className="text-sm font-black text-orange-400 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{isFa ? "ایزولاسیون کامل چندمستأجری" : "Logical Multi-Tenant Security"}</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {isFa
                    ? "اطمینان ۱۰۰٪ از عدم نفوذ یا نشت کدهای خزش‌شده و اسناد اختصاصی میان سازمان‌ها."
                    : "100% boundary safety, shielding confidential crawled data from cross-organization leakage."}
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack Overview */}
          <div className="space-y-6 text-start">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Database className="text-purple-400" size={24} />
              <span>{isFa ? "پشته فناوری و زیرساخت توسعه" : "State-of-the-Art Technology Stack"}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((tech, i) => (
                <div key={i} className="glass-panel p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]/20 hover:scale-[1.02] transition-transform space-y-2">
                  <h3 className="text-xs sm:text-sm font-black text-white">{tech.label}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Values */}
          <div className="space-y-6 text-start">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              <span>{isFa ? "ارزش‌های بنیادین مجموعه ما" : "Our Core Shared Values"}</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-3 hover:border-amber-500/20 transition-all">
                  <h3 className="text-sm font-black text-amber-400">{v.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unified CTA Box */}
          <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#1e293b]/70 to-slate-950 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--sky-blue-500)]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--orange-500)]/10 rounded-full blur-3xl" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {isFa ? "می‌خواهید عضوی از آینده وب هوشمند باشید؟" : "Unlock the Power of Conversational Search Optimization"}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? "با استفاده از پنل سنجش سئورچبل، یکبار برای همیشه دامنه‌تان را با روندهای هوش زبانی همگام کنید."
                  : "Connect your enterprise domain and launch automated crawlers in under 60 seconds."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link href={`/${locale}/pricing`}>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer">
                  <span>{isFa ? "مشاهده تعرفه‌ها و شروع کار" : "Explore Pricing & Plans"}</span>
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                  {isFa ? "درخواست دمو سازمانی" : "Request Enterprise Demo"}
                </button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
