"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Brain, Server } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/Input";
import TextLoop from "@/components/ui/TextLoop";
import MoltenMetal from "@/components/ui/MoltenMetal";
import { motion } from "framer-motion";

/**
 * Ultra-minimal, high-contrast, Apple-like Hero component.
 * Utilizes the MoltenMetal WebGL animated background with an abstract Dashboard Wireframe.
 */
export function Hero() {
  const { session } = useAuth();
  const { language } = useTheme();
  const isFa = language === "fa";

  return (
    <section className="relative isolate min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* WebGL Animated Background */}
      <div className="absolute inset-0 -z-20">
        <MoltenMetal
          color1="#0bddef"
          color2="#64748b"
          color3="#105cd9"
          backgroundColor="#000000"
          lightMode={false}
          className="opacity-40 dark:opacity-70 mix-blend-screen"
          colorMode="default"
        />
      </div>

      {/* Fallback gradient / overlay to ensure contrast and Apple-like vignette */}
      <div className="absolute inset-0 -z-10 bg-white/70 dark:bg-black/80 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.1)_100%)] dark:bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.9)_100%)] backdrop-blur-[2px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 text-center lg:text-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500" />
            </span>
            {isFa
              ? "پلتفرم نسل‌بعدی AEO و GEO"
              : "Next-generation AEO & GEO platform"}
          </span>

          <h1 className="font-display font-black tracking-tight text-balance max-w-4xl mx-auto text-5xl sm:text-6xl md:text-7xl leading-[1.2] md:leading-[1.1] text-white drop-shadow-lg">
            اندازه گیری، پایش و ارتقای حضور برند شما در موتورهای جستجو و هوش
            مصنوعی
          </h1>

          <p className="text-lg md:text-xl text-white drop-shadow-lg leading-loose max-w-4xl mx-auto text-balance font-medium">
            مجموعه نرم افزاری یکپارچه مدیریت رتبه‌بندی، سهم استناد و برطرف کردن
            توهم‌های هوش مصنوعی در معرفی برند شما در موتورهای جستجو و مدل‌های
            زبانی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/30 w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              onClick={() => {
                const ref = document.getElementById("free-audit");
                if (ref)
                  ref.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>{isFa ? "شروع رایگان" : "Start Free"}</span>
            </button>

            <Link href={`/${language}/contact`} className="w-full sm:w-auto">
              <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm">
                <span>{isFa ? "تماس با ما" : "Contact Us"}</span>
              </button>
            </Link>
          </div>
        </motion.div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4 font-medium">
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
                  <Icon
                    size={16}
                    className="text-[var(--color-primary-600)] rtl:-scale-x-100"
                  />
                  {isFa ? chip.fa : chip.en}
                </span>
              );
            })}
          </div>
        </div>

        {/* TextLoop (Marquee) Component */}
        <div className="w-full relative z-20 mb-16">
          <TextLoop
            text="SEOrchable ✦ SEO ✦ AEO ✦ GEO ✦ AI"
            shape="line"
            className="-mx-4 sm:-mx-6 md:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+4rem)]"
          />
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

            {/* Fake Sidebar */}
            <div className="w-20 hidden sm:flex flex-col items-center py-6 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-zinc-950/20 space-y-6">
              <div className="w-8 h-8 rounded-md bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
              <div className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* Fake Content Area */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6">

              {/* Header Skeleton */}
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="w-32 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-24 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Floating Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="p-4 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/50 dark:border-zinc-800/50 backdrop-blur-md shadow-sm space-y-3"
                >
                  {isLoading
                    ? isFa
                      ? "در حال اعتبارسنجی..."
                      : "Validating secure session..."
                    : isFa
                      ? "ورود به نسخه‌ی دمو"
                      : "Access live sandbox demo"}
                  {!isLoading && (
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  )}
                </button>

              {/* Server Terminal Mock */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex-1 rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 font-mono text-[10px] sm:text-xs text-zinc-400 space-y-2 backdrop-blur-md overflow-hidden relative"
              >
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2">
                  <Server size={12} className="text-zinc-500" />
                  <span className="text-zinc-500">terminal_session</span>
                </div>
                <p><span className="text-emerald-400">~/system $</span> initiating crawl sequence...</p>
                <p className="opacity-70"><span className="text-emerald-400">~/system $</span> mapping semantic triples: [BRAND] -&gt; [PRODUCT]...</p>
                <p className="opacity-50"><span className="text-emerald-400">~/system $</span> syncing to vector database...</p>

                {/* Overlay gradient to fade out bottom */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              </motion.div>
            </div>
          </div>

          {/* Decorative Blur Orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-400/20 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-zinc-400/20 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
