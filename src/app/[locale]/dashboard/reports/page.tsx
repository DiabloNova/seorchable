"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  FileText, Download, Calendar, Mail, Settings, RefreshCw, Sparkles, CheckCircle2
} from "lucide-react";

export default function ReportsPage() {
  const { language, direction } = useTheme();
  const isRtl = language === "fa";

  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleExportPDF = () => {
    setIsExporting(true);
    setSuccessMsg("");
    setTimeout(() => {
      setIsExporting(false);
      setSuccessMsg(isRtl ? "فایل PDF با موفقیت آماده دانلود شد." : "PDF Report is compiled and downloaded.");
    }, 1500);
  };

  const scheduledReports = [
    {
      id: "sch-1",
      name: isRtl ? "گزارش دیده‌شدن هفتگی دیجی‌کالا" : "Weekly Executive Brand report",
      frequency: isRtl ? "هر شنبه" : "Weekly (Saturdays)",
      recipient: "ceo@company.com",
      status: "active"
    },
    {
      id: "sch-2",
      name: isRtl ? "پایش ماهانه سهم صدا (SOV)" : "Monthly Competitors Analysis Summary",
      frequency: isRtl ? "اول هر ماه میلادی" : "Monthly (1st day)",
      recipient: "marketing-leads@company.com",
      status: "active"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" dir={direction}>
      {/* Header */}
      <div className="text-start">
        <h1 className="text-2xl font-black text-[var(--text-primary)] font-display">
          {isRtl ? "گزارش‌گیری و صادرات داده" : "Executive PDF Reports"}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {isRtl
            ? "تولید فایل‌های چاپی، خروجی‌های PDF غنی از نمودارها و پیکربندی ارسال خودکار ایمیل‌های گزارش هفتگی."
            : "Generate comprehensive audit PDFs, manage scheduled executive dispatches, and export brand metrics tabular sheets."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Compilation Area */}
        <Card className="lg:col-span-2 border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between">
          <CardHeader className="text-start">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-[var(--sky-blue-500)]">
              <Sparkles size={16} />
              <span>{isRtl ? "خروجی هوشمند PDF" : "On-Demand PDF Compilation"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isRtl
                ? "یک گزارش لوکس شامل تحلیل گوگل جمنی، خطاهای خزش وب‌سایت، استنادهای چت‌ببات‌ها و راهکارهای GEO برای ارائه به مدیران ارشد."
                : "Compile a beautifully branded, multi-page executive audit summary containing crawler logs, Gemini insights, and GEO fixes."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-start flex-1 flex flex-col justify-between">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--muted-surface)]/40 space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)]">SYSTEM COMPILER STATUS</span>
              <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed">
                {isRtl
                  ? "✓ تمامی داده‌های مربوط به خزش ۵ دسامبر ۲۰۲۴ و تحلیل پایگاه‌های داده در دسترس هستند."
                  : "✓ All brand-health metrics and crawling datasets from Dec 5th, 2024 are synced and ready."}
              </p>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2.5 font-bold animate-fade-in">
                <CheckCircle2 size={15} />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border)]">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full text-xs font-black gap-2 py-3.5 rounded-xl flex items-center justify-center cursor-pointer shadow-md bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white"
              >
                {isExporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                    <span>{isRtl ? "در حال تدوین گزارش..." : "Compiling Report..."}</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>{isRtl ? "دانلود فوری گزارش مدیران (PDF)" : "Generate & Download PDF Now"}</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Settings */}
        <Card className="border border-[var(--border)] bg-[var(--card)] text-start">
          <CardHeader className="border-b border-[var(--border)] pb-3">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-[var(--orange-500)]">
              <Calendar size={16} />
              <span>{isRtl ? "ارسال‌های خودکار زمان‌بندی شده" : "Scheduled Executive Dispatches"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {scheduledReports.map((sch) => (
              <div key={sch.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--muted-surface)]/40 space-y-1.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-[var(--text-primary)] truncate max-w-[150px]">{sch.name}</h4>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                    {sch.status}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] space-y-0.5">
                  <p>{isRtl ? `دوره: ${sch.frequency}` : `Interval: ${sch.frequency}`}</p>
                  <p>{isRtl ? `گیرنده: ${sch.recipient}` : `To: ${sch.recipient}`}</p>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full py-2.5 rounded-xl text-xs font-bold gap-2 cursor-pointer mt-2">
              <Settings size={13} />
              <span>{isRtl ? "افزودن زمان‌بندی جدید" : "Add Scheduled Recipient"}</span>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
