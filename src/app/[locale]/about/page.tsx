"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Shield, Brain, Cpu, Users, Lock, ShieldCheck, Key } from "lucide-react";

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const roles = [
    { name: isFa ? "مدیر کل پلتفرم (Super Admin)" : "Super Admin", desc: isFa ? "دسترسی کامل سیستمی و مدیریت کاربران ارشد." : "Complete system control and administrator provisioning." },
    { name: isFa ? "مدیر عملیات (Operations)" : "Operations Lead", desc: isFa ? "پیکربندی هوش زنده، مانیتورینگ خزش و پرامپت‌ها." : "Configures model gateways and monitors crawling queues." },
    { name: isFa ? "ناظر امنیتی (Auditor)" : "Security Auditor", desc: isFa ? "بازرسی مسیر لاگ‌های تغییرناپذیر سیستم." : "Inspects audit trails and logs user actions." },
    { name: isFa ? "پشتیبانی (Support)" : "Customer Support", desc: isFa ? "بررسی درخواست‌ها و قالب کلمات کلیدی مشتریان." : "Troubleshoots client issues and handles tickets." },
  ];

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
            <div className="space-y-6 text-start">
              <h2 className="text-2xl font-black font-display text-gradient-brand">
                {isFa ? "چرا هوشمندی برند شکل گرفت؟" : "The Core Vision"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "با ورود ابزارهای مولد متنی و موتورهای پاسخگو، نحوه تعامل کاربران و کشف اطلاعات برندها دچار تحول شدیدی شده است. سئو کلمات کلیدی دیگر پاسخگوی توهم‌های مخرب مدل‌های زبانی نیست. ما در اپتیموس لایه‌ای از تحلیل‌های دقیق را بر اساس گراف‌های دانش روابط معنایی بنا کرده‌ایم."
                  : "As traditional keyword search engines decline in favor of dynamic RAG answers, business citation management is becoming critical. Optimus AI maps complex local graph relations to verify facts and protect brand voice programmatically."}
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] relative overflow-hidden text-start">
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

      {/* Advanced RBAC section derived from repo documentation */}
      <section className="py-16 bg-[var(--background)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-start">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand">
              {isFa ? "سیستم دسترسی چندلایه (Hierarchical RBAC)" : "Hierarchical RBAC Security Model"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
              {isFa ? "کنترل دقیق سطوح دسترسی بر اساس الگوهای نوین سیستم‌های متمرکز سازمانی." : "Strict linear role hierarchy ensuring complete platform integrity and compliance."}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {roles.map((role, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#38bdf8]"><Lock size={16} /></div>
                <h4 className="text-xs sm:text-sm font-bold font-display text-white">{role.name}</h4>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)] leading-relaxed font-semibold">{role.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl border border-[var(--glass-border)] bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Key size={20} className="text-[#38bdf8]" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white font-display">{isFa ? "آمادگی کامل اتصال به سامانه‌های احراز هویت یکپارچه (SSO)" : "Enterprise Single Sign-On Ready (SSO)"}</h4>
                <p className="text-[10px] sm:text-xs text-[var(--text-muted)] font-semibold mt-0.5">{isFa ? "ساختار و مدل‌های دسترسی پلتفرم به راحتی از استانداردهای OIDC و SAML پشتیبانی می‌کنند." : "Designed to link federated external identities directly onto user workspaces without modifying access check layers."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Focus & Architecture (Mentioning Isolation and Context Manager) */}
      <section className="py-16 bg-[var(--background-subtle)]/10 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-start">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-gradient-brand text-center">
              {isFa ? "امنیت و معماری ایزوله داده‌ها" : "Enterprise Grade Security"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold text-center">
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
