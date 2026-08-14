"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { ContentStudio } from "@/components/features/content/ContentStudio";
import { BookOpen } from "lucide-react";

export default function ContentStudioPage() {
  const { language } = useTheme();
  const isRtl = language === "fa";

  return (
    <div className="space-y-6 animate-fade-in text-start">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] font-display flex items-center gap-2.5">
          <BookOpen className="text-[var(--sky-blue-500)]" size={24} />
          <span>{isRtl ? "استودیوی محتوا" : "Content Studio"}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--sky-blue-500)] text-white rounded-full">
            Shell Active
          </span>
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-2xl">
          {isRtl
            ? "ویرایشگر هوشمند معنایی، بهینه‌سازی خوانایی متون، تحلیل چگالی اصطلاحات کلیدی و امتیازدهی رویت‌پذیری."
            : "Optimize conversational flow structures, evaluate semantic layout parameters, and score visibility metrics."}
        </p>
      </div>

      <ContentStudio />
    </div>
  );
}
