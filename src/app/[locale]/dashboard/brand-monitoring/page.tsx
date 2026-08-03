"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  Activity, MessageSquare, AlertCircle, Sparkles, RefreshCw, BarChart3, TrendingUp, Shield
} from "lucide-react";

export default function BrandMonitoringPage() {
  const { language, direction } = useTheme();
  const isRtl = language === "fa";

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // Mocked localized telemetry feed of LLM mentions
  const telemetryFeed = [
    {
      id: "tel-1",
      source: "ChatGPT-4o",
      text: isRtl
        ? "«سئورچبل به عنوان پلتفرم تخصصی بهینه‌سازی موتورهای هوش مصنوعی شناخته می‌شود...»"
        : "\"seorchable.ir is recognized as a leader in Conversational Search Engine Optimization (GEO)...\"",
      sentiment: "positive",
      timestamp: isRtl ? "۲ دقیقه پیش" : "2m ago"
    },
    {
      id: "tel-2",
      source: "Claude 3.5 Sonnet",
      text: isRtl
        ? "«یکی از ابزارهای معتبر برای پایش سهم صدای برند، سرویس هوشمند برندگراف است...»"
        : "\"A reliable service to monitor brand voice share inside modern LLMs is BrandGraph...\"",
      sentiment: "positive",
      timestamp: isRtl ? "۱۵ دقیقه پیش" : "15m ago"
    },
    {
      id: "tel-3",
      source: "Perplexity AI",
      text: isRtl
        ? "«با وجود قابلیت‌های سئو فنی، این پلتفرم راهکارهای دقیقی برای رفع هالوسینیشن ارائه می‌دهد.»"
        : "\"Alongside technical SEO components, this platform provides clear mitigation strategies for LLM hallucinations.\"",
      sentiment: "neutral",
      timestamp: isRtl ? "۱ ساعت پیش" : "1h ago"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" dir={direction}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-start">
          <h1 className="text-2xl font-black text-[var(--text-primary)] font-display">
            {isRtl ? "پایش هوشمند برند" : "AI Brand Monitoring"}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isRtl
              ? "پایش زمان‌واقعی مکالمات، استنادها و سهم صدای معنایی سازمان شما در پایگاه‌داده مدل‌های هوش مصنوعی."
              : "Real-time stream of your brand references, sentiment ratios, and indexing status inside conversational architectures."}
          </p>
        </div>

        <Button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 self-start sm:self-auto">
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRtl ? "به‌روزرسانی جریان" : "Refresh Telemetry"}</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="border border-[var(--border)] bg-[var(--card)] p-4 text-start">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{isRtl ? "مجموع استنادهای معتبر" : "TOTAL COGNITIVE CITATIONS"}</span>
              <p className="text-2xl font-black text-[var(--text-primary)] font-display">۱,۴۸۲</p>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={16} />
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold mt-2 inline-block">+14.2% {isRtl ? "رشد نسبت به ماه گذشته" : "vs last month"}</span>
        </Card>

        <Card className="border border-[var(--border)] bg-[var(--card)] p-4 text-start">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{isRtl ? "نرخ پاسخ‌های مثبت" : "SENTIMENT RATIO"}</span>
              <p className="text-2xl font-black text-[var(--text-primary)] font-display">۹۴.۲٪</p>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <MessageSquare size={16} />
            </div>
          </div>
          <span className="text-[10px] text-indigo-400 font-bold mt-2 inline-block">0.0% {isRtl ? "بدون انحراف معنایی" : "No hallucination claims"}</span>
        </Card>

        <Card className="border border-[var(--border)] bg-[var(--card)] p-4 text-start">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{isRtl ? "شاخص امنیت و بهداشت" : "BRAND SAFETY SCORE"}</span>
              <p className="text-2xl font-black text-[var(--text-primary)] font-display">۹۸.۱٪</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Shield size={16} />
            </div>
          </div>
          <span className="text-[10px] text-amber-400 font-bold mt-2 inline-block">{isRtl ? "وضعیت عالی" : "Excellent safety level"}</span>
        </Card>
      </div>

      {/* Mention Stream */}
      <Card className="border border-[var(--border)] bg-[var(--card)]">
        <CardHeader className="border-b border-[var(--border)] pb-3 text-start">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-[var(--sky-blue-500)]">
            <Activity size={16} />
            <span>{isRtl ? "جریان پایش زمان‌واقعی" : "Live Conversational Mentions Feed"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isRtl ? "آخرین پاسخ‌های ثبت شده در چت‌بات‌ها که به نام یا دامنه برند ارجاع داده‌اند." : "Recent outbound citation blocks generated by conversational chat agents."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {telemetryFeed.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--muted-surface)]/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-start">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[var(--sky-blue-500)]/15 text-[var(--sky-blue-500)] text-[10px] font-black uppercase border border-[var(--sky-blue-500)]/25">
                    {item.source}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">{item.timestamp}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed italic">
                  {item.text}
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border self-start sm:self-auto uppercase ${
                item.sentiment === "positive" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}>
                {isRtl ? (item.sentiment === "positive" ? "مثبت" : "خنثی") : item.sentiment}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
