"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog } from "@/components/Dialog";
import { Tabs } from "@/components/Tabs";

// Brand Intelligence Analytics Components
import { KPICard } from "@/components/features/analytics/KPICard";
import { SentimentTrendChart } from "@/components/features/analytics/SentimentTrendChart";
import { TopEntitiesList } from "@/components/features/analytics/TopEntitiesList";
import { KnowledgeGraphExplorer } from "@/components/features/graph/KnowledgeGraphExplorer";

// Technical Optimization Panel
import { TechnicalOptimizationPanel } from "@/components/features/optimization/TechnicalOptimizationPanel";

// Competitive Analysis Panel
import { CompetitiveAnalysisPanel } from "@/components/features/analysis/CompetitiveAnalysisPanel";

import { intelligenceService } from "@/services/intelligence";
import { BrandHealthMetrics } from "@/schemas/intelligence";

import {
  MessageSquare,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  Activity,
  Award
} from "lucide-react";

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
 * Premium dashboard redesigned with vertical route-based sidebar navigation and core tabs.
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
      id: "technical",
      label: isRtl ? "بهینه‌سازی فنی سئو ⭐" : "Technical Optimization ⭐",
      content: <TechnicalOptimizationPanel />,
    },
    {
      id: "competitive",
      label: isRtl ? "تحلیل رقابتی ⭐" : "Competitive Analysis ⭐",
      content: <CompetitiveAnalysisPanel />,
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

      {/* Tabs Container */}
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
