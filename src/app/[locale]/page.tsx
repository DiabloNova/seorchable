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
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  Eye,
  Radar,
  LineChart as LineChartIcon,
  HelpCircle,
  FileCode,
  Lock,
  Compass,
  DollarSign
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Button } from "@/components/Button";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";
import { useAuth } from "@/components/AuthProvider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { RadialPolarGraph } from "@/components/features/graph/RadialPolarGraph";

/**
 * Enterprise-grade, high-fidelity Homepage for seorchable.ir (Optimus AI).
 * Redesigned from the ground up to establish elite category authority.
 * Seamlessly integrates existing visual features (Radial Polar Graph, mini-dashboard,
 * and sitemaps/checklists) into a strategic B2B enterprise journey.
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
  const freeAuditRef = useRef<HTMLDivElement | null>(null);
  const platformFeaturesRef = useRef<HTMLDivElement | null>(null);
  const liveDashboardPreviewRef = useRef<HTMLDivElement | null>(null);
  const pricingPreviewRef = useRef<HTMLDivElement | null>(null);

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
      {/* 1. Global Enterprise Header */}
      <LandingHeader />

      {/* 2. Enterprise Hero Section */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        {/* Elite Ambient Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[45vw] h-[45vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[40vw] h-[40vw] bg-gradient-to-tr from-[#f97316]/10 to-[#38bdf8]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-2 text-xs font-bold text-[#38bdf8] mx-auto">
            <Sparkles size={14} className="animate-pulse text-[#f97316]" />
            {isFa ? "پلتفرم مدیریت هوشمندی برند و بهینه‌سازی موتورهای پاسخگو (AEO & GEO)" : "Enterprise AI Visibility, Search, GEO & Analytics Platform"}
          </span>

          {/* Strategic Enterprise Headline */}
          <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] text-balance max-w-5xl mx-auto">
            {isFa ? (
              <>
                <span className="text-[var(--text-primary)]">اندازه‌گیری و بهینه‌سازی حضور شما در</span>
                <span className="text-gradient-brand font-extrabold block mt-3">دنیای هوش مصنوعی و مدل‌های زبانی</span>
              </>
            ) : (
              <>
                <span className="text-[var(--text-primary)]">Optimize Your Brand Visibility In</span>
                <span className="text-gradient-brand font-extrabold block mt-3">AI Answers & Large Language Models</span>
              </>
            )}
          </h1>

          {/* Value Proposition Description */}
          <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-3xl mx-auto">
            {isFa
              ? "پلتفرم پیشرو تحلیل معنایی، پایش توهم و بهبود سهم صدای برند (LLM Share of Voice). برند خود را برای ChatGPT، Gemini، Perplexity و موتورهای پاسخگو بهینه‌سازی کنید."
              : "Discover how ChatGPT, Claude, and Perplexity understand, evaluate, and recommend your brand. Monitor citations, track hallucinations, and improve semantic authority organically."}
          </p>

          {/* Unmistakable Calls to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => scrollToRef(freeAuditRef)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white text-base font-bold bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-xl shadow-[#38bdf8]/20 hover:shadow-[#f97316]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>{isFa ? "شروع آنالیز رایگان وب‌سایت" : "Start Free AI Audit"}</span>
              <ArrowDown size={16} className="animate-bounce shrink-0" />
            </button>

            <button
              onClick={() => scrollToRef(liveDashboardPreviewRef)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-slate-900/40 hover:bg-[#38bdf8]/10 text-[var(--text-primary)] border border-[#38bdf8]/30 hover:border-[#38bdf8]/80 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{isFa ? "مشاهده پیشخوان زنده" : "Explore Live Dashboard"}</span>
              <ArrowRight size={16} className="rtl:-scale-x-100 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Primary Conversion Point: Free AI Website Audit */}
      <section id="audit" ref={freeAuditRef} className="py-12 bg-[var(--background)] dark:bg-[#07090e] relative border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#38bdf8]">{isFa ? "محل اصلی تبدیل مخاطب" : "INSTANT VISIBILITY AUDIT"}</h2>
            <p className="text-xs text-[var(--text-muted)]">{isFa ? "دامنه خود را بلافاصله اسکن کنید تا شاخص‌های پایه‌ای سئو و ساختار صفحات ارزیابی گردند." : "Scan your domain now to verify structural tags, metadata health, and indexability profiles."}</p>
          </div>

          {/* High-Fidelity Audit Component */}
          <div className="glass-panel p-2 sm:p-5 rounded-3xl border border-[#38bdf8]/30 bg-[var(--glass-bg)] shadow-2xl relative overflow-hidden group">
            {/* Soft backdrop glow to draw focus */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <FreeAuditPanel onUpgradeClick={() => scrollToRef(pricingPreviewRef)} />
          </div>
        </div>
      </section>

      {/* 4. Credibility & Trust Signals Section */}
      <section className="py-16 bg-[var(--background-subtle)]/40 dark:bg-[#090b12]/40 border-t border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Logo cloud */}
          <div className="text-center space-y-4">
            <p className="text-xs uppercase font-black tracking-widest text-[var(--text-muted)]">
              {isFa ? "پشتیبانی و انطباق کامل با برترین پلتفرم‌های هوش زنده دنیا" : "INTEGRATED & TRUSTED ACCROSS ELITE AI ECOSYSTEMS"}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="text-sm font-black tracking-tight font-mono text-[var(--text-primary)]">OpenAI ChatGPT</span>
              <span className="text-sm font-black tracking-tight font-mono text-[var(--text-primary)]">Google Gemini</span>
              <span className="text-sm font-black tracking-tight font-mono text-[var(--text-primary)]">Anthropic Claude</span>
              <span className="text-sm font-black tracking-tight font-mono text-[var(--text-primary)]">Perplexity AI</span>
              <span className="text-sm font-black tracking-tight font-mono text-[var(--text-primary)]">Meta Llama</span>
            </div>
          </div>

          {/* Platform Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-[var(--border)] pt-12">
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-black font-display text-[#38bdf8]">۹۹.۹۹٪</span>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "نرخ آپ‌تایم مانیتورینگ" : "Monitoring Uptime"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-black font-display text-[#f97316]">۱۲.۵M+</span>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "کوئری‌های مانیتور شده" : "Queries Audited"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-black font-display text-[#38bdf8]">۴۲۰ms</span>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "میانگین پاسخ‌دهی لایه تحلیل" : "Avg Analysis Latency"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl md:text-4xl font-black font-display text-[#f97316]">۳,۴۰۰+</span>
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "مشتریان فعال سازمانی" : "Enterprise Brands Mapped"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Platform Capabilities Showcase */}
      <section id="features" ref={platformFeaturesRef} className="py-24 bg-[var(--background)] dark:bg-[#06080d] relative">
        <div className="absolute top-1/3 left-1/4 w-[35vw] h-[35vw] bg-[#38bdf8]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "راهکارهای جامع مدیریت حضور هوش زبانی" : "Enterprise AI Optimization Modules"}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg">
              {isFa
                ? "مجموعه‌ای کامل از ابزارهای تحلیلی و بهینه‌سازی که جایگاه برند شما را در هسته مدل‌های پاسخگو تضمین می‌کند."
                : "A complete suite engineered to track, optimize, and secure your brand across Generative AI Platforms."}
            </p>
          </div>

          {/* Grid of 7 core modules */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Capability 1: AI Visibility Monitoring */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#38bdf8]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "پایش دیده‌شدن برند در هوش مصنوعی" : "AI Visibility Monitoring"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "ردیابی زنده سهم صدای برند شما در پاسخ‌های ChatGPT و Gemini به سوالات صنعت شما."
                  : "Track your brand's share of voice and citation frequency on relevant commercial queries in real-time."}
              </p>
            </div>

            {/* Capability 2: Brand Intelligence & Hallucination Watch */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "تحلیل هوشمندی و رفع توهم زبانی" : "Brand Intelligence & Hallucination Watch"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "شناسایی سریع دروغ‌ها، توهم‌ها و اطلاعات اشتباه مدل‌ها درباره محصولات و رفع فوری آن."
                  : "Detect model errors, false claims, and attribute deviations before they reach potential customers."}
              </p>
            </div>

            {/* Capability 3: AI Citation Tracking */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#38bdf8]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "ردیابی منابع استنادی چت‌بات‌ها" : "AI Citation Tracking"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "تحلیل اینکه مدل‌ها کدام مستندات، مقالات یا کدهای شما را به عنوان رفرنس نهایی معرفی می‌کنند."
                  : "Map precise inbound links and markdown citation references generated inside conversational answers."}
              </p>
            </div>

            {/* Capability 4: Competitor Analysis */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "رادار پایش و تحلیل رقبا" : "Competitor Analysis"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "مقایسه زنده سبد واژگان، ارتباطات و نقاط ارجاع رقبای صنعتی شما در مدل‌های هوش زبانی."
                  : "Conduct multi-competitor vector comparisons to understand where search share diverges."}
              </p>
            </div>

            {/* Capability 5: GEO Optimization */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#38bdf8]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "بهینه‌سازی موتورهای پاسخگو (GEO)" : "GEO Optimization"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "تحلیل ساختار صفحات و بهینه‌سازی فنی داده‌های متادیتا جهت سهولت استناد توسط وب‌کراولرها."
                  : "Inject semantic tokens, micro-data schemas, and context hints to ensure frictionless LLM parsing."}
              </p>
            </div>

            {/* Capability 6: Knowledge Graph Monitoring */}
            <div className="glass-panel hover-lift p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/5 rounded-full blur-xl pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <Network size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "رصد گراف دانش برند" : "Knowledge Graph Monitoring"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "نگاشت کامل موجودیت‌های کسب‌وکار شما و تنظیم روابط منطقی هدرها برای تقویت حافظه معنایی هوش مصنوعی."
                  : "Map corporate entity hierarchies to strengthen brand footprints inside foundational graph databases."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Interactive Mini-Dashboard & Relationships Graph */}
      <section id="platforms" ref={liveDashboardPreviewRef} className="py-24 bg-[var(--background-subtle)]/40 dark:bg-[#080a10]/40 relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "پیش‌نویس گراف زنده و پیشخوان تصمیم‌گیری" : "Live Localized Graph Simulator & Preview"}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg">
              {isFa
                ? "بر روی رقبای مختلف کلیک کنید تا تحلیل‌های معنایی واقعی، روابط گراف و توزیع پاسخ‌ها را پایش نمایید."
                : "Select brand profiles to simulate live semantic trends, hallucination thresholds, and entity networks."}
            </p>
          </div>

          {/* Mini-Dashboard Mock Layout */}
          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden grid lg:grid-cols-[260px_1fr] min-h-[540px]">
            {/* Left Sidebar inside preview */}
            <div className="border-b lg:border-b-0 lg:border-l border-[var(--glass-border)] bg-[var(--muted-surface)]/20 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {isFa ? "برند هدف پایش" : "Simulated Target Scope"}
                  </h3>
                  <div className="space-y-2">
                    {(["optimus", "digikala", "snapp"] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-start transition-all ${
                          activeBrand === brand
                            ? "bg-gradient-to-r from-[#38bdf8]/20 to-[#f97316]/10 text-[var(--text-primary)] border border-[#38bdf8]/40 shadow-sm"
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
                    {isFa ? "ماژول‌های تصمیم‌گیری" : "Visual Analysis Views"}
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: "sentiment", label: isFa ? "تحلیل سیگنال‌ها و توهم زبانی" : "Sentiment & Risk Watch", icon: MessageSquare },
                      { id: "visibility", label: isFa ? "شاخص دیده‌شدن برخط (AI Index)" : "AI Visibility Score Trend", icon: Activity },
                      { id: "graph", label: isFa ? "گراف دانش برند" : "Mapped Brand Graph", icon: Network },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-start flex items-center gap-2.5 transition-all ${
                            activeTab === tab.id
                              ? "bg-[var(--muted-surface)] text-[var(--text-primary)] font-bold border border-[var(--border)] shadow-inner"
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
              <div className="pt-6 border-t border-[var(--border)]">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg shadow-sky-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center"
                >
                  {isFa ? "اجرای تست مجدد" : "Run Fresh Scan"}
                </button>
              </div>
            </div>

            {/* Right content view area */}
            <div className="p-8 flex flex-col justify-between bg-[var(--muted-surface)]/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
                      {activeTab === "sentiment" && (isFa ? "گزارش وضعیت سیگنال‌ها و شیب توهم زبانی" : "LLM Semantic Sentiment Scorecard")}
                      {activeTab === "visibility" && (isFa ? "شاخص انطباق معنایی و دیده‌شدن در رادار" : "LLM Citation Proximity Analytics")}
                      {activeTab === "graph" && (isFa ? "گراف همسایگی موجودیت‌ها و مفاهیم برند" : "Graph Neighborhood Extraction")}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {isFa ? `سیگنال ورودی زنده برای برند: ` : "Visualizing analytics for brand: "}
                      <span className="text-[#38bdf8] font-bold">{brandNames[activeBrand]}</span>
                    </p>
                  </div>

                  <span className="text-[10px] px-2.5 py-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 font-bold font-mono uppercase tracking-widest">{isFa ? "محیط زنده" : "SANDBOX SIM"}</span>
                </div>

                {/* Sub Tab Screen: Sentiment Analysis */}
                {activeTab === "sentiment" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Score card */}
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-center">
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "امتیاز سهم صدای برند" : "SOP Share of Voice"}</span>
                        <div className="text-3xl font-black text-[#38bdf8] mt-1 font-display">
                          {liveDashboardData[activeBrand].sentiment.score} <span className="text-xs text-[var(--text-muted)]">/ ۱۰۰</span>
                        </div>
                        <span className="text-[11px] text-emerald-500 font-black mt-1 block">
                          {isFa ? "گرید کیفی: " : "Grade: "} {liveDashboardData[activeBrand].sentiment.grade}
                        </span>
                      </div>

                      {/* Positive distribution */}
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "جهت معنایی (Sentiment)" : "Sentiment Gradient"}</span>
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
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "ضریب خطا / توهم" : "Claim Conflict Index"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between">
                            <span className="text-rose-500">{isFa ? "توهم مخرب برند" : "Hallucination Event"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.neg}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neg}%` }} />
                          </div>
                          <p className="text-[9px] text-[var(--text-muted)] leading-tight mt-1">
                            {isFa ? "احتمال تولید اطلاعات کذب توسط مدل‌های زبانی" : "Calculated chance of misattribution by model"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--muted-surface)]/30">
                      <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{isFa ? "خلاصه ارزیابی معنایی" : "Semantic Intelligence Digest"}</h4>
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
                          <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} name={isFa ? "امتیاز شما" : "Optimus Score"} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="competitors" stroke="#f97316" strokeWidth={2} name={isFa ? "میانگین رقبا" : "Competitors Avg"} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] text-center" style={{ direction: isFa ? "rtl" : "ltr" }}>
                      {isFa
                        ? "تحلیل روند دیده‌شدن (Sky Blue) نسبت به رقبای صنعتی (Orange) در مدل‌های مرجع OpenAI و Google"
                        : "Tracking Brand Health Score (Sky Blue) against market average (Orange) across top LLMs."}
                    </p>
                  </div>
                )}

                {/* Sub Tab Screen: Mapped Brand Graph */}
                {activeTab === "graph" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          ? "موجودیت‌های بالا مستقیماً از خزش ساختار صفحات وب‌سایت استخراج شده و گراف روابط را در مدل زبانی متولد می‌کنند."
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
                    ? "آیا مایلید تمام بردارهای همسایگی و خطاهای مدل زبانی خود را اسکن نمایید؟"
                    : "Ready to inspect your brand's actual entity schema and hallucination profile?"}
                </span>
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="px-5 py-2.5 rounded-xl bg-[var(--muted-surface)] border border-[var(--border)] text-[#38bdf8] hover:text-[var(--text-primary)] hover:border-[#38bdf8] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isFa ? "شروع اسکن جامع و تحلیل هدرها" : "Run Technical Audit Now"}</span>
                  <ArrowRight size={14} className="rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Live Polar Radar Graph & Guide Container (Under hero journey segment) */}
      <section className="py-24 bg-[var(--background)] dark:bg-[#06080d] relative border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          {/* Guide & Legend for the Live Relationships Graph */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 bg-slate-950/75 text-white shadow-2xl space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#f97316] animate-pulse" />
              <h4 className="text-sm sm:text-base font-black font-display text-white">
                {isFa ? "راهنمای شاخص‌ها و علائم رادار زنده" : "Live Relationships Graph Guide & Legend"}
              </h4>
            </div>

            <div className="space-y-4 text-[12px] leading-relaxed">
              {/* Point 1 */}
              <div className="space-y-1">
                <h5 className="font-bold text-[#38bdf8] text-xs uppercase tracking-wider">
                  {isFa ? "۱. تحلیل رنگ‌ها و پایش سیگنال‌ها" : "1. Color & Signal Analysis"}
                </h5>
                <p className="text-slate-400 text-xs">
                  {isFa
                    ? "سیگنال‌های آبی آسمانی بیانگر قدرت حضور اورگانیک برند و فرکانس‌های قرمز گرم بیانگر توهم مدل زبانی و انحراف استناد به رقبای مستقیم بازار شما می‌باشد."
                    : "Sky Blue contours reveal organic brand frequency, while Warm Red vectors point out competitive claim leaks and model hallucination risks."}
                </p>
              </div>

              {/* Point 2 */}
              <div className="space-y-1">
                <h5 className="font-bold text-[#f97316] text-xs uppercase tracking-wider">
                  {isFa ? "۲. مدارهای دایره‌ای رادار" : "2. Concentric Radial Thresholds"}
                </h5>
                <p className="text-slate-400 text-xs">
                  {isFa
                    ? "مدارهای هم‌مرکز از آستانه ۲۰٪ در دایره میانی شروع و تا ۱۰۰٪ در پوسته بیرونی گسترش می‌یابند. هرچهContourها به پوسته نزدیک‌تر باشند، نمره ثبات و اعتماد استناد بالاتر است."
                    : "Concentric rings evaluate citation stability from a 20% central baseline up to 100% outer rim accuracy. Proximity to the edge dictates brand persistence."}
                </p>
              </div>
            </div>

            {/* Pointers */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rotate-45 bg-[#38bdf8] shrink-0" />
                <span>{isFa ? "سهم صدای برند" : "Brand Share of Voice"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rotate-45 bg-[#c53f47] shrink-0" />
                <span>{isFa ? "ریسک توهم و خطا" : "Hallucination Risk"}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[400px] sm:h-[450px] rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-2xl overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-[#38bdf8]/20 text-xs text-[#38bdf8] backdrop-blur-lg">
              <Network size={14} className="animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider">{isFa ? "گراف روابط زنده" : "Interactive KG Core"}</span>
            </div>

            <RadialPolarGraph className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* 8. Documentation Preview Section */}
      <section className="py-24 bg-[var(--background-subtle)]/40 dark:bg-[#07090e]/40 border-t border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "مستندات فنی و راهنمای بهینه‌سازی" : "System Documentation Preview"}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg">
              {isFa
                ? "پلتفرم ما کاملاً مستند شده و آماده همگام‌سازی و استقرار در بسترهای ابری بزرگ است."
                : "Explore our rich guides, deployment models, and API endpoints to customize your integration flow."}
            </p>
          </div>

          {/* Grid of 5 documentation pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: isFa ? "مقدمه و شروع سریع" : "Getting Started",
                desc: isFa ? "آشنایی با پلتفرم بهینه‌سازی موتورهای پاسخگو (AEO) و ساختار معنایی." : "Learn core concepts of Answer Engine Optimization and brand footprint modeling.",
                slug: "introduction-to-brandgraph"
              },
              {
                title: isFa ? "معماری زیرساخت" : "Infrastructure & Ops",
                desc: isFa ? "پیکربندی هوشمند وب‌کراولرها و فرآیند خزش اسناد با Firecrawl." : "Configuring the enterprise crawling cluster and secure file decoders.",
                slug: "infrastructure-architecture"
              },
              {
                title: isFa ? "مدیریت چندمستأجری" : "Multi-Tenant Isolation",
                desc: isFa ? "جداسازی داده‌ها، مدیریت دسترسی‌ها و امنیت خطوط انتقال." : "Enforcing row-level security and secure tenant metadata boundaries.",
                slug: "multi-tenant-isolation"
              },
              {
                title: isFa ? "معماری پایپلاین" : "AI Ingestion Pipeline",
                desc: isFa ? "جریان استخراج بردارهای استنادی و نگاشت روابط معنایی." : "Trace the processing sequence from raw HTML to vector indices.",
                slug: "ai-pipeline-architecture"
              },
              {
                title: isFa ? "گراف دانش سازمانی" : "Knowledge Graph Design",
                desc: isFa ? "نگاشت هوشمند موجودیت‌ها و مفاهیم برای تصاحب کلمات کلیدی." : "How we build entity synopses to represent complex corporate relationships.",
                slug: "knowledge-graph-design"
              }
            ].map((doc, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover-lift flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--sky-blue-500)]/10 text-[var(--sky-blue-500)] font-black uppercase font-mono tracking-widest">{isFa ? "مستند فنی" : "DOCS"}</span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-display truncate">{doc.title}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{doc.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border)]">
                  <Link
                    href={`/${locale}/docs/${doc.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-[#38bdf8] hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isFa ? "مطالعه مستندات" : "Read Docs"}</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Pricing Preview Section */}
      <section id="pricing" ref={pricingPreviewRef} className="py-24 bg-[var(--background)] dark:bg-[#06080d] relative border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "تعرفه‌های منعطف و برترین پلن‌های مانیتورینگ" : "Enterprise-Ready Pricing Plans"}
            </h2>
            <p className="text-[var(--text-secondary)] md:text-lg">
              {isFa
                ? "پلن کاربری خود را متناسب با حجم کلمات کلیدی و صفحات وب‌سایت خود انتخاب کنید."
                : "Choose a pricing tier scaled exactly to your corporate monitoring keywords and crawled page counts."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1: Starter */}
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover-lift flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded bg-zinc-500/10 text-zinc-400 font-bold uppercase tracking-wider">{isFa ? "شروع ساده" : "STARTER"}</span>
                  <h3 className="text-xl font-black text-[var(--text-primary)] font-display">{isFa ? "پلن آغازین" : "Starter"}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{isFa ? "مناسب برای استارتاپ‌ها و سایت‌های کوچک" : "For startups establishing initial brand footprints."}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-[var(--text-primary)]">{isFa ? "۴۹" : "$49"}</span>
                  <span className="text-xs text-[var(--text-muted)]">/ {isFa ? "ماهانه" : "month"}</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-bold">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "پایش ۱۰ کلمه کلیدی اصلی" : "Track up to 10 brand keywords"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "خزش تا ۵۰۰ صفحه با Firecrawl" : "Crawl up to 500 pages/mo"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "تحلیل ۱-هاپ گراف دانش" : "1-hop entity relationship models"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:border-[#38bdf8] text-xs font-bold transition-all cursor-pointer"
                >
                  {isFa ? "انتخاب پلن آغازین" : "Select Starter Plan"}
                </button>
              </div>
            </div>

            {/* Plan 2: Growth (Highlighted) */}
            <div className="glass-panel p-8 rounded-2xl border-2 border-[#38bdf8] bg-[#38bdf8]/5 hover-lift flex flex-col justify-between h-full relative">
              <span className="absolute -top-3 right-8 px-3 py-1 bg-[#38bdf8] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-md">POPULAR</span>
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] font-bold uppercase tracking-wider">{isFa ? "رشد کسب‌وکار" : "GROWTH"}</span>
                  <h3 className="text-xl font-black text-[var(--text-primary)] font-display">{isFa ? "پلن رشد" : "Growth"}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{isFa ? "مناسب برای شرکت‌های متوسط و برندهای پویا" : "For expanding companies tracking multiple competitor brands."}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-[#38bdf8]">{isFa ? "۱۴۹" : "$149"}</span>
                  <span className="text-xs text-[var(--text-muted)]">/ {isFa ? "ماهانه" : "month"}</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-bold">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "پایش ۵۰ کلمه کلیدی و رقیب" : "Track up to 50 brand keywords"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "خزش تا ۳,۰۰۰ صفحه با Firecrawl" : "Crawl up to 3,000 pages/mo"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "تحلیل پیشرفته توهم و استناد" : "Full semantic claim and citation audit"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "پشتیبانی پاسخگو اختصاصی" : "Dedicated priority customer support"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white text-xs font-bold shadow-lg shadow-sky-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {isFa ? "انتخاب پلن رشد (پیشنهادی)" : "Choose Growth Plan"}
                </button>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover-lift flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold uppercase tracking-wider">{isFa ? "امنیت و مقیاس" : "ENTERPRISE"}</span>
                  <h3 className="text-xl font-black text-[var(--text-primary)] font-display">{isFa ? "پلن سازمانی" : "Enterprise"}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{isFa ? "مناسب برای هلدینگ‌ها و رهبران بازار" : "For market leaders demanding dedicated clusters and custom SLA."}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-display text-[var(--text-primary)]">{isFa ? "تماس با ما" : "Custom / SLA"}</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-bold">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "پایش نامحدود واژگان و موجودیت‌ها" : "Unlimited search term extraction"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "کلاستر اختصاصی خزش با Firecrawl" : "Dedicated private crawling instances"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" />
                    <span>{isFa ? "سیستم امنیتی SSO و MFA اختصاصی" : "SAML SSO, custom data retention SLAs"}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link href={`/${locale}/contact`}>
                  <button className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:border-[#38bdf8] text-xs font-bold transition-all cursor-pointer">
                    {isFa ? "تماس با واحد فروش" : "Contact Sales Department"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Sample Report & Success Stories Section */}
      <section className="py-24 bg-[var(--background-subtle)]/40 dark:bg-[#07090e]/40 border-t border-[var(--border)] relative overflow-hidden">
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
                {isFa ? "نمونه گزارش مانیتورینگ را دریافت کنید" : "Download Sample Analytics Report"}
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

      {/* 11. Customer Success Testimonials */}
      <section className="py-24 bg-[var(--background-subtle)]/40 dark:bg-[#06080d]/40 border-t border-[var(--border)] relative overflow-hidden">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
              {isFa ? "مورد اعتماد رهبران تکنولوژی و مدیران بازاریابی" : "Enterprise Case Studies & Stories"}
            </h2>
            <p className="text-[var(--text-muted)] md:text-lg">
              {isFa
                ? "ببینید شرکت‌های مطرح چگونه با اصلاح لایه‌های وب و تزریق گراف دانش توانسته‌اند توهم‌های مربوط به خود را مرتفع نمایند."
                : "Real brand optimization cases executing semantic authority alignment strategies."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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

      {/* 12. Final Call to Action Segment */}
      <section className="py-24 bg-gradient-to-b from-[#38bdf8]/5 to-[#f97316]/5 dark:from-[#0a0d16]/30 dark:to-slate-950 border-t border-[var(--border)] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#38bdf8]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight text-[var(--text-primary)] leading-tight text-balance">
            {isFa ? "آماده تصاحب جایگاه برتر در پاسخ‌های هوش زبانی هستید؟" : "Supercharge Your Brand In AI Answers Today"}
          </h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto">
            {isFa
              ? "به جمع برندهایی بپیوندید که پیش از این سهم ارگانیک خود را در پاسخ چت‌بات‌ها تثبیت کرده‌اند."
              : "Begin optimizing for search engine results of the next decade. Start your enterprise trial now."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToRef(freeAuditRef)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white text-base font-bold bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>{isFa ? "شروع آنالیز فنی رایگان" : "Start Free Audit Scanner"}</span>
            </button>

            <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl text-base font-bold bg-slate-900/40 hover:bg-[#38bdf8]/10 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>{isFa ? "تماس با کارشناسان ما" : "Contact Sales Unit"}</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 13. High-Fidelity Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
