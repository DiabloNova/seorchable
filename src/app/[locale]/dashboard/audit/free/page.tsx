"use client";

import React from "react";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";
import { GlassCard } from "@/components/GlassCard";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

export default function FreeAuditPage() {
  const { language } = useTheme();
  const router = useRouter();
  const isRtl = language === "fa";

  const handleUpgradeClick = () => {
    router.push(`/${language}/dashboard/audit/premium`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-display flex items-center gap-2.5">
          <Award className="text-[var(--sky-blue-500)]" size={24} />
          <span>{isRtl ? "تحلیل رایگان سئو و پایش هوشمند" : "Free SEO & Intelligent Audit"}</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
          {isRtl
            ? "بررسی و ارزیابی رایگان وضعیت بهینه‌سازی وب‌سایت شما برای موتورهای پاسخ‌دهی هوش مصنوعی."
            : "Free diagnostic analysis evaluating your domain's retrieval footprint across generative answer engines."}
        </p>
      </div>

      {/* Wrapped Panel in Premium Glassmorphic Container */}
      <GlassCard hoverable={false} className="p-6">
        <FreeAuditPanel onUpgradeClick={handleUpgradeClick} />
      </GlassCard>
    </div>
  );
}
