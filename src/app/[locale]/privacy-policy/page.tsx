"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8]">
            <ShieldAlert size={12} />
            <span>{isFa ? "سیاست حفظ حریم خصوصی داده‌ها" : "Data Privacy Guidelines"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            {isFa ? "قوانین حفظ حریم خصوصی و امنیت اطلاعات سازمان‌ها" : "Privacy Policy & Enterprise Data Isolation"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "چگونگی جمع‌آوری اطلاعات، تضمین جداسازی چندمستاجری و امنیت مطلق بردارهای معنایی مربوط به برندها در پایگاه داده."
              : "Learn how we implement tenant isolation and safeguard brand intelligence datasets."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass-panel p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-8 font-medium">
            {/* Clause 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#38bdf8]">{isFa ? "۱. رعایت جداسازی مطلق چندمستاجری (Tenant Isolation)" : "1. Strict Multi-Tenant Isolation"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "ما امنیت داده‌های شما را بسیار جدی می‌گیریم. تمامی اطلاعات و کوئری‌های مربوط به تحلیل برندها با استفاده از کانتکست ایزوله‌ی مستاجر ذخیره شده و هیچ سازمان دیگری امکان دسترسی به داده‌های خزش یا نتایج گراف روابط شما را تحت هیچ شرایطی نخواهد داشت."
                  : "We enforce absolute database isolation. Brand queries and crawled documents are protected with tenant context boundaries, meaning no cross-tenant reading or leaks are possible."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#f97316]">{isFa ? "۲. اطلاعات خزش شده و متاداده‌ها" : "2. Crawled Materials & Metadata"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "موتور خزش Firecrawl ما تنها متون قابل خواندن عمومی وب‌سایت شما را جهت ارزیابی انطباق گرامری LLM واکشی می‌کند. این اطلاعات به هیچ عنوان به عنوان بردارهای عمومی آموزشی جهت ساخت مدل‌های زبانی به کار گرفته نخواهد شد."
                  : "Our Firecrawl integrations query publicly accessible elements of your target website. Captured metadata is used solely for LLM validation and is never sold or used for foundational training."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-purple-400">{isFa ? "۳. حقوق قانونی سازمان‌ها" : "3. Commercial Rights & Audits"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "هر زمان که مایل باشید، می‌توانید به طور کامل حساب کاربری، دامنه‌های پایش شده، متاداده‌های ساختاریافته و رکوردهای تحلیل معنایی خود را به طور دائم از سرورهای اپتیموس پاک کنید."
                  : "You retain full commercial control. You can request permanent erasure of your crawled indexes, semantic models, and workspace data at any time directly through support channels."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
