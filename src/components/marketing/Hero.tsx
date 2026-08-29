"use client";

import Link from "next/link";
import { Activity, ArrowRight, Brain, Server, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import TextLoop from "@/components/ui/TextLoop";
import MoltenMetal from "@/components/ui/MoltenMetal";

const chips = [
  { icon: ShieldCheck, en: "Technical SEO", fa: "سئوی فنی" },
  { icon: Activity, en: "AI Visibility", fa: "دیده‌شدن در هوش مصنوعی" },
  { icon: Brain, en: "Brand Intelligence", fa: "هوشمندی برند" },
];

export function Hero() {
  const { session } = useAuth();
  const { language } = useTheme();
  const isFa = language === "fa";
  const isLoading = !session;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28">
      <div className="absolute inset-0 -z-20">
        <MoltenMetal
          color1="#0bddef"
          color2="#64748b"
          color3="#105cd9"
          backgroundColor="#000000"
          lightMode={false}
          className="mix-blend-screen opacity-40 dark:opacity-70"
          colorMode="default"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center lg:text-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {isFa ? "پلتفرم نسل‌بعدی AEO و GEO" : "Next-generation AEO & GEO platform"}
          </span>
          <h1 className="text-balance text-5xl font-black leading-[1.2] tracking-tight text-white sm:text-6xl md:text-7xl">
            اندازه گیری، پایش و ارتقای حضور برند شما در موتورهای جستجو و هوش مصنوعی
          </h1>
          <p className="mx-auto max-w-3xl text-balance text-lg font-medium leading-loose text-white/85 md:text-xl lg:mx-0">
            مجموعه نرم افزاری یکپارچه مدیریت رتبه‌بندی، سهم استناد و برطرف کردن توهم‌های هوش مصنوعی در معرفی برند شما در موتورهای جستجو و مدل‌های زبانی
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href={`/${language}/#free-audit`}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
            >
              {isFa ? "شروع رایگان" : "Start Free"}
              <ArrowRight size={16} className="rtl:-scale-x-100" />
            </Link>
            <Link
              href={`/${language}/contact`}
              className="w-full rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-center text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
            >
              {isFa ? "تماس با ما" : "Contact Us"}
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {chips.map((chip) => {
              const Icon = chip.icon;
              return (
                <span key={chip.en} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                  <Icon size={16} />
                  {isFa ? chip.fa : chip.en}
                </span>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="rounded-2xl border border-white/15 bg-black/40 p-5 font-mono text-xs text-zinc-400 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
            <Server size={14} className="text-cyan-400" />
            <span>terminal_session</span>
          </div>
          <div className="space-y-3 leading-relaxed">
            <p><span className="text-emerald-400">~/system $</span> initiating crawl sequence...</p>
            <p><span className="text-emerald-400">~/system $</span> mapping semantic triples: [BRAND] -&gt; [PRODUCT]...</p>
            <p><span className="text-emerald-400">~/system $</span> syncing to vector database...</p>
            <p className="text-cyan-300">{isLoading ? "awaiting secure session..." : "secure session verified"}</p>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 mt-16 w-full">
        <TextLoop text="SEOrchable ✦ SEO ✦ AEO ✦ GEO ✦ AI" shape="line" className="w-full" />
      </div>
    </section>
  );
}
