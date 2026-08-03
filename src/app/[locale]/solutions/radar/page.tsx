"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, Compass, BarChart3, CheckCircle, AlertTriangle, ListOrdered,
  HelpCircle, BookOpen, ChevronRight, ArrowRight, Activity, Cpu
} from "lucide-react";

export default function RadarSolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const faFaqs = [
    { q: "سهم صدای هوش مصنوعی (AI Voice Share) چیست؟", a: "این شاخص به درصد دفعاتی اشاره دارد که دامنه‌ی شما در مقایسه با رقبای تجاری‌تان، در پاسخ به کوئری‌های مقایسه‌ای یا توصیه‌ای کاربران در چت‌بات‌ها (مانند '۱۰ نرم‌افزار برتر مدیریت مالی') ظاهر شده و لینک منبع آن ذکر می‌گردد." },
    { q: "رادار رقابتی چگونه دامنه‌ها را رصد می‌کند؟", a: "سیستم به طور خودکار هزاران سناریوی پرسش‌وپاسخ متداول بازار هدف شما را طراحی کرده، آن را بر روی مدل‌های زبانی شبیه‌سازی می‌کند و مراجع معرفی شده برای هر رقیب را استخراج می‌کند." },
    { q: "چگونه می‌توانیم مراجع رقیب را مال خود کنیم؟", a: "با مهندسی معکوس کدهای استناد، سئورچبل به شما می‌گوید رقیبتان در کدام ویکی‌ها، دایرکتوری‌ها، یا رسانه‌ها حضور یافته که توسط ربات‌های هوش مصنوعی کرال شده است تا شما نیز با همان متد حضور یابید." }
  ];

  const enFaqs = [
    { q: "What is AI Share of Voice (AI SOV)?", a: "AI SOV measures the percentage of times your brand is recommended or cited relative to your key industry competitors across conversational chatbot answers (e.g. 'What is the best ERP software in 2025?')." },
    { q: "How does the Competitive Radar monitor domains?", a: "The radar executes hundreds of mock query prompts in target segments daily, extracting LLM citation weights and uncovering the exact backend reference directories linked to competitors." },
    { q: "How can we intercept competitor citations?", a: "Our platform maps the precise sources cited by AI engines for your competitors, pointing out gaps across directories, wikis, and high-authority publications where your brand needs to be listed." }
  ];

  const faWorkflow = [
    { title: "تعریف رقبای هدف", desc: "افزودن لیست دامنه‌ها و برندهای رقیب حوزه تجاری خود در پنل کاربری سئورچبل." },
    { title: "شبیه‌سازی کوئری‌های مقایسه‌ای", desc: "اجرای روزانه و خودکار صدها سناریوی پرسش عمومی بازار با مدل‌های زبانی برجسته." },
    { title: "نقشه‌برداری از مراجع رقبا", desc: "کشف و فهرست‌بندی دقیق سایت‌ها و فروم‌هایی که چت‌بات‌ها برای توصیف رقیب به آن‌ها لینک داده‌اند." },
    { title: "تدوین استراتژی تهاجمی", desc: "ارائه توصیه‌های گام‌به‌گام جهت حضور در منابع مرجع و ارتقای سهم صدای برند شما." }
  ];

  const enWorkflow = [
    { title: "Define Core Competitors", desc: "Adding competitor URLs and company names directly into your Seorchable workspace." },
    { title: "Comparative Scenario Audits", desc: "Simulating hundreds of industry recommendation query prompts across elite generative systems." },
    { title: "Mapping Competitor Citations", desc: "Isolating the precise blogs, directories, or wikis cited by AI systems when referencing your rivals." },
    { title: "Deploy Optimization Plays", desc: "Providing actionable checklists to obtain listings on competitor-referenced domains and boost voice shares." }
  ];

  const faCapabilities = [
    { title: "تحلیل شکاف محتوایی معنایی", desc: "کشف کلیدواژه‌هایی که رقبا در آن‌ها مرجعیت تام دارند اما برند شما کاملاً غایب است." },
    { title: "نمودارهای بلادرنگ سهم بازار هوش", desc: "پایش لحظه‌ای نوسانات جایگاه و سهم حضور در بازار چت‌بات‌ها به تفکیک مدل‌های مختلف." },
    { title: "مهندسی معکوس الگوهای استناد", desc: "شناسایی داک‌های متصل، روابط موجودیت رقیب و فاکتورهای ترجیحی چت‌بات‌ها." }
  ];

  const enCapabilities = [
    { title: "Semantic Gap Mining", desc: "Unearthing content pillars where competitors are highly cited but your domain remains unreferenced." },
    { title: "Live AI Share of Voice Charts", desc: "Real-time visualization of market coverage fluctuations split across GPT-4o, Claude 3.5, and Perplexity." },
    { title: "Reference Vector Inversion", desc: "Reverse engineering competitor linkage weightings and entity network properties queried by AI bots." }
  ];

  const faChallenges = [
    { title: "انحصار بی‌صدای رقبا در چت‌بات‌ها", desc: "توصیه مکرر رقبای قدیمی توسط هوش مصنوعی به دلیل نداشتن رقیب فعال و بهینه شده." },
    { title: "کوری استراتژیک مارکتینگ", desc: "نداشتن متریک یا مبنایی برای سنجش عملکرد کمپین‌های روابط عمومی از دیدگاه هوش زبانی." },
    { title: "هدررفت بودجه سئو روی کلمات سوخته", desc: "تمرکز روی کلیدواژه‌های سنتی بدون آگاهی از اینکه چت‌بات‌ها کل بازار آن کلمه را تصاحب کرده‌اند." }
  ];

  const enChallenges = [
    { title: "Silent Competitor Dominance in LLMs", desc: "AI assistants recommending older, legacy rivals because your digital assets are not optimized for retrieval." },
    { title: "Strategic Marketing Blindspots", desc: "No viable feedback loop to measure how well public relations and marketing outreach influences AI references." },
    { title: "Wasted Legacy Keyword Spend", desc: "Chasing traditional search rankings on keywords already dominated and fully summarized by AI conversational layers." }
  ];

  const workflow = isFa ? faWorkflow : enWorkflow;
  const capabilities = isFa ? faCapabilities : enCapabilities;
  const challenges = isFa ? faChallenges : enChallenges;
  const faqs = isFa ? faFaqs : enFaqs;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <AppSidebar />
      <LandingHeader />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Ambient light blobs */}
        <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "رصد رقبا" : "Competitive Radar"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "رادار هوشمند پایش و سنجش رقبا" : "Competitive AI Radar"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "سنجش همه‌جانبه، تحلیل احساسات و مهندسی معکوس سهم صدای رقبای شما در پاسخ‌های مقایسه‌ای و توصیه‌ای تمام مدل‌های زبانی برتر جهان."
                : "Measure, analyze, and reverse engineer competitor share of voice, citations, and semantic authority across LLM responses."}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-[#38bdf8] font-display">۱۰+</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "مدل هوش زبانی تحت پوشش" : "Generative Models Monitored"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-orange-400 font-display">۲۴ ساعت</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "بروزرسانی داده‌های سهم صدا" : "Telemetry Refresh Rate"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-emerald-400 font-display">۱۰۰٪</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "دقت در کشف مراجع مخفی رقبا" : "Competitor Citation Accuracy"}</p>
            </div>
          </div>

          {/* 1. Overview */}
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Compass className="text-[#38bdf8]" size={24} />
              <span>{isFa ? "رویکرد رادار هوشمند پایش رقبا" : "The Core Intelligence Behind Competitive Radar"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {isFa
                ? "سهم صدا در هوش مصنوعی (AI Voice Share) شاخص استراتژیک جدید مارکتینگ است. هنگامی که یک مشتری از دستیار هوش مصنوعی خود می‌پرسد کدام نرم‌افزار برای کار من ایده‌آل است، مدل بر اساس داده‌های خزش‌شده خود سه برند برتر را پیشنهاد می‌دهد. رادار پایش رقبای سئورچبل، با بررسی مداوم پاسخ‌های توصیه‌ای، تحلیل عمیقی از وزن حضور و سهم صدای رقبایتان ارائه کرده و با کالبدشکافی مراجع مورد استناد آن‌ها، نقشه راه تهاجمی دقیقی برای جلو زدن از آن‌ها در اختیارتان می‌گذارد."
                : "AI Share of Voice (AI SOV) is the new definitive metric for growth. When buyers ask conversational models for vendor recommendations, the system recommends specific players based on its underlying indexing. Seorchable's Competitive Radar constantly tracks these recommendations, extracts competitor authority weights, reverse engineers cited references, and presents step-by-step optimization pathways to outpace your rivals."}
            </p>
          </div>

          {/* 2. Business Challenges */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={24} />
              <span>{isFa ? "تهدیدات رقابتی در غیاب رصد هوشمند" : "Competitive Pitfalls We Address"}</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {challenges.map((chal, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-red-500/[0.02] hover:border-red-500/20 transition-all space-y-3">
                  <h3 className="text-sm font-black text-rose-400">{chal.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">{chal.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Platform Capabilities */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Activity className="text-orange-400" size={24} />
              <span>{isFa ? "قابلیت‌های پلتفرم در مانیتورینگ رقبا" : "Competitive Scanning Scope"}</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-sky-500/[0.01] hover:border-sky-500/20 transition-all space-y-3">
                  <h3 className="text-sm font-black text-orange-400 flex items-center gap-2">
                    <CheckCircle size={15} />
                    <span>{cap.title}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Workflow */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <ListOrdered className="text-emerald-400" size={24} />
              <span>{isFa ? "مراحل خزش و تحلیل رقبا" : "Competitive Intelligence Workflow"}</span>
            </h2>
            <div className="grid sm:grid-cols-4 gap-4">
              {workflow.map((flow, i) => (
                <div key={i} className="glass-panel p-5 rounded-xl border border-[var(--border)] bg-emerald-500/[0.01] relative space-y-3 hover:scale-[1.02] transition-transform">
                  <span className="absolute top-3 right-3 text-lg font-black text-emerald-500/20">0{i + 1}</span>
                  <h3 className="text-xs sm:text-sm font-black text-white pt-2">{flow.title}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-semibold">{flow.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. FAQs */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={24} />
              <span>{isFa ? "سوالات متداول رادار پایش رقبا" : "Competitive Radar FAQs"}</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/20 space-y-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 inline-flex items-center justify-center text-[10px] font-black">؟</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-7 font-semibold">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Navigation & Resources */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--sky-blue-500)] block">{isFa ? "مستندات مهندسی مرتبط" : "Related Technical Guides"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/docs/cqrs-design`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "مدیریت کوئری‌های فشرده و طراحی CQRS" : "CQRS AI Pattern Specification"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/docs/persistence-model`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "مدل ماندگاری داده‌های کلان و استنادها" : "Enterprise DB Persistence Modeling"}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--orange-500)] block">{isFa ? "سایر راهکارهای مانیتورینگ" : "Alternative Defenses"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/solutions/protection`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "محافظت معنایی و مهار توهم برند" : "Factual Brand Protection"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/solutions/geo`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "بهینه‌سازی موتورهای جستجوی هوشمند (GEO)" : "Generative Engine Optimization (GEO)"}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 7. CTA */}
          <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#1e293b]/70 to-slate-950 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--sky-blue-500)]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--orange-500)]/10 rounded-full blur-3xl" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {isFa ? "نگذارید رقبایتان سهم صدای برند شما را بربایند" : "Don't Let Competitors Monopolize Conversational AI"}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? "با پیوستن به پلتفرم سئورچبل، پایش بلادرنگ بازار را آغاز کرده و دامنه‌تان را به عنوان مرجع شماره یک صنعت معرفی کنید."
                  : "Deploy our Competitive Radar today and stay steps ahead of rival citation captures."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link href={`/${locale}/#free-audit`}>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer">
                  <Compass size={14} />
                  <span>{isFa ? "شروع آنالیز رقابتی رایگان" : "Start Competitor Search Scan"}</span>
                </button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                  {isFa ? "درخواست دموی رقابتی" : "Request Enterprise Demo"}
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
