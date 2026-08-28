"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

/**
 * Award-grade hero: aurora + dotted grid backdrop, Peyda display headline with
 * a brand gradient, YekanBakh supporting copy, and a glassmorphic access card
 * wrapped in an animated conic border.
 */
export function Hero() {
  const { session } = useAuth();
  const { language } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isFa = language === "fa";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Redirect to auth page with email as query param
    window.location.href = `/${language}/register?email=${encodeURIComponent(email)}`;
  };

  const chips = [
    { icon: TrendingUp, fa: "افزایش ۳٫۸ برابری ارجاع", en: "3.8× more citations" },
    { icon: ShieldCheck, fa: "پایش لحظه‌ای توهم برند", en: "Live hallucination watch" },
    { icon: Zap, fa: "اتصال به ۴ موتور هوش مصنوعی", en: "4 AI engines connected" },
  ];

  return (
    <section className="aurora-bg relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* dotted grid layer */}
      <div className="grid-backdrop absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center">
        {/* Copy column */}
        <div className="text-center max-w-4xl mx-auto space-y-7 mb-12">
          <span className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[color-mix(in_srgb,var(--color-primary-600)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-primary-600)_10%,transparent)] px-4 py-2 text-xs font-semibold text-[var(--color-primary-600)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-600)] opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary-600)]" />
            </span>
            {isFa ? "پلتفرم نسل‌بعدی AEO و GEO" : "Next-generation AEO & GEO platform"}
          </span>

          <h1 className="font-display font-black tracking-tight text-balance text-5xl sm:text-6xl md:text-7xl leading-[1.15]">
            <span className="text-[var(--text-primary)]">
              معرفی برند شما در هوش مصنوعی
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto text-pretty">
            آنالیز داده های هوش مصنوعی در معرفی برند شما به میلیون ها کاربر ایرانی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white text-base font-bold bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => {
                const ref = document.getElementById("free-audit");
                if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>شروع رایگان</span>
            </button>

            <Link href={`/${language}/contact`} className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl text-base font-bold bg-slate-900/40 hover:bg-[#38bdf8]/10 text-[var(--text-primary)] border border-[var(--glass-border)] transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>تماس با ما</span>
              </button>
            </Link>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
            شروع آزمایشی به مدت یک هفته کاملا رایگان.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {chips.map((chip, i) => {
              const Icon = chip.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-full)] neu-surface px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm"
                >
                  <Icon size={16} className="text-[var(--color-primary-600)] rtl:-scale-x-100" />
                  {isFa ? chip.fa : chip.en}
                </span>
              );
            })}
          </div>
        </div>

        {/* Dashboard Showcase Video/Slideshow Placeholder */}
        <div className="w-full max-w-5xl mx-auto mb-16 relative perspective-1000">
          <div className="relative rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl shadow-sky-900/20 aspect-video group">
            {/* Top Bar (Mockup window controls) */}
            <div className="absolute top-0 inset-x-0 h-8 bg-[var(--muted-surface)] border-b border-[var(--glass-border)] flex items-center px-4 gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 flex justify-center">
                <div className="h-4 w-32 bg-[var(--glass-border)] rounded-full opacity-50" />
              </div>
            </div>

            {/* Main Content Area Placeholder */}
            <div className="absolute inset-0 pt-8 bg-gradient-to-br from-slate-900/40 to-slate-800/40 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-[var(--text-muted)] opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary-600)]/20 flex items-center justify-center cursor-pointer hover:bg-[var(--color-primary-600)]/30 transition-colors hover:scale-110">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-[var(--color-primary-600)] border-b-8 border-b-transparent ml-1 rtl:mr-1 rtl:ml-0 rtl:border-l-0 rtl:border-r-[12px] rtl:border-r-[var(--color-primary-600)]" />
                </div>
                <p className="text-sm font-semibold tracking-widest uppercase">
                  {isFa ? "مشاهده محیط پلتفرم" : "Watch Platform Demo"}
                </p>
              </div>
            </div>
          </div>

          {/* Decorative glows behind the showcase */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--color-primary-600)]/30 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--orange-500)]/20 rounded-full blur-3xl -z-10" />
        </div>

        {/* Email Capture & Access card column */}
        <div className="w-full max-w-md mx-auto relative z-10 mt-8">
          <div className="animated-border-glass p-6 sm:p-7">
            {session.status === "authenticated" ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto grid place-items-center w-14 h-14 rounded-[var(--radius-lg)] neu-surface text-[var(--color-primary-600)] glow-ring">
                  <ShieldCheck size={26} />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                    {isFa ? "نشست شما فعال است" : "Your session is active"}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] break-all">
                    {session.user?.email}
                  </p>
                </div>
                <Link href={`/${language}/dashboard`} className="block">
                  <Button variant="primary" size="lg" className="w-full font-bold gap-2">
                    {isFa ? "ورود به پیشخوان کاربری" : "Enter admin console"}
                    <ArrowRight size={18} className="rtl:-scale-x-100" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-start">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                    {isFa ? "ورود سریع به میز کار" : "Access the workspace"}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isFa
                      ? "ایمیل سازمانی خود را برای مشاهده‌ی نسخه‌ی نمایشی وارد کنید."
                      : "Enter your business email to open the live sandbox demo."}
                  </p>
                </div>
                <Input
                  type="email"
                  placeholder={isFa ? "you@company.com" : "you@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label={isFa ? "ایمیل سازمانی" : "Business email"}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold gap-2"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isFa
                      ? "در حال اعتبارسنجی..."
                      : "Validating secure session..."
                    : isFa
                      ? "ورود به نسخه‌ی دمو"
                      : "Access live sandbox demo"}
                  {!isLoading && <ArrowRight size={18} className="rtl:-scale-x-100" />}
                </Button>
                <p className="text-[11px] text-[var(--text-muted)] text-center pt-1">
                  {isFa
                    ? "بدون نیاز به کارت اعتباری — محیط آزمایشی امن"
                    : "No credit card required — secure sandbox environment"}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
