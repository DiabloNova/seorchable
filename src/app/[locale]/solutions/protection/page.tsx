"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, ShieldCheck, AlertCircle, CheckCircle, AlertTriangle, ListOrdered,
  HelpCircle, BookOpen, ChevronRight, ArrowRight, Shield, Cpu
} from "lucide-react";

export default function ProtectionSolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const faFaqs = [
    { q: "توهم هوش مصنوعی (Hallucination) درباره برند چیست؟", a: "توهم زمانی اتفاق می‌افتد که یک مدل زبانی بزرگ مانند ChatGPT یا Gemini در پاسخ به سؤالات کاربران درباره شرکت یا محصول شما، اطلاعات نادرست، خیالی، شماره تماس اشتباه یا خدمات غیرواقعی سرهم کند." },
    { q: "چگونه سئورچبل از برند ما در مقابل سوگیری‌ها محافظت می‌کند؟", a: "سئورچبل با ایجاد و همگام‌سازی مراجع مرجع توزیع‌شده (مانند گراف دانش اختصاصی دامین شما)، الگوهای استنادی چت‌بات‌ها را با پایگاه‌های داده معتبر همگام کرده و سوگیری‌های اشتباه را مهار می‌سازد." },
    { q: "پایش سلامت برند در چه بازه‌هایی انجام می‌شود؟", a: "در پنل‌های سازمانی و پیشرفته، شبیه‌سازی و تست کوئری‌های مخرب و حساس به صورت روزانه انجام شده و تله‌متری آن ثبت می‌گردد." }
  ];

  const enFaqs = [
    { q: "What is AI Brand Hallucination?", a: "Brand hallucination happens when LLMs synthesize fabricated or completely false details regarding your company—such as false support lines, locations, pricing models, or non-existent scandals." },
    { q: "How does Seorchable protect our brand integrity against chatbot bias?", a: "We construct explicit semantic records and link them directly to decentralized knowledge layers. This syncs chatbot citations with verified, high-authority corporate registries to prevent bias." },
    { q: "How often are the brand security scans executed?", a: "For Professional and Enterprise clients, our simulated penetration testing of brand-related prompts is executed on a daily basis." }
  ];

  const faWorkflow = [
    { title: "اسکن مستمر توهم برند", desc: "ردیابی و کشف ادعاهای غلط و خیالی مدل‌های زبانی درباره تاریخچه، محصولات و مدیران شما." },
    { title: "سنجش انحراف به سمت رقبا", desc: "شناسایی کوئری‌هایی که در آن‌ها چت‌بات‌ها به اشتباه کاربران را به جای شما به سمت رقبا هدایت می‌کنند." },
    { title: "تثبیت پایگاه حقایق (Fact Hub)", desc: "ثبت کدهای اطلاعاتی استاندارد و هموارسازی مسیر خزش مدل‌ها به سمت منابع مرجع رسمی." },
    { title: "اعلام هشدار سریع تغییرات", desc: "اطلاع‌رسانی آنی در صورت افت رتبه یا وقوع تغییرات ناگهانی در وزن و جهت‌گیری احساسی مدل‌ها." }
  ];

  const enWorkflow = [
    { title: "Continuous Hallucination Scan", desc: "Scanning and mapping fabricated claims about your executive team, prices, or core services." },
    { title: "Citation Deflection Tracking", desc: "Pinpointing key comparative queries where LLMs direct your potential leads to competitors." },
    { title: "Factual Truth Hub Integration", desc: "Structuring your true brand facts as high-priority, easily indexable schema registries." },
    { title: "Rapid Alert Defect Telemetry", desc: "Instantly notifying your security and marketing teams of sudden sentiment shifts inside AI models." }
  ];

  const faCapabilities = [
    { title: "سیستم دفع سوگیری‌های مخرب", desc: "اعمال الگوهای تصحیح اطلاعات در دایرکتوری‌های همکار هوش زبانی جهت همسان‌سازی پاسخ چت‌بات‌ها." },
    { title: "پایش روزانه ۲۱ سرفصل امنیتی", desc: "سنجش امنیت اطلاعاتی برند از منظر قوانین، دسترسی‌ها، اعتبار مالی و خدمات پس از فروش." },
    { title: "مهار ارجاعات مسموم یا سوگیرانه", desc: "کاهش نرخ نمایش اطلاعات گمراه‌کننده یا تخریب‌کننده‌ای که توسط عوامل خارجی وارد کانون خزش چت‌بات‌ها شده‌اند." }
  ];

  const enCapabilities = [
    { title: "Algorithmic Bias Correction", desc: "Deploying factual corrections to decentralized data catalogs that conversational bots query." },
    { title: "Daily Brand Security Scans", desc: "Auditing 21 separate risk verticals, protecting your factual integrity, phone details, and pricing structures." },
    { title: "Toxic Deflection Shielding", desc: "Neutralizing competitor keyword stuffing and fake claims before they poison chatbot scraping pools." }
  ];

  const faChallenges = [
    { title: "تخریب چهره عمومی برند در چت‌بات‌ها", desc: "مدل‌های زبانی ممکن است بر اساس اطلاعات مسموم وبلاگ‌های زرد، پاسخ‌های تخریبی صادر کنند." },
    { title: "هدایت مشتریان ارزشمند به سمت رقبا", desc: "از دست رفتن سرنخ‌های ورودی به علت سوگیری‌های ناخواسته مدل‌ها در پاسخ‌های مقایسه‌ای." },
    { title: "فقدان کنترل روی حافظه معنایی مدل‌ها", desc: "عدم توانایی ویرایش دستی یا رفرش مستقیم کش اطلاعات در مغز متفکر مدل‌های کلان زبانی." }
  ];

  const enChallenges = [
    { title: "Brand Defamation by AI Conversationalists", desc: "Chatbots often synthesize negative or false reviews from spam blogs as absolute truth." },
    { title: "Competitor Lead Deflection", desc: "Losing high-value buying queries when conversational systems recommend competitors over your verified solutions." },
    { title: "Semantic Memory Black Box", desc: "The inability of standard PR teams to edit, refresh, or verify cached details inside massive global LLM weights." }
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
        {/* Decorative Grid and Ambient Lights */}
        <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              <Shield size={12} className="animate-pulse" />
              <span>{isFa ? "محافظت از برند" : "Brand Protection"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "محافظت معنایی و اعتبارسنجی برند" : "Semantic Brand Protection"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "پایش شبانه‌روزی، اعتبارسنجی و تصحیح اطلاعات برند شما در هسته حافظه مدل‌های زبانی بزرگ برای مهار توهمات، رفع انحرافات رقابتی و تضمین یکپارچگی داده‌ها."
                : "Continuous active scanning of LLM weights to preempt brand defamation, correct factual bias, and stop lead redirection to competitors."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-emerald-400 font-display">۱۰۰٪</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "پایش حقایق و کانال‌های استناد" : "Factual Integrity Scanned"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-[#38bdf8] font-display">۹۴٪+</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "رفع موفقیت‌آمیز انحراف به رقیب" : "Success Rate in Correcting Bias"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-orange-400 font-display">۲۴/۷</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "پایش زنده و ردیابی سیگنال‌ها" : "Real-Time Telemetry & Watch"}</p>
            </div>
          </div>

          {/* 1. Overview */}
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={24} />
              <span>{isFa ? "ضرورت محافظت معنایی از برند در عصر هوش مصنوعی" : "Why Modern Brands Require Semantic Protection"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {isFa
                ? "در جهان تحت حاکمیت مدل‌های زبانی کلان (LLMs)، اعتبار برند دیگر صرفاً به سئوی سنتی و نظرات گوگل مپ محدود نیست. چت‌بات‌ها می‌توانند در صدم ثانیه با تولید گزاره‌های توهم‌آمیز و سوگیرانه، مشتریان بالقوه شما را به سمت رقبا منحرف سازند یا به تصویر عمومی برند لطمه جدی وارد کنند. پنل محافظت از برند سئورچبل با مانیتورینگ زنده و روزانه کلمات کلیدی کلیدی کسب‌وکار شما، هرگونه سوگیری یا خطا را فوراً شناسایی کرده و اصلاحات اساسی و ریشه‌ای را در گراف‌های مرجع این مدل‌ها اعمال می‌نماید."
                : "In an LLM-dominated world, brand reputation is no longer bounded by legacy reviews or links. AI assistants synthesize corporate data in milliseconds, and any factual hallucination can immediately redirect prospective enterprise buyers to your competitors. Seorchable's Brand Protection system continuously tests conversational scenarios to capture deflection risks and deploys factual updates directly to the knowledge bases queried by top chatbots."}
            </p>
          </div>

          {/* 2. Business Challenges */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={24} />
              <span>{isFa ? "چالش‌های مبرم حریم خصوصی و امنیت معنایی" : "Critical Reputation Challenges"}</span>
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
              <Cpu className="text-emerald-400" size={24} />
              <span>{isFa ? "قابلیت‌های انحصاری پلتفرم سئورچبل" : "Seorchable Defense Capabilities"}</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-emerald-500/[0.01] hover:border-emerald-500/20 transition-all space-y-3">
                  <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
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
              <span>{isFa ? "مراحل صیانت و مهار سوگیری‌های هوش مصنوعی" : "The Brand Protection Workflow"}</span>
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
              <span>{isFa ? "سوالات متداول محافظت و اعتبارسنجی برند" : "Brand Protection FAQs"}</span>
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
              <span className="text-[10px] font-black uppercase text-[var(--sky-blue-500)] block">{isFa ? "مستندات امنیتی مرتبط" : "Related Security Guides"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/docs/multi-tenant-isolation`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "ایزولاسیون کامل چندمستأجری و امنیت داده" : "Enterprise Tenant Isolation Design"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/docs/security-model`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "مدل جامع امنیت هوش مصنوعی و رمزنگاری" : "AI Security & Core Isolation Spec"}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--orange-500)] block">{isFa ? "سایر سرویس‌های تکمیلی" : "Complementary Services"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/solutions/aeo`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "بهینه‌سازی پاسخ‌ها و کادر پاسخ مستقیم (AEO)" : "Answer Engine Optimization (AEO)"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/solutions/geo`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "بهینه‌سازی موتورهای جستجوی مولد (GEO)" : "Generative Engine Optimization (GEO)"}</span>
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
                {isFa ? "اجازه ندهید پاسخ‌های توهم‌آمیز هوش مصنوعی اعتبار شما را خدشه‌دار کند" : "Secure Your Conversational Factual Shield Today"}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? "همین امروز با اجرای اسکن امنیتی، ریشه اطلاعات نادرست چت‌بات‌ها را خشک کرده و انحراف به سمت رقیب را مهار کنید."
                  : "Start scanning and correct deflection vulnerabilities before they impact your brand integrity."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link href={`/${locale}/#free-audit`}>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer">
                  <ShieldCheck size={14} />
                  <span>{isFa ? "شروع پایش امنیتی رایگان دامنه‌ی شما" : "Start Brand Protection Audit"}</span>
                </button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                  {isFa ? "درخواست جلسه با تیم امنیت" : "Request Enterprise Demo"}
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
