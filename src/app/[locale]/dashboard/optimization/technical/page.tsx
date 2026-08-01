"use client";

import React from "react";
import { TechnicalOptimizationPanel } from "@/components/features/optimization/TechnicalOptimizationPanel";
import { useTheme } from "@/components/ThemeProvider";
import { Settings } from "lucide-react";

export default function TechnicalOptimizationPage() {
  const { language } = useTheme();
  const isRtl = language === "fa";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-display flex items-center gap-2.5">
          <Settings className="text-[var(--sky-blue-500)]" size={24} />
          <span>{isRtl ? "بهینه‌سازی فنی و سئو تکنیکال" : "Technical SEO & Optimization"}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white rounded-full">
            Pro
          </span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-3xl leading-relaxed">
          {isRtl
            ? "پایش کدهای وب‌سایت، تحلیل سرعت و حجم صفحات، بررسی دسترسی‌پذیری و ارائه راه‌حل‌های کاملاً عملی به همراه کدهای مربوطه."
            : "Audit site scripts, page weight metrics, mobile rendering configs, accessibility, and discover actionable code fixes."}
        </p>
      </div>

      {/* Render the Technical Optimization UI Component */}
      <TechnicalOptimizationPanel />
    </div>
  );
}
