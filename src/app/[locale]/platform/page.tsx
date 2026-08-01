"use client";

import React, { useState, use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Waypoints,
  TrendingUp,
  Radar,
  MessageSquare,
  Activity,
  Network,
  Check,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function PlatformPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  // States for interactive mini-dashboard
  const [activeBrand, setActiveBrand] = useState<"optimus" | "digikala" | "snapp">("optimus");
  const [activeTab, setActiveTab] = useState<"sentiment" | "visibility" | "graph">("sentiment");
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);

  const features = [
    {
      icon: BrainCircuit,
      span: "md:col-span-2",
      title: isFa ? "بهینه‌سازی موتور مولد (GEO)" : "Generative Engine Optimization",
      desc: isFa
        ? "ردپای برند خود را در خطوط پردازش RAG به‌صورت سیستماتیک دنبال و بهینه کنید تا در خروجی مدل‌ها برجسته شوید."
        : "Systematically track and optimize your brand footprint inside RAG pipelines so you surface in model outputs.",
    },
    {
      icon: Sparkles,
      span: "",
      title: isFa ? "بهینه‌سازی موتور پاسخ (AEO)" : "Answer Engine Optimization",
      desc: isFa
        ? "زمینه‌ی پیوندهای خروجی را چنان ساختار دهید که به‌عنوان منبع مستقیم توصیه در Perplexity ذکر شوید."
        : "Structure outbound link context to be cited as a direct recommendation source in Perplexity.",
    },
    {
      icon: ShieldCheck,
      span: "",
      title: isFa ? "محافظت در برابر توهم" : "Hallucination protection",
      desc: isFa
        ? "به‌محض آنکه مدل‌ها درباره‌ی شرکت شما اطلاعات نادرست تولید کنند، هشدار دریافت کنید."
        : "Get alerted the instant language models output factual inaccuracies about your company.",
    },
    {
      icon: Waypoints,
      span: "",
      title: isFa ? "گراف دانش برند" : "Brand knowledge graph",
      desc: isFa
        ? "روابط میان موجودیت‌ها، محصولات و مدیران را در یک گراف زنده و قابل‌کاوش مشاهده کنید."
        : "See how entities, products, and executives relate inside a live, explorable graph.",
    },
    {
      icon: TrendingUp,
      span: "",
      title: isFa ? "تحلیل احساسات و روند" : "Sentiment & trend analytics",
      desc: isFa
        ? "روند لحن گفتگوها درباره‌ی برند شما را در طول زمان و در هر موتور بسنجید."
        : "Measure how sentiment about your brand shifts over time, per engine.",
    },
    {
      icon: Radar,
      span: "md:col-span-2",
      title: isFa ? "رصد رقبا" : "Competitive radar",
      desc: isFa
        ? "جایگاه خود را در برابر رقبا در پاسخ‌های مدل‌ها بسنجید و شکاف‌های ارجاع را کشف کنید."
        : "Benchmark your share of voice against competitors in model answers and uncover citation gaps.",
    },
  ];

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
        { date: "۰۱/۰4", score: 57, competitors: 53 },
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
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-bold text-[#38bdf8]">
            {isFa ? "امکانات پلتفرم مرکزی" : "Core Platform Capabilities"}
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight">
            {isFa ? "سکوی هوشمندی برند و بهبود سهم صدای هوش مصنوعی" : "The Core Engine for AI Brand Share of Voice"}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-3xl mx-auto font-medium">
            {isFa
              ? "ابزارها و قابلیت‌های عمیق تحلیل برای رهبری برند شما در عصر مدل‌های زبانی بزرگ، موتورهای پاسخگو و شبکه‌های معنایی."
              : "Advanced dashboarding, competitive tracking, and RAG optimization capabilities configured for enterprise systems."}
          </p>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "امکانات و اجزای کلیدی" : "Platform Modules"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {isFa ? "موتورهای یکپارچه برای ردیابی، سنجش، و بهبود حضور ارگانیک برند شما." : "Powerful capabilities built on multi-model testing frameworks."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <article
                  key={i}
                  className={`group animated-border-glass ${f.span} hover-lift rounded-[var(--radius-xl)] p-6 md:p-7 bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col gap-4`}
                >
                  <span className="feature-icon inline-flex w-10 h-10 items-center justify-center rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
                    <Icon size={20} className="rtl:-scale-x-100" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Live Mini-Dashboard Sandbox */}
      <section className="py-20 bg-[var(--background-subtle)]/30 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "شبیه‌ساز پیشخوان پلتفرم" : "Live Dashboard Sandbox"}
            </h2>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm font-medium">
              {isFa ? "داده‌ها و نحوه تحلیل احساسات برندها را به ازای مدل‌های مختلف هوش مصنوعی بررسی کنید." : "Select targets to preview LLM sentiment analysis, visibility trend charts, and entity network data."}
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden grid lg:grid-cols-[250px_1fr] min-h-[520px]">
            {/* Left sidebar */}
            <div className="border-b lg:border-b-0 lg:border-l border-[var(--glass-border)] bg-[var(--muted-surface)]/20 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {isFa ? "برند هدف" : "Target Brand Scope"}
                  </h3>
                  <div className="space-y-2">
                    {(["optimus", "digikala", "snapp"] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrand(brand)}
                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-start transition-all cursor-pointer ${
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

                <div className="h-[px] bg-[var(--border)]" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {isFa ? "نمای تحلیل" : "Analytics Views"}
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
                          className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium text-start flex items-center gap-2.5 transition-all cursor-pointer ${
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
            </div>

            {/* Right content */}
            <div className="p-8 flex flex-col justify-between bg-[var(--muted-surface)]/10">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border)] mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] font-display">
                      {activeTab === "sentiment" && (isFa ? "گزارش درک معنایی و احساسات برند" : "Semantic Sentiment Insight")}
                      {activeTab === "visibility" && (isFa ? "شاخص هوشمندی و سهم صدای برند" : "LLM Visibility Index Trend")}
                      {activeTab === "graph" && (isFa ? "ساختار روابط معنایی گراف دانش" : "Live Localized Entity Network")}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {isFa ? "نمای فعال برای: " : "Active scope: "}
                      <span className="text-[#38bdf8] font-bold">{brandNames[activeBrand]}</span>
                    </p>
                  </div>
                </div>

                {activeTab === "sentiment" && (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-center">
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{isFa ? "امتیاز سلامت معنایی" : "Semantic Score"}</span>
                        <div className="text-3xl font-black text-[#38bdf8] mt-1 font-display">
                          {liveDashboardData[activeBrand].sentiment.score} <span className="text-xs text-[var(--text-muted)]">/ ۱۰۰</span>
                        </div>
                        <div className="text-[11px] text-emerald-500 font-bold mt-1">
                          {isFa ? "رتبه کیفی: " : "Grade: "} {liveDashboardData[activeBrand].sentiment.grade}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "سیگنال‌های درک" : "Sentiment Mix"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-500">{isFa ? "مثبت" : "Positive"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.pos}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.pos}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)]">
                        <span className="text-xs text-[var(--text-muted)] block text-center mb-2">{isFa ? "ریسک توهم" : "Hallucination Risk"}</span>
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between">
                            <span className="text-rose-500">{isFa ? "پاسخ نادرست" : "Risk of Claim Error"}</span>
                            <span>{liveDashboardData[activeBrand].sentiment.neg}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${liveDashboardData[activeBrand].sentiment.neg}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--muted-surface)]/30">
                      <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{isFa ? "تحلیل کالبدشکافی زبان طبیعی" : "Semantic AI Analysis Verdict"}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                        {liveDashboardData[activeBrand].sentiment.text}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "visibility" && (
                  <div className="space-y-4" style={{ direction: "ltr" }}>
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
                  </div>
                )}

                {activeTab === "graph" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {liveDashboardData[activeBrand].nodes.map((n) => (
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
                          <p className="text-[10px] text-[var(--text-muted)] mt-2 truncate font-semibold">{n.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand">
              {isFa ? "مقایسه کارایی با ابزارهای سئو سنتی" : "How We Compare with Classic SEO"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {isFa ? "دنیای سئو کلمات کلیدی در مقابل موتورهای معنایی و پاسخگویی هوش مصنوعی." : "Our approach targets model parameters rather than simple index page ranks."}
            </p>
          </div>

          <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-[var(--text-secondary)]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted-surface)]/40 text-[var(--text-secondary)] text-xs font-bold">
                    <th className="py-5 px-6 text-start">{isFa ? "ویژگی‌های تحلیل" : "Core Capabilities"}</th>
                    <th className="py-5 px-6 text-[#38bdf8] text-center bg-[#38bdf8]/5">Optimus AI</th>
                    <th className="py-5 px-6 text-center">Ahrefs</th>
                    <th className="py-5 px-6 text-center">SEMrush</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-bold">
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4 px-6 text-start">{isFa ? "تحلیل معنایی با LLM و رفع توهم" : "Semantic LLM Analysis & Hallucination Watch"}</td>
                    <td className="py-4 px-6 text-center bg-[#38bdf8]/5"><Check size={14} className="text-emerald-400 mx-auto" strokeWidth={3} /></td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4 px-6 text-start">{isFa ? "ترسیم هوشمند گراف دانش برند" : "Brand Entity Knowledge Graph Mapping"}</td>
                    <td className="py-4 px-6 text-center bg-[#38bdf8]/5"><Check size={14} className="text-emerald-400 mx-auto" strokeWidth={3} /></td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                  </tr>
                  <tr className="hover:bg-[var(--muted-surface)]/20 transition-colors">
                    <td className="py-4 px-6 text-start">{isFa ? "تحلیل شاخص دیده‌شدن برخط (AI Visibility)" : "LLM Visibility Index Analysis"}</td>
                    <td className="py-4 px-6 text-center bg-[#38bdf8]/5"><Check size={14} className="text-emerald-400 mx-auto" strokeWidth={3} /></td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                    <td className="py-4 px-6 text-center text-slate-500">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
