"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Check, HelpCircle } from "lucide-react";

export default function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const plans = [
    {
      name: isFa ? "تحلیل رایگان" : "Free Audit",
      price: isFa ? "۰ تومان" : "$0",
      period: isFa ? "برای همیشه" : "Forever",
      desc: isFa ? "مناسب برای بررسی اولیه و عیب‌یابی فنی و متاداده‌های ساختاری." : "Basic sanity checks on meta elements and index crawlability.",
      features: [
        isFa ? "خزش ۱ دامنه به صورت انتخابی" : "Crawl 1 custom domain",
        isFa ? "تحلیل متاداده‌ها و ساختار ربات‌ها" : "Analyze header & robots.txt metadata",
        isFa ? "اعتبارسنجی تک‌مدلی (ChatGPT)" : "Single-model simulation (ChatGPT)",
        isFa ? "گزارش کلی و تکی نمره سئو" : "General audit quality scorecard",
      ],
      cta: isFa ? "شروع تحلیل رایگان" : "Start Free Audit",
      href: `/${locale}`,
      accent: false,
    },
    {
      name: isFa ? "حرفه‌ای (Professional)" : "Professional",
      price: isFa ? "۲۹۹$ / ماه" : "$299 / mo",
      period: isFa ? "تضمین عودت وجه" : "Billed monthly",
      desc: isFa ? "برای استارتاپ‌ها و شرکت‌های متوسط جهت ردیابی کامل و رفع توهم." : "Deep semantic insight and continuous hallucination monitoring.",
      features: [
        isFa ? "پایش مستمر تا ۵ دامنه برخط" : "Track up to 5 active domains",
        isFa ? "اتصال به ۴ موتور برجسته (GPT-4o, Claude 3.5, Perplexity, Gemini)" : "Connect to all major LLMs & search engines",
        isFa ? "گراف دانش روابط معنایی ۱-هاپ" : "Interactive 1-hop brand entity graph",
        isFa ? "هشدار لحظه‌ای به محض کشف توهم" : "Real-time email/webhook hallucination alerts",
        isFa ? "ارائه راهکارهای بهبود رتبه AEO" : "Actionable sitemap optimization guidelines",
      ],
      cta: isFa ? "خرید اشتراک حرفه‌ای" : "Subscribe Professional",
      href: `/${locale}/register`,
      accent: true,
    },
    {
      name: isFa ? "سازمانی (Enterprise)" : "Enterprise Suite",
      price: isFa ? "تماس با فروش" : "Custom / Enterprise",
      period: isFa ? "قرارداد سالانه SLA" : "Enterprise grade SLA",
      desc: isFa ? "برای شرکت‌های بزرگ، هلدینگ‌ها و پلتفرم‌های با داده‌های حجیم." : "Bespoke custom pipelines with full tenant context isolation.",
      features: [
        isFa ? "دامنه و پهنای باند کاملاً نامحدود" : "Unlimited target domains & crawls",
        isFa ? "تزریق اختصاصی محتوا به دیتابیس RAG" : "Direct vector and RAG ingestion paths",
        isFa ? "پشتیبانی اختصاصی کارشناسان زبان طبیعی" : "Dedicated NLP & LLM optimization engineers",
        isFa ? "دسترسی کامل به API پلتفرم" : "Full REST API access & SDK libraries",
        isFa ? "امنیت فوق‌العاده با جداسازی چندمستاجری" : "SLA agreement and dedicated support team",
      ],
      cta: isFa ? "درخواست دمو و مشاوره" : "Contact Sales / Demo",
      href: `/${locale}/contact`,
      accent: false,
    },
  ];

  const faqs = [
    {
      q: isFa ? "تفاوت سئو سنتی با AEO چیست؟" : "What is Answer Engine Optimization (AEO)?",
      a: isFa
        ? "سئو سنتی بر روی رتبه صفحات وب در ایندکس‌های موتورهای جستجوی متنی تمرکز دارد. اما AEO بر ساختارهای گراف دانش و پارامترهای توزیع معنایی مدل‌های زبانی متمرکز است تا به عنوان مرجع اصلی در خروجی‌های هوش مصنوعی توصیه شوید."
        : "Traditional SEO focuses on search index ranks. AEO organizes website context and structured schemas so LLMs understand your entities and cite you directly in conversational outputs.",
    },
    {
      q: isFa ? "پایش توهم برند چگونه کار می‌کند؟" : "How does hallucination monitoring work?",
      a: isFa
        ? "سیستم ما به صورت خودکار سوالات کلیدی مربوط به حوزه تخصصی شما را شبیه‌سازی کرده و پاسخ‌های دریافتی از مدل‌ها را پردازش می‌کند. در صورت وجود ارجاع اشتباه یا اطلاعات غیرواقعی، بلافاصله هشدار دریافت می‌کنید."
        : "Our pipeline continuously queries target models with industry and brand prompts. If a model generates false facts or links your services to a competitor, we flag it immediately.",
    },
    {
      q: isFa ? "آیا امکان ارتقا یا لغو اشتراک در هر زمان وجود دارد؟" : "Can I upgrade or cancel my plan anytime?",
      a: isFa
        ? "بله، در اشتراک‌های ماهیانه شما به سادگی می‌توانید اشتراک خود را در بخش تنظیمات ارتقا داده یا لغو کنید. اشتراک‌های سازمانی به صورت توافق‌نامه خدماتی سالانه تنظیم می‌گردند."
        : "Yes, monthly subscription plans are fully flexible and can be modified or cancelled directly inside your settings panel. Enterprise deals can be structured with customized billing cycles.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-bold text-[#38bdf8]">
            {isFa ? "اشتراک‌ها و تعرفه‌ها" : "Pricing Plans"}
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight">
            {isFa ? "تعرفه‌های منعطف برای پایش اعتبار برند در هوش مصنوعی" : "Flexible Pricing Tailored for Growth"}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto font-medium">
            {isFa
              ? "بر اساس اندازه سازمان و نیازهای پایش خود، بهترین طرح را برای بهبود رتبه و کاهش ریسک توهمات برند انتخاب کنید."
              : "Choose a plan that fits your business scope—from basic technical audits to enterprise-scale RAG injection."}
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-12 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((p, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
                  p.accent
                    ? "border-[#38bdf8] bg-gradient-to-b from-[#111827]/80 to-[#1e293b]/50 dark:from-[#0f172a] dark:to-[#1e1b4b]/20 shadow-2xl shadow-sky-500/10"
                    : "border-[var(--glass-border)] bg-[var(--glass-bg)]"
                }`}
              >
                {p.accent && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white text-[10px] font-black uppercase tracking-wider">
                    {isFa ? "پیشنهاد کاربران" : "Most Popular"}
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold font-display text-[var(--text-primary)]">{p.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-semibold min-h-[32px]">{p.desc}</p>
                  </div>

                  <div className="py-4 border-y border-[var(--border)]">
                    <span className="text-3xl font-black font-display text-[var(--text-primary)]">{p.price}</span>
                    <span className="text-xs text-[var(--text-muted)] font-bold ms-2">/ {p.period}</span>
                  </div>

                  <ul className="space-y-3">
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold text-[var(--text-secondary)]">
                        <Check size={14} className="text-[#38bdf8] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={p.href}
                    className={`block w-full py-3.5 rounded-xl text-center text-xs font-black transition-all ${
                      p.accent
                        ? "bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white shadow-lg hover:shadow-sky-500/15"
                        : "bg-[var(--muted-surface)] text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)]"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[var(--background-subtle)]/20 border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand">
              {isFa ? "سوالات متداول کاربران" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">
              {isFa ? "پاسخ به متداول‌ترین ابهامات درباره تعرفه‌ها و خدمات هوشمندی برند." : "Everything you need to know about our billing and technology."}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((f, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-2.5">
                <div className="flex items-center gap-2 text-[#38bdf8]">
                  <HelpCircle size={16} />
                  <h3 className="text-sm sm:text-base font-bold font-display">{f.q}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
