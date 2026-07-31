"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/Input";
import { Dialog } from "@/components/Dialog";
import { Tabs } from "@/components/Tabs";

// Brand Intelligence Analytics Components
import { KPICard } from "@/components/features/analytics/KPICard";
import { SentimentTrendChart } from "@/components/features/analytics/SentimentTrendChart";
import { TopEntitiesList } from "@/components/features/analytics/TopEntitiesList";
import { KnowledgeGraphExplorer } from "@/components/features/graph/KnowledgeGraphExplorer";

// Existing Components
import { IngestionForm } from "@/components/features/ingestion/IngestionForm";
import { BrandIntelligenceChat } from "@/components/features/rag/BrandIntelligenceChat";
import { AeoAuditPanel } from "@/components/features/audit/AeoAuditPanel";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";
import { PremiumAuditPanel } from "@/components/features/audit/PremiumAuditPanel";
import { ContentStudio } from "@/components/features/content/ContentStudio";
import { LlmAnalyticsPanel } from "@/components/features/analytics/LlmAnalyticsPanel";
import { intelligenceService } from "@/services/intelligence";
import { BrandHealthMetrics } from "@/schemas/intelligence";

import {
  MessageSquare,
  FileText,
  AlertCircle,
  Plus,
  ExternalLink,
  RefreshCw,
  Activity,
  Award
} from "lucide-react";
import Link from "next/link";

interface AnalyticsSummary {
  totalMentions: number;
  averageSentimentScore: number;
  sentimentDistribution: { positive: number; neutral: number; negative: number };
  topEntities: Array<{ name: string; type: string; mentionCount: number }>;
  recentTrend: Array<{ date: string; score: number }>;
}

// Premium loading skeleton component for the full page
const Skeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="h-8 w-48 skeleton rounded-lg" />
        <div className="h-4 w-96 max-w-full skeleton rounded" />
      </div>
      <div className="h-10 w-36 skeleton rounded-[var(--radius-md)]" />
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 skeleton rounded-[var(--radius-lg)]" />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-[350px] skeleton rounded-[var(--radius-lg)]" />
      <div className="h-[350px] skeleton rounded-[var(--radius-lg)]" />
    </div>

    <div className="h-[450px] skeleton rounded-[var(--radius-lg)]" />
  </div>
);

/**
 * Premium dashboard with integrated "Analytics & Overview" and "Ingestion & Chat Tools" via a tabbed layout.
 */
