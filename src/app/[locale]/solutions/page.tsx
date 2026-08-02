"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import {
  Globe,
  Database,
  Brain,
  Layers,
  ExternalLink,
  ShieldAlert,
  Search,
  CheckCircle,
} from "lucide-react";

export default function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#f97316]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-1.5 text-xs font-bold text-[#f97316]">
            {isFa ? "راهکارهای سطح سازمانی (Enterprise)" : "Enterprise Solutions Hub"}
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight">
            {isFa ? "راه‌حل‌های بهینه‌سازی و حفاظت از برند برای صنایع هوشمند" : "Protect & Optimize Your Brand Across AI Ecosystems"}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-3xl mx-auto font-medium">
            {isFa
              ? "تحلیل گرامری و عمیق، غنی‌سازی مدل‌های زبانی با اطلاعات صحیح و برخط درباره ساختار محصولات و سرویس‌های سازمان شما."
              : "Enterprise-grade RAG ingestion, schema structuring, and hallucination monitoring built for high-scale organizations."}
          </p>
        </div>
      </section>

      {/* 4-Step Technical Flow Section */}
      <section className="py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "فرآیند تحلیل و جریان فنی پردازش" : "Our Technical Pipeline"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {isFa
                ? "چگونه پلتفرم ما به طور خودکار داده‌ها را جمع‌آوری، تفکیک و در پاسخ‌های هوش زبانی تزریق می‌کند."
                : "A multi-stage programmatic pipeline designed for accuracy and high citation volume."}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۱
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۱. خزش هوشمند (Crawl)" : "1. Smart Crawling"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "خزش تمام‌عیار محتوای وب‌سایت با موتور Firecrawl جهت یافتن محتواهای ساختاریافته و داده‌های مخفی."
                  : "We crawl corporate websites using specialized Firecrawl infrastructure, gathering deep text elements."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۲
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316] mb-6">
                <Database size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۲. استخراج موجودیت‌ها (Parse)" : "2. Entity Parsing"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "استخراج روابط و موجودیت‌های برند، رقبای کلیدی، مفاهیم و الگوها با دقت دستوری و گرامری بسیار بالا."
                  : "Processing textual structures to map complex brand schemas, proprietary assets, and synonyms."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۳
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۳. تحلیل معنایی (Analyze)" : "3. Semantic Analysis"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "تحلیل معنایی با LLM برای شناسایی میزان تفاهم و سهم حضور برند در پاسخ‌های هوش مصنوعی."
                  : "Assessing LLM sentiment vectors, keyword associations, and competitor citation frequencies."}
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#f97316] flex items-center justify-center text-xs font-black text-white">
                ۴
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 font-display">
                {isFa ? "۴. گراف دانش و توصیه‌ها (Visualize)" : "4. Graph Mapping"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "نمایش روابط گراف دانش، پایش توهم و تولید راهکارهای بهبود رتبه برند در هوش مصنوعی (AEO)."
                  : "Generating interactive graph networks and direct optimization proposals for brand discovery."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Segments / Industries */}
      <section className="py-20 bg-[var(--background-subtle)]/20 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand">
              {isFa ? "راهکارهای صنعتی هدف" : "Industry-specific Solutions"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {isFa ? "پیکربندی هوشمند و متمایز برای صنایع مختلف بازار." : "Bespoke configurations tailored for diverse commercial vectors."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] space-y-4">
              <h3 className="text-lg font-bold font-display text-[#38bdf8]">{isFa ? "خرده‌فروشی و تجارت الکترونیک" : "E-commerce & Retail"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "بهبود سهم صدا و توصیه‌های هوشمند برای کاتالوگ محصولات با هزاران ردیف کالا." : "Scale recommendation frequency across millions of SKU permutations."}
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] space-y-4">
              <h3 className="text-lg font-bold font-display text-[#f97316]">{isFa ? "استارتاپ‌ها و پلتفرم‌های SaaS" : "SaaS & Tech Platforms"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "قرار گرفتن در خوشه‌های ارجاع و مقایسه‌های برتر ابزارها در تحلیل‌های LLM." : "Dominate competitor benchmark tables and feature comparisons inside ChatGPT."}
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] space-y-4">
              <h3 className="text-lg font-bold font-display text-purple-400">{isFa ? "سازمان‌های مالی و خدماتی" : "Finance & Services"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "حفاظت شدید در برابر اطلاعات نادرست و توهم‌های مالی با درجه ایمنی تجاری بالا." : "Mitigate systemic risk and verify financial product claims in real-time."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Block */}
      <section className="py-20 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "مورد اعتماد مدیران بازاریابی و متخصصان رشد" : "Trusted by Category Leaders"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {isFa
                ? "نظرات کارشناسان و متخصصان بهینه‌سازی که توانسته‌اند توهم برند خود را در مدل‌های زبانی رفع کنند."
                : "See how enterprise companies analyze and optimize their AI presence."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">{"★".repeat(5)}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {isFa
                    ? "«پیش از استفاده از اپتیموس، هوش مصنوعی کلود خدمات ما را به اشتباه به یکی از رقبایمان استناد می‌داد. به کمک تحلیل معنایی و تحلیل ساختاری توانستیم این توهم مخرب برند را کاملاً مرتفع کنیم.»"
                    : "Before Optimus AI, Claude routinely hallucinated our market services and pointed customers to rival links. Restructuring our entities completely resolved this visibility leak."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-[#38bdf8]">م‌ر</div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "مسعود راد" : "Masoud Rad"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر رشد، علی‌بابا" : "VP of Growth, Alibaba"}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">{"★".repeat(5)}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {isFa
                    ? "«تحلیل سهم صدای برند در مدل‌های زبانی (LLM Voice Share) دقیقاً همان حلقه‌ی گم‌شده‌ی گزارش‌های برندینگ ما بود. پلتفرم اپتیموس این کار سخت را به یک فرآیند خودکار و جذاب تبدیل کرده است.»"
                    : "The LLM Voice Share and citation tracking index is exactly what we needed to evaluate our organic visibility in OpenAI answers."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-[#f97316]">س‌م</div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "سارا موسوی" : "Sara Mousavi"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر ارشد سئو، اسنپ" : "Head of SEO, Snapp"}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between h-full hover-lift">
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">{"★".repeat(5)}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">
                  {isFa
                    ? "«به عنوان یک استارتاپ تکنولوژی، حضور صحیح در پاسخ‌های متنی هوش زبانی برای جذب ترافیک علمی ما حیاتی بود. ابزار تحلیل و بهبود فنی اپتیموس امتیاز و کیفیت برند ما را ۲ برابر افزایش داد.»"
                    : "As a technology startup, getting our platform cited correctly in ChatGPT answers was vital. Optimus AI doubled our visibility index scores."}
                </p>
              </div>
              <div className="pt-6 border-t border-[var(--border)] mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--muted-surface)] flex items-center justify-center font-bold text-purple-400">آ‌ب</div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{isFa ? "آرش بهرامی" : "Arash Bahrami"}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">{isFa ? "مدیر بازاریابی دیجیتال، تپسی" : "Digital Marketing Lead, Tapsi"}</span>
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
