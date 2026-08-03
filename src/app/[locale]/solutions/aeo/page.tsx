"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, MessageSquare, Award, CheckCircle, AlertTriangle, Cpu,
  ListOrdered, HelpCircle, BookOpen, ChevronRight, ArrowRight, TrendingUp, Lightbulb
} from "lucide-react";

export default function AeoSolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const faFaqs = [
    { q: "تفاوت AEO با سئو سنتی چیست؟", a: "سئو سنتی بر روی رتبه‌بندی کلمات کلیدی در موتورهای جستجوی متکی بر پیوند (مانند گوگل) متمرکز است، در حالی که AEO محتوا را به گونه‌ای مهندسی می‌کند که مستقیماً به عنوان پاسخ نهایی در سیستم‌های چت‌بات هوش مصنوعی شبیه‌سازی و ارائه شود." },
    { q: "مدل‌های هدف در بهینه‌سازی AEO کدامند؟", a: "این سرویس مدل‌های هوشمند برتر جهان نظیر OpenAI GPT-4o، Anthropic Claude 3.5، Google Gemini و موتورهای استنادی مانند Perplexity را پوشش می‌دهد." },
    { q: "چقدر طول می‌کشد تا نتایج AEO نمایان شود؟", a: "تغییرات ساختاری صفحات معمولاً ظرف ۲ الی ۴ هفته پس از خزش مجدد موتورهای پاسخگو و همگام‌سازی گراف‌های دانش ابری بر روی نتایج مکالمات تاثیر مثبت می‌گذارد." }
  ];

  const enFaqs = [
    { q: "What is the difference between AEO and traditional SEO?", a: "Traditional SEO focuses on webpage links and keyword rankings in standard search engines. AEO formats and structures your content to serve as the direct, definitive answer synthesized inside conversational AI systems." },
    { q: "Which AI models are targeted by AEO?", a: "AEO targets premium conversational models including OpenAI's GPT-4o, Anthropic's Claude 3.5, Google Gemini, and citation-first engines like Perplexity." },
    { q: "How long does it take to see AEO results?", a: "Once your schemas and structure are updated, generative engines typically pick up the changes and update their conversational answers in 2 to 4 weeks." }
  ];

  const faWorkflow = [
    { title: "خزش و ارزیابی عمیق اولیه", desc: "اسکن کامل آدرس‌های سایت شما برای استخراج ساختارهای پرسش‌وپاسخ با Firecrawl." },
    { title: "تحلیل انطباق معنایی با LLMs", desc: "ارزیابی میزان هماهنگی و همپوشانی کلمات شما با الگوهای بازیابی معنایی مدل‌های زبانی." },
    { title: "قالب‌بندی و تولید اسکیما", desc: "تولید کدهای استاندارد FAQ و نشانه‌گذاری‌های معنایی برای جلوگیری از توهم هوش مصنوعی." },
    { title: "پایش مداوم و بهینه‌سازی زنده", desc: "رصد تغییرات پاسخ چت‌بات‌ها و اعمال اصلاحات سریع متناسب با بروزرسانی مدل‌ها." }
  ];

  const enWorkflow = [
    { title: "Deep Crawling & Audit", desc: "Full structural website scan using Firecrawl to isolate current Q&A and semantic configurations." },
    { title: "LLM Semantic Matching", desc: "Evaluating how well your textual context aligns with LLM retrieval vectors and token constraints." },
    { title: "Structured Schema Formatting", desc: "Generating premium FAQ microdata and structured entities to eliminate chatbot hallucination." },
    { title: "Continuous Monitoring", desc: "Tracking conversational shifts in real-time and adjusting content as generative models update." }
  ];

  const faCapabilities = [
    { title: "نشانه‌گذاری‌های هوشمند اسکیما", desc: "ساخت کدهای اسکیما متناسب با الگوهای بازیابی چت‌بات‌ها برای مهار توهمات هوش مصنوعی." },
    { title: "پالایش صریح متون فنی", desc: "ساده‌سازی متون پیچیده به قالب‌های روان، خلاصه‌شده و قابل هضم برای سیستم‌های هوش مصنوعی." },
    { title: "گراف ارتباطات محتوا", desc: "اتصال به گراف دانش سازمانی برای تحکیم وزن مرجعیت برند شما در پاسخ‌های هوش مصنوعی." }
  ];

  const enCapabilities = [
    { title: "Intelligent Microdata Schemas", desc: "Constructing advanced microdata blocks targeted specifically at LLM parser logic." },
    { title: "Content Simplification Engine", desc: "Refining complex technical explanations into direct, highly digestible summaries for chatbots." },
    { title: "Enterprise Graph Integration", desc: "Linking your assets directly to the corporate Knowledge Graph to cement authority." }
  ];

  const faChallenges = [
    { title: "ارجاعات نادرست و نامعتبر", desc: "مدل‌های زبانی غالباً اطلاعات نامعتبر یا قدیمی درباره برندها ارائه می‌دهند." },
    { title: "عدم حضور در کادر پاسخ مستقیم", desc: "کاهش کلیک‌ها به دلیل اینکه پاسخ‌ها درون خود چت‌بات حل شده و ترافیک به سایت هدایت نمی‌شود." },
    { title: "پراکندگی داده‌های برند در وب", desc: "نبود ساختار یکپارچه پرسش‌وپاسخ که منجر به نادیده گرفته شدن برند در تحلیل رقبا می‌شود." }
  ];

  const enChallenges = [
    { title: "Inaccurate Generative References", desc: "Chatbots often synthesize outdated or completely incorrect information about your company." },
    { title: "Zero-Click Visibility Loss", desc: "Users get immediate answers directly from conversational bots, bypassing traditional site visits entirely." },
    { title: "Fragmented Semantic Presence", desc: "The lack of formatted structural Q&A causes LLMs to ignore your brand in critical industry benchmarks." }
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-bold text-orange-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "بهینه‌سازی AEO" : "AEO Optimization"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "بهینه‌سازی موتورهای پاسخگو (AEO)" : "Answer Engine Optimization"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "مهندسی، ساختاردهی و قالب‌بندی عمیق محتوای وب‌سایت برای غلبه بر چالش‌های عدم حضور در کادر پاسخ‌های مستقیم چت‌بات‌ها و تضمین بالاترین سهم استناد در مدل‌های زبانی."
                : "Structure, refine, and format your company's digital footprint to win organic recommendations inside AI search assistants and language models."}
            </p>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-orange-400 font-display">۸۵٪+</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "کاهش خطاهای توهم برند" : "Reduction in Chatbot Hallucinations"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-[#38bdf8] font-display">۳.۵x</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "افزایش نرخ مرجعیت پاسخ" : "Increase in Direct References"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-emerald-400 font-display">۹۹٪</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "تضمین انطباق با اسکیماها" : "Schema Integration Score"}</p>
            </div>
          </div>

          {/* 1. Overview Section */}
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Cpu className="text-orange-400" size={24} />
              <span>{isFa ? "بررسی اجمالی و رویکرد AEO" : "Overview & AEO Philosophy"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {isFa
                ? "بهینه‌سازی موتورهای پاسخگو (AEO) آینده جستجو است. با تغییر رفتار مخاطبین از کلیک روی لینک‌ها به دریافت مستقیم جواب از دستیارهای هوش مصنوعی، برند شما باید کاندید شماره یک این دستیارها باشد. پلتفرم سئورچبل با شناسایی دقیق کوئری‌های متداول صنعت شما، متون وب‌سایتتان را ساختاربندی کرده و با الگوهای بازیابی اطلاعات RAG منطبق می‌سازد."
                : "Answer Engine Optimization represents the next epoch of search behavior. As user queries shift from link discovery to direct, conversational answers, brands must secure their spots inside LLM response modules. Seorchable continuously tracks key industry questions and transforms your website text to match modern RAG data retrieval patterns."}
            </p>
          </div>

          {/* 2. Business Challenges Section */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={24} />
              <span>{isFa ? "چالش‌های کلیدی کسب‌وکارها در عصر هوش مصنوعی" : "Business Challenges We Solve"}</span>
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

          {/* 3. Platform Capabilities Section */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <TrendingUp className="text-[#38bdf8]" size={24} />
              <span>{isFa ? "قابلیت‌های تخصصی پلتفرم سئورچبل در حوزه AEO" : "Advanced Platform Capabilities"}</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-sky-500/[0.01] hover:border-sky-500/20 transition-all space-y-3">
                  <h3 className="text-sm font-black text-[#38bdf8] flex items-center gap-2">
                    <CheckCircle size={15} />
                    <span>{cap.title}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Solution Workflow Steps */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <ListOrdered className="text-emerald-400" size={24} />
              <span>{isFa ? "نقشه راه پیاده‌سازی و مراحل کار" : "Our Step-by-Step Workflow"}</span>
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

          {/* 5. Frequently Asked Questions FAQ */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <HelpCircle className="text-purple-400" size={24} />
              <span>{isFa ? "سوالات متداول بهینه‌سازی موتور پاسخگو" : "AEO Frequently Asked Questions"}</span>
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

          {/* 6. Related Resources & Navigation Links */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--sky-blue-500)] block">{isFa ? "مستندات فنی مرتبط" : "Related Technical Guides"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/docs/architecture`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "معماری تحلیل معنایی هوش مصنوعی" : "AI Core Architecture Spec"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/docs/ai-pipeline-architecture`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "اتصال و یکپارچه‌سازی با LLMها" : "Large Language Model Integrations"}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--orange-500)] block">{isFa ? "سایر راهکارهای هوش مصنوعی" : "Other Solutions"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/solutions/geo`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "بهینه‌سازی موتورهای جستجوی هوشمند (GEO)" : "Generative Engine Optimization (GEO)"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/solutions/protection`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "رادار پایش رقبا و محافظت برند" : "Brand Protection & Citation Radar"}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 7. Bottom Call-to-action (Context-Aware CTA) */}
          <div className="p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#1e293b]/70 to-slate-950 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--sky-blue-500)]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--orange-500)]/10 rounded-full blur-3xl" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {isFa ? "آماده‌اید مرجع شماره یک مدل‌های زبان بزرگ شوید؟" : "Ready to Dominate Conversational AI Searches?"}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? "با استفاده از کیت مانیتورینگ سئورچبل، یکبار برای همیشه ابهامات و ارجاعات نامعتبر چت‌بات‌ها را برطرف کرده و ترافیک هدفمند به دست آورید."
                  : "Start scanning your site context today. Convert raw conversational queries into active pipeline referrals."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link href={`/${locale}/#free-audit`}>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer">
                  <Sparkles size={14} />
                  <span>{isFa ? "شروع آنالیز رایگان AEO دامنه‌ی شما" : "Start Free AEO Audit"}</span>
                </button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                  {isFa ? "درخواست جلسه دمو" : "Request Enterprise Demo"}
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
