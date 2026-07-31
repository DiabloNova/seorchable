"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import {
  Zap, AlertTriangle, ShieldAlert, CheckCircle,
  Settings, Award, RefreshCw, Layers, Layout,
  Cpu, FileText, Download, Smartphone, Eye
} from "lucide-react";

interface Category {
  score: number;
  issues: number;
}

interface CriticalIssue {
  category: string;
  issue: string;
  affectedPages: number;
  impact: "high" | "medium" | "low";
  effort: "easy" | "medium" | "hard";
  recommendation: string;
  codeExample?: string;
}

interface QuickWin {
  issue: string;
  fix: string;
  estimatedTime: string;
}

interface PerformanceMetrics {
  avgLoadTime: string;
  largestContentfulPaint: string;
  cumulativeLayoutShift: string;
  totalPageSize: string;
  imageOptimizationScore: number;
}

interface TechnicalAuditData {
  technicalScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  pagesAnalyzed: number;
  categories: {
    performance: Category;
    accessibility: Category;
    mobile: Category;
    security: Category;
    technicalSeo: Category;
  };
  criticalIssues: CriticalIssue[];
  quickWins: QuickWin[];
  performanceMetrics: PerformanceMetrics;
}

export const TechnicalOptimizationPanel: React.FC = () => {
  const { language } = useTheme();
  const { session } = useAuth();
  const isRtl = language === "fa";

  const [url, setUrl] = useState("");
  const [pagesToAnalyze, setPagesToAnalyze] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TechnicalAuditData | null>(null);
  const [expandedIssueIdx, setExpandedIssueIdx] = useState<number | null>(null);

  // Multi-step loading phrases
  const loadingSteps = [
    "در حال خزش صفحات سایت...",
    "تحلیل عملکرد و سرعت...",
    "بررسی دسترسی‌پذیری...",
    "ارزیابی امنیت و سئو فنی...",
    "تولید پیشنهادات بهینه‌سازی..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    setData(null);

    try {
      const workspaceId = session.user?.workspaceId || "ws-tehran";
      const response = await fetch("/api/v1/optimization/technical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": workspaceId,
          "x-user-id": session.user?.id || "usr-1001"
        },
        body: JSON.stringify({ url, pagesToAnalyze }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || "خطایی در انجام پایش فنی وب‌سایت رخ داد.");
      }

      const resData = await response.json();
      setData(resData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطایی در برقراری ارتباط با سرور رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIssueExpand = (idx: number) => {
    setExpandedIssueIdx(expandedIssueIdx === idx ? null : idx);
  };

  const handleExportPDF = () => {
    // Generate simple print-mode trigger or styled download
    window.print();
  };

  const getImpactBadgeVariant = (impact: "high" | "medium" | "low") => {
    if (impact === "high") return "error";
    if (impact === "medium") return "warning";
    return "info";
  };

  const getImpactLabel = (impact: "high" | "medium" | "low") => {
    if (impact === "high") return isRtl ? "تاثیر بالا" : "High Impact";
    if (impact === "medium") return isRtl ? "تاثیر متوسط" : "Medium Impact";
    return isRtl ? "تاثیر کم" : "Low Impact";
  };

  const getEffortLabel = (effort: "easy" | "medium" | "hard") => {
    if (effort === "easy") return isRtl ? "ساده" : "Easy";
    if (effort === "medium") return isRtl ? "متوسط" : "Medium";
    return isRtl ? "دشوار" : "Hard";
  };

  return (
    <div className="space-y-6">
      {/* Search & Config GlassCard */}
      <GlassCard hoverable={false} className="p-5">
        <form onSubmit={handleStartAnalysis} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* URL Input */}
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Layout size={14} className="text-[var(--sky-blue-500)]" />
                <span>{isRtl ? "آدرس وب‌سایت هدف" : "Target Website URL"}</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-xs rounded-xl outline-none transition-all duration-300
                         bg-white/[0.02] text-white border border-white/10
                         focus:border-[var(--sky-blue-500)] focus:ring-1 focus:ring-[var(--sky-blue-500)]/30 focus:bg-white/[0.04]"
              />
            </div>

            {/* Pages Selector */}
            <div className="w-full md:w-48 space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Layers size={14} className="text-[var(--orange-500)]" />
                <span>{isRtl ? "تعداد صفحات پایش" : "Pages to Crawl"}</span>
              </label>
              <select
                value={pagesToAnalyze}
                onChange={(e) => setPagesToAnalyze(Number(e.target.value))}
                disabled={isLoading}
                className="w-full px-4 py-3 text-xs rounded-xl outline-none transition-all duration-300
                         bg-slate-900/90 text-white border border-white/10 cursor-pointer
                         focus:border-[var(--sky-blue-500)]"
              >
                <option value={5}>{isRtl ? "۵ صفحه" : "5 pages"}</option>
                <option value={10}>{isRtl ? "۱۰ صفحه" : "10 pages"}</option>
                <option value={25}>{isRtl ? "۲۵ صفحه" : "25 pages"}</option>
                <option value={50}>{isRtl ? "۵۰ صفحه" : "50 pages"}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full md:w-auto px-6 py-3 text-xs font-bold rounded-xl text-white cursor-pointer
                       bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)]
                       hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>{isRtl ? "در حال اجرای پایش..." : "Running Scan..."}</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="animate-pulse" />
                  <span>{isRtl ? "شروع آنالیز فنی سئو" : "Start Technical Analysis"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Error State */}
      {error && (
        <GlassCard hoverable={false} className="p-4 border-red-500/20 bg-red-500/[0.02]">
          <div className="flex gap-3 items-start">
            <ShieldAlert className="text-red-400 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-red-400">{isRtl ? "خطا در فرآیند پایش" : "Audit Pipeline Failed"}</h4>
              <p className="text-[11px] text-red-300/80 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Loading State */}
      {isLoading && (
        <GlassCard hoverable={false} className="p-8 text-center space-y-6">
          <div className="relative flex items-center justify-center mx-auto w-16 h-16">
            <div className="absolute w-16 h-16 border-4 border-[var(--sky-blue-500)]/20 border-t-[var(--sky-blue-500)] rounded-full animate-spin" />
            <Cpu className="text-[var(--sky-blue-500)] animate-pulse" size={24} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[var(--text-primary)] animate-pulse">
              {loadingSteps[loadingStep]}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
              {isRtl
                ? "فرآیند خزش عمیق و تحلیل کدهای وب‌سایت در حال انجام است. لطفاً منتظر بمانید."
                : "Parsing HTML structures, auditing mobile rendering configurations, and generating solutions."}
            </p>
          </div>

          {/* Stepper progress nodes */}
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            {loadingSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx <= loadingStep ? "w-8 bg-[var(--sky-blue-500)]" : "w-2 bg-white/10"
                }`}
              />
            ))}
          </div>
        </GlassCard>
      )}

      {/* Result State */}
      {data && (
        <div className="space-y-6 animate-slide-up print:text-black print:bg-white">
          {/* Row 1: Overall score & Grade card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard hoverable={false} className="p-6 flex flex-col justify-between items-center text-center">
              <div className="w-full text-start mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] flex items-center gap-1.5">
                  <Award size={14} />
                  <span>{isRtl ? "امتیاز کل بهینه‌سازی فنی" : "Overall Technical Score"}</span>
                </h3>
              </div>

              <div className="relative flex items-center justify-center my-6">
                <div className="w-36 h-36 rounded-full border-4 border-dashed border-white/10 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    {data.technicalScore}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-widest">
                    GRADE {data.grade}
                  </span>
                </div>
              </div>

              <div className="space-y-1 w-full border-t border-white/5 pt-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  {isRtl
                    ? `تعداد کل صفحات پایش شده: ${data.pagesAnalyzed} صفحه`
                    : `Total Pages Crawled: ${data.pagesAnalyzed}`}
                </p>
              </div>
            </GlassCard>

            {/* Performance Metrics Dashboard */}
            <GlassCard hoverable={false} className="lg:col-span-2 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] flex items-center gap-1.5">
                  <Zap size={14} />
                  <span>{isRtl ? "داشبورد آماری لود و کارایی" : "Speed & Loading Telemetry"}</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={handleExportPDF} className="text-[10px] flex items-center gap-1 cursor-pointer">
                  <Download size={12} />
                  <span>{isRtl ? "خروجی PDF گزارش" : "Export PDF"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-1">{isRtl ? "میانگین لود" : "Avg Load Time"}</span>
                  <span className="text-sm font-black text-white">{data.performanceMetrics.avgLoadTime}</span>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-1">Largest Contentful Paint (LCP)</span>
                  <span className="text-sm font-black text-[var(--orange-500)]">{data.performanceMetrics.largestContentfulPaint}</span>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-1">Cumulative Layout Shift (CLS)</span>
                  <span className="text-sm font-black text-emerald-400">{data.performanceMetrics.cumulativeLayoutShift}</span>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-1">{isRtl ? "مجموع حجم صفحه" : "Total Page Size"}</span>
                  <span className="text-sm font-black text-white">{data.performanceMetrics.totalPageSize}</span>
                </div>
              </div>

              {/* Progress Slider image optimization */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[var(--text-muted)]">{isRtl ? "امتیاز فشرده‌سازی و بهینه‌سازی تصاویر" : "Image Compression Score"}</span>
                  <span className="font-black text-emerald-400">{data.performanceMetrics.imageOptimizationScore} / 100</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.performanceMetrics.imageOptimizationScore}%` }} />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Category score breakdowns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <GlassCard hoverable={false} className="p-3 text-center space-y-1">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase font-bold">{isRtl ? "عملکرد" : "Performance"}</span>
              <span className="text-base font-black text-white">{data.categories.performance.score}%</span>
              <span className="text-[9px] text-red-400 block">{isRtl ? `${data.categories.performance.issues} خطا` : `${data.categories.performance.issues} issues`}</span>
            </GlassCard>
            <GlassCard hoverable={false} className="p-3 text-center space-y-1">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase font-bold">{isRtl ? "دسترسی‌پذیری" : "Accessibility"}</span>
              <span className="text-base font-black text-white">{data.categories.accessibility.score}%</span>
              <span className="text-[9px] text-red-400 block">{isRtl ? `${data.categories.accessibility.issues} خطا` : `${data.categories.accessibility.issues} issues`}</span>
            </GlassCard>
            <GlassCard hoverable={false} className="p-3 text-center space-y-1">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase font-bold">{isRtl ? "سازگاری موبایل" : "Mobile"}</span>
              <span className="text-base font-black text-white">{data.categories.mobile.score}%</span>
              <span className="text-[9px] text-red-400 block">{isRtl ? `${data.categories.mobile.issues} خطا` : `${data.categories.mobile.issues} issues`}</span>
            </GlassCard>
            <GlassCard hoverable={false} className="p-3 text-center space-y-1">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase font-bold">{isRtl ? "امنیت" : "Security"}</span>
              <span className="text-base font-black text-white">{data.categories.security.score}%</span>
              <span className="text-[9px] text-red-400 block">{isRtl ? `${data.categories.security.issues} خطا` : `${data.categories.security.issues} issues`}</span>
            </GlassCard>
            <GlassCard hoverable={false} className="p-3 text-center space-y-1">
              <span className="text-[9px] text-[var(--text-muted)] block uppercase font-bold">{isRtl ? "سئو فنی" : "Technical SEO"}</span>
              <span className="text-base font-black text-white">{data.categories.technicalSeo.score}%</span>
              <span className="text-[9px] text-red-400 block">{isRtl ? `${data.categories.technicalSeo.issues} خطا` : `${data.categories.technicalSeo.issues} issues`}</span>
            </GlassCard>
          </div>

          {/* Quick Wins Section */}
          <GlassCard hoverable={false} className="p-5 border-emerald-500/10 bg-emerald-500/[0.01]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-4">
              <CheckCircle size={14} />
              <span>{isRtl ? "پیشنهادات بهبود فوری (Quick Wins)" : "Quick Wins"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.quickWins.map((win, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] flex items-start gap-3">
                  <Zap className="text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" size={16} />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-normal">{win.issue}</h4>
                    <p className="text-[10px] text-emerald-300/80 mt-1 leading-relaxed">{win.fix}</p>
                    <span className="text-[9px] text-emerald-400/60 block mt-1.5 font-bold">{isRtl ? `زمان تخمینی: ${win.estimatedTime}` : `Estimated Time: ${win.estimatedTime}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Critical Issues List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <AlertTriangle size={14} />
              <span>{isRtl ? "خطاهای بحرانی و نیاز به توجه (Critical Issues)" : "Critical Issues"}</span>
            </h3>

            <div className="space-y-3">
              {data.criticalIssues.map((issue, idx) => {
                const isExpanded = expandedIssueIdx === idx;
                return (
                  <GlassCard key={idx} hoverable={false} className="p-4 border-red-500/10 bg-red-500/[0.005]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex gap-2.5 items-start">
                        <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 flex-shrink-0 mt-0.5">
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{issue.category}</span>
                          <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">{issue.issue}</h4>
                          <p className="text-[10px] text-[var(--text-muted)] mt-1">
                            {isRtl
                              ? `تعداد صفحات تحت تاثیر: ${issue.affectedPages} صفحه`
                              : `Affected pages: ${issue.affectedPages}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Badge variant={getImpactBadgeVariant(issue.impact)} className="text-[9px]">
                          {getImpactLabel(issue.impact)}
                        </Badge>
                        <Badge variant="neutral" className="text-[9px]">
                          {isRtl ? `سختی: ${getEffortLabel(issue.effort)}` : `Effort: ${getEffortLabel(issue.effort)}`}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleIssueExpand(idx)}
                          className="p-1 px-2.5 text-[10px] hover:bg-white/5 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={10} />
                          <span>{isRtl ? "نمایش راهکار" : "View Fix"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Fix Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-slide-down">
                        <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5">
                          <h5 className="text-[10px] font-bold text-slate-300 mb-1">{isRtl ? "توصیه فنی بهینه‌سازی:" : "Optimization Recommendation:"}</h5>
                          <p className="text-xs text-slate-200 leading-relaxed">{issue.recommendation}</p>
                        </div>

                        {issue.codeExample && (
                          <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold text-slate-300">{isRtl ? "نمونه کد پیاده‌سازی:" : "Implementation Code Example:"}</h5>
                            <pre className="p-3 bg-slate-950/80 border border-white/5 rounded-lg text-[10px] text-slate-300 font-mono overflow-x-auto leading-normal whitespace-pre">
                              <code>{issue.codeExample}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
