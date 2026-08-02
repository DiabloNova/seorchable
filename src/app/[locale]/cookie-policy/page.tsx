"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { ShieldCheck } from "lucide-react";

export default function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-xs font-bold text-[#38bdf8]">
            <ShieldCheck size={12} />
            <span>{isFa ? "سیاست کوکی‌های پلتفرم" : "Cookie Utilization Principles"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            {isFa ? "قوانین و اهداف استفاده از کوکی‌ها در سامانه‌های تحلیل" : "Cookie Policy & Session Context"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "نحوه ذخیره‌سازی اطلاعات احراز هویت (JWT)، اولویت‌های زبانی و تم‌های کاربری در مرورگر شما."
              : "Read how we use browser cookies to handle user preferences and secure JSON Web Tokens."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass-panel p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-8 font-medium">
            {/* Clause 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#38bdf8]">{isFa ? "۱. کوکی‌های احراز هویت (Authentication Cookies)" : "1. Secure Session Management"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "کوکی‌های ضروری احراز هویت جهت ذخیره‌سازی توکن امن نشست کاربری شما (JWT) برای مدیریت محیط چندمستاجری و جداسازی کانتکست‌ها استفاده می‌شوند تا به طور ایمن از اطلاعات پایش خود محافظت کنید."
                  : "We store secure HTTP-only session tokens to maintain tenant context boundary checks and keep your admin console session active."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#f97316]">{isFa ? "۲. کوکی‌های تنظیمات کاربر (Preferences)" : "2. Localization & Preference Toggles"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "ما انتخاب‌های ترجیحی شما مانند تم تاریک یا روشن و انتخاب زبان (فارسی / انگلیسی) را جهت بهبود تجربه کاربری و هماهنگی فونت‌ها در قالب کوکی ذخیره می‌کنیم."
                  : "We record simple client parameters like dark-mode theme selections and language parameters (EN/FA) to preserve interface layouts across returns."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-purple-400">{isFa ? "۳. مدیریت کوکی‌ها" : "3. Cookie Control & Configuration"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "شما می‌توانید به طور کامل از طریق منوی تنظیمات مرورگر خود ذخیره این رکوردهای ترجیحی را متوقف کنید، اما ممکن است در فرآیند ورود سریع به بخش پیشخوان دچار مشکل شوید."
                  : "You can modify or disable browser cookies via settings anytime. Note that disabling essential token cookies will interrupt secure login procedures."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
