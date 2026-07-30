"use client";

import React from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Provides the layout for Brand Intelligence pages with a localized breadcrumb.
 *
 * @param children - The content rendered below the breadcrumb.
 */
export default function IntelligenceLayout({ children }: { children: React.ReactNode }) {
  const { language } = useTheme();

  const breadcrumbItems = [
    { label: language === "fa" ? "داشبورد" : "Dashboard", href: "/dashboard" },
    { label: language === "fa" ? "هوشمندی برند" : "Brand Intelligence" },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      {children}
    </div>
  );
}