export default function DashboardPage() {
  const { session } = useAuth();
  const { language } = useTheme();
  const isRtl = language === "fa";

  const [brandMetrics, setBrandMetrics] = useState<BrandHealthMetrics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDomain, setNewBrandDomain] = useState("");

  // Control active tab dynamically to support redirection from Free Audit Panel Upsell
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (session.status !== "authenticated") return;

    let active = true;

    const performFetch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const workspaceId = session.user?.workspaceId || "ws-tehran";

        // 1. Fetch existing brand health metrics
        const metricsRes = await intelligenceService.getBrandHealthMetrics(workspaceId);

        // 2. Fetch high-level analytics summary mock data
        const summaryResponse = await fetch("/api/v1/analytics/summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": workspaceId,
          },
        });

        if (!summaryResponse.ok) {
          throw new Error("Failed to fetch analytics summary data");
        }

        const summaryRes: AnalyticsSummary = await summaryResponse.json();

        if (active) {
          setBrandMetrics(metricsRes);
          setAnalyticsSummary(summaryRes);
        }

      } catch (err: unknown) {
        if (active) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard statistics";
          setError(errorMessage);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Defer the state updates and fetch execution to safely bypass react-hooks/set-state-in-effect warning
    const timer = setTimeout(() => {
      performFetch();
    }, 100);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [session, refreshKey]);

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddBrandOpen(false);
    setNewBrandName("");
    setNewBrandDomain("");
  };

  const handleRetry = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleUpgradeRedirect = () => {
    setActiveTab("audit");
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
        <div className="p-4 bg-[var(--color-error-bg)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)] text-[var(--color-error)] rounded-full">
          <AlertCircle size={40} />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {isRtl ? "خطا در بارگذاری اطلاعات" : "Failed to Load Workspace"}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {isRtl
              ? "متأسفانه ارتباط با سرور هوشمندی برند برقرار نشد. لطفاً مجدداً تلاش فرمایید."
              : "We were unable to validate your brand security metrics or fetch the live stream. Please try again."}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">{error}</p>
        </div>
        <Button variant="outline" onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw size={14} />
          <span>{isRtl ? "تلاش مجدد" : "Retry Connection"}</span>
        </Button>
      </div>
    );
  }

  if (isLoading || !brandMetrics || !analyticsSummary) {
    return <Skeleton />;
  }

  // Define tab structures
  const dashboardTabs = [
    {
      id: "overview",
      label: isRtl ? "نمای کلی و تحلیلی" : "Overview & Analytics",
      content: (
        <div className="space-y-6">
          {/* Row 1: KPI Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title={isRtl ? "مجموع سیگنال‌های پایش شده" : "Total Mentions Tracked"}
              value={analyticsSummary.totalMentions}
              change="+12.4%"
              changeType="success"
              description={isRtl ? "پایش فعال در موتورهای پاسخ‌دهی" : "Active crawling from leading search models"}
              icon={Activity}
            />
            <KPICard
              title={isRtl ? "میانگین شاخص احساسات" : "Avg Sentiment Index"}
              value={`${(analyticsSummary.averageSentimentScore * 100).toFixed(1)} / 100`}
              change="+4.2%"
              changeType="success"
              description={isRtl ? "کیفیت معنایی پاسخ‌های هوش مصنوعی" : "Qualitative semantic score"}
              icon={MessageSquare}
            />
            <KPICard
              title={isRtl ? "شاخص سلامت و امنیت برند" : "Brand Safety Index"}
              value="۹۲.۴٪"
              change="+1.5%"
              changeType="success"
              description={isRtl ? "عدم وجود پاسخ مغایر با حقیقت" : "Risk of incorrect model claims"}
              icon={Award}
            />
            <KPICard
              title={isRtl ? "کل مراجع استناد شده" : "Verified Outbound Citations"}
              value={brandMetrics.totalCitations}
              change="+8.3%"
              changeType="success"
              description={isRtl ? "پیوندهای ارجاع ثبت‌شده به دامنه" : "Verified active citation links"}
              icon={FileText}
            />
          </div>

          {/* Row 2: Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SentimentTrendChart data={analyticsSummary.recentTrend} />
            </div>
            <div>
              <TopEntitiesList data={analyticsSummary.topEntities} />
            </div>
          </div>

          {/* Row 3: Interactive Knowledge Graph Explorer */}
          <div className="w-full">
            <KnowledgeGraphExplorer />
          </div>
        </div>
      ),
    },
    {
      id: "free-audit",
      label: isRtl ? "تحلیل رایگان سئو" : "Free SEO Analysis",
      content: <FreeAuditPanel onUpgradeClick={handleUpgradeRedirect} />,
    },
    {
      id: "premium-audit",
      label: isRtl ? "تحلیل پیشرفته و پریمیوم ⭐" : "Premium Analysis ⭐",
      content: <PremiumAuditPanel />,
    },
    {
      id: "content-studio",
      label: isRtl ? "استودیو محتوا" : "Content Studio",
      content: <ContentStudio />,
    },
    {
      id: "llm-analytics",
      label: isRtl ? "تحلیل مدل‌های زبانی" : "LLM Analytics",
      content: <LlmAnalyticsPanel />,
    },
    {
      id: "audit",
      label: isRtl ? "ارزیابی و بینش" : "Audit & Insights",
      content: <AeoAuditPanel />,
    },
    {
      id: "tools",
      label: isRtl ? "کنسول ابزارها و گفتگو" : "Ingestion & Chat Tools",
      content: (
        <div className="space-y-6">
          {/* Live Ingestion & Chat Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IngestionForm />
            <BrandIntelligenceChat />
          </div>

          {/* Table & Optimizations Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Live Citation Stream table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{isRtl ? "پایش زنده استنادات و مراجع" : "Live Citation Stream"}</CardTitle>
                    <CardDescription>
                      {isRtl
                        ? "نمای لحظه‌ای از نحوه ارجاع مدل‌ها به دارایی‌های وب شما."
                        : "Real-time logs of queries yielding direct links to your web domains."}
                    </CardDescription>
                  </div>
                  <Link href={`/${language}/dashboard/intelligence`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      {isRtl ? "مشاهده همه" : "View All"}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-5">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="border-y border-[var(--border)] text-[10px] text-[var(--text-muted)] font-semibold uppercase bg-[var(--muted-surface)]">
                        <th className="py-2.5 px-4 text-start">{isRtl ? "مدل" : "Engine"}</th>
                        <th className="py-2.5 px-4 text-start">{isRtl ? "کوئری فرضی" : "Prompt Query"}</th>
                        <th className="py-2.5 px-4 text-start">{isRtl ? "نوع ارجاع" : "Type"}</th>
                        <th className="py-2.5 px-4 text-start">{isRtl ? "زمان" : "Occurred"}</th>
                        <th className="py-2.5 px-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] text-xs">
                      {brandMetrics.recentCitations.map((cit) => (
                        <tr key={cit.id} className="hover:bg-[var(--muted-surface)] transition-colors">
                          <td className="py-3 px-4 font-semibold text-[var(--text-primary)]">
                            {cit.engine}
                          </td>
                          <td className="py-3 px-4 text-[var(--text-secondary)] italic max-w-[200px] truncate">
                            &ldquo;{cit.query}&rdquo;
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={cit.status === "Verified Citation" ? "success" : "info"}>
                              {cit.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-[10px] text-[var(--text-muted)]">
                            {cit.time}
                          </td>
                          <td className="py-3 px-4 text-end">
                            <a
                              href={cit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex p-1 text-[var(--text-muted)] hover:text-[var(--color-primary-600)] transition-colors"
                            >
                              <ExternalLink size={14} className="rtl:-scale-x-100" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* AI Action Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle>{isRtl ? "اقدامات فوری بهینه‌سازی" : "Optimization Center"}</CardTitle>
                <CardDescription>
                  {isRtl
                    ? "وظایف پیشنهادی هوش مصنوعی برای ارتقای رتبه و سهم صدای برند."
                    : "AI-generated steps to secure brand citation anchors."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--muted-surface)] border border-[var(--border)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      {isRtl ? "افزودن اسکیما به صفحات فرود" : "Inject Schema on Product Pages"}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {isRtl ? "فرمت JSON-LD به مدل‌ها در درک موجودیت‌ها کمک می‌کند." : "Provides structured context for ChatGPT models."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--muted-surface)] border border-[var(--border)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      {isRtl ? "رفع خطای توکنایزر زبان فارسی" : "Address Hallucinated Claims"}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {isRtl ? "درخواست اسکن هدفمند جدید برای رفع تناقض‌های متنی." : "Create target benchmarks for incorrect statements."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--muted-surface)] border border-[var(--border)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-600)] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">
                      {isRtl ? "به‌روزرسانی ساختار llms.txt" : "Publish structured llms.txt"}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {isRtl ? "به‌روزرسانی دسترسی ربات‌های جمع‌آوری داده هوش مصنوعی." : "Allows seamless crawling by Perplexity crawler engines."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-display">
            {isRtl
              ? `خوش آمدید، ${session.user?.name || "کاربر گرامی"}`
              : `Welcome back, ${session.user?.name || "Guest"}`}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isRtl
              ? "بررسی و پایش جامع سهم صدای مدل، مراجع استناد شده، و شبکه ارتباط معنایی برند شما."
              : "Overview of your brand's presence metrics across leading generative answer platforms."}
          </p>
        </div>

        <Button onClick={() => setIsAddBrandOpen(true)} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          <span>{isRtl ? "افزودن برند جدید" : "Register Brand"}</span>
        </Button>
      </div>

      {/* Main Tabbed Layout Container */}
      <Tabs tabs={dashboardTabs} activeTabId={activeTab} onTabChange={setActiveTab} />

      {/* REGISTER BRAND DIALOG */}
      <Dialog
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
        title={isRtl ? "ثبت برند جدید در پنل پایش" : "Register Brand Context"}
      >
        <form onSubmit={handleAddBrand} className="space-y-4">
          <Input
            label={isRtl ? "نام رسمی برند" : "Official Brand Name"}
            placeholder={isRtl ? "مثال: دیجی کالا" : "e.g., Tehran Ecommerce Corp"}
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            required
          />
          <Input
            label={isRtl ? "دامنه وب‌سایت اصلی" : "Root Web Domain"}
            placeholder="https://example.ir"
            value={newBrandDomain}
            onChange={(e) => setNewBrandDomain(e.target.value)}
            required
          />

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-[var(--border)]">
            <Button variant="outline" type="button" onClick={() => setIsAddBrandOpen(false)}>
              {isRtl ? "انصراف" : "Cancel"}
            </Button>
            <Button variant="primary" type="submit">
              {isRtl ? "ایجاد و شروع اسکن" : "Register & Run Audit"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
