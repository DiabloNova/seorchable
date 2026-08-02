"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Cpu,
  Database,
  Check,
  X,
  Download,
  FileText,
  Activity,
  MessageSquare,
  Award,
  Network,
  Zap,
  Bot,
  Layers,
  ArrowDown,
  ExternalLink,
  Brain,
  Search,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Button } from "@/components/Button";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";
import { useAuth } from "@/components/AuthProvider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { RadialPolarGraph } from "@/components/features/graph/RadialPolarGraph";
import AppSidebar from "@/components/navigation/AppSidebar";

/**
 * Redesigned category-leading brand landing page for Optimus AI.
 * Completely localized, fully RTL-compliant, featuring sky blue/orange visual language,
 * interactive hero Knowledge Graph canvas, a live interactive mini-dashboard,
 * and high-fidelity technical flow and pricing sections.
 */
export default function MarketingLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const { session } = useAuth();

  // States for interactive mini-dashboard
  const [activeBrand, setActiveBrand] = useState<"optimus" | "digikala" | "snapp">("optimus");
  const [activeTab, setActiveTab] = useState<"sentiment" | "visibility" | "graph">("sentiment");

  // State for Graph Query search term in Interactive Mini-Dashboard
  const [graphQuery, setGraphQuery] = useState(isFa ? "اپتیموس" : "Optimus");

  // State to control active node in mini-dashboard graph view
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);

  // References for scrolling to sections
  const dashboardPreviewRef = useRef<HTMLDivElement | null>(null);
  const freeAuditRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll handler
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Live mini-dashboard mock database
  const liveDashboardData = {
    optimus: {
      sentiment: {
        score: 88,
        grade: "A+",
        pos: 72,
        neu: 21,
        neg: 7,
        text: isFa ? "برند اپتیموس دارای بازخورد فوق‌العاده مثبت در میان تمام مدل‌های زبانی است. مرجع معتبر علمی به عنوان رهبر هوشمندی برند شناخته می‌شود." : "Optimus AI brand exhibits highly positive semantic score. It is referenced as the authority in Brand Intelligence with minimal hallucinations."
      },
      chartData: [
        { date: "۰۱/۰۱", score: 78, competitors: 45 },
        { date: "۰۱/۰۲", score: 81, competitors: 48 },
        { date: "۰۱/۰۳", score: 84, competitors: 44 },
        { date: "۰۱/۰۴", score: 86, competitors: 49 },
        { date: "۰۱/۰۵", score: 88, competitors: 50 },
      ],
      nodes: [
        { id: "opt-1", label: isFa ? "اپتیموس هوش مصنوعی" : "Optimus AI", type: "برند", value: "موجودیت مرکزی" },
        { id: "opt-2", label: "AEO", type: "قابلیت", value: "پشتیبانی کامل" },
        { id: "opt-3", label: "GPT-4o", type: "مدل زبانی", value: "۹۲٪ دیده‌شدن" },
        { id: "opt-4", label: "Claude 3.5", type: "مدل زبانی", value: "۸۹٪ دیده‌شدن" },
      ]
    },
    digikala: {
      sentiment: {
        score: 64,
        grade: "B-",
        pos: 44,
        neu: 32,
        neg: 24,
        text: isFa ? "دیجی‌کالا دارای سهم بازار گسترده است، اما مدل‌های زبانی گزارش‌های متعددی در خصوص زمان تحویل کالا و پشتیبانی کاربران ارائه می‌دهند." : "Digikala occupies large voice share. However, language models frequently hallucinate about delivery delays and support issues."
      },
      chartData: [
        { date: "۰۱/۰۱", score: 62, competitors: 62 },
        { date: "۰۱/۰۲", score: 65, competitors: 60 },
        { date: "۰۱/۰۳", score: 63, competitors: 61 },
        { date: "۰۱/۰۴", score: 66, competitors: 58 },
        { date: "۰۱/۰۵", score: 64, competitors: 59 },
      ],
      nodes: [
        { id: "dk-1", label: isFa ? "دیجی‌کالا" : "Digikala", type: "رقیب", value: "سهم صدای ۶۵٪" },
        { id: "dk-2", label: isFa ? "تاخیر ارسال" : "Delivery Delay", type: "موضوع منفی", value: "۲۴٪ سیگنال‌ها" },
        { id: "dk-3", label: "GPT-4o", type: "مدل زبانی", value: "مرجع با خطا" },
        { id: "dk-4", label: isFa ? "مارکت‌پلیس" : "Marketplace", type: "مفهوم", value: "استناد قوی" },
      ]
    },
    snapp: {
      sentiment: {
        score: 58,
        grade: "C",
        pos: 35,
        neu: 43,
        neg: 22,
        text: isFa ? "اسنپ نفوذ بالایی در حوزه‌ی خدمات مسافرتی دارد، اما توهم‌های مدل زبانی گاهی خدمات فعال اسنپ را اشتباهاً متعلق به تپسی ذکر می‌کنند." : "Snapp is highly recognized for mobility. However, AI hallucination sometimes misattributes Snapp services to its competitor Tapsi."
      },
      chartData: [
        { date: "۰۱/۰۱", score: 55, competitors: 50 },
        { date: "۰۱/۰۲", score: 56, competitors: 52 },
        { date: "۰۱/۰۳", score: 59, competitors: 51 },
        { date: "۰۱/۰۴", score: 57, competitors: 53 },
        { date: "۰۱/۰۵", score: 58, competitors: 51 },
      ],
      nodes: [
        { id: "sn-1", label: isFa ? "اسنپ" : "Snapp", type: "رقیب", value: "سهم صدای ۵۴٪" },
        { id: "sn-2", label: isFa ? "توهم رقابتی" : "Hallucination", type: "موضوع منفی", value: "ارتباط با تپسی" },
        { id: "sn-3", label: "Claude 3.5", type: "مدل زبانی", value: "خطای استناد" },
        { id: "sn-4", label: isFa ? "اسنپ فود" : "SnappFood", type: "زیربرند", value: "دیده‌شدن مطلوب" },
      ]
    }
  };

  const brandNames = {
    optimus: isFa ? "اپتیموس هوش مصنوعی" : "Optimus AI",
    digikala: isFa ? "دیجی‌کالا" : "Digikala",
    snapp: isFa ? "اسنپ" : "Snapp"
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      {/* Overlay Drawer Hamburger Menu */}
      <AppSidebar />

      {/* 1. Glassmorphic Navigation Bar */}
      <LandingHeader />

      {/* Hero Section Container */}
      <section className="relative isolate pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Animated Sky Blue / Orange Background Orbs & Gradients */}
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-tr from-[#f97316]/10 to-[#38bdf8]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Subtle grid backdrop layer */}
        <div className="absolute inset-0 grid-backdrop opacity-[0.3] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Farsi Display Title and Content Block */}
          <div className="space-y-8 text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-2 text-xs font-bold text-[#38bdf8]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
              </span>
              {isFa ? "موتور تحلیل هوش مصنوعی نسل جدید" : "Next-Generation Brand AI Analytics"}
            </span>

            <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl md:text-6xl leading-[1.2] text-balance">
              <span className="text-[var(--text-primary)] block">
                {isFa ? "هوش مصنوعی برند شما را" : "AI Analyzes"}
              </span>
              <span className="text-gradient-brand font-extrabold inline-block mt-2">
                {isFa ? "تحلیل می‌کند" : "Your Brand Context"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {isFa
                ? "پلتفرم تحلیل معنایی، پایش توهم و بهینه‌سازی موتورهای پاسخگو (AEO). از نحوه درک برند خود در ChatGPT، Claude و Perplexity مطلع شوید."
                : "The world's premium semantic analysis and answer engine optimization (AEO) platform. Manage how LLMs perceive and recommend your brand."}
            </p>

            {/* Shimmer CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2 w-full sm:w-auto">
              {/* Primary Button: Shimmer Gradient */}
              <button
                onClick={() => scrollToRef(freeAuditRef)}
                className="relative overflow-hidden group px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl text-white text-sm sm:text-base font-bold bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-lg shadow-[#38bdf8]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#f97316]/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                style={{
                  boxShadow: "0 10px 20px -5px rgba(56, 189, 248, 0.3), 0 4px 6px -2px rgba(249, 115, 22, 0.2)",
                }}
              >
                {/* Gradient shimmer sheen overlay */}
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:animate-shimmer" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
                <span>{isFa ? "شروع تحلیل رایگان" : "Start Free Audit"}</span>
                <ArrowRight size={16} className="rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Secondary Button: Premium Glassmorphic */}
              <button
                onClick={() => scrollToRef(dashboardPreviewRef)}
                className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold bg-slate-950/40 hover:bg-[#38bdf8]/10 text-[var(--text-primary)] border border-[#38bdf8]/30 hover:border-[#38bdf8]/80 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{isFa ? "مشاهده دمو" : "View Live Demo"}</span>
                <ArrowDown size={16} className="animate-bounce" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[var(--border)] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm font-bold text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#38bdf8] font-display">۱۲,۰۰۰+</span>
                  <span>{isFa ? "صفحه تحلیل‌شده" : "Pages Analyzed"}</span>
                </div>
                <div className="h-4 w-[1px] bg-[var(--border)]" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#f97316] font-display">۸۵۰+</span>
                  <span>{isFa ? "برند پایش‌شده" : "Brands Tracked"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Polar Radar Graph Container with Guide/Legend */}
          <div className="flex flex-col gap-4 w-full">
            <div className="relative w-full h-[350px] sm:h-[390px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-2xl overflow-hidden group">
              <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-[#38bdf8]/20 text-xs text-[#38bdf8] backdrop-blur-lg">
                <Network size={14} className="animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider">{isFa ? "گراف روابط زنده" : "Interactive KG Core"}</span>
              </div>

              <RadialPolarGraph className="w-full h-full" />

              <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[10px] text-slate-400">
                  {isFa ? "موس خود را روی بخش‌های مختلف حرکت دهید تا ارتباطات و بردارهای استنادی را پایش کنید" : "Hover over segments to inspect semantic vectors and citation patterns"}
                </p>
              </div>
            </div>

            {/* Guide & Legend for the Live Relationships Graph */}
            <div className="glass-panel border border-white/10 rounded-2xl p-4 sm:p-5 bg-slate-950/75 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#f97316] animate-pulse" />
                <h4 className="text-xs sm:text-sm font-black font-display text-white">
                  {isFa ? "راهنمای علائم و شاخص‌های گراف روابط زنده" : "Live Relationships Graph Guide & Legend"}
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                {/* Column 1: Colors & Signals */}
                <div className="space-y-3">
                  <h5 className="font-bold text-[var(--sky-blue-500)] text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">
                    {isFa ? "۱. تحلیل رنگ‌ها و سیگنال‌ها" : "1. Color & Signal Analysis"}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#38bdf8]/20 border border-[#38bdf8] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-200">{isFa ? "سیگنال آبی آسمانی (موج ارگانیک):" : "Sky Blue Wave (Organic Signal)"}</p>
                        <p className="text-slate-400 text-[10px]">
                          {isFa
                            ? "نشان‌دهنده قدرت حضور ارگانیک و انطباق معنایی برند شما در مدل‌های هوش مصنوعی زبانی است."
                            : "Represents organic semantic strength and natural alignment of your brand across model training data."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-[#c53f47]/20 border border-[#c53f47] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-200">{isFa ? "سیگنال قرمز گرم (سیگنال رقبا):" : "Warm Red Wave (Competitor Signal)"}</p>
                        <p className="text-slate-400 text-[10px]">
                          {isFa
                            ? "پایش چگالی حضور رقبا و سهم ارجاعات چت‌بات‌ها به سایر کسب‌وکارهای موازی بازار را نمایش می‌دهد."
                            : "Monitors competitive references and how often model citations are diverted to other market competitors."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Lines & Values */}
                <div className="space-y-3">
                  <h5 className="font-bold text-[var(--orange-500)] text-[10px] uppercase tracking-wider border-b border-white/5 pb-1">
                    {isFa ? "۲. تحلیل حلقه‌ها و مدارهای رادار" : "2. Lines & Radial Thresholds"}
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1 items-center shrink-0 mt-1 font-mono text-[9px] text-slate-400 font-bold">
                        <span>100%</span>
                        <div className="w-5 h-px border-t border-slate-500 border-dashed" />
                        <span>20%</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{isFa ? "مدارهای دایره‌ای هم‌مرکز (فاصله معنایی):" : "Concentric Gray Tracks (Semantic Distance)"}</p>
                        <p className="text-slate-400 text-[10px]">
                          {isFa
                            ? "نشان‌دهنده ضریب اطمینان استناد است (۲۰٪ در مرکز تا ۱۰۰٪ در پوسته بیرونی). نزدیکی به مرز ۱۰۰٪ به معنای پایداری ارجاع است."
                            : "Measures semantic proximity and citation confidence (from 20% core to 100% outer rim). Sits highest near the edge."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-px border-t-2 border-slate-400 border-dashed shrink-0 mt-2.5" />
                      <div>
                        <p className="font-bold text-slate-200">{isFa ? "مرز دایره‌ای نقطه‌چین (آستانه مطلوب):" : "Middle Dashed Track (Optimal Threshold)"}</p>
                        <p className="text-slate-400 text-[10px]">
                          {isFa
                            ? "خط آستانه ۵۰٪ بقا و دیده‌شدن را نشان می‌دهد؛ انحناهای موجی باید بالاتر از این خط حرکت کنند تا ارجاع پایدار باشد."
                            : "The vital 50% baseline threshold. Wave contours must expand beyond this circle to ensure predictable citation delivery."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diamond Pointer Explanations */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-4 justify-around text-[10px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[#38bdf8] shrink-0" />
                  <span>{isFa ? "لوزی آبی (p1): سهم صدای برند" : "Blue Diamond (p1): Brand Share of Voice"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[#c53f47] shrink-0" />
                  <span>{isFa ? "لوزی قرمز (p2): ریسک توهم" : "Red Diamond (p2): Hallucination Risk"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[#c53f47] opacity-75 shrink-0" />
                  <span>{isFa ? "لوزی قرمز کمرنگ (p3): خروج استناد" : "Red/Teal Diamond (p3): Citation Leakage"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section (Technical Depth with 4-Step Flow) */}
      <section id="process" className="py-24 bg-[var(--background-subtle)]/30 dark:bg-[#0a0d16]/30 relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "پیکربندی هوشمند و جریان تحلیل فنی" : "Under the Hood: Enterprise Pipeline"}
            </h2>
            <p className="text-[var(--text-muted)] md:text-lg">
              {isFa
                ? "چگونه مدل اختصاصی ما ساختار وب‌سایت شما را برخط پایش کرده و بر اساس گراف دانش، دیده‌شدن را ارتقا می‌دهد."
                : "Our automated sequence ingests corporate data, extracts entities, and models recommendation scores."}
            </p>
          </div>

          {/* 4-Step Visual Flow Cards */}
          <div id="features" className="grid md:grid-cols-4 gap-6 relative">
            {/* Step 1: Crawl */}
            <div className="glass-panel hover-lift p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۱
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6">
                <Globe size={24} className="animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۱. خزش هوشمند (Crawl)" : "1. Smart Crawling"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                {isFa
                  ? "خزش تمام‌عیار محتوای وب‌سایت با موتور Firecrawl جهت یافتن محتواهای ساختاریافته و داده‌های مخفی."
                  : "We crawl corporate websites using specialized Firecrawl infrastructure, gathering deep text elements."}
              </p>
              <Link
                href={`/${locale}/docs/infrastructure-architecture`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isFa ? "مستندات خزش هوشمند" : "Read Crawl Docs"}</span>
                <ExternalLink size={10} />
              </Link>
            </div>

            {/* Step 2: Parse */}
            <div className="glass-panel hover-lift p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۲
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] mb-6">
                <Database size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۲. استخراج موجودیت‌ها (Parse)" : "2. Entity Parsing"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                {isFa
                  ? "استخراج روابط و موجودیت‌های برند، رقبای کلیدی، مفاهیم و الگوها با دقت دستوری و گرامری بسیار بالا."
                  : "Processing textual structures to map complex brand schemas, proprietary assets, and synonyms."}
              </p>
              <Link
                href={`/${locale}/docs/knowledge-graph-design`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#f97316] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isFa ? "مستندات نگاشت موجودیت" : "Read Schema Docs"}</span>
                <ExternalLink size={10} />
              </Link>
            </div>

            {/* Step 3: Analyze */}
            <div className="glass-panel hover-lift p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۳
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۳. تحلیل معنایی (Analyze)" : "3. Semantic Analysis"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                {isFa
                  ? "تحلیل معنایی با LLM برای شناسایی میزان تفاهم و سهم حضور برند در پاسخ‌های هوش مصنوعی."
                  : "Assessing LLM sentiment vectors, keyword associations, and competitor citation frequencies."}
              </p>
              <Link
                href={`/${locale}/docs/ai-pipeline-architecture`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isFa ? "مستندات تحلیل مدل‌ها" : "Read LLM Docs"}</span>
                <ExternalLink size={10} />
              </Link>
            </div>

            {/* Step 4: Visualize */}
            <div className="glass-panel hover-lift p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۴
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۴. گراف دانش و توصیه‌ها (Visualize)" : "4. Graph Mapping"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                {isFa
                  ? "نمایش روابط گراف دانش، پایش توهم و تولید راهکارهای بهبود رتبه برند در هوش مصنوعی (AEO)."
                  : "Generating interactive graph networks and direct optimization proposals for brand discovery."}
              </p>
              <Link
                href={`/${locale}/docs/knowledge-graph-design`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isFa ? "مستندات گراف دانش" : "Read Graph Docs"}</span>
                <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Live Mini-Dashboard Section */}
      <section id="platforms" ref={dashboardPreviewRef} className="py-24 bg-[var(--background)] dark:bg-[#080b11] relative border-t border-[var(--border)]">
        <div className="absolute top-1/4 right-1/3 w-[30vw] h-[30vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "پیش‌نمایش تعاملی پیشخوان هوش برند" : "Interactive Live Dashboard Preview"}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg">
              {isFa
                ? "بر روی رقبای مختلف کلیک کنید تا تحلیل‌های معنایی زنده و داده‌های واقعی پلتفرم را مشاهده کنید."
                : "Toggle competitor contexts to simulate real-time semantic analysis and citation mapping."}
            </p>
          </div>

          {/* Mini-Dashboard Mock Layout */}
          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden grid lg:grid-cols-[250px_1fr] min-h-[520px]">
            {/* Left Sidebar inside preview */}
            <div className="border-b lg:border-b-0 lg:border-l border-[var(--glass-border)] bg-[var(--muted-surface)]/20 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {isFa ? "انتخاب برند هدف" : "Target Brand Scope"}
                  </h3>
                  <div className="space-y-2">
                    {(["optimus", "digikala", "snapp"] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-start transition-all ${
                          activeBrand === brand
                            ? "bg-gradient-to-r from-[#38bdf8]/20 to-[#f97316]/10 text-[var(--text-primary)] border border-[#38bdf8]/40"
                            : "text-[var(--text-muted)] hover:bg-[var(--muted-surface)] hover:text-[var(--text-primary)] border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${brand === "optimus" ? "bg-[#38bdf8]" : "bg-orange-500"}`} />
                          <span>{brandNames[brand]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-[var(--border)]" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {isFa ? "ابزارها و قابلیت‌ها" : "Analytics Features"}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: "sentiment", label: isFa ? "تحلیل احساسات و کلمات کلیدی" : "Sentiment & Claims", icon: MessageSquare },
                      { id: "visibility", label: isFa ? "شاخص دیده‌شدن برخط" : "AI Visibility Score", icon: Activity },
                      { id: "graph", label: isFa ? "گراف دانش اختصاصی" : "Mapped Brand Graph", icon: Network },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium text-start flex items-center gap-2.5 transition-all ${
                            activeTab === tab.id
                              ? "bg-[var(--muted-surface)] text-[var(--text-primary)] font-bold border border-[var(--border)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--muted-surface)] hover:text-[var(--text-primary)] border border-transparent"
                          }`}
                        >
                          <Icon size={14} className="text-[#38bdf8]" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Try It Yourself Bottom Button inside Dashboard */}
              <div className="pt-6">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg shadow-sky-500/10 hover:scale-[1.02] transition-transform cursor-pointer text-center"
                >
                  {isFa ? "تحلیل وب‌سایت خودتان" : "Run Your Free Audit"}
                </button>
              </div>
            </div>

            {/* Right content view area */}
            <div className="p-8 flex flex-col justify-between bg-[var(--muted-surface)]/10">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border)] mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
                      {activeTab === "sentiment" && (isFa ? "گزارش درک معنایی و توهم هوش زبانی" : "Semantic Sentiment Insight")}
                      {activeTab === "visibility" && (isFa ? "نمودار هوشمندی و دیده‌شدن برند" : "LLM Visibility Index Trend")}
                      {activeTab === "graph" && (isFa ? "شبکه روابط معنایی گراف دانش" : "Live Localized Entity Network")}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {isFa ? `در حال نمایش نتایج زنده برای: ` : "Current context: "}
                      <span className="text-[#38bdf8] font-bold">{brandNames[activeBrand]}</span>
                    </p>
                  </div>

                  {/* High Quality Quality Indicator Badge */}
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full bg-[var(--muted-surface)] border border-[var(--border)] flex items-center gap-2 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[var(--text-muted)] uppercase tracking-widest text-[9px]">{isFa ? "محیط آزمایشی فعال" : "SANDBOX SECURE"}</span>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Screen: Sentiment Analysis */}
                {activeTab === "sentiment" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Score card */}
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-center">
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "نمره سلامت برند" : "Semantic Score"}</span>
                        <div className="text-3xl font-black text-[#38bdf8] mt-1 font-display">
                          {liveDashboardData[activeBrand].sentiment.score} <span className="text-xs text-[var(--text-muted)]">/ ۱۰۰</span>
                        </div>
                        <div className="text-[11px] text-emerald-500 font-bold mt-1">
                          {isFa ? "رتبه کیفی: " : "Grade: "} {liveDashboardData[activeBrand].sentiment.grade}
                        </div>
                      </div>

                      {/* Positive distribution */}
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "توزیع سیگنال‌ها" : "Sentiment Mix"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-500">{isFa ? "مثبت" : "Positive"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.pos}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.pos}%` }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--text-muted)]">{isFa ? "خنثی" : "Neutral"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.neu}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-slate-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neu}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Negative issues */}
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "ریسک توهم و خطا" : "Hallucination Risk"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between">
                            <span className="text-rose-500">{isFa ? "پاسخ نادرست / کاذب" : "Risk of Claim Error"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.neg}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neg}%` }} />
                          </div>
                          <p className="text-[9px] text-[var(--text-muted)] leading-tight mt-1">
                            {isFa ? "میزان ارجاع اشتباه به رقیب یا استناد نامعتبر" : "Percentage of inaccurate facts generated"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--muted-surface)]/30">
                      <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{isFa ? "تحلیل کالبدشکافی زبان طبیعی" : "Semantic AI Analysis Verdict"}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                        {liveDashboardData[activeBrand].sentiment.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub Tab Screen: AI Visibility Score over time */}
                {activeTab === "visibility" && (
                  <div className="space-y-4 animate-fade-in" style={{ direction: "ltr" }}>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveDashboardData[activeBrand].chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                          <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "8px" }}
                            labelStyle={{ color: "var(--text-primary)", fontWeight: "bold" }}
                          />
                          <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} name={isFa ? "سلامت برند شما" : "Your Brand Score"} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="competitors" stroke="#f97316" strokeWidth={2} name={isFa ? "میانگین رقبا" : "Competitors Avg"} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] text-center" style={{ direction: isFa ? "rtl" : "ltr" }}>
                      {isFa
                        ? "نمودار ردیابی سلامت برند (Sky Blue) در مقابل رقبای بازار (Orange) در مدل‌های ChatGPT-4o و Gemini Pro"
                        : "Tracking Brand Health Score (Sky Blue) against market average (Orange) across top LLMs."}
                    </p>
                  </div>
                )}

                {/* Sub Tab Screen: Mapped Brand Graph */}
                {activeTab === "graph" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-4 gap-3">
                      {liveDashboardData[activeBrand].nodes.map((n, idx) => (
                        <div
                          key={n.id}
                          onClick={() => setSelectedGraphNode(selectedGraphNode === n.id ? null : n.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center ${
                            selectedGraphNode === n.id
                              ? "border-[#38bdf8] bg-[#38bdf8]/10 shadow-lg"
                              : "border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--glass-bg)]"
                          }`}
                        >
                          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1 truncate">{n.label}</h4>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--muted-surface)] text-[var(--text-muted)] uppercase font-bold tracking-widest">{n.type}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-2 truncate font-medium">{n.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 text-center">
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                        {isFa
                          ? "موجودیت‌های بالا مستقیماً از خزش ساختار کلمات کلیدی برند شما استخراج شده و گراف روابط را در مدل زبانی بهبود می‌دهند."
                          : "These structures are retrieved dynamically from crawled documents, strengthening brand discovery vectors."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Footer with redirection to Free Audit */}
              <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isFa
                    ? "آیا می‌خواهید گزارش کامل ساختار و موجودیت‌های وب‌سایت خود را ببینید؟"
                    : "Ready to inspect your brand's actual entity schema and hallucination profile?"}
                </span>
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--muted-surface)] border border-[var(--border)] text-[#38bdf8] hover:text-[var(--text-primary)] hover:border-[#38bdf8] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isFa ? "شروع تحلیل فنی و ساختاری" : "Run Technical Audit Now"}</span>
                  <ArrowRight size={14} className="rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table Section */}
      <section id="metrics" className="py-24 bg-[var(--background-subtle)]/30 dark:bg-[#0a0d16]/30 relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "مقایسه کارایی: پلتفرم‌های سنتی در مقابل نسل جدید" : "Optimus AI vs. Traditional SEO Tools"}
            </h2>
            <p className="text-[var(--text-muted)]">
              {isFa
                ? "چرا ابزارهای سئو سنتی برای موفقیت در عصر موتورهای جستجوی هوش مصنوعی کافی نیستند؟"
                : "Standard SEO tools optimize for search engine indexes. Optimus AI builds brand trust in semantic memory."}
            </p>
          </div>

          {/* Glassmorphic Comparison Table */}
          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[var(--text-secondary)]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted-surface)]/40 text-[var(--text-secondary)]">
                    <th className="py-5 px-6 font-display font-extrabold text-sm text-start">{isFa ? "ویژگی‌ها و قابلیت‌های تحلیل" : "Core Capabilities"}</th>
                    <th className="py-5 px-6 font-display font-black text-sm text-[#38bdf8] text-center bg-[#38bdf8]/5">{isFa ? "Optimus AI" : "Optimus AI"}</th>
                    <th className="py-5 px-6 font-display font-bold text-sm text-center">{isFa ? "Ahrefs" : "Ahrefs"}</th>
                    <th className="py-5 px-6 font-display font-bold text-sm text-center">{isFa ? "SEMrush" : "SEMrush"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-bold">
                  {/* Row 1 */}
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4.5 px-6 text-[var(--text-secondary)] text-start">{isFa ? "تحلیل معنایی با LLM و رفع توهم" : "Semantic LLM Analysis & Hallucination Watch"}</td>
                    <td className="py-4.5 px-6 text-center bg-[#38bdf8]/5">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4.5 px-6 text-[var(--text-secondary)] text-start">{isFa ? "ترسیم هوشمند گراف دانش برند" : "Brand Entity Knowledge Graph Mapping"}</td>
                    <td className="py-4.5 px-6 text-center bg-[#38bdf8]/5">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4.5 px-6 text-[var(--text-secondary)] text-start">{isFa ? "تحلیل شاخص دیده‌شدن برخط (AI Visibility)" : "LLM Visibility Index Analysis"}</td>
                    <td className="py-4.5 px-6 text-center bg-[#38bdf8]/5">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4.5 px-6 text-[var(--text-secondary)] text-start">{isFa ? "تولید خودکار محتوای بهینه‌شده AEO" : "AI Answer Engine Optimization (AEO) Copywriting"}</td>
                    <td className="py-4.5 px-6 text-center bg-[#38bdf8]/5">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                    <td className="py-4.5 px-6 text-center text-[var(--text-muted)]">❌</td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4.5 px-6 text-[var(--text-secondary)] text-start">{isFa ? "تحلیل متاداده، فایل ربات و نقشه وب‌سایت" : "Classic SEO Auditing & XML Sitemaps"}</td>
                    <td className="py-4.5 px-6 text-center bg-[#38bdf8]/5">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sample Report Download Section */}
      <section className="py-24 bg-[var(--background)] dark:bg-[#080b11] relative border-t border-[var(--border)]">
        <div className="absolute top-1/2 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#f97316]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 md:p-12 grid md:grid-cols-[1fr_400px] gap-12 items-center">
            {/* Download Content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-xs font-bold text-[#f97316]">
                <FileText size={12} />
                <span>{isFa ? "مستند تحلیل جامع نمونه" : "Sample Brand Report"}</span>
              </span>

              <h2 className="font-display font-black text-3xl text-[var(--text-primary)]">
                {isFa ? "نمونه گزارش تحلیل را دانلود کنید" : "Download Sample Analytics Report"}
              </h2>

              <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                {isFa
                  ? "با دریافت این سند نمونه، با فرمت و متدولوژی تحلیل ساختاری و تحلیل سهم صدای برند خود در مدل‌های برجسته زبانی به طور دقیق آشنا شوید."
                  : "Explore a fully localized diagnostic document generated by Optimus AI. Review entity graphs and visibility metrics."}
              </p>

              <div className="space-y-3 font-bold text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#38bdf8]" />
                  <span>{isFa ? "شامل نگاشت ساختار گراف ارتباطات ۱-هاپ" : "Comprehensive 1-hop relation schema mapping"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#38bdf8]" />
                  <span>{isFa ? "تحلیل کلمات کلیدی، استنادها و پایش توهم" : "Factuality analysis and hallucination prevention guidelines"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-[#38bdf8]" />
                  <span>{isFa ? "شامل راهکارهای عملی و برنامه‌ی تولید محتوای AEO" : "Actionable sitemap optimization checklist for LLMs"}</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="/optimus-ai-sample-report.pdf"
                  download="optimus-ai-sample-report.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-sm shadow-lg shadow-[#38bdf8]/15 hover:scale-[1.03] transition-transform cursor-pointer"
                >
                  <Download size={16} />
                  <span>{isFa ? "دانلود نمونه گزارش (PDF)" : "Download Sample PDF Report"}</span>
                </a>
              </div>
            </div>

            {/* Premium CSS-only Report Mockup (Interactive / beautiful) */}
            <div className="relative w-full h-[360px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
              {/* Backlit highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-[#f97316]/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

              {/* Mock PDF Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-white font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-primary)]">{isFa ? "گزارش وضعیت هوشمندی برند" : "Brand AI Audit"}</h4>
                    <span className="text-[9px] text-[var(--text-muted)] font-mono">ID: #99A1-D8</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] font-bold">{isFa ? "نمونه رسمی" : "SAMPLE REPORT"}</span>
              </div>

              {/* Mock PDF Content Block */}
              <div className="space-y-4 py-4 flex-1">
                {/* Simulated charts/metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[var(--muted-surface)]/50 border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">{isFa ? "صحت داده‌ها" : "Factuality"}</span>
                    <p className="text-lg font-extrabold text-[#38bdf8] font-display">۹۴.۲٪</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--muted-surface)]/50 border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">{isFa ? "سهم استناد" : "Citations"}</span>
                    <p className="text-lg font-extrabold text-[#f97316] font-display">۸۴۰ {isFa ? "مرجع" : "Ref"}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#38bdf8] to-[#f97316]" style={{ width: "85%" }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-medium">
                    <span>{isFa ? "انطباق معنایی وب‌سایت" : "Website Semantic Aligned"}</span>
                    <span>۸۵٪</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#38bdf8]/5 border border-[#38bdf8]/10">
                  <p className="text-[10px] text-[var(--text-muted)] leading-normal font-medium">
                    {isFa
                      ? "پیشنهاد فوری: فایل sitemap را با افزودن تگ روابط معنایی <entity> در ساختار هدر برای ربات‌های کلود بهینه‌سازی نمایید."
                      : "Optimization recommendation: Restructure product catalog markup to declare direct semantic relationships."}
                  </p>
                </div>
              </div>

              {/* Mock PDF Footer */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span>{isFa ? "پلتفرم هوش مصنوعی اپتیموس" : "Powered by Optimus AI Hub"}</span>
                <span className="font-mono">Page 1 / 18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 bg-[var(--background-subtle)]/30 dark:bg-[#0a0d16]/30 relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "مورد اعتماد مدیران بازاریابی و متخصصان رشد" : "Trusted by Category-Leading Brands"}
            </h2>
            <p className="text-[var(--text-muted)] md:text-lg">
              {isFa
                ? "نظرات کارشناسان و متخصصان بهینه‌سازی که توانسته‌اند توهم برند خود را در مدل‌های زبانی رفع کنند."
                : "See how enterprise companies analyze and optimize their AI presence to capture citations."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                  {isFa
                    ? "«پیش از استفاده از اپتیموس، هوش مصنوعی کلود خدمات ما را به اشتباه به یکی از رقبایمان استناد می‌داد. به کمک تحلیل معنایی و تحلیل ساختاری توانستیم این توهم مخرب برند را کاملاً مرتفع کنیم.»"
                    : "Before Optimus AI, Claude routinely hallucinated our market services and pointed customers to rival links. Restructuring our entities completely resolved this visibility leak."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-[#38bdf8]">
                  م‌ر
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "مسعود راد" : "Masoud Rad"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر رشد، علی‌بابا" : "VP of Growth, Alibaba"}</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                  {isFa
                    ? "«تحلیل سهم صدای برند در مدل‌های زبانی (LLM Voice Share) دقیقاً همان حلقه‌ی گم‌شده‌ی گزارش‌های برندینگ ما بود. پلتفرم اپتیموس این کار سخت را به یک فرآیند خودکار و جذاب تبدیل کرده است.»"
                    : "The LLM Voice Share and citation tracking index is exactly what we needed to evaluate our organic visibility in OpenAI answers. Beautiful automation and visual graph dashboards."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-[#f97316]">
                  س‌م
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "سارا موسوی" : "Sara Mousavi"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر ارشد سئو، اسنپ" : "Head of SEO, Snapp"}</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">
                  {"★".repeat(5)}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                  {isFa
                    ? "«به عنوان یک استارتاپ تکنولوژی، حضور صحیح در پاسخ‌های متنی هوش زبانی برای جذب ترافیک علمی ما حیاتی بود. ابزار تحلیل و بهبود فنی اپتیموس امتیاز و کیفیت برند ما را ۲ برابر افزایش داد.»"
                    : "As a technology startup, getting our platform cited correctly in ChatGPT answers was vital. Optimus AI doubled our visibility index scores in less than a month."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-purple-400">
                  آ‌ب
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "آرش بهرامی" : "Arash Bahrami"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر بازاریابی دیجیتال، تپسی" : "Digital Marketing Lead, Tapsi"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Active Embedded Technical Audit Section */}
      <section ref={freeAuditRef} className="py-24 bg-[var(--background)] dark:bg-[#080b11] relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "تحلیل ساختار برخط سایت" : "Online Audit Suite"}</span>
            </span>
            <h2 className="font-display font-black text-3xl text-[var(--text-primary)]">
              {isFa ? "همین حالا ساختار وب‌سایت خود را تحلیل کنید" : "Audit Your Brand SEO Core"}
            </h2>
            <p className="text-[var(--text-muted)]">
              {isFa
                ? "دامنه سایت خود را به صورت زنده وارد کنید تا تگ‌های متادیتا، ساختار ربات‌ها و کیفیت خوانش وب‌سایت با Firecrawl بررسی گردد."
                : "Submit your domain URL. Retrieve standard diagnostics on crawlability, declared lang structures, and heading scores."}
            </p>
          </div>

          {/* Render the core system Free Audit Panel directly for maximum value */}
          <div className="glass-panel p-2 sm:p-4 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl">
            <FreeAuditPanel onUpgradeClick={() => {}} />
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <LandingFooter />
    </div>
  );
}
