"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/components/ThemeProvider";
import { FreeAuditResponse } from "@/app/api/v1/audit/free/route";
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Lock,
  Globe,
  AlertCircle,
  Flame,
  Check,
  Shield,
  FileCode,
  Languages,
  Eye,
  ArrowLeft
} from "lucide-react";

interface FreeAuditPanelProps {
  onUpgradeClick: () => void;
}

export const FreeAuditPanel: React.FC<FreeAuditPanelProps> = ({ onUpgradeClick }) => {
  const { language, direction } = useTheme();
  const isRtl = language === "fa";

  const [url, setUrl] = useState("");
  const [result, setResult] = useState<FreeAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [animatedScore, setAnimatedScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (result) {
      // Clear any existing intervals safely
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      let start = 0;
      const end = result.score;
      if (start === end) {
        // Set state inside a microtask/setTimeout to prevent synchronous render warnings
        const t = setTimeout(() => {
          setAnimatedScore(end);
        }, 0);
        return () => clearTimeout(t);
      }
      const duration = 1000;
      const increment = end / (duration / 16);

      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(interval);
          setAnimatedScore(end);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);

      timerRef.current = interval;

      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      const t = setTimeout(() => {
        setAnimatedScore(0);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [result]);

  const strings = {
    title: isRtl ? "تحلیل رایگان ساختار سئو وب‌سایت" : "Free Website SEO & Structure Audit",
    desc: isRtl
      ? "ساختار اولیه، تگ‌ها و وضعیت دسترسی ربات‌های وب‌سایت خود را با ابزار پیشرفته خزش Firecrawl تحلیل نمایید."
      : "Audit basic meta elements, headings, and bot crawlability with industry-grade Firecrawl technology.",
    placeholder: isRtl ? "آدرس وب‌سایت خود را وارد کنید (مثلاً: https://example.com)" : "Enter website URL (e.g. https://example.com)",
    btnAnalyze: isRtl ? "آنالیز رایگان وب‌سایت" : "Analyze Website Free",
    btnAnalyzing: isRtl ? "در حال خزش هوشمند و تحلیل ساختار وب‌سایت..." : "Intelligently crawling and analyzing website structure...",
    scoreGaugeTitle: isRtl ? "امتیاز سئو فنی" : "Technical SEO Score",
    scoreGaugeDesc: isRtl ? "سنجش شاخص‌های استاندارد صفحه بر اساس خزش" : "Standardized meta checks scoring synthesis",
    checksTitle: isRtl ? "چک‌لیست بررسی‌های انجام شده" : "SEO Meta Diagnostic Checklist",
    quickTipsTitle: isRtl ? "اقدامات و پیشنهادات فوری بهینه‌سازی" : "Quick Actionable Fixes & Insights",
    premiumTitle: isRtl ? "🔒 ارتقا به نسخه حرفه‌ای هوشمند (AEO & Graph)" : "🔒 Unlock Enterprise Semantic Auditing",
    gradeLabel: isRtl ? "رتبه صفحه:" : "Page Grade:",
    titleCheck: isRtl ? "وجود تگ عنوان (Title)" : "Title Meta Tag Presence",
    descCheck: isRtl ? "توضیحات متاداده (Meta Description)" : "Meta Description Presence",
    h1Check: isRtl ? "وجود حداقل یک تگ H1" : "At least one H1 element",
    httpsCheck: isRtl ? "پروتکل امن HTTPS" : "Secure HTTPS Protocol",
    langCheck: isRtl ? "تعریف زبان وب‌سایت" : "Declared Page Language",
    robotsCheck: isRtl ? "قابلیت ایندکس (Crawlability)" : "Search Bot Indexable Status",
    checked: isRtl ? "بررسی شده" : "Checked",
    notChecked: isRtl ? "خطا در بررسی" : "Failed",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError(isRtl ? "لطفاً آدرس وب‌سایت را وارد کنید." : "Please enter a valid website URL.");
      return;
    }

    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/v1/audit/free", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: trimmed }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || (isRtl ? "خطا در برقراری ارتباط با سرور." : "An error occurred."));
        }

        setResult(data);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "stroke-emerald-500 text-emerald-400";
    if (score >= 75) return "stroke-teal-500 text-teal-400";
    if (score >= 60) return "stroke-amber-500 text-amber-400";
    if (score >= 45) return "stroke-orange-500 text-orange-400";
    return "stroke-red-500 text-red-400";
  };

  const getGradeBg = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "B": return "bg-teal-500/10 border-teal-500/30 text-teal-400";
      case "C": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "D": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      default: return "bg-red-500/10 border-red-500/30 text-red-400";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={direction}>
      {/* Search & URL Input Card */}
      <Card className="border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
              <Globe size={18} />
            </div>
            <div>
              <CardTitle>{strings.title}</CardTitle>
              <CardDescription>{strings.desc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] ${isRtl ? "right-4" : "left-4"}`} />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={strings.placeholder}
                className={`
                  w-full py-3 text-xs rounded-xl outline-none transition-all duration-300
                  bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[var(--border)]
                  focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 focus:bg-[var(--card-bg)]
                  placeholder:text-[var(--text-muted)]
                  ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"}
                `}
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending || !url.trim()}
              className="gap-2 px-6 py-3 font-bold rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-none text-white transition-all duration-300"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  <span>{isRtl ? "در حال تحلیل..." : "Analyzing..."}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>{strings.btnAnalyze}</span>
                </>
              )}
            </Button>
          </form>

          {isPending && (
            <div className="mt-4 p-4 rounded-xl border border-sky-500/15 bg-sky-500/5 text-sky-500 dark:text-sky-300 text-xs flex items-center gap-3 animate-pulse">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping" />
              <p className="font-medium leading-relaxed">{strings.btnAnalyzing}</p>
            </div>
          )}

          {error && (
            <div className="p-4 mt-4 rounded-xl border border-[var(--color-error-bg)] bg-[var(--color-error-bg)] text-[var(--color-error)] text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Results Display */}
      {result && !isPending && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Radial Score Gauge */}
          <Card className="border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md shadow-lg flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Globe size={12} />
                <span>{strings.scoreGaugeTitle}</span>
              </CardTitle>
              <CardDescription className="text-[10px]">
                {strings.scoreGaugeDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 flex-1 space-y-5">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    className="stroke-[var(--border)]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    className={`transition-all duration-1000 ${getScoreColor(result.score)}`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - animatedScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black font-display leading-none tracking-tight ${getScoreColor(result.score)}`}>
                    {animatedScore}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] mt-1 tracking-widest">
                    / 100
                  </span>
                </div>
              </div>

              {/* Page Grade */}
              <div className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${getGradeBg(result.grade)}`}>
                <span>{strings.gradeLabel}</span>
                <span className="text-sm font-black">{result.grade}</span>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Pillar */}
          <Card className="border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md shadow-lg">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Shield size={12} />
                <span>{strings.checksTitle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.titleCheck}</span>
                </div>
                {result.checks.hasTitle ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <FileCode size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.descCheck}</span>
                </div>
                {result.checks.hasMetaDescription ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.h1Check}</span>
                </div>
                {result.checks.hasH1 ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.httpsCheck}</span>
                </div>
                {result.checks.isHttps ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Languages size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.langCheck}</span>
                </div>
                {result.checks.hasLanguage ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--muted-surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{strings.robotsCheck}</span>
                </div>
                {result.checks.isIndexable ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips Column */}
          <Card className="border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md shadow-lg">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>{strings.quickTipsTitle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 max-h-[290px] overflow-y-auto pr-1">
              {result.quickTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted-surface)] space-y-1">
                  <p className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    {tip.issue}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {tip.recommendation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Premium Locked Upsell Card */}
          <Card className="lg:col-span-3 border border-sky-500/20 bg-gradient-to-b from-sky-950/20 to-black/35 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -z-10 group-hover:bg-sky-500/10 transition-colors duration-500" />

            <CardHeader className="pb-2 border-b border-white/5">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-sky-400">
                <Lock size={15} />
                <span>{strings.premiumTitle}</span>
              </CardTitle>
              <CardDescription className="text-xs text-white/70">
                {result.premiumUpsell.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.premiumUpsell.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-white/90 font-medium">
                    <div className="w-4 h-4 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-white/5">
                <Button
                  onClick={onUpgradeClick}
                  className="gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-none font-bold text-xs text-white shadow-lg shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <span>{isRtl ? "ارتقا به نسخه پریمیوم و تحلیل معنایی" : "Upgrade to Premium Semantic Audit"}</span>
                  <ArrowLeft size={14} className="rtl:-scale-x-100" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
