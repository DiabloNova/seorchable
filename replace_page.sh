cat << 'INNER_EOF' > src/app/\[locale\]/page.tsx
"use client";

import { useEffect, useState, useRef, use } from "react";
import { Link } from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  BarChart3,
  Search,
  Sparkles,
  Zap,
  Globe,
  Database,
  Lock,
  ChevronRight,
  Eye,
  Crosshair,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldAlert,
  PieChart,
  Target,
  Check,
  Building2,
  Workflow,
  Cpu
} from "lucide-react";

import { Header } from "@/components/marketing/Header";
import { Hero } from "@/components/marketing/Hero";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { FreeAuditSection } from "@/components/marketing/FreeAuditSection";

interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function Home(props: LocalePageProps) {
  const params = use(props.params);
  const locale = params.locale;
  const isFa = locale === "fa";
  const { theme } = useTheme();

  // Scroll logic for specific sections
  const freeAuditRef = useRef<HTMLElement>(null);
  const whyDifferentRef = useRef<HTMLElement>(null);
  const ecosystemRef = useRef<HTMLElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const aeoFeatures = [
    {
      icon: Eye,
      title: isFa ? "تحلیل رویت‌پذیری برند (Visibility)" : "Brand Visibility Analysis",
      desc: isFa ? "سنجش میزان حضور و معرفی برند شما در پاسخ‌های هوش مصنوعی." : "Measure how often your brand is recommended by AI models."
    },
    {
      icon: BrainCircuit,
      title: isFa ? "استخراج موجودیت‌ها و گره‌ها (Entities)" : "Entity Extraction & Mapping",
      desc: isFa ? "تحلیل ساختار گراف دانش و شناسایی موجودیت‌های مرتبط با برند." : "Analyze the knowledge graph and extract brand-related entities."
    },
    {
      icon: MessageSquare,
      title: isFa ? "تحلیل لحن و احساسات (Sentiment)" : "Sentiment & Tone Analysis",
      desc: isFa ? "بررسی لحن و رویکرد هوش مصنوعی نسبت به محصولات و خدمات شما." : "Evaluate the AI's sentiment toward your products and services."
    },
    {
      icon: ShieldAlert,
      title: isFa ? "پایش ادعاها و توهمات (Hallucinations)" : "Hallucination & Claim Monitoring",
      desc: isFa ? "شناسایی اطلاعات نادرست و توهمات هوش مصنوعی درباره برند شما." : "Detect inaccurate information and AI hallucinations about your brand."
    }
  ];

  const ecoSystemLayers = [
    {
      icon: Database,
      title: isFa ? "لایه یک: جمع‌آوری داده" : "Layer 1: Data Acquisition",
      desc: isFa ? "خزش و استخراج محتوا از منابع ساختاریافته و بدون ساختار (Web Crawling & API)." : "Crawling and extracting content from structured and unstructured sources."
    },
    {
      icon: Cpu,
      title: isFa ? "لایه دو: پردازش و غنی‌سازی" : "Layer 2: Processing & Enrichment",
      desc: isFa ? "استفاده از مدل‌های زبانی (LLMs) برای درک معنایی، استخراج موجودیت‌ها و دسته‌بندی." : "Using LLMs for semantic understanding, entity extraction, and classification."
    },
    {
      icon: Workflow,
      title: isFa ? "لایه سه: گراف دانش" : "Layer 3: Knowledge Graph",
      desc: isFa ? "ایجاد ارتباط بین مفاهیم، برندها و محصولات در یک گراف دانش یکپارچه." : "Building relationships between concepts, brands, and products in a unified knowledge graph."
    },
    {
      icon: Search,
      title: isFa ? "لایه چهار: موتور هوش پاسخگو" : "Layer 4: Conversational Engine",
      desc: isFa ? "پاسخگویی به پرسش‌های کاربران بر اساس داده‌های غنی‌شده و گراف دانش." : "Answering user queries based on enriched data and the knowledge graph."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-teal-500/30 font-sans">
      <Header />
      <Hero />

      {/* Logos Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-1000">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
            {isFa ? "موتورهای تحت پوشش پایش" : "Monitored AI Engines"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Replace with actual minimal SVG logos if available, using text for now */}
             <div className="text-xl font-bold font-display text-slate-700 dark:text-slate-300">ChatGPT</div>
             <div className="text-xl font-bold font-display text-slate-700 dark:text-slate-300">Claude</div>
             <div className="text-xl font-bold font-display text-slate-700 dark:text-slate-300">Gemini</div>
             <div className="text-xl font-bold font-display text-slate-700 dark:text-slate-300">Perplexity</div>
             <div className="text-xl font-bold font-display text-slate-700 dark:text-slate-300">Copilot</div>
          </div>
        </div>
      </section>

      {/* Feature 1: AEO & Visibility (Replaces ugly cyan module) */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                   <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                   <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
                     {isFa ? "ماژول :: پایش رویت‌پذیری" : "MODULE :: VISIBILITY MONITORING"}
                   </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.2]">
                  {isFa ? "سهم صدای برند خود را در هوش مصنوعی رصد کنید." : "Track your brand's Share of Voice inside AI."}
                </h2>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed md:leading-loose text-pretty">
                  {isFa
                    ? "سئورچبل با شبیه‌سازی رفتار کاربران واقعی در چت‌بات‌ها (RAG)، به صورت مستمر بررسی می‌کند که برند شما، محصولاتتان و رقبایتان با چه کلیدواژه‌ها و چه لحنی معرفی می‌شوند."
                    : "By simulating real user behavior in RAG systems, Seorchable continuously monitors how your brand, products, and competitors are represented, including keywords and sentiment."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {aeoFeatures.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="flex gap-4 group">
                      <div className="mt-1 shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-colors">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{feat.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
               <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 rounded-3xl blur-3xl -z-10"></div>
               <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl">
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 aspect-[4/3] flex items-center justify-center relative">
                     {/* Abstract Chart Representation */}
                     <div className="absolute inset-0 p-8 flex flex-col gap-6 opacity-80">
                        <div className="flex justify-between items-end h-48 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                           {[65, 45, 80, 50, 95, 70, 85].map((h, i) => (
                             <div key={i} className="w-full relative group">
                                <div className="absolute bottom-0 w-full bg-slate-200 dark:bg-slate-800 rounded-t-sm" style={{ height: '100%' }}></div>
                                <div className="absolute bottom-0 w-full bg-teal-500 rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
                             </div>
                           ))}
                        </div>
                        <div className="flex justify-between items-center px-2">
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Brand Mentions</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Competitors</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Audit Section Component */}
      <div ref={freeAuditRef} className="scroll-mt-24">
         <FreeAuditSection />
      </div>

      {/* Pricing Section (Minimalist Redesign) */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white">
              {isFa ? "سرمایه‌گذاری روی آینده جستجو" : "Invest in the Future of Search"}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed md:leading-loose">
              {isFa
                ? "تعرفه‌های شفاف و مقیاس‌پذیر برای سازمان‌هایی که می‌خواهند رهبر بازار در عصر هوش مصنوعی باشند."
                : "Transparent and scalable pricing for organizations aiming to lead their market in the AI era."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">{isFa ? "کسب‌وکارهای کوچک" : "STARTER"}</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">{isFa ? "پلن آغازین" : "Starter"}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{isFa ? "پایش پایه‌ای حضور برند در نتایج اولیه." : "Establish brand footprints inside foundational memories."}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-slate-900 dark:text-white">{isFa ? "۴۹" : "$49"}</span>
                  <span className="text-sm text-slate-500">/ {isFa ? "ماهانه" : "mo"}</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "پایش ۱۰ کلمه کلیدی اصلی" : "Track up to 10 brand keywords"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "خزش تا ۵۰۰ صفحه ماهانه" : "Crawl up to 500 pages/mo"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "تحلیل ۱-هاپ گراف دانش" : "1-hop entity relationship models"}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 mt-auto">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
                >
                  {isFa ? "انتخاب پلن آغازین" : "Select Starter Plan"}
                </button>
              </div>
            </div>

            {/* Growth Plan - Highlighted */}
            <div className="rounded-2xl border-2 border-teal-500 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-xl relative transform md:-translate-y-4">
              <span className="absolute -top-3 right-8 px-3 py-1 bg-teal-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-md">POPULAR</span>
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold uppercase tracking-wider">{isFa ? "شرکت‌های متوسط" : "GROWTH"}</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">{isFa ? "پلن رشد" : "Growth"}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{isFa ? "پایش رقبای بازار و تحلیل عمیق توهمات هوش مصنوعی." : "Mitigate claim errors and track multiple competitors."}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-teal-600 dark:text-teal-400">{isFa ? "۱۴۹" : "$149"}</span>
                  <span className="text-sm text-slate-500">/ {isFa ? "ماهانه" : "mo"}</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "پایش ۵۰ کلمه کلیدی و رقیب" : "Track up to 50 brand keywords"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "خزش تا ۳,۰۰۰ صفحه ماهانه" : "Crawl up to 3,000 pages/mo"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "تحلیل پیشرفته توهم و استناد" : "Full semantic claim and citation audit"}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 mt-auto">
                <button
                  onClick={() => scrollToRef(freeAuditRef)}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-semibold shadow-md transition-colors"
                >
                  {isFa ? "انتخاب پلن رشد" : "Choose Growth Plan"}
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">{isFa ? "هلدینگ‌ها و رهبران" : "ENTERPRISE"}</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">{isFa ? "پلن سازمانی" : "Enterprise"}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{isFa ? "راهکارهای اختصاصی با SLA کامل برای رهبران صنعت." : "For market leaders demanding absolute data isolation SLAs."}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-display text-slate-900 dark:text-white">{isFa ? "تماس با ما" : "Custom"}</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "پایش نامحدود واژگان و رقبا" : "Unlimited search term extraction"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "کلاستر اختصاصی خزش" : "Dedicated private crawling instances"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{isFa ? "پشتیبانی اختصاصی (SSO)" : "SAML SSO, custom data SLAs"}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 mt-auto">
                 <Link href={`/${locale}/contact`} className="block">
                  <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors">
                    {isFa ? "تماس با واحد فروش" : "Contact Sales"}
                  </button>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Area - Clean Minimal Version */}
      <section className="py-24 bg-white dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.2] text-balance">
            {isFa ? "آماده تغییر قواعد بازی در عصر هوش پاسخگو هستید؟" : "Supercharge Your Brand Inside Conversational Search"}
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed md:leading-loose max-w-2xl mx-auto">
            {isFa
              ? "آدرس دامنه خود را بلافاصله آنالیز کنید تا وضعیت حضور برندتان در مدل‌های زبانی سنجیده شود."
              : "Analyze your website structure right now to check meta elements and crawler indexability status."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => scrollToRef(freeAuditRef)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>{isFa ? "شروع آنالیز رایگان وب‌سایت" : "Start Free Audit Scanner"}</span>
            </button>

            <Link href={`/${locale}/contact`} className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl text-base font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>{isFa ? "تماس با کارشناسان ما" : "Contact Sales"}</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Landing Footer */}
      <LandingFooter />
    </div>
  );
}
INNER_EOF
sh replace_page.sh
