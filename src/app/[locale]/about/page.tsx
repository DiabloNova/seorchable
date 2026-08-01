"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Shield, Brain, Cpu, Users } from "lucide-react";

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-bold text-[#38bdf8]">
            {isFa ? "درباره پلتفرم هوشمندی برند" : "About Our Platform"}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">
            {isFa ? "ساخت لایه سنجش و اعتماد معنایی برای عصر هوش مصنوعی" : "Building the Trust Layer for the AI Era"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-3xl mx-auto font-medium">
            {isFa
              ? "ماموریت ما توانمندسازی سازمان‌ها جهت کنترل، رصد دقیق و ارتقای سهم صدای ارگانیک محصولاتشان در تمامی مدل‌های زبانی مطرح دنیاست."
              : "Our mission is to empower organizations with factual validation and structured optimization toolkits."}
          </p>
        </div>
      </section>

      {/* Mission / Values Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-display text-gradient-brand">
                {isFa ? "چرا هوشمندی برند شکل گرفت؟" : "The Core Vision"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "با ورود ابزارهای مولد متنی و موتورهای پاسخگو، نحوه تعامل کاربران و کشف اطلاعات برندها دچار تحول شدیدی شده است. سئو کلمات کلیدی دیگر پاسخگوی توهم‌های مخرب مدل‌های زبانی نیست. ما در اپتیموس لایه‌ای از تحلیل‌های دقیق را بر اساس گراف‌های دانش روابط معنایی بنا کرده‌ایم."
                  : "As traditional keyword search engines decline in favor of dynamic RAG answers, business citation management is becoming critical. Optimus AI maps complex local graph relations to verify facts and protect brand voice programmatically."}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-2xl" />
              <h3 className="text-base sm:text-lg font-bold font-display mb-4 text-[#38bdf8]">{isFa ? "بیانیه ماموریت پلتفرم" : "Mission Statement"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "ارائه راهکارهای فنی، شفاف، و منطبق بر حفظ حریم خصوصی برای شرکت‌ها جهت تحلیل دقیق، رتبه‌بندی مطلوب، و پایش برخط موجودیت‌ها در مدل‌های زبانی تجاری."
                  : "To deliver high-fidelity, privacy-preserving, and multi-tenant secure tools for enterprises seeking to analyze, measure, and scale their AI citation share of voice."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Focus & Architecture (Mentioning Isolation and Context Manager) */}
      <section className="py-16 bg-[var(--background-subtle)]/10 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand">
              {isFa ? "امنیت و معماری ایزوله داده‌ها" : "Enterprise Grade Security"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold">
              {isFa ? "چگونه سیستم ما به طور کامل امنیت محتوا و حریم خصوصی شرکت شما را تضمین می‌کند." : "Underpinned by robust tenant context management boundaries."}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center"><Shield size={20} /></div>
              <h3 className="text-sm sm:text-base font-bold font-display">{isFa ? "جداسازی چندمستاجری" : "Strict Tenant Isolation"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "تمامی تحلیل‌ها و داده‌های ورودی با مدیریت اختصاصی کانتکست مستاجر به صورت کاملاً مجزا و ایزوله نگهداری می‌شوند." : "All operations utilize dynamic database boundary wrappers to guarantee row-level isolation."}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#f97316] flex items-center justify-center"><Brain size={20} /></div>
              <h3 className="text-sm sm:text-base font-bold font-display">{isFa ? "مدل‌های زبانی امن" : "Private Model Prompts"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "ما هیچ‌یک از متون یا اسناد خزش شده‌ی اختصاصی سازمان شما را در آموزش عمومی مدل‌ها به کار نمی‌بریم." : "Proprietary inputs are never shared with public foundational model training datasets."}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center"><Cpu size={20} /></div>
              <h3 className="text-sm sm:text-base font-bold font-display">{isFa ? "زیرساخت ابری پایدار" : "Resilient Cloud Core"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa ? "اجرای سریع توابع تحلیل، مجهز به لایه کانتینری و پشتیبان‌های داده‌ای چندگانه." : "Highly optimized, redundant computing instances ensuring SLA service compliance."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
