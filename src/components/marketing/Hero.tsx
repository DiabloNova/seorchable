"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/Input";
import MoltenMetal from "@/components/ui/MoltenMetal";

/**
 * Ultra-minimal, high-contrast, Apple-like Hero component.
 * Utilizes the MoltenMetal WebGL animated background.
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

  return (
    <section className="relative isolate min-h-[100svh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* WebGL Animated Background */}
      <div className="absolute inset-0 -z-20">
        <MoltenMetal
          color1="#0a0a0a"
          color2="#171717"
          color3="#262626"
          backgroundColor="#000000"
          lightMode={false}
          className="opacity-70 dark:opacity-100"
          colorMode="default"
        />
      </div>

      {/* Fallback gradient / overlay to ensure contrast and Apple-like vignette */}
      <div className="absolute inset-0 -z-10 bg-white/60 dark:bg-black/60 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] backdrop-blur-[2px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 w-full flex flex-col items-center justify-center relative z-10 flex-1">
        {/* Copy column */}
        <div className="text-center max-w-3xl mx-auto space-y-8 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm transition-transform hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            {isFa ? "پلتفرم نسل‌بعدی AEO و GEO" : "Next-generation AEO & GEO platform"}
          </span>

          <h1 className="font-display font-black tracking-tight text-balance text-5xl sm:text-6xl md:text-7xl leading-[1.2] md:leading-[1.1] text-zinc-900 dark:text-white drop-shadow-sm">
            معرفی برند شما در هوش مصنوعی
          </h1>

          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-[1.8] max-w-xl mx-auto text-pretty font-medium">
            آنالیز داده های هوش مصنوعی در معرفی برند شما به میلیون ها کاربر ایرانی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white text-sm font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              onClick={() => {
                const ref = document.getElementById("free-audit");
                if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>{isFa ? "شروع رایگان" : "Start Free"}</span>
            </button>

            <Link href={`/${language}/contact`} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm">
                <span>{isFa ? "تماس با ما" : "Contact Us"}</span>
              </button>
            </Link>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4 font-medium">
            شروع آزمایشی به مدت یک هفته کاملا رایگان.
          </p>
        </div>

        {/* Email Capture & Access card column */}
        <div className="w-full max-w-md mx-auto relative z-10 mt-auto">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-8 rounded-[2rem] shadow-2xl">
            {session.status === "authenticated" ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto grid place-items-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                  <ShieldCheck size={24} />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                    {isFa ? "نشست شما فعال است" : "Your session is active"}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 break-all font-medium">
                    {session.user?.email}
                  </p>
                </div>
                <Link href={`/${language}/dashboard`} className="block pt-2">
                  <button className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]">
                    {isFa ? "ورود به پیشخوان کاربری" : "Enter admin console"}
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-start">
                <div className="space-y-2">
                  <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                    {isFa ? "ورود سریع به میز کار" : "Access the workspace"}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-[1.8] font-medium">
                    {isFa
                      ? "ایمیل سازمانی خود را برای مشاهده‌ی نسخه‌ی نمایشی وارد کنید."
                      : "Enter your business email to open the live sandbox demo."}
                  </p>
                </div>

                <div className="pt-2">
                  <Input
                    type="email"
                    placeholder={isFa ? "you@company.com" : "you@company.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label={isFa ? "ایمیل سازمانی" : "Business email"}
                    className="w-full h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-sm px-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
                >
                  {isLoading
                    ? isFa
                      ? "در حال اعتبارسنجی..."
                      : "Validating secure session..."
                    : isFa
                      ? "ورود به نسخه‌ی دمو"
                      : "Access live sandbox demo"}
                  {!isLoading && <ArrowRight size={16} className="rtl:-scale-x-100" />}
                </button>

                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center pt-2 font-medium">
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
