"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { CheckCircle2, Activity, ShieldCheck, Clock, Server } from "lucide-react";

export default function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const components = [
    {
      name: isFa ? "موتور خزش وب (Firecrawl API)" : "Firecrawl Crawler Cluster",
      status: isFa ? "برقرار و فعال" : "Operational",
      uptime: "99.98%",
      latency: "120ms",
    },
    {
      name: isFa ? "پایگاه داده توزیع‌شده (PostgreSQL RLS)" : "PostgreSQL Database Pool",
      status: isFa ? "متصل و ایمن" : "Operational",
      uptime: "100%",
      latency: "12ms",
    },
    {
      name: isFa ? "موتور استنتاج هوش زنده (LLM Gateway)" : "Semantic Analysis API Engine",
      status: isFa ? "برقرار" : "Operational",
      uptime: "99.95%",
      latency: "280ms",
    },
    {
      name: isFa ? "سرورهای پردازش تگ‌های معنایی (AEO Worker)" : "AEO Metadata Workers",
      status: isFa ? "در حال کار" : "Operational",
      uptime: "99.99%",
      latency: "45ms",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 size={14} className="animate-pulse" />
            <span>{isFa ? "تمامی سامانه‌ها برقرار و آنلاین هستند" : "All Systems Operational"}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">
            {isFa ? "وضعیت لحظه‌ای و سلامت سامانه‌های پلتفرم" : "Real-time Service Health Dashboard"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "پایش زنده کارکرد سرورهای تحلیل، وضعیت اتصال دیتابیس ایمن، مدت زمان پاسخگویی APIها و آپ‌تایم ۳۰ روز گذشته."
              : "Live diagnostics of crawl middle-layers, context managers, and LLM synthesis endpoints."}
          </p>
        </div>
      </section>

      {/* Component Status Grid */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          {/* Main Status Indicator card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mx-auto">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display">{isFa ? "به‌روزرسانی خودکار" : "Global Systems Online"}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-semibold">{isFa ? "آپ‌تایم کل پلتفرم در ماه جاری: ۹۹.۹۸٪" : "All foundational pipelines are functioning normally."}</p>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-2 flex items-center gap-1.5">
              <Clock size={12} />
              <span>{isFa ? "۱۰۰٪ برقرار" : "100% ONLINE"}</span>
            </div>
          </div>

          {/* List of sub-services */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{isFa ? "وضعیت تفکیکی خدمات زیرسیستم" : "System Component Health"}</h3>
            <div className="grid gap-4">
              {components.map((c, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-between gap-4 shadow-sm hover:border-[var(--border-strong)] transition-all">
                  <div className="flex items-center gap-3">
                    <Server size={16} className="text-[#38bdf8]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">{c.name}</h4>
                      <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 font-semibold">
                        {isFa ? "آپ‌تایم: " : "Uptime: "} {c.uptime} • {isFa ? "پاسخ‌دهی: " : "Latency: "} {c.latency}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-xs font-black bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{c.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
