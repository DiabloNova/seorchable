"use client";

import React from "react";
import { PremiumAuditPanel } from "@/components/features/audit/PremiumAuditPanel";
import { GlassCard } from "@/components/GlassCard";
import { useTheme } from "@/components/ThemeProvider";
import { Star } from "lucide-react";

export default function PremiumAuditPage() {
  const { language } = useTheme();
  const isRtl = language === "fa";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-display flex items-center gap-2.5">
          <Star className="text-[var(--orange-500)] fill-[var(--orange-500)]" size={24} />
          <span>{isRtl ? "تحلیل پیشرفته و ارزیابی عمیق سئو هوش مصنوعی" : "Premium AI SEO & Semantic Audit"}</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
          {isRtl
            ? "گزارش همه‌جانبه، پایش پیشرفته کلمات کلیدی، استخراج سیگنال‌ها و ارزیابی عمیق رتبه برند شما."
            : "Complete diagnostic suite providing granular keyword index tracking, sentiment telemetry, and competitive deep-dives."}
        </p>
      </div>

      {/* Wrapped Panel in Premium Glassmorphic Container */}
      <GlassCard hoverable={false} className="p-6">
        <PremiumAuditPanel />
      </GlassCard>
    </div>
  );
}
