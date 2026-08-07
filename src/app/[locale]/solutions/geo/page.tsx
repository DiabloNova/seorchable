"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, Globe, Cpu, CheckCircle, AlertTriangle, ListOrdered,
  HelpCircle, BookOpen, ChevronRight, ArrowRight, TrendingUp, Network
} from "lucide-react";

export default function GeoSolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const faFaqs = [
    { q: "بهینه‌سازی GEO چیست و چطور کار می‌کند؟", a: "بهینه‌سازی موتورهای جستجوی مولد (GEO)، روشی است که محتوا و کدهای فنی سایت شما را با الگوریتم‌های بازیابی اطلاعات موتورهایی مانند Perplexity، Gemini و SearchGPT هماهنگ می‌کند تا برند شما به عنوان مرجع اصلی با لینک استناد معرفی شود." },
    { q: "آیا برای GEO نیاز به تغییر کدهای وب‌سایت است؟", a: "بله، اما بیشتر شامل بهینه‌سازی کلمات کلیدی معنایی، افزودن ساختارهای JSON-LD، اصلاح تگ‌های معنایی متن و تقویت روابط موجودیت‌ها در بستر وب است." },
    { q: "تفاوت GEO با سئو کلاسیک چیست؟", a: "سئو کلاسیک روی فاکتورهای فیزیکی مانند بک‌لینک و چگالی کلمات کلیدی برای خزش ربات‌های قدیمی گوگل متمرکز است. GEO روی وزن ارتباط معنایی، غنای منبع اطلاعاتی و الگوهای فهم طبیعی چت‌بات‌ها تمرکز دارد." }
  ];

  const enFaqs = [
    { q: "What is Generative Engine Optimization (GEO)?", a: "GEO is a framework that aligns your web content with the factual retrieval algorithms of systems like SearchGPT, Perplexity, and Gemini, ensuring your brand gets selected as a primary linked citation." },
    { q: "Does GEO require modification of website code?", a: "Yes, but primarily through updating semantic microdata, injecting schema tags (JSON-LD), clarifying sentence linkages, and refining on-page text mapping." },
    { q: "How does GEO differ from traditional SEO?", a: "SEO values links, keyword density, and site speed for traditional Google crawlers. GEO focuses on deep citation probability, conversational context compatibility, and factual accuracy of your brand's records." }
  ];

  const faWorkflow = [
    { title: "خزشگر هوشمند GEO", desc: "اسکن ساختار معنایی سایت شما و ردیابی کلمات کلیدی متناسب با هوش مصنوعی مولد." },
    { title: "ارزیابی احتمال استناد", desc: "محاسبه درصد و ضریب احتمال انتخاب صفحات شما به عنوان منبع مستقیم چت‌بات‌ها." },
    { title: "تزریق قالب‌های داده معنایی", desc: "افزودن تگ‌های نشانه‌گذاری عمیق JSON-LD جهت پیوند به گراف‌های دانش ابری." },
    { title: "تست و شبیه‌سازی بلادرنگ", desc: "شبیه‌سازی نتایج بر روی موتورهای SearchGPT و Perplexity و سنجش رشد ارجاعات." }
  ];

  const enWorkflow = [
    { title: "Semantic GEO Crawl", desc: "Scanning your website to map keyword densities matching generative engine retrieval vectors." },
    { title: "Citation Probability Audit", desc: "Calculating the statistical probability of your domain being linked as an active resource by LLMs." },
    { title: "Structured Schema Injection", desc: "Deploying deep semantic JSON-LD modules to anchor your brand to decentralized knowledge bases." },
    { title: "Generative Engine Simulation", desc: "Simulating responses inside SearchGPT and Perplexity to guarantee measurable click-through improvements." }
  ];

  const faCapabilities = [
    { title: "بهینه‌سازی برداری محتوا", desc: "هم‌راستاسازی زاویه بردارهای معنایی سایت شما با بردارهای پرس‌وجوی چت‌بات‌های بزرگ بازار." },
    { title: "تثبیت مرجعیت استناد دامین", desc: "تقویت نشانه‌های بیرونی اعتبار برند شما در مراجع آزاد مانند ویکی‌ها و ژورنال‌های علمی." },
    { title: "اصلاح پیوندهای گراف دانش", desc: "همسان‌سازی داده‌های سایت با گراف دانش بین‌المللی برای مهار هرگونه سوگیری منفی علیه برند شما." }
  ];

  const enCapabilities = [
    { title: "Vector Alignment Engine", desc: "Matching your website’s embedding vectors to the typical conversational embeddings of top LLMs." },
    { title: "Domain Citation Authority", desc: "Boosting external trust anchors across public directories, Wikidata, and high-quality references." },
    { title: "Knowledge Graph Integration", desc: "Aligning on-site schemas with globally decentralized knowledge graph properties to stop bias." }
  ];

  const faChallenges = [
    { title: "کاهش کلیک و حذف ترافیک سنتی", desc: "چت‌بات‌ها جواب کاربران را مستقیماً می‌دهند، بدون اینکه نیازی به بازدید از سایت باشد." },
    { title: "بی‌توجهی مدل‌های زبانی به برند شما", desc: "معرفی رقبا به عنوان گزینه‌های برتر در سناریوهای مقایسه‌ای به دلیل نداشتن داده‌ی بهینه." },
    { title: "نبود ابزاری برای پایش جایگاه", desc: "ابزارهای سنتی سئو قادر به اندازه‌گیری سهم صدای شما در مدل‌های زبانی نیستند." }
  ];

  const enChallenges = [
    { title: "Loss of Traditional Organic Traffic", desc: "Generative search answers queries on the spot, causing massive organic traffic drops for un-optimized brands." },
    { title: "Brand Erasure in AI Decisions", desc: "Conversational bots constantly suggest competitors as prime solutions due to lack of vector optimization." },
    { title: "Inability to Track AI Share of Voice", desc: "Legacy SEO toolsets cannot measure your brand's presence, mentions, or index levels inside modern LLMs." }
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
        {/* Ambient background blur */}
        <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "بهینه‌سازی GEO" : "GEO Optimization"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "بهینه‌سازی موتورهای جستجوی هوشمند (GEO)" : "Generative Engine Optimization"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "ارتقای علمی رتبه، میزان استناد، و نمایش لینک سایت شما در خروجی پاسخ چت‌بات‌های نسل جدید و موتورهای مکالمه‌محور مانند Perplexity و SearchGPT."
                : "Boost your organic visibility, linked citation counts, and authoritative presence across advanced generative search engines."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-sky-400 font-display">۴.۸x</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "رشد ارجاع مستقیم موتورهای هوشمند" : "Growth in Direct LLM Citation Rates"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-orange-400 font-display">۶۵٪+</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "بهبود نرخ پاسخ مقایسه‌ای رقبا" : "Improvement in Comparative Brand Battles"}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 text-center space-y-2">
              <span className="text-3xl font-black text-emerald-400 font-display">۱۵٪+</span>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{isFa ? "صرفه‌جویی در بودجه ادز ورودی" : "Savings in Organic Funnel Ad Spending"}</p>
            </div>
          </div>

          {/* 1. Overview */}
          <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <Globe className="text-[#38bdf8]" size={24} />
              <span>{isFa ? "رویکرد انقلابی بهینه‌سازی GEO" : "Our Generative Engine Optimization Framework"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {isFa
                ? "در حالی که جهان وب به سرعت به سمت خلاصه‌سازی پاسخ‌ها پیش می‌رود، قرار گرفتن در لیست منابع استناد (Citation Links) به تنها راه جذب ترافیک از موتورهای جستجوی مولد تبدیل شده است. فریم‌ورک اختصاصی GEO سئورچبل، با مهندسی الگوهای درک طبیعی زبان (NLP) و بهینه‌سازی بردارهای محتوایی، صفحات شما را به کانون‌های اطلاعاتی مورد علاقه ربات‌های هوشمند مایکروسافت، گوگل و OpenAI مبدل می‌سازد."
                : "As search platforms shift from lists of blue links to conversational synthesis, securing clickable citation references is the only way to retain organic traffic. Seorchable's GEO optimizer analyzes semantic word embeddings, patterns page contexts to align with LLM query schemas, and ensures your products are highlighted as direct recommendations in Bing, Google, and SearchGPT."}
            </p>
          </div>

          {/* 2. Business Challenges */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={24} />
              <span>{isFa ? "مشکلاتی که بدون GEO با آن‌ها روبرو هستید" : "The Core Business Risks of Ignoring GEO"}</span>
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
              <Network className="text-sky-400" size={24} />
              <span>{isFa ? "قدرت پلتفرم سئورچبل در مدیریت GEO" : "Enterprise GEO Capabilities"}</span>
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

          {/* 4. Workflow */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <ListOrdered className="text-emerald-400" size={24} />
              <span>{isFa ? "مراحل بهینه‌سازی GEO دامنه‌ها" : "The Strategic GEO Workflow"}</span>
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
              <span>{isFa ? "سوالات متداول بهینه‌سازی موتورهای جستجوی مولد" : "GEO Frequently Asked Questions"}</span>
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

          {/* 6. Navigation Links & Resources */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--sky-blue-500)] block">{isFa ? "مستندات مهندسی مرتبط" : "Related Technical Documentation"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/docs/knowledge-graph-design`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "طراحی پایگاه گراف دانش معنایی" : "Knowledge Graph Design Spec"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/docs/infrastructure-architecture`} className="hover:text-[var(--sky-blue-500)] flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>{isFa ? "زیرساخت شبکه خزش توزیع‌شده" : "Infrastructure & Network Topology"}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <span className="text-[10px] font-black uppercase text-[var(--orange-500)] block">{isFa ? "سایر سرویس‌های کلیدی" : "Other Services"}</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li>
                  <Link href={`/${locale}/solutions/aeo`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "بهینه‌سازی موتورهای پاسخگو (AEO)" : "Answer Engine Optimization (AEO)"}</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/solutions/radar`} className="hover:text-[var(--orange-500)] flex items-center gap-1">
                    <ChevronRight size={12} className="rtl:rotate-180" />
                    <span>{isFa ? "رادار پایش رقابتی و سهم صدای بازار" : "Competitive Intelligence Radar"}</span>
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
                {isFa ? "آماده‌اید رتبه‌ی استنادی برند خود را باز پس بگیرید؟" : "Reclaim Your Brand’s Citation Footprint"}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {isFa
                  ? "با پیاده‌سازی گام‌های مهندسی GEO، ترافیک ورودی دامنه‌تان را در عصر چت‌بات‌ها ایمن سازید."
                  : "Deploy our GEO toolset and turn AI conversational engines into massive referral traffic generators."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link href={`/${locale}/#free-audit`}>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 cursor-pointer">
                  <Sparkles size={14} />
                  <span>{isFa ? "اجرای سریع اسکن GEO رایگان" : "Start Free GEO Audit"}</span>
                </button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer">
                  {isFa ? "تماس با کارشناسان فنی" : "Contact Technical Sales"}
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
