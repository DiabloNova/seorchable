"use client";

import React from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Renders the localized Competitive Intel dashboard page with a placeholder for competitive monitoring.
 */
export default function CompetitivePage() {
  const { language } = useTheme();

  const breadcrumbItems = [
    { label: language === "fa" ? "داشبورد" : "Dashboard", href: "/dashboard" },
    { label: language === "fa" ? "تحلیل رقابتی" : "Competitive Intel" },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {language === "fa" ? "تحلیل رقابتی" : "Competitive Intel"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {language === "fa"
              ? "پایش سهم صدای مدل‌های زبانی بزرگ (SoMV) به صورت بلادرنگ در مقایسه با رقبای اصلی بازار."
              : "Real-time tracking of Share of Model Voice (SoMV) compared with primary market competitors."}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "fa" ? "تحلیل همزمان سهم صدای مدل‌ها" : "Share of Model Voice Benchmarking"}</CardTitle>
            <CardDescription>
              {language === "fa"
                ? "مقایسه میزان دفعات پیشنهاد شدن برند شما در مقابل رقبا در موتورهای هوش مصنوعی."
                : "Comparative brand recommendation volume counts against competitors across top AI engines."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border border-dashed border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)]">
            <span className="text-sm text-[var(--text-muted)]">
              {language === "fa" ? "ماژول پایش رقابتی (به زودی در فازهای بعدی)" : "Competitive Monitoring Workspace (Coming in future phases)"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
