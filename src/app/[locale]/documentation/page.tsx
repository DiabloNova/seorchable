"use client";

import React, { useState, use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Code2, Terminal, BookOpen, Layers, Play } from "lucide-react";

export default function DocumentationPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

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
            <span>{isFa ? "مرکز توسعه‌دهندگان" : "Developer Portal"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            {isFa ? "مستندات فنی و راهنمای پیاده‌سازی API" : "Technical Integration & API Reference"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-medium max-w-2xl">
            {isFa
              ? "نحوه کارکرد مدل‌های تحلیل معنایی، اسناد مربوط به توابع خزش Firecrawl و مستندات گام‌به‌گام اتصال به سرویس."
              : "Learn how to query semantic sentiment metrics, integrate crawler hooks, and retrieve brand entity graphs."}
          </p>
        </div>
      </section>

      {/* Docs Body Content */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-6 hidden lg:block">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{isFa ? "شروع به کار" : "Getting Started"}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-[var(--text-secondary)]">
                <li><span className="block px-3 py-2 rounded-lg bg-[var(--muted-surface)] text-[#38bdf8] cursor-pointer">{isFa ? "راهنمای شروع سریع" : "Quick Start Guide"}</span></li>
                <li><span className="block px-3 py-2 rounded-lg hover:bg-[var(--muted-surface)] cursor-pointer">{isFa ? "مفاهیم کلیدی" : "Key Concepts"}</span></li>
                <li><span className="block px-3 py-2 rounded-lg hover:bg-[var(--muted-surface)] cursor-pointer">{isFa ? "احراز هویت" : "Authentication"}</span></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{isFa ? "مرجع وب‌سرویس‌ها" : "API Endpoints"}</h3>
              <ul className="space-y-1.5 text-xs font-bold text-[var(--text-secondary)]">
                <li><span className="block px-3 py-2 rounded-lg hover:bg-[var(--muted-surface)] cursor-pointer">{isFa ? "ارسال دامنه خزش" : "POST Crawl Target"}</span></li>
                <li><span className="block px-3 py-2 rounded-lg hover:bg-[var(--muted-surface)] cursor-pointer">{isFa ? "تحلیل معنایی" : "GET Semantic Sentiment"}</span></li>
                <li><span className="block px-3 py-2 rounded-lg hover:bg-[var(--muted-surface)] cursor-pointer">{isFa ? "شبیه‌ساز روابط گراف" : "GET Entity Graph"}</span></li>
              </ul>
            </div>
          </aside>

          {/* Core Technical Content */}
          <div className="space-y-10 min-w-0">
            {/* Quickstart segment */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                <Play size={20} className="text-[#38bdf8]" />
                <span>{isFa ? "راهنمای شروع سریع (Quick Start)" : "Quick Start Guide"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "جهت شروع کار با سرویس و دریافت گزارش دیده‌شدن برند، ابتدا به سادگی کلید دسترسی API خود را از پیشخوان کاربری کپی کرده و اولین وب‌سرویس را به صورت آزمایشی فراخوانی نمایید."
                  : "To query your brand visibility programmatically, grab your security token inside the administrative panel, and issue a HTTP request to our REST middleware."}
              </p>

              {/* Code Container */}
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

            <div className="h-px bg-[var(--border)]" />

            {/* Ingestion & Crawling segment */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)] flex items-center gap-2">
                <Layers size={20} className="text-[#f97316]" />
                <span>{isFa ? "مکانیسم خزش و پردازش ساختاریافته" : "Ingestion & Crawler Architecture"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "موتور خزش ما با رعایت تمام قوانین فایل robots.txt، ساختار وب‌سایت، متاداده‌های هدر و تگ‌های معنایی را با Firecrawl واکشی کرده و به عنوان گره‌های جدید به گراف روابط برند اضافه می‌کند."
                  : "Our pipeline integrates Firecrawl infrastructure to capture dynamic HTML components, processing metadata structure according to row-level security parameters."}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] space-y-2">
                  <h4 className="text-sm font-bold font-display text-[var(--text-primary)]">{isFa ? "نرخ مجاز خزش (Rate Limiting)" : "Adaptive Crawling Rate"}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                    {isFa ? "سیستم به صورت پویا با توجه به پاسخ‌دهی سرور شما سرعت خزش را جهت جلوگیری از ممانعت یا فشار روی سرور تنظیم می‌کند." : "Crawl engines dynamically rate-limit targets to preserve active server resource safety."}
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] space-y-2">
                  <h4 className="text-sm font-bold font-display text-[var(--text-primary)]">{isFa ? "استانداردهای امنیتی خزش" : "Security & Agent Isolation"}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                    {isFa ? "تمامی فرآیندهای استخراج و خزش با تایید مالکیت و جداسازی کامل داده‌ها در سطح مستاجر انجام می‌شوند." : "All crawl sessions verify organizational ownership, maintaining strict row-level isolation."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
