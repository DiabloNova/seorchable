import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
  ShieldAlert,
  Sparkles,
  Award,
  Link2,
  Cpu,
  FileSpreadsheet,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon
} from "lucide-react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";

// Subtle Persian geometric motif (SVG data URI)
const PERSIAN_PATTERN_BG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 3.333L36.667 20 20 36.667 3.333 20 20 3.333zm0 2.828L6.162 20 20 33.838 33.838 20 20 6.161zM20 10l10 10-10 10-10-10 10-10zm0 2.828L12.828 20 20 27.172 27.172 20 20 12.828z' fill='currentColor' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;

interface DashboardKpiGridProps {
  seoHealth: number | "N/A";
  aiVisibility: number | "N/A";
  brandAuthority: number | "N/A";
  citationVisibility: number | "N/A";
  technicalHealth: number | "N/A";
  contentHealth: number | "N/A";
  competitivePosition: string | "N/A";
  loading?: boolean;
}

interface CustomKPICardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: "success" | "error" | "warning" | "info";
  description?: string;
  icon?: LucideIcon;
  loading?: boolean;
  onClick: () => void;
  isRtl: boolean;
  className?: string;
}

const CustomKPICard: React.FC<CustomKPICardProps> = ({
  title,
  value,
  change,
  changeType = "info",
  description,
  icon: Icon,
  loading = false,
  onClick,
  isRtl,
  className = "",
}) => {
  if (loading) {
    return (
      <Card className={`p-5 overflow-hidden ${className}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-2/3 bg-[var(--border)] animate-pulse rounded" />
            <div className="h-8 w-1/2 bg-[var(--border)] animate-pulse rounded" />
          </div>
          <div className="w-10 h-10 bg-[var(--border)] animate-pulse rounded-lg" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="h-5 w-12 bg-[var(--border)] animate-pulse rounded-full" />
          <div className="h-3 w-20 bg-[var(--border)] animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  const isPositive = changeType === "success";
  const isNegative = changeType === "error";

  return (
    <Card
      hoverable
      className={`relative h-full flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-300 border-[var(--border)] hover:border-[var(--sky-blue-500)]/30 ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`${title} details`}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"
        style={{ backgroundImage: PERSIAN_PATTERN_BG, backgroundSize: '40px 40px' }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl font-black text-[var(--text-primary)] block font-display tracking-tight group-hover:text-[var(--sky-blue-500)] transition-colors">
            {value}
          </span>
        </div>
        {Icon && (
          <div className="p-2.5 bg-[var(--color-info-bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--color-primary-600)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
            <Icon size={18} className="rtl:-scale-x-100" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between text-[10px] gap-2">
        {change && (
          <Badge variant={changeType} className="shadow-sm">
            <span className="flex items-center gap-0.5">
              {isPositive && <ArrowUpRight size={12} />}
              {isNegative && <ArrowDownRight size={12} />}
              {change}
            </span>
          </Badge>
        )}
        {description && (
          <span className="text-[var(--text-muted)] truncate max-w-[150px] text-end opacity-80">
            {description}
          </span>
        )}
      </div>

      <div className={`absolute bottom-3 ${isRtl ? "left-3" : "right-3"} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
        {isRtl ? <ArrowLeft size={14} className="text-[var(--sky-blue-500)]" /> : <ArrowRight size={14} className="text-[var(--sky-blue-500)]" />}
      </div>
    </Card>
  );
};

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({
  seoHealth,
  aiVisibility,
  brandAuthority,
  citationVisibility,
  technicalHealth,
  contentHealth,
  competitivePosition,
  loading = false,
}) => {
  const router = useRouter();
  const { language } = useTheme();
  const isRtl = language === "fa";

  const navigateTo = (path: string) => {
    router.push(`/${language}${path}`);
  };

  const getScoreChangeType = (score: number | "N/A"): "success" | "error" | "warning" | "info" => {
    if (score === "N/A") return "info";
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "error";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in" role="region" aria-label={isRtl ? "آمار کلیدی داشبورد" : "Dashboard Key Metrics"}>
      <CustomKPICard
        title={isRtl ? "شاخص سلامت سئو (SEO Health)" : "SEO Health Score"}
        value={seoHealth !== "N/A" ? `${seoHealth}%` : "N/A"}
        change={seoHealth !== "N/A" ? (isRtl ? "پایش فعال" : "Active Audited") : (isRtl ? "بدون داده" : "No Data")}
        changeType={getScoreChangeType(seoHealth)}
        description={isRtl ? "میانگین وزنی پارامترهای موتور جستجو" : "Overall crawled performance weight"}
        icon={ShieldAlert}
        loading={loading}
        onClick={() => navigateTo("/dashboard/audits")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "میزان دیده‌شدن هوش مصنوعی (AEO)" : "AI Visibility Score"}
        value={aiVisibility !== "N/A" ? `${aiVisibility}%` : "N/A"}
        change={aiVisibility !== "N/A" ? (isRtl ? "بهینه‌شده" : "Optimized") : (isRtl ? "غیرفعال" : "Unavailable")}
        changeType={getScoreChangeType(aiVisibility)}
        description={isRtl ? "سهم پاسخ در چت‌بات‌های بزرگ" : "Synthesized conversational share"}
        icon={Sparkles}
        loading={loading}
        onClick={() => navigateTo("/dashboard/aeo/audits")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "اعتبار برند (Brand Authority)" : "Brand Authority"}
        value={brandAuthority !== "N/A" ? brandAuthority : "N/A"}
        change={isRtl ? "غیرفعال" : "Inactive"}
        changeType="info"
        description={isRtl ? "بررسی حضور معنایی در گراف" : "Semantic authority index"}
        icon={Award}
        loading={loading}
        onClick={() => navigateTo("/dashboard/brand/citations")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "استناد به مراجع (Citations)" : "Citation Visibility"}
        value={citationVisibility !== "N/A" ? citationVisibility : "N/A"}
        change={isRtl ? "اتصال وب‌سرور" : "Disconnected"}
        changeType="info"
        description={isRtl ? "مجموع پیوندهای استناد شده" : "Inbound reference citations count"}
        icon={Link2}
        loading={loading}
        onClick={() => navigateTo("/dashboard/brand/citations")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "سلامت فنی (Technical SEO)" : "Technical Health"}
        value={technicalHealth !== "N/A" ? `${technicalHealth}%` : "N/A"}
        change={technicalHealth !== "N/A" ? (isRtl ? "تطبیق کامل" : "Compliant") : (isRtl ? "نیاز به اسکن" : "Needs Scan")}
        changeType={getScoreChangeType(technicalHealth)}
        description={isRtl ? "سرعت، متادیتا و لایه‌های امنیتی" : "Performance, SSL & structured meta tags"}
        icon={Cpu}
        loading={loading}
        onClick={() => navigateTo("/dashboard/seo/technical")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "سلامت محتوا (Content Quality)" : "Content Health"}
        value={contentHealth !== "N/A" ? `${contentHealth}%` : "N/A"}
        change={contentHealth !== "N/A" ? (isRtl ? "کلاستر غنی" : "Rich Cluster") : (isRtl ? "بدون داده" : "Empty")}
        changeType={getScoreChangeType(contentHealth)}
        description={isRtl ? "خوانایی معنایی و هم‌پوشانی" : "Semantic completeness and reading ease"}
        icon={FileSpreadsheet}
        loading={loading}
        onClick={() => navigateTo("/dashboard/content/studio")}
        isRtl={isRtl}
      />

      <CustomKPICard
        title={isRtl ? "موقعیت رقابتی (Competitive Rank)" : "Competitive Position"}
        value={competitivePosition !== "N/A" ? competitivePosition : (isRtl ? "موجود نیست" : "Unavailable")}
        change={isRtl ? "نیاز به مانیتورینگ" : "Unmonitored"}
        changeType="warning"
        description={isRtl ? "شاخص برتری برند نسبت به رقبا" : "Performance baseline vs key competitors"}
        icon={TrendingUp}
        loading={loading}
        onClick={() => navigateTo("/dashboard/competitors/radar")}
        isRtl={isRtl}
        className="sm:col-span-2 lg:col-span-2"
      />
    </div>
  );
};
