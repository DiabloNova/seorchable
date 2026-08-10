"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { MessageSquare, CheckCircle2 } from "lucide-react";

export default function AeoPlaygroundPage() {
  const { language } = useTheme();
  const isRtl = language === "fa";

  return (
    <div className="space-y-6 animate-fade-in text-start">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] font-display flex items-center gap-2.5">
          <MessageSquare className="text-[var(--sky-blue-500)]" size={24} />
          <span>{isRtl ? "محیط اجرای هوش مصنوعی" : "AI Playground"}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--sky-blue-500)] text-white rounded-full">
            Shell Verified
          </span>
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl">
          {isRtl
            ? "شبیه‌سازی سناریوها، پرامپت‌ها و بهینه‌سازی مستقیم پاسخ موتورهای زبانی بزرگ به صورت زنده."
            : "Test prompt intelligence, simulate customized customer questions, and benchmark direct responses."}
        </p>
      </div>

      <Card className="border border-[var(--border)] bg-[var(--card)]">
        <CardHeader>
          <CardTitle className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[var(--sky-blue-500)]" />
            <span>{isRtl ? "پیکربندی موفقیت‌آمیز پوسته" : "Shell Architecture Success"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isRtl
              ? "پوسته یکپارچه داشبورد با موفقیت بر روی این مسیر بارگذاری شده است."
              : "The unified Dashboard Shell is actively rendering this route context with proper navigation parameters."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
          <p>
            {isRtl
              ? "مسیر فعال سایدبار: ابزارهای رویت‌پذیری هوش مصنوعی > محیط اجرای هوش مصنوعی"
              : "Active Sidebar Navigation State: AI Visibility Tools > AI Playground"}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] font-mono">
            Route: /dashboard/aeo/playground
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
