"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog } from "@/components/Dialog";
import {
  Check, Shield, Award, Sparkles, Building, ChevronRight, AlertCircle, HelpCircle,
  CreditCard, ShieldCheck, Zap, ArrowRight, ArrowDown, Landmark, CheckCircle2
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";

export default function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { session, register } = useAuth();
  const isRtl = locale === "fa";

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Authentication gate states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const planParam = searchParams?.get("plan");
    if (planParam) {
      handlePlanSelection(planParam);
    }
  }, [searchParams]);

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);

    if (session.status === "unauthenticated") {
      setIsAuthOpen(true);
    } else {
      setIsWorkspaceOpen(true);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);

    try {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        throw new Error(isRtl ? "لطفاً تمام فیلدها را پر کنید." : "Please fill in all details.");
      }

      await register(authName, authEmail, authPassword);
      setIsAuthOpen(false);
      setIsWorkspaceOpen(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setAuthError(errMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleWorkspaceCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim() || !targetDomain.trim()) return;

    setIsCreatingWorkspace(true);

    setTimeout(() => {
      setIsCreatingWorkspace(false);
      setIsWorkspaceOpen(false);

      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "subscription_started",
          plan: selectedPlan,
          domain: targetDomain
        });
      }

      router.push(`/${locale}/dashboard?workspace=${encodeURIComponent(workspaceName)}`);
    }, 1500);
  };

  const faqs = isRtl
    ? [
        { q: "فرایند پرداخت ریالی چگونه است؟", a: "در حال حاضر پرداخت‌ها از طریق فاکتورهای رسمی B2B سازمانی صادر و تسویه می‌شود. در فازهای آتی، درگاه‌های واسط شتاب و شاپرک جهت پرداخت برخط متصل خواهند شد." },
        { q: "آیا در طول دوره امکان ارتقا یا تنزل پلن وجود دارد؟", a: "بله، شما می‌توانید در هر زمان از پنل کاربری بخش صورتحساب نسبت به تغییر اشتراک خود اقدام کنید. مابه‌التفاوت هزینه به صورت خودکار محاسبه خواهد شد." },
        { q: "حفاظت از اسناد خزش‌شده ما به چه صورت انجام می‌شود؟", a: "تمام فایل‌ها و کدهای خزش‌شده به صورت رمزگذاری‌شده ذخیره شده و هیچ دیتای حساسی از سازمان شما در حافظه‌ی عمومی مدل‌های زبانی وارد نمی‌شود." }
      ]
    : [
        { q: "How is payment handled for international users?", a: "Currently, enterprise accounts are provisioned via direct bank transfers and official B2B invoices. An integrated online payment gateway is currently in preparation." },
        { q: "Can I upgrade or downgrade my plan at any time?", a: "Yes, you can easily shift between plans inside your billing dashboard. The differences in quotas and balances are calculated and prorated automatically." },
        { q: "How secure is our scraped content?", a: "All scraped texts and indices are encrypted at rest under strict multi-tenant context manager rules, ensuring complete isolation from third-party LLM caching pools." }
      ];

  const purchaseSteps = isRtl
    ? [
        { step: "۱", title: "انتخاب پلن هوشمند", desc: "اشتراک متناسب با دامنه‌ها و سهمیه مانیتورینگ خود را انتخاب کنید." },
        { step: "۲", title: "احراز هویت سریع", desc: "با ایمیل سازمانی خود ثبت‌نام کرده و دسترسی را فعال سازید." },
        { step: "۳", title: "ثبت دامین و ران ممیزی", desc: "فضای کاری اختصاصی خود را بسازید تا سیستم به طور خودکار اولین خزش را شروع کند." }
      ]
    : [
        { step: "1", title: "Select Subscription Plan", desc: "Choose the package matching your tracking scale and enterprise requirements." },
        { step: "2", title: "Fast Authentication", desc: "Sign up with your enterprise corporate email address to open your secured seat." },
        { step: "3", title: "Provision Brand Workspace", desc: "Input your audited domain and target keywords to auto-trigger the first crawling pipeline." }
      ];

  const matrixFeatures = isRtl
    ? [
        { cat: "قابلیت‌های ممیزی", feat: "تعداد دامنه‌های تحت پایش", free: "۱ دامنه", pro: "۲ دامنه", ent: "نامحدود" },
        { cat: "قابلیت‌های ممیزی", feat: "خزشگر صفحات با Firecrawl", free: "بله (سطحی)", pro: "بله (عمیق)", ent: "بله (نامحدود + پروکسی اختصاصی)" },
        { cat: "تحلیل هوش مصنوعی", feat: "شبیه‌سازی پاسخ Gemini", free: "محدود", pro: "کامل (روزانه‌)", ent: "بلادرنگ + سفارشی‌سازی پرامپت" },
        { cat: "تحلیل هوش مصنوعی", feat: "پایش احساسات و توهم برند", free: "خیر", pro: "بله", ent: "بله + مهار خودکار سوگیری‌ها" },
        { cat: "گزارش‌دهی و توسعه", feat: "خروجی PDF خودکار", free: "خیر", pro: "بله", ent: "بله (شخصی‌سازی کامل برند تجاری)" },
        { cat: "گزارش‌دهی و توسعه", feat: "دسترسی تام به REST API & MCP", free: "خیر", pro: "خیر", ent: "بله" },
        { cat: "پشتیبانی و تراکنش", feat: "درگاه واسط ایرانی (شتاب/شاپرک)", free: "خیر", pro: "به‌زودی (فاز آزمایشی)", ent: "بله (قرارداد رسمی B2B ریالی)" },
        { cat: "پشتیبانی و تراکنش", feat: "پشتیبان تلفنی اختصاصی", free: "خیر", pro: "خیر", ent: "بله (۲۴ ساعته تلفنی)" }
      ]
    : [
        { cat: "Audit Capabilities", feat: "Audited Domains Limit", free: "1 Domain", pro: "2 Domains", ent: "Unlimited" },
        { cat: "Audit Capabilities", feat: "Firecrawl Crawler Depth", free: "Basic", pro: "Deep Dynamic", ent: "Unlimited + IP Rotation proxies" },
        { cat: "Conversational AI Insights", feat: "Google Gemini Synthesis", free: "Limited", pro: "Daily Scans", ent: "Real-time + Custom Prompt Tuning" },
        { cat: "Conversational AI Insights", feat: "Sentiment & Deflection Patrol", free: "No", pro: "Yes", ent: "Yes + Factual correction agents" },
        { cat: "Reporting & Integrations", feat: "Advanced PDF Downloads", free: "No", pro: "Yes", ent: "Yes (White-label customized branding)" },
        { cat: "Reporting & Integrations", feat: "REST API & MCP Server Access", free: "No", pro: "No", ent: "Yes" },
        { cat: "Billing & Assistance", feat: "Iranian Shetab/Shaparak Gateway", free: "No", pro: "Coming Soon (Trial phase)", ent: "Yes (B2B Invoice Contracts)" },
        { cat: "Billing & Assistance", feat: "Priority Support Level", free: "Community", pro: "Email", ent: "Dedicated 24/7 Telephone Agent" }
      ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <AppSidebar />
      <LandingHeader />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background Lights */}
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-gradient-to-br from-[#38bdf8]/10 to-[#f97316]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">

          {/* Header Title */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <CreditCard size={12} />
              <span>{isRtl ? "پلن‌های اشتراک سازمانی" : "Enterprise Billing Plans"}</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-gradient-brand leading-none font-display">
              {isRtl ? "طرح‌های اشتراک و تعرفه‌ها" : "Enterprise Grade Pricing"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {isRtl
                ? "پیکربندی هوشمند و ممیزی دیده‌شدن برند خود در مدل‌های زبانی با پلن‌های متناسب با مقیاس کسب‌وکار شما."
                : "Start measuring and optimizing your LLM footprint. Choose the subscription matching your scale."}
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* FREE PLAN */}
            <Card className="border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md hover:border-sky-500/20 transition-all duration-300 flex flex-col justify-between text-start rounded-3xl p-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black text-[var(--text-primary)]">{isRtl ? "پلن رایگان (Free)" : "Free"}</CardTitle>
                <CardDescription className="text-xs text-[var(--text-muted)]">
                  {isRtl ? "برای آزمایش اولیه ساختار و خزش دامین" : "Perfect for initial evaluation & brand audits"}
                </CardDescription>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[var(--text-primary)] font-display">0</span>
                  <span className="text-xs text-[var(--text-muted)] font-bold">{isRtl ? "تومان" : "$"}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] font-semibold border-t border-[var(--border)] pt-4">
                  {isRtl
                    ? ["ممیزی دامنه‌های محدود", "شاخص دیده‌شدن پایه", "خلاصه گزارش‌های آماری"]
                    : ["Limited brand audits", "Basic visibility scoring", "Historical overview summaries"].map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                </ul>
                <Button
                  variant="outline"
                  onClick={() => handlePlanSelection("Free")}
                  className="w-full mt-6 py-3 rounded-xl text-xs font-black gap-2 flex items-center justify-center cursor-pointer hover:bg-white/5"
                >
                  <span>{isRtl ? "شروع رایگان" : "Start Free Trial"}</span>
                  <ChevronRight size={13} className={isRtl ? "rotate-180" : ""} />
                </Button>
              </CardContent>
            </Card>

            {/* PROFESSIONAL PLAN */}
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-[var(--sky-blue-500)] to-[var(--orange-500)] shadow-2xl transform md:-translate-y-2">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-md">
                {isRtl ? "محبوب‌ترین پلن" : "MOST POPULAR"}
              </span>
              <Card className="h-full border-none bg-slate-950/95 backdrop-blur-md rounded-[22px] flex flex-col justify-between text-start p-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-black text-white">{isRtl ? "پلن حرفه‌ای (Professional)" : "Professional"}</CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    {isRtl ? "برای رشد مستمر و پایش دائم دیده‌شدن" : "For growing startups & active brands"}
                  </CardDescription>
                  <div className="pt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-display">
                      {isRtl ? "۱,۵۰۰,۰۰۰" : "49"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{isRtl ? "تومان / ماه" : "$ / mo"}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2.5 text-xs text-slate-200 font-semibold border-t border-white/10 pt-4">
                    {isRtl
                      ? ["پایش مداوم و خودکار", "گزارش‌های پیشرفته PDF", "تحلیل عمیق بر مبنای جمنی", "دسترسی به ۲ فضای کاری مجزا"]
                      : ["Continuous brand monitoring", "Advanced PDF export reports", "Google Gemini insights access", "Up to 2 active brand workspaces"].map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check size={14} className="text-[var(--sky-blue-500)] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                  </ul>
                  <Button
                    variant="primary"
                    onClick={() => handlePlanSelection("Professional")}
                    className="w-full mt-6 py-3.5 rounded-xl text-xs font-black gap-2 flex items-center justify-center cursor-pointer bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] border-none text-white shadow-lg"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    <span>{isRtl ? "ارتقا به حرفه‌ای" : "Upgrade to Pro"}</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* ENTERPRISE PLAN */}
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-purple-500 to-[var(--sky-blue-500)] shadow-xl">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-[var(--sky-blue-500)] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-md">
                {isRtl ? "امکانات اختصاصی" : "ENTERPRISE SPEC"}
              </span>
              <Card className="h-full border-none bg-slate-950/95 backdrop-blur-md rounded-[22px] flex flex-col justify-between text-start p-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-black text-[var(--text-primary)]">{isRtl ? "پلن سازمانی (Enterprise)" : "Enterprise"}</CardTitle>
                  <CardDescription className="text-xs text-[var(--text-muted)]">
                    {isRtl ? "برای برندهای بزرگ سازمانی و هلدینگ‌ها" : "For large scale holding groups & agencies"}
                  </CardDescription>
                  <div className="pt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[var(--text-primary)] font-display">
                      {isRtl ? "تماس بگیرید" : "Custom"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] font-semibold border-t border-[var(--border)] pt-4">
                    {isRtl
                      ? ["تعداد نامحدود فضاهای کاری", "دسترسی کامل اعضای تیم", "دسترسی تام به REST API و MCP", "پشتیبانی ۲۴ ساعته اختصاصی"]
                      : ["Unlimited active brands", "Multi-seat team workspace access", "Full REST API & MCP Server access", "Dedicated priority support agent"].map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check size={14} className="text-purple-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                  </ul>
                  <Button
                    variant="outline"
                    onClick={() => handlePlanSelection("Enterprise")}
                    className="w-full mt-6 py-3 rounded-xl text-xs font-black gap-2 flex items-center justify-center cursor-pointer hover:bg-white/5 border border-purple-500/20 text-purple-400 hover:text-white"
                  >
                    <span>{isRtl ? "ارتباط با پشتیبانی" : "Contact Sales"}</span>
                    <ChevronRight size={13} className={isRtl ? "rotate-180" : ""} />
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* PURCHASE PROCESS EXPLANATION */}
          <div className="space-y-6 pt-10">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white text-center flex items-center justify-center gap-2">
              <Zap className="text-orange-400" size={24} />
              <span>{isRtl ? "مراحل گام‌به‌گام فرایند خرید و فعال‌سازی" : "How the Activation Flow Works"}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {purchaseSteps.map((step, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 relative space-y-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 inline-flex items-center justify-center text-xs font-black font-mono">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-black text-white">{step.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-semibold">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE AVAILABILITY MATRIX */}
          <div className="space-y-6 pt-10">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="text-sky-400" size={24} />
              <span>{isRtl ? "جدول مقایسه دقیق ویژگی‌ها و لایسنس‌ها" : "Feature Comparison Matrix"}</span>
            </h2>

            <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--card)]/20 backdrop-blur-md">
              <table className="w-full border-collapse text-start text-xs font-bold text-slate-300">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-slate-900/60 text-[10px] sm:text-xs text-white uppercase tracking-wider">
                    <th className="p-4">{isRtl ? "بخش" : "Category"}</th>
                    <th className="p-4">{isRtl ? "قابلیت / ویژگی" : "Feature Name"}</th>
                    <th className="p-4">{isRtl ? "رایگان" : "Free"}</th>
                    <th className="p-4">{isRtl ? "حرفه‌ای" : "Pro"}</th>
                    <th className="p-4">{isRtl ? "سازمانی" : "Enterprise"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {matrixFeatures.map((m, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 text-[10px] text-slate-500 font-black uppercase">{m.cat}</td>
                      <td className="p-4 text-white font-black">{m.feat}</td>
                      <td className="p-4 text-slate-400">{m.free}</td>
                      <td className="p-4 text-[#38bdf8] font-bold">{m.pro}</td>
                      <td className="p-4 text-orange-400 font-black">{m.ent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Iranian Payment Gateway Placeholder Warning Box */}
            <div className="p-4 rounded-2xl border border-sky-500/10 bg-sky-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
              <div className="flex items-center gap-3">
                <Landmark size={20} className="text-[#38bdf8]" />
                <div className="space-y-0.5 text-start">
                  <h4 className="text-white">{isRtl ? "پشتیبانی از شبکه پرداخت شتاب و شاپرک (بزودی)" : "Shetab & Shaparak Network Ready"}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                    {isRtl
                      ? "سیستم آماده‌ی اتصال به درگاه‌های بانکی عضو شتاب است. در حال حاضر پرداخت‌ها از طریق فاکتورهای رسمی B2B سازمانی تسویه می‌شود."
                      : "The payment layer is configured for Iranian Shetab network integration. Multi-currency support is also available via corporate billing routes."}
                  </p>
                </div>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 text-[9px] font-black uppercase tracking-wider font-mono">
                {isRtl ? "درگاه واسط زرین‌پال / شتاب" : "Gateways Ready"}
              </span>
            </div>
          </div>

          {/* FAQS SECTION */}
          <div className="space-y-6 pt-10">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white text-center flex items-center justify-center gap-2">
              <HelpCircle className="text-purple-400" size={24} />
              <span>{isRtl ? "سوالات متداول درباره تعرفه‌ها و لایسنس‌ها" : "Pricing & Licensing FAQs"}</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 inline-flex items-center justify-center text-[10px] font-black">؟</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-7 font-semibold">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Auth Gate and Workspace creation modals */}
      <Dialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} title={isRtl ? "🔐 ثبت‌نام و فعال‌سازی اشتراک" : "🔐 Register to Activate Plan"}>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isRtl
              ? "لطفاً ابتدا حساب کاربری سازمانی خود را برای اعمال تغییرات لایسنس فعال فرمایید."
              : "Please create your corporate account first to activate your selected billing license."}
          </p>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span className="font-bold">{authError}</span>
            </div>
          )}

          <Input
            label={isRtl ? "نام و نام خانوادگی" : "Full Name"}
            placeholder="e.g. Seyed"
            value={authName}
            onChange={(e) => setAuthName(e.target.value)}
            disabled={isAuthLoading}
            required
          />

          <Input
            type="email"
            label={isRtl ? "ایمیل سازمانی" : "Enterprise Email"}
            placeholder="e.g. business@company.com"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            disabled={isAuthLoading}
            required
          />

          <Input
            type="password"
            label={isRtl ? "رمز عبور" : "Password"}
            placeholder="••••••••"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            disabled={isAuthLoading}
            required
          />

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-[var(--border)]">
            <Button variant="outline" type="button" onClick={() => setIsAuthOpen(false)} disabled={isAuthLoading}>
              {isRtl ? "انصراف" : "Cancel"}
            </Button>
            <Button variant="primary" type="submit" disabled={isAuthLoading}>
              {isAuthLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                  <span>{isRtl ? "در حال ثبت‌نام..." : "Creating..."}</span>
                </>
              ) : (
                <span>{isRtl ? "ثبت‌نام و ادامه خرید" : "Create Account & Continue"}</span>
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)} title={isRtl ? "⚡ راه‌اندازی فوری فضای کاری جدید" : "⚡ Setup Your Premium Workspace"}>
        <form onSubmit={handleWorkspaceCreate} className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isRtl
              ? "مشخصات و دامنه وب‌سایت اصلی سازمان خود را برای شروع پایش دائم سیستم وارد کنید."
              : "Input your primary audited domain and brand name to launch your dedicated monitoring space."}
          </p>

          <Input
            label={isRtl ? "نام تجاری فضای کاری" : "Workspace / Brand Name"}
            placeholder={isRtl ? "مثال: هلدینگ دیجی‌کالا" : "e.g., Digikala Group Workspace"}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            disabled={isCreatingWorkspace}
            required
          />

          <Input
            label={isRtl ? "آدرس وب‌سایت سازمان (دامنه)" : "Target Web Domain URL"}
            placeholder="e.g. company.com"
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            disabled={isCreatingWorkspace}
            required
          />

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-[var(--border)]">
            <Button variant="outline" type="button" onClick={() => setIsWorkspaceOpen(false)} disabled={isCreatingWorkspace}>
              {isRtl ? "انصراف" : "Cancel"}
            </Button>
            <Button variant="primary" type="submit" disabled={isCreatingWorkspace || !workspaceName.trim() || !targetDomain.trim()}>
              {isCreatingWorkspace ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                  <span>{isRtl ? "در حال راه‌اندازی فضا..." : "Provisioning Workspace..."}</span>
                </>
              ) : (
                <span>{isRtl ? "ایجاد فضا و ورود به داشبورد" : "Provision Workspace & Enter Dashboard"}</span>
              )}
            </Button>
          </div>
        </form>
      </Dialog>

      <LandingFooter />
    </div>
  );
}
