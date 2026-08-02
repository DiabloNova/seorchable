"use client";

import React, { useState, useRef, use } from "react";
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
  Network,
  Zap,
  Bot,
  Layers,
  ExternalLink,
  Brain,
  Search,
  CheckCircle,
  FileSpreadsheet,
  BarChart2,
  Shield,
  TrendingUp,
  BookOpen,
  Users,
  Star,
  Quote,
  ArrowUpRight,
  LayoutGrid,
  ChevronRight,
  Building2,
  Target,
  Eye,
  Lightbulb,
  Code2,
  PlayCircle,
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Button } from "@/components/Button";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";
import { useAuth } from "@/components/AuthProvider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { RadialPolarGraph } from "@/components/features/graph/RadialPolarGraph";
import AppSidebar from "@/components/navigation/AppSidebar";

export default function MarketingLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const { session } = useAuth();

  const [activeBrand, setActiveBrand] = useState<"optimus" | "digikala" | "snapp">("optimus");
  const [activeTab, setActiveTab] = useState<"sentiment" | "visibility" | "graph">("sentiment");
  const [graphQuery, setGraphQuery] = useState(isFa ? "اپتیموس" : "Optimus");
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);
  const [auditUrl, setAuditUrl] = useState("");

  const dashboardPreviewRef = useRef<HTMLDivElement | null>(null);
  const freeAuditRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Mini-dashboard data ── */
  const liveDashboardData = {
    optimus: {
      sentiment: { score: 88, grade: "A+", pos: 72, neu: 21, neg: 7,
        text: isFa ? "برند اپتیموس دارای بازخورد فوق‌العاده مثبت در میان تمام مدل‌های زبانی است." : "Optimus AI exhibits highly positive semantic score and is referenced as authority in Brand Intelligence." },
      chartData: [
        { date: "Jan", score: 78, competitors: 45 }, { date: "Feb", score: 81, competitors: 48 },
        { date: "Mar", score: 84, competitors: 44 }, { date: "Apr", score: 86, competitors: 49 },
        { date: "May", score: 88, competitors: 50 },
      ],
      nodes: [
        { id: "opt-1", label: isFa ? "اپتیموس هوش مصنوعی" : "Optimus AI", type: isFa ? "برند" : "Brand", value: isFa ? "موجودیت مرکزی" : "Central Entity" },
        { id: "opt-2", label: "AEO", type: isFa ? "قابلیت" : "Feature", value: isFa ? "پشتیبانی کامل" : "Full Support" },
        { id: "opt-3", label: "GPT-4o", type: "LLM", value: "92% visibility" },
        { id: "opt-4", label: "Claude 3.5", type: "LLM", value: "89% visibility" },
      ],
    },
    digikala: {
      sentiment: { score: 64, grade: "B-", pos: 44, neu: 32, neg: 24,
        text: isFa ? "دیجی‌کالا دارای سهم بازار گسترده است، اما گزارش‌های متعددی در خصوص زمان تحویل وجود دارد." : "Digikala occupies large voice share. However, LLMs frequently hallucinate about delivery delays." },
      chartData: [
        { date: "Jan", score: 62, competitors: 62 }, { date: "Feb", score: 65, competitors: 60 },
        { date: "Mar", score: 63, competitors: 61 }, { date: "Apr", score: 66, competitors: 58 },
        { date: "May", score: 64, competitors: 59 },
      ],
      nodes: [
        { id: "dk-1", label: isFa ? "دیجی‌کالا" : "Digikala", type: isFa ? "رقیب" : "Competitor", value: "65% voice share" },
        { id: "dk-2", label: isFa ? "تاخیر ارسال" : "Delivery Delay", type: isFa ? "موضوع منفی" : "Negative Signal", value: "24% signals" },
        { id: "dk-3", label: "GPT-4o", type: "LLM", value: isFa ? "مرجع با خطا" : "Cited w/ errors" },
        { id: "dk-4", label: isFa ? "مارکت‌پلیس" : "Marketplace", type: isFa ? "مفهوم" : "Concept", value: isFa ? "استناد قوی" : "Strong citation" },
      ],
    },
    snapp: {
      sentiment: { score: 58, grade: "C", pos: 35, neu: 43, neg: 22,
        text: isFa ? "اسنپ نفوذ بالایی دارد، اما توهم مدل گاهی خدمات را اشتباهاً به تپسی نسبت می‌دهد." : "Snapp is highly recognized for mobility. AI hallucination sometimes misattributes services to competitor Tapsi." },
      chartData: [
        { date: "Jan", score: 55, competitors: 50 }, { date: "Feb", score: 56, competitors: 52 },
        { date: "Mar", score: 59, competitors: 51 }, { date: "Apr", score: 57, competitors: 53 },
        { date: "May", score: 58, competitors: 51 },
      ],
      nodes: [
        { id: "sn-1", label: isFa ? "اسنپ" : "Snapp", type: isFa ? "رقیب" : "Competitor", value: "54% voice share" },
        { id: "sn-2", label: isFa ? "توهم رقابتی" : "Hallucination", type: isFa ? "موضوع منفی" : "Negative Signal", value: isFa ? "ارتباط با تپسی" : "Tapsi association" },
        { id: "sn-3", label: "Claude 3.5", type: "LLM", value: isFa ? "خطای استناد" : "Citation error" },
        { id: "sn-4", label: isFa ? "اسنپ فود" : "SnappFood", type: isFa ? "زیربرند" : "Sub-brand", value: isFa ? "دیده‌شدن مطلوب" : "Good visibility" },
      ],
    },
  };

  const brandNames = {
    optimus: isFa ? "اپتیموس هوش مصنوعی" : "Optimus AI",
    digikala: isFa ? "دیجی‌کالا" : "Digikala",
    snapp: isFa ? "اسنپ" : "Snapp",
  };

  /* ── AI engine logos (text-based) ── */
  const aiEngines = ["ChatGPT", "Perplexity", "Claude", "Gemini", "Copilot", "Grok", "Meta AI", "You.com"];

  /* ── Platform capabilities ── */
  const capabilities = [
    {
      icon: BarChart2,
      color: "#38bdf8",
      title: isFa ? "پایش دیده‌شدن هوش مصنوعی" : "AI Visibility Monitoring",
      desc: isFa ? "رصد لحظه‌ای حضور برند شما در پاسخ‌های ChatGPT، Claude، Perplexity و سایر موتورهای هوش مصنوعی." : "Real-time monitoring of your brand across ChatGPT, Claude, Perplexity and every major AI search engine.",
      href: `/${locale}/platform/ai-visibility`,
    },
    {
      icon: Brain,
      color: "#a78bfa",
      title: isFa ? "هوش برند" : "Brand Intelligence",
      desc: isFa ? "درک عمیق از نحوه بازنمایی، توصیف و پیشنهاد برند شما در مدل‌های زبانی بزرگ." : "Deep understanding of how LLMs represent, describe, and recommend your brand to end users.",
      href: `/${locale}/platform/brand-intelligence`,
    },
    {
      icon: Network,
      color: "#f97316",
      title: isFa ? "ردیابی استناد هوش مصنوعی" : "AI Citation Tracking",
      desc: isFa ? "پایش هر بار که هوش مصنوعی برند، محصول یا محتوای شما را ذکر می‌کند و اندازه‌گیری دقت ارجاعات." : "Track every AI mention of your brand, products, or content and measure citation accuracy across models.",
      href: `/${locale}/platform/citation-tracking`,
    },
    {
      icon: Target,
      color: "#10b981",
      title: isFa ? "تحلیل رقبا" : "Competitor Analysis",
      desc: isFa ? "مقایسه جایگاه و سهم صدای برند شما در برابر رقبا در تمام مدل‌های هوش مصنوعی." : "Compare your brand positioning and share of voice against competitors across all major AI models.",
      href: `/${locale}/platform/competitor-analysis`,
    },
    {
      icon: Globe,
      color: "#38bdf8",
      title: isFa ? "بهینه‌سازی GEO" : "GEO Optimization",
      desc: isFa ? "بهینه‌سازی محتوا و ساختار برند برای موتورهای جستجوی مولد و پاسخگو نسل جدید." : "Optimize content and brand structure specifically for Generative Engine Optimization and answer engines.",
      href: `/${locale}/platform/geo`,
    },
    {
      icon: LayoutGrid,
      color: "#f97316",
      title: isFa ? "پایش گراف دانش" : "Knowledge Graph Monitoring",
      desc: isFa ? "پایش و بهینه‌سازی نمایش برند در گراف دانش گوگل و پایگاه‌های دانش سازمانی." : "Monitor and optimize your brand's representation in Google Knowledge Graph and structured data sources.",
      href: `/${locale}/platform/knowledge-graph`,
    },
  ];

  /* ── Stats ── */
  const stats = [
    { value: "12,000+", label: isFa ? "صفحه تحلیل‌شده" : "Pages Analyzed", accent: "#38bdf8" },
    { value: "850+", label: isFa ? "برند پایش‌شده" : "Brands Tracked", accent: "#f97316" },
    { value: "6", label: isFa ? "موتور هوش مصنوعی" : "AI Engines", accent: "#10b981" },
    { value: "99.9%", label: isFa ? "آپ‌تایم پلتفرم" : "Platform Uptime", accent: "#a78bfa" },
  ];

  /* ── Testimonials ── */
  const testimonials = [
    {
      quote: isFa
        ? "«پیش از استفاده از این پلتفرم، هوش مصنوعی کلود خدمات ما را به اشتباه به یکی از رقبایمان استناد می‌داد. با تحلیل معنایی توانستیم این توهم مخرب را کاملاً مرتفع کنیم.»"
        : "\"Before this platform, Claude routinely hallucinated our services and pointed customers to a rival. Restructuring our entities completely resolved the visibility leak.\"",
      name: isFa ? "مسعود راد" : "Masoud Rad",
      role: isFa ? "مدیر رشد، علی‌بابا" : "VP of Growth, Alibaba",
      initials: isFa ? "م‌ر" : "MR",
      color: "#38bdf8",
    },
    {
      quote: isFa
        ? "«تحلیل سهم صدای برند در مدل‌های زبانی دقیقاً همان حلقه گم‌شده گزارش‌های برندینگ ما بود. اکنون این فرآیند کاملاً خودکار شده است.»"
        : "\"LLM Voice Share tracking is exactly what was missing from our brand reporting. The automation and visual dashboards are genuinely enterprise-grade.\"",
      name: isFa ? "سارا موسوی" : "Sara Mousavi",
      role: isFa ? "مدیر ارشد سئو، اسنپ" : "Head of SEO, Snapp",
      initials: isFa ? "س‌م" : "SM",
      color: "#f97316",
    },
    {
      quote: isFa
        ? "«به عنوان یک استارتاپ تکنولوژی، حضور صحیح در پاسخ‌های ChatGPT برای جذب ترافیک ما حیاتی بود. امتیاز برند ما ظرف یک ماه ۲ برابر افزایش یافت.»"
        : "\"As a tech startup, getting cited correctly in ChatGPT answers was critical. Our visibility index doubled in less than a month with this platform.\"",
      name: isFa ? "آرش بهرامی" : "Arash Bahrami",
      role: isFa ? "مدیر بازاریابی دیجیتال، تپسی" : "Digital Marketing Lead, Tapsi",
      initials: isFa ? "آ‌ب" : "AB",
      color: "#a78bfa",
    },
  ];

  /* ── Docs categories ── */
  const docsCategories = [
    { icon: BookOpen, color: "#38bdf8", title: isFa ? "شروع سریع" : "Getting Started", desc: isFa ? "اتصال پلتفرم و اولین تحلیل در زیر ۵ دقیقه" : "Connect and run your first analysis in under 5 minutes", href: `/${locale}/docs/getting-started`, badge: isFa ? "توصیه‌شده" : "Start here" },
    { icon: Code2, color: "#a78bfa", title: isFa ? "مرجع API" : "API Reference", desc: isFa ? "مستندات کامل REST API برای توسعه‌دهندگان" : "Full REST API docs for developers and integrations", href: `/${locale}/docs/api`, badge: "REST / OpenAPI" },
    { icon: PlayCircle, color: "#f97316", title: isFa ? "آموزش‌ها" : "Tutorials", desc: isFa ? "راهنماهای گام‌به‌گام برای سناریوهای رایج" : "Step-by-step guides for common use cases", href: `/${locale}/docs/tutorials`, badge: isFa ? "ویدیویی + متنی" : "Video + text" },
    { icon: Layers, color: "#10b981", title: isFa ? "راهنمای یکپارچه‌سازی" : "Integration Guides", desc: isFa ? "اتصال به ابزارهای موجود مثل Slack، Notion و GA4" : "Connect with Slack, Notion, GA4 and 30+ tools", href: `/${locale}/docs/integrations`, badge: "30+ integrations" },
    { icon: Lightbulb, color: "#38bdf8", title: isFa ? "بهترین شیوه‌ها" : "Best Practices", desc: isFa ? "الگوها و توصیه‌های آزمایش‌شده در سطح سازمانی" : "Battle-tested patterns for enterprise deployments", href: `/${locale}/docs/best-practices`, badge: "Enterprise" },
  ];

  /* ── Pricing tiers ── */
  const pricingTiers = [
    {
      name: isFa ? "رایگان" : "Free",
      price: isFa ? "۰ تومان" : "$0",
      period: isFa ? "/ ماه" : "/mo",
      desc: isFa ? "برای شروع کار و کسب‌وکارهای کوچک" : "For individuals and small projects",
      features: [
        isFa ? "۵ ممیزی رایگان در ماه" : "5 free audits / month",
        isFa ? "پایش ۱ برند" : "1 brand monitored",
        isFa ? "گزارش‌های پایه" : "Basic reports",
        isFa ? "پشتیبانی ایمیلی" : "Email support",
      ],
      cta: isFa ? "شروع رایگان" : "Get started free",
      ctaHref: `/${locale}/register`,
      highlight: false,
    },
    {
      name: isFa ? "حرفه‌ای" : "Professional",
      price: isFa ? "۴,۹۹۰,۰۰۰ تومان" : "$149",
      period: isFa ? "/ ماه" : "/mo",
      desc: isFa ? "برای تیم‌های رشد و آژانس‌های دیجیتال" : "For growth teams and digital agencies",
      features: [
        isFa ? "ممیزی نامحدود" : "Unlimited audits",
        isFa ? "پایش ۱۰ برند" : "10 brands monitored",
        isFa ? "تحلیل رقبا" : "Competitor analysis",
        isFa ? "گزارش‌های سفارشی" : "Custom reports",
        isFa ? "پشتیبانی اولویت‌دار" : "Priority support",
        isFa ? "دسترسی API" : "API access",
      ],
      cta: isFa ? "شروع آزمایش ۱۴ روزه" : "Start 14-day trial",
      ctaHref: `/${locale}/register?plan=pro`,
      highlight: true,
    },
    {
      name: isFa ? "سازمانی" : "Enterprise",
      price: isFa ? "سفارشی" : "Custom",
      period: "",
      desc: isFa ? "برای سازمان‌های بزرگ با نیازهای خاص" : "For large organizations with custom requirements",
      features: [
        isFa ? "همه قابلیت‌های حرفه‌ای" : "Everything in Professional",
        isFa ? "برندهای نامحدود" : "Unlimited brands",
        isFa ? "یکپارچه‌سازی سفارشی" : "Custom integrations",
        isFa ? "پشتیبانی اختصاصی" : "Dedicated support",
        isFa ? "قراردادهای SLA" : "SLA agreements",
        isFa ? "استقرار On-Premise" : "On-premise deployment",
      ],
      cta: isFa ? "تماس با ما" : "Contact sales",
      ctaHref: `/${locale}/contact`,
      highlight: false,
    },
  ];

  /* ── Comparison table rows ── */
  const comparisonRows = [
    { feature: isFa ? "تحلیل معنایی LLM و رفع توهم" : "Semantic LLM Analysis & Hallucination Detection", us: true, ahrefs: false, semrush: false },
    { feature: isFa ? "نگاشت هوشمند گراف دانش برند" : "Brand Entity Knowledge Graph Mapping", us: true, ahrefs: false, semrush: false },
    { feature: isFa ? "شاخص دیده‌شدن هوش مصنوعی" : "LLM Visibility Index", us: true, ahrefs: false, semrush: false },
    { feature: isFa ? "تولید محتوای بهینه AEO" : "AI Answer Engine Optimization (AEO) Content", us: true, ahrefs: false, semrush: false },
    { feature: isFa ? "ردیابی استناد در ۶+ موتور هوش مصنوعی" : "Citation tracking across 6+ AI engines", us: true, ahrefs: false, semrush: false },
    { feature: isFa ? "ممیزی سئو کلاسیک (متادیتا، ساختار)" : "Classic SEO Audit (metadata, sitemap)", us: true, ahrefs: true, semrush: true },
    { feature: isFa ? "تحلیل بک‌لینک" : "Backlink Analysis", us: true, ahrefs: true, semrush: true },
    { feature: isFa ? "ردیابی کلمات کلیدی سنتی" : "Traditional Keyword Tracking", us: true, ahrefs: true, semrush: true },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]"
      style={{ direction: isFa ? "rtl" : "ltr" }}
    >
      <AppSidebar />
      <LandingHeader />

      {/* ══════════════════════════════════════════════════════
          1. HERO — Value proposition immediately clear
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "معرفی پلتفرم" : "Platform introduction"}
        className="relative isolate pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      >
        {/* Ambient orbs */}
        <div className="absolute top-0 right-1/4 w-[42vw] h-[42vw] bg-gradient-to-br from-[#38bdf8]/12 to-[#f97316]/5 rounded-full blur-[120px] pointer-events-none -z-10" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-tr from-[#f97316]/8 to-[#38bdf8]/8 rounded-full blur-[130px] pointer-events-none -z-10" aria-hidden="true" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" aria-hidden="true" />

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          {/* Copy */}
          <div className="space-y-7 text-center lg:text-start">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[#38bdf8]/30 bg-[#38bdf8]/8 px-4 py-2 text-xs font-bold text-[#38bdf8]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
              </span>
              {isFa ? "پلتفرم پایش دیده‌شدن برند در هوش مصنوعی" : "Enterprise AI Visibility & Brand Intelligence Platform"}
            </span>

            {/* H1 */}
            <h1 className="font-display font-black tracking-tight text-balance text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.15]">
              <span className="text-[var(--text-primary)] block">
                {isFa ? "برند خود را در موتورهای" : "Dominate AI Search"}
              </span>
              <span className="text-gradient-brand font-extrabold block mt-1">
                {isFa ? "هوش مصنوعی مسلط کنید" : "Before Your Competitors Do"}
              </span>
            </h1>

            {/* Supporting paragraph */}
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto lg:mx-0 text-pretty">
              {isFa
                ? "سئورچبل به کسب‌وکارها کمک می‌کند تا دیده‌شدن برند خود را در ChatGPT، Claude، Perplexity و سایر موتورهای جستجوی هوش مصنوعی درک، پایش و بهبود دهند."
                : "Seorchable helps businesses understand, monitor and improve their brand visibility across AI-powered search engines and Large Language Models — before competitors take their citations."}
            </p>

            {/* CTA pair */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <button
                onClick={() => scrollToRef(freeAuditRef)}
                className="relative overflow-hidden group px-7 py-3.5 rounded-[var(--radius-full)] text-white font-bold text-sm bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-lg shadow-[#38bdf8]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[#f97316]/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                aria-label={isFa ? "شروع ممیزی رایگان" : "Start free AI audit"}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-[var(--radius-full)]" aria-hidden="true" />
                <Sparkles size={15} />
                <span>{isFa ? "ممیزی رایگان هوش مصنوعی" : "Start Free AI Audit"}</span>
                <ArrowRight size={15} className="rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => scrollToRef(dashboardPreviewRef)}
                className="px-7 py-3.5 rounded-[var(--radius-full)] font-bold text-sm bg-[var(--muted-surface)] hover:bg-[#38bdf8]/10 text-[var(--text-primary)] border border-[var(--border)] hover:border-[#38bdf8]/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                aria-label={isFa ? "مشاهده دمو زنده" : "View live dashboard demo"}
              >
                <PlayCircle size={15} />
                <span>{isFa ? "مشاهده دمو زنده" : "View Live Demo"}</span>
              </button>
            </div>

            {/* Micro-stats */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <span className="text-xl font-extrabold font-display" style={{ color: s.accent }}>{s.value}</span>
                  <span className="text-[var(--text-muted)] font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Polar graph + legend */}
          <div className="flex flex-col gap-4 w-full">
            <div
              className="relative w-full h-[340px] sm:h-[380px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-2xl overflow-hidden group"
              aria-label={isFa ? "گراف تعاملی روابط برند" : "Interactive brand relationship graph"}
            >
              <div className="absolute top-3 left-3 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-full)] bg-black/50 border border-[#38bdf8]/20 text-xs text-[#38bdf8] backdrop-blur-lg">
                <Network size={13} className="animate-pulse" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-wider">{isFa ? "گراف روابط زنده" : "Live KG Core"}</span>
              </div>
              <RadialPolarGraph className="w-full h-full" />
            </div>

            {/* Graph legend */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--glass-border)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#f97316] animate-pulse" aria-hidden="true" />
                <h4 className="text-xs font-bold text-[var(--text-primary)]">
                  {isFa ? "راهنمای گراف روابط زنده" : "Live Relationship Graph Legend"}
                </h4>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#38bdf8]/20 border border-[#38bdf8] shrink-0" aria-hidden="true" />
                  <span className="text-[var(--text-muted)]">{isFa ? "سیگنال ارگانیک برند" : "Organic brand signal"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#c53f47]/20 border border-[#c53f47] shrink-0" aria-hidden="true" />
                  <span className="text-[var(--text-muted)]">{isFa ? "سیگنال رقبا" : "Competitor signal"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-dashed border-slate-400 rounded shrink-0" aria-hidden="true" />
                  <span className="text-[var(--text-muted)]">{isFa ? "آستانه بقای ۵۰٪" : "50% viability threshold"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. AI ENGINE TRUST STRIP
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "موتورهای هوش مصنوعی پشتیبانی‌شده" : "Supported AI engines"}
        className="py-8 border-y border-[var(--border)] bg-[var(--muted-surface)]/30"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-6">
            {isFa ? "پایش در تمام موتورهای هوش مصنوعی پیشرو" : "Monitoring across all leading AI search engines"}
          </p>
          <div className="overflow-hidden relative">
            <div className="marquee-track flex gap-10 items-center">
              {[...aiEngines, ...aiEngines].map((name, i) => (
                <span
                  key={i}
                  className="font-display font-black text-base sm:text-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. FREE AI AUDIT CTA — primary conversion point
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "ابزار ممیزی رایگان" : "Free AI audit tool"}
        className="py-16 md:py-20 bg-[var(--background)] relative border-b border-[var(--border)]"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.15] pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8]">
              <Sparkles size={12} className="animate-pulse" aria-hidden="true" />
              {isFa ? "بدون نیاز به ثبت‌نام" : "No account required"}
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-[var(--text-primary)]">
              {isFa ? "وب‌سایت خود را همین حالا تحلیل کنید" : "Analyze Your Website Right Now"}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-pretty">
              {isFa
                ? "آدرس وب‌سایت خود را وارد کنید تا ساختار سئو، وضعیت خزش‌پذیری و آمادگی برای موتورهای هوش مصنوعی را بررسی کنیم."
                : "Enter your website URL to instantly check SEO structure, crawlability status, and AI engine readiness for free."}
            </p>
          </div>

          {/* Prominent audit input card */}
          <div className="glass-panel rounded-2xl border border-[var(--glass-border)] p-6 sm:p-8 shadow-2xl">
            <form
              onSubmit={(e) => { e.preventDefault(); scrollToRef(freeAuditRef); }}
              className="flex flex-col sm:flex-row gap-3"
              aria-label={isFa ? "فرم ممیزی رایگان" : "Free audit form"}
            >
              <div className="relative flex-1">
                <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none ${isFa ? "right-4" : "left-4"}`} aria-hidden="true" />
                <input
                  type="url"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder={isFa ? "https://yourwebsite.com" : "https://yourwebsite.com"}
                  aria-label={isFa ? "آدرس وب‌سایت" : "Website URL"}
                  className={`w-full py-3.5 text-sm rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all ${isFa ? "pr-11 pl-5" : "pl-11 pr-5"}`}
                />
              </div>
              <button
                type="submit"
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-sm shadow-lg shadow-[#38bdf8]/20 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                aria-label={isFa ? "آنالیز وب‌سایت" : "Analyze website"}
              >
                <Sparkles size={14} aria-hidden="true" />
                {isFa ? "آنالیز رایگان" : "Analyze Free"}
              </button>
            </form>

            {/* Quick trust indicators */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]">
              {[
                { icon: Shield, text: isFa ? "بدون نیاز به کارت اعتباری" : "No credit card required" },
                { icon: Zap, text: isFa ? "نتایج در زیر ۳۰ ثانیه" : "Results in under 30 seconds" },
                { icon: CheckCircle, text: isFa ? "۱۰۰٪ رایگان برای همیشه" : "Free forever tier" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-[var(--color-primary-600)]" aria-hidden="true" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. SOCIAL PROOF STATS
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "آمار پلتفرم" : "Platform statistics"}
        className="py-16 bg-[var(--background-subtle)]/20 border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[var(--border)] rtl:divide-x-reverse">
            {[
              { value: "12,000+", label: isFa ? "صفحه تحلیل‌شده" : "Pages Analyzed", sub: isFa ? "از ۱۲۰+ وب‌سایت" : "across 120+ websites", accent: "#38bdf8" },
              { value: "850+", label: isFa ? "برند پایش‌شده" : "Brands Tracked", sub: isFa ? "در ۶ موتور هوش مصنوعی" : "across 6 AI engines", accent: "#f97316" },
              { value: "3.8×", label: isFa ? "افزایش استناد" : "More Citations", sub: isFa ? "میانگین بعد از بهینه‌سازی" : "average post-optimization", accent: "#10b981" },
              { value: "99.9%", label: isFa ? "آپ‌تایم پلتفرم" : "Platform Uptime", sub: isFa ? "با مانیتورینگ ۲۴/۷" : "with 24/7 monitoring", accent: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="text-center px-6 py-4 space-y-1">
                <p className="font-display font-black text-4xl sm:text-5xl" style={{ color: s.accent }}>{s.value}</p>
                <p className="font-bold text-sm text-[var(--text-primary)]">{s.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. PLATFORM CAPABILITIES
         ══════════════════════════════════════════════════════ */}
      <section
        id="platform"
        aria-label={isFa ? "قابلیت‌های پلتفرم" : "Platform capabilities"}
        className="py-20 md:py-24 bg-[var(--background)] border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isFa ? "قابلیت‌های پلتفرم" : "Platform Capabilities"}
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
              {isFa ? "هر ابزاری که برای مسلط شدن بر جستجوی هوش مصنوعی نیاز دارید" : "Every tool you need to dominate AI search"}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg text-pretty">
              {isFa
                ? "از پایش لحظه‌ای تا بهینه‌سازی پیشرفته — همه چیز در یک پلتفرم یکپارچه."
                : "From real-time monitoring to advanced optimization — everything in one unified platform."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <Link
                  key={cap.title}
                  href={cap.href}
                  className="group glass-panel hover-lift rounded-2xl border border-[var(--glass-border)] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[var(--color-primary-600)]/40"
                  aria-label={cap.title}
                >
                  <div
                    className="w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center text-white"
                    style={{ background: `${cap.color}20`, border: `1px solid ${cap.color}40` }}
                  >
                    <Icon size={20} style={{ color: cap.color }} aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{cap.desc}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-bold text-[var(--color-primary-600)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{isFa ? "بیشتر بدانید" : "Learn more"}</span>
                    <ArrowRight size={12} className="rtl:-scale-x-100" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. HOW IT WORKS — 4-step technical flow
         ══════════════════════════════════════════════════════ */}
      <section
        id="process"
        aria-label={isFa ? "نحوه کارکرد" : "How it works"}
        className="py-20 md:py-24 bg-[var(--background-subtle)]/20 border-b border-[var(--border)] relative"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.18] pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isFa ? "زیر هود موتور" : "Under the Hood"}
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
              {isFa ? "چطور کار می‌کند؟" : "Enterprise-grade pipeline"}
            </h2>
            <p className="text-[var(--text-secondary)] text-pretty">
              {isFa
                ? "جریان تحلیل خودکار ما محتوای وب‌سایت شما را خزش کرده، موجودیت‌ها را استخراج کرده، تحلیل معنایی انجام می‌دهد و نتایج را برای بهینه‌سازی نمایش می‌دهد."
                : "Our automated pipeline crawls your site, extracts entities, runs semantic analysis, and surfaces optimization recommendations."}
            </p>
          </div>

          <div id="features" className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line — desktop */}
            <div className="hidden md:block absolute top-10 inset-x-[12%] h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent -z-0" aria-hidden="true" />

            {[
              { step: "1", icon: Globe, color: "#38bdf8", title: isFa ? "خزش هوشمند" : "Smart Crawling", desc: isFa ? "خزش تمام‌عیار محتوای وب‌سایت با موتور Firecrawl جهت یافتن محتواهای ساختاریافته." : "Full-depth crawl using Firecrawl infrastructure to surface deep structured content.", link: isFa ? "مستندات خزش" : "Crawl Docs", href: `/${locale}/docs/infrastructure-architecture` },
              { step: "2", icon: Database, color: "#f97316", title: isFa ? "استخراج موجودیت‌ها" : "Entity Parsing", desc: isFa ? "استخراج روابط، برند، رقبای کلیدی و مفاهیم با دقت گرامری بسیار بالا." : "Map complex brand schemas, synonyms, and entity relationships with NLP precision.", link: isFa ? "مستندات نگاشت" : "Schema Docs", href: `/${locale}/docs/knowledge-graph-design` },
              { step: "3", icon: Brain, color: "#a78bfa", title: isFa ? "تحلیل معنایی" : "Semantic Analysis", desc: isFa ? "تحلیل معنایی با LLM برای شناسایی سهم صدا و میزان توهم در پاسخ‌های هوش مصنوعی." : "Assess LLM sentiment vectors, brand associations, and competitor citation frequencies.", link: isFa ? "مستندات LLM" : "LLM Docs", href: `/${locale}/docs/ai-pipeline-architecture` },
              { step: "4", icon: Layers, color: "#10b981", title: isFa ? "گزارش و بهینه‌سازی" : "Reporting & Optimization", desc: isFa ? "نمایش گراف دانش، گزارش توهم و تولید راهکارهای عملی برای بهبود رتبه برند." : "Interactive graphs, hallucination reports, and direct optimization proposals.", link: isFa ? "مستندات گراف" : "Graph Docs", href: `/${locale}/docs/knowledge-graph-design` },
            ].map(({ step, icon: Icon, color, title, desc, link, href }) => (
              <div key={step} className="glass-panel hover-lift p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
                <div
                  className="w-8 h-8 rounded-[var(--radius-full)] flex items-center justify-center text-xs font-black text-white mb-4"
                  style={{ background: `linear-gradient(135deg, ${color}, #f97316)` }}
                  aria-label={`Step ${step}`}
                >
                  {step}
                </div>
                <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center mb-4" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={20} style={{ color }} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">{desc}</p>
                <Link href={href} className="text-[11px] font-bold flex items-center gap-1 hover:underline" style={{ color }}>
                  {link}
                  <ExternalLink size={10} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. INTERACTIVE LIVE DASHBOARD PREVIEW
         ══════════════════════════════════════════════════════ */}
      <section
        id="dashboard"
        ref={dashboardPreviewRef}
        aria-label={isFa ? "پیش‌نمایش داشبورد" : "Dashboard preview"}
        className="py-20 md:py-24 bg-[var(--background)] border-b border-[var(--border)] relative"
      >
        <div className="absolute top-1/4 right-1/3 w-[28vw] h-[28vw] bg-gradient-to-br from-[#38bdf8]/8 to-transparent rounded-full blur-[80px] pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isFa ? "پیش‌نمایش داشبورد" : "Live Dashboard Preview"}
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
              {isFa ? "داشبورد تعاملی هوش برند" : "Brand Intelligence Dashboard"}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {isFa
                ? "روی برندهای مختلف کلیک کنید تا تحلیل‌های معنایی زنده را مشاهده کنید."
                : "Toggle brand contexts to simulate real-time semantic analysis and citation mapping."}
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden grid lg:grid-cols-[240px_1fr] min-h-[500px]">
            {/* Sidebar */}
            <div className="border-b lg:border-b-0 lg:border-e border-[var(--glass-border)] bg-[var(--muted-surface)]/20 p-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">{isFa ? "انتخاب برند هدف" : "Brand Scope"}</h3>
                  <div className="space-y-1.5">
                    {(["optimus", "digikala", "snapp"] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className={`w-full px-3 py-2.5 rounded-[var(--radius-lg)] text-xs font-bold text-start transition-all ${activeBrand === brand ? "bg-gradient-to-r from-[#38bdf8]/15 to-[#f97316]/8 text-[var(--text-primary)] border border-[#38bdf8]/35" : "text-[var(--text-muted)] hover:bg-[var(--muted-surface)] hover:text-[var(--text-primary)] border border-transparent"}`}
                        aria-pressed={activeBrand === brand}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${brand === "optimus" ? "bg-[#38bdf8]" : "bg-[#f97316]"}`} aria-hidden="true" />
                          {brandNames[brand]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[var(--border)]" aria-hidden="true" />

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">{isFa ? "ابزارها" : "Analytics"}</h3>
                  <div className="space-y-1.5">
                    {[
                      { id: "sentiment", label: isFa ? "تحلیل احساسات" : "Sentiment Analysis", icon: MessageSquare },
                      { id: "visibility", label: isFa ? "شاخص دیده‌شدن" : "Visibility Score", icon: Activity },
                      { id: "graph", label: isFa ? "گراف دانش" : "Knowledge Graph", icon: Network },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as "sentiment" | "visibility" | "graph")}
                          className={`w-full px-3 py-2.5 rounded-[var(--radius-lg)] text-xs font-medium text-start flex items-center gap-2 transition-all ${activeTab === tab.id ? "bg-[var(--muted-surface)] text-[var(--text-primary)] font-bold border border-[var(--border)]" : "text-[var(--text-secondary)] hover:bg-[var(--muted-surface)] hover:text-[var(--text-primary)] border border-transparent"}`}
                          aria-pressed={activeTab === tab.id}
                        >
                          <Icon size={13} className="text-[#38bdf8]" aria-hidden="true" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollToRef(freeAuditRef)}
                className="mt-6 w-full py-2.5 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                aria-label={isFa ? "ممیزی رایگان" : "Run free audit"}
              >
                {isFa ? "ممیزی وب‌سایت شما" : "Run Your Free Audit"}
              </button>
            </div>

            {/* Main content pane */}
            <div className="p-6 sm:p-8 flex flex-col justify-between bg-[var(--muted-surface)]/5">
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[var(--border)] mb-6">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                      {activeTab === "sentiment" && (isFa ? "گزارش درک معنایی" : "Semantic Sentiment Insight")}
                      {activeTab === "visibility" && (isFa ? "شاخص دیده‌شدن برند" : "LLM Visibility Index")}
                      {activeTab === "graph" && (isFa ? "شبکه روابط معنایی" : "Entity Network")}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {isFa ? "برند انتخاب‌شده: " : "Context: "}
                      <span className="text-[#38bdf8] font-bold">{brandNames[activeBrand]}</span>
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] flex items-center gap-2 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-[var(--text-muted)] uppercase tracking-widest text-[9px]">{isFa ? "محیط آزمایشی" : "SANDBOX"}</span>
                  </div>
                </div>

                {/* Sentiment tab */}
                {activeTab === "sentiment" && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--glass-bg)] text-center">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "امتیاز" : "Score"}</span>
                        <div className="text-3xl font-black text-[#38bdf8] mt-1 font-display">{liveDashboardData[activeBrand].sentiment.score}<span className="text-xs text-[var(--text-muted)]">/100</span></div>
                        <div className="text-[11px] text-emerald-500 font-bold mt-1">{liveDashboardData[activeBrand].sentiment.grade}</div>
                      </div>
                      <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-2">{isFa ? "توزیع احساسات" : "Sentiment Mix"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex justify-between"><span className="text-emerald-500">{isFa ? "مثبت" : "Positive"}</span><span>{liveDashboardData[activeBrand].sentiment.pos}%</span></div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.pos}%` }} /></div>
                          <div className="flex justify-between"><span className="text-[var(--text-muted)]">{isFa ? "خنثی" : "Neutral"}</span><span>{liveDashboardData[activeBrand].sentiment.neu}%</span></div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-slate-500 transition-all duration-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neu}%` }} /></div>
                        </div>
                      </div>
                      <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-[10px] text-[var(--text-muted)] block mb-2">{isFa ? "ریسک توهم" : "Hallucination Risk"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex justify-between"><span className="text-rose-500">{isFa ? "ریسک خطا" : "Error Risk"}</span><span>{liveDashboardData[activeBrand].sentiment.neg}%</span></div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neg}%` }} /></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--muted-surface)]/30">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{liveDashboardData[activeBrand].sentiment.text}</p>
                    </div>
                  </div>
                )}

                {/* Visibility tab */}
                {activeTab === "visibility" && (
                  <div className="space-y-4 animate-fade-in" style={{ direction: "ltr" }}>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={liveDashboardData[activeBrand].chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                          <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: "8px" }} />
                          <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} name={isFa ? "امتیاز برند" : "Brand Score"} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="competitors" stroke="#f97316" strokeWidth={2} name={isFa ? "رقبا" : "Competitors"} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Graph tab */}
                {activeTab === "graph" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-4 gap-3">
                      {liveDashboardData[activeBrand].nodes.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => setSelectedGraphNode(selectedGraphNode === n.id ? null : n.id)}
                          className={`p-3.5 rounded-[var(--radius-xl)] border cursor-pointer text-center transition-all ${selectedGraphNode === n.id ? "border-[#38bdf8] bg-[#38bdf8]/10" : "border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--glass-bg)]"}`}
                          role="button"
                          aria-pressed={selectedGraphNode === n.id}
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedGraphNode(selectedGraphNode === n.id ? null : n.id); }}
                        >
                          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1 truncate">{n.label}</h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--muted-surface)] text-[var(--text-muted)] uppercase font-bold">{n.type}</span>
                          <p className="text-[10px] text-[var(--text-muted)] mt-2 truncate">{n.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dashboard footer */}
              <div className="mt-8 pt-5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-[var(--text-muted)]">
                  {isFa ? "آماده برای مشاهده گزارش کامل وب‌سایت خودتان؟" : "Ready to inspect your own brand's AI profile?"}
                </span>
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="px-4 py-2 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-[#38bdf8] hover:border-[#38bdf8] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isFa ? "شروع ممیزی فنی" : "Run Technical Audit"}</span>
                  <ArrowRight size={13} className="rtl:-scale-x-100" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. COMPARISON TABLE
         ══════════════════════════════════════════════════════ */}
      <section
        id="comparison"
        aria-label={isFa ? "مقایسه با رقبا" : "Comparison with competitors"}
        className="py-20 md:py-24 bg-[var(--background-subtle)]/20 border-b border-[var(--border)] relative"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.18] pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="font-display font-black text-3xl text-[var(--text-primary)] text-balance">
              {isFa ? "چرا ابزارهای سئوی سنتی کافی نیستند؟" : "Why traditional SEO tools fall short"}
            </h2>
            <p className="text-[var(--text-muted)]">
              {isFa
                ? "ابزارهای سئوی سنتی برای ایندکس موتورهای جستجو بهینه می‌شوند. این پلتفرم اعتماد برند را در حافظه معنایی هوش مصنوعی می‌سازد."
                : "Traditional SEO tools optimize for search engine indexes. This platform builds brand authority in AI semantic memory."}
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[var(--text-secondary)]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted-surface)]/40">
                    <th className="py-4 px-5 font-display font-bold text-sm text-start text-[var(--text-secondary)]">{isFa ? "قابلیت" : "Capability"}</th>
                    <th className="py-4 px-5 font-display font-black text-sm text-[#38bdf8] text-center bg-[#38bdf8]/5">Seorchable</th>
                    <th className="py-4 px-5 font-display font-semibold text-sm text-center text-[var(--text-muted)]">Ahrefs</th>
                    <th className="py-4 px-5 font-display font-semibold text-sm text-center text-[var(--text-muted)]">SEMrush</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="hover:bg-[var(--muted-surface)]/15 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-[var(--text-secondary)]">{row.feature}</td>
                      <td className="py-3.5 px-5 text-center bg-[#38bdf8]/5">
                        {row.us ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            <Check size={12} strokeWidth={3} className="text-emerald-400" aria-label="Yes" />
                          </span>
                        ) : (
                          <X size={14} className="text-[var(--text-muted)] mx-auto" aria-label="No" />
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.ahrefs ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            <Check size={12} strokeWidth={3} className="text-emerald-400" aria-label="Yes" />
                          </span>
                        ) : (
                          <X size={14} className="text-[var(--text-muted)] mx-auto" aria-label="No" />
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.semrush ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            <Check size={12} strokeWidth={3} className="text-emerald-400" aria-label="Yes" />
                          </span>
                        ) : (
                          <X size={14} className="text-[var(--text-muted)] mx-auto" aria-label="No" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. TESTIMONIALS
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "نظرات مشتریان" : "Customer testimonials"}
        className="py-20 md:py-24 bg-[var(--background)] border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isFa ? "نظرات مشتریان" : "Customer Stories"}
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
              {isFa ? "مورد اعتماد متخصصان بازاریابی" : "Trusted by marketing leaders"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="glass-panel hover-lift p-7 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between"
              >
                <blockquote className="space-y-4">
                  <div className="flex gap-0.5" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" className="text-[#f97316]" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t.quote}</p>
                </blockquote>
                <figcaption className="pt-5 border-t border-[var(--border)] mt-5 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-full)] flex items-center justify-center font-bold text-xs"
                    style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}30` }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <cite className="text-xs font-bold text-[var(--text-primary)] not-italic">{t.name}</cite>
                    <p className="text-[10px] text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Placeholder customer logo row */}
          <div className="mt-14 pt-10 border-t border-[var(--border)]">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-8">
              {isFa ? "مورد اعتماد سازمان‌های پیشرو" : "Trusted by category-leading organizations"}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {["Alibaba", "Snapp", "Tapsi", "Digikala", "Divar", "Bamilo"].map((name) => (
                <div
                  key={name}
                  className="h-12 flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--muted-surface)]/40 px-3"
                  aria-label={name}
                >
                  <span className="text-xs font-bold text-[var(--text-muted)]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. DOCUMENTATION PREVIEW
         ══════════════════════════════════════════════════════ */}
      <section
        id="docs"
        aria-label={isFa ? "پیش‌نمایش مستندات" : "Documentation preview"}
        className="py-20 md:py-24 bg-[var(--background-subtle)]/20 border-b border-[var(--border)] relative"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.15] pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                {isFa ? "مستندات" : "Documentation"}
              </span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
                {isFa ? "مستندات جامع برای هر سطحی" : "Comprehensive docs for every level"}
              </h2>
              <p className="text-[var(--text-secondary)] text-pretty">
                {isFa
                  ? "از راهنمای شروع سریع تا مرجع کامل API — همه چیز به خوبی مستند شده است."
                  : "From quick-start guides to full API reference — everything thoroughly documented."}
              </p>
            </div>
            <Link
              href={`/${locale}/docs`}
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--muted-surface)] text-sm font-bold text-[var(--text-primary)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)] transition-colors"
            >
              {isFa ? "مشاهده تمام مستندات" : "View all docs"}
              <ArrowRight size={14} className="rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {docsCategories.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link
                  key={doc.title}
                  href={doc.href}
                  className="group glass-panel hover-lift rounded-2xl border border-[var(--glass-border)] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--color-primary-600)]/35"
                  aria-label={doc.title}
                >
                  <div
                    className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center"
                    style={{ background: `${doc.color}15`, border: `1px solid ${doc.color}30` }}
                  >
                    <Icon size={18} style={{ color: doc.color }} aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--color-primary-600)] transition-colors">{doc.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{doc.desc}</p>
                  </div>
                  <span className="mt-auto text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--muted-surface)] text-[var(--text-muted)] border border-[var(--border)] self-start font-medium">
                    {doc.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          11. PRICING PREVIEW
         ══════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        ref={pricingRef}
        aria-label={isFa ? "قیمت‌گذاری" : "Pricing"}
        className="py-20 md:py-24 bg-[var(--background)] border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[var(--muted-surface)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isFa ? "قیمت‌گذاری شفاف" : "Transparent Pricing"}
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-[var(--text-primary)] text-balance">
              {isFa ? "برای هر مرحله از رشد شما" : "Plans for every stage of growth"}
            </h2>
            <p className="text-[var(--text-secondary)] text-pretty">
              {isFa
                ? "با طرح رایگان شروع کنید. با رشد کسب‌وکارتان ارتقا دهید."
                : "Start free. Upgrade as your brand grows. No lock-in."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl p-7 border transition-all duration-300 ${
                  tier.highlight
                    ? "border-[#38bdf8]/50 bg-gradient-to-b from-[#38bdf8]/5 to-[var(--glass-bg)] shadow-2xl shadow-[#38bdf8]/8 scale-[1.02]"
                    : "border-[var(--glass-border)] glass-panel"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                    {isFa ? "محبوب‌ترین" : "Most Popular"}
                  </div>
                )}

                <div className="space-y-1 mb-6">
                  <h3 className="font-display font-black text-base text-[var(--text-primary)]">{tier.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="font-display font-black text-3xl text-[var(--text-primary)]">{tier.price}</span>
                    {tier.period && <span className="text-sm text-[var(--text-muted)] mb-1">{tier.period}</span>}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{tier.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1" aria-label={`${tier.name} features`}>
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={tier.ctaHref}>
                  <Button
                    variant={tier.highlight ? "primary" : "ghost"}
                    className={`w-full font-bold ${tier.highlight ? "shadow-lg shadow-[#38bdf8]/20" : "border border-[var(--border)]"}`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-[var(--text-muted)]">
            {isFa ? "مقایسه کامل طرح‌ها را مشاهده کنید. " : "See full plan comparison. "}
            <Link href={`/${locale}/pricing`} className="text-[var(--color-primary-600)] font-bold hover:underline">
              {isFa ? "صفحه قیمت‌گذاری ←" : "Pricing page →"}
            </Link>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          12. SAMPLE REPORT DOWNLOAD
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "دانلود نمونه گزارش" : "Sample report download"}
        className="py-20 md:py-24 bg-[var(--background-subtle)]/20 border-b border-[var(--border)] relative"
      >
        <div className="absolute top-1/2 left-1/4 w-[30vw] h-[30vw] bg-gradient-to-br from-[#f97316]/8 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" aria-hidden="true" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 md:p-12 grid md:grid-cols-[1fr_380px] gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[#f97316]/10 border border-[#f97316]/30 text-xs font-bold text-[#f97316]">
                <FileText size={12} aria-hidden="true" />
                {isFa ? "مستند نمونه" : "Sample Report"}
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl text-[var(--text-primary)] text-balance">
                {isFa ? "نمونه گزارش تحلیل برند را دانلود کنید" : "Download a sample brand analysis report"}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {isFa
                  ? "با دریافت این سند نمونه، با فرمت و متدولوژی تحلیل ساختاری و سهم صدای برند آشنا شوید."
                  : "Explore a fully generated diagnostic document — entity graphs, visibility metrics, and actionable recommendations."}
              </p>
              <ul className="space-y-2.5 text-xs font-bold text-[var(--text-muted)]">
                {[
                  isFa ? "نگاشت ساختار گراف ارتباطات ۱-هاپ" : "1-hop relation schema mapping",
                  isFa ? "تحلیل کلمات کلیدی و پایش توهم" : "Keyword analysis and hallucination monitoring",
                  isFa ? "راهکارهای عملی بهینه‌سازی AEO" : "Actionable AEO optimization recommendations",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-[#38bdf8]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/optimus-ai-sample-report.pdf"
                download="seorchable-sample-report.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-sm shadow-lg shadow-[#38bdf8]/15 hover:scale-[1.03] transition-transform"
                aria-label={isFa ? "دانلود نمونه گزارش PDF" : "Download sample PDF report"}
              >
                <Download size={15} aria-hidden="true" />
                {isFa ? "دانلود نمونه گزارش (PDF)" : "Download Sample Report (PDF)"}
              </a>
            </div>

            {/* Stylised report mockup */}
            <div className="relative w-full h-[320px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 shadow-2xl flex flex-col justify-between overflow-hidden" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/4 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[var(--radius-md)] bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-white text-[10px] font-black">AI</div>
                  <div>
                    <h4 className="text-[11px] font-black text-[var(--text-primary)]">Brand AI Audit</h4>
                    <span className="text-[9px] text-[var(--text-muted)] font-mono">ID: #99A1-D8</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] font-bold">SAMPLE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 py-3">
                <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--muted-surface)]/50 border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Factuality</span>
                  <p className="text-lg font-extrabold text-[#38bdf8] font-display">94.2%</p>
                </div>
                <div className="p-2.5 rounded-[var(--radius-lg)] bg-[var(--muted-surface)]/50 border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Citations</span>
                  <p className="text-lg font-extrabold text-[#f97316] font-display">840 ref</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#38bdf8] to-[#f97316]" style={{ width: "85%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                  <span>Semantic Alignment</span><span>85%</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border)] flex justify-between text-[10px] text-[var(--text-muted)]">
                <span>Seorchable Platform</span>
                <span className="font-mono">Page 1 / 18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          13. FREE AUDIT FULL PANEL
         ══════════════════════════════════════════════════════ */}
      <section
        ref={freeAuditRef}
        aria-label={isFa ? "ابزار ممیزی کامل" : "Full audit tool"}
        className="py-20 md:py-24 bg-[var(--background)] border-b border-[var(--border)] relative"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.15] pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8]">
              <Sparkles size={12} className="animate-pulse" aria-hidden="true" />
              {isFa ? "ابزار ممیزی آنلاین" : "Online Audit Suite"}
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-[var(--text-primary)] text-balance">
              {isFa ? "همین حالا ساختار وب‌سایت خود را تحلیل کنید" : "Audit Your Website Structure Now"}
            </h2>
            <p className="text-[var(--text-muted)] text-pretty">
              {isFa
                ? "دامنه سایت خود را وارد کنید تا تگ‌های متادیتا، ساختار ربات‌ها و کیفیت خوانش با Firecrawl بررسی شود."
                : "Submit your domain to retrieve diagnostics on crawlability, declared language structures, and heading scores."}
            </p>
          </div>

          <div className="glass-panel p-2 sm:p-4 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl">
            <FreeAuditPanel onUpgradeClick={() => scrollToRef(pricingRef)} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          14. FINAL CTA BAND
         ══════════════════════════════════════════════════════ */}
      <section
        aria-label={isFa ? "شروع کار" : "Get started"}
        className="py-20 md:py-28 bg-[var(--background-subtle)]/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-gradient-to-br from-[#38bdf8]/8 to-[#f97316]/5 rounded-full blur-[120px] pointer-events-none -z-10" aria-hidden="true" />

        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center space-y-8 relative z-10">
          <h2 className="font-display font-black text-3xl md:text-5xl text-[var(--text-primary)] text-balance leading-tight">
            {isFa ? (
              <>برند شما در موتورهای هوش مصنوعی<br /><span className="text-gradient-brand">چقدر دیده می‌شود؟</span></>
            ) : (
              <>How visible is your brand<br /><span className="text-gradient-brand">in AI search engines?</span></>
            )}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto text-pretty">
            {isFa
              ? "همین حالا یک ممیزی رایگان انجام دهید و بفهمید که ChatGPT، Claude و Perplexity چه تصویری از برند شما دارند."
              : "Run a free audit today and discover exactly how ChatGPT, Claude, and Perplexity describe your brand."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollToRef(freeAuditRef)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-base shadow-xl shadow-[#38bdf8]/20 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
              aria-label={isFa ? "شروع ممیزی رایگان" : "Start free audit"}
            >
              <Sparkles size={16} aria-hidden="true" />
              {isFa ? "ممیزی رایگان هوش مصنوعی" : "Start Free AI Audit"}
            </button>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[var(--radius-full)] font-bold text-base text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)] bg-[var(--muted-surface)] transition-colors"
            >
              {isFa ? "تماس با تیم فروش" : "Talk to Sales"}
              <ArrowRight size={15} className="rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {isFa ? "بدون نیاز به کارت اعتباری · راه‌اندازی در زیر ۵ دقیقه · پشتیبانی ۲۴/۷" : "No credit card required · Setup in under 5 minutes · 24/7 support"}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          15. FOOTER
         ══════════════════════════════════════════════════════ */}
      <LandingFooter />
    </div>
  );
}
