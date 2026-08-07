"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Dialog } from "@/components/Dialog";
import { useAuth } from "@/components/AuthProvider";
import {
  FileText, Search, Plus, Calendar, Shield, Globe, Award, Sparkles, AlertCircle, ArrowRight, ArrowLeft
} from "lucide-react";

// Initial set of high fidelity mock audits
const initialAudits = [
  {
    id: "aud-001",
    url: "https://seorchable.ir",
    score: 88,
    grade: "A",
    createdAt: "2024-11-20T14:30:00.000Z",
    crawledPages: 18,
    status: "completed"
  },
  {
    id: "aud-002",
    url: "https://digikala.com",
    score: 74,
    grade: "B",
    createdAt: "2024-11-18T10:15:00.000Z",
    crawledPages: 45,
    status: "completed"
  },
  {
    id: "aud-003",
    url: "https://snapp.ir",
    score: 62,
    grade: "C",
    createdAt: "2024-11-15T18:45:00.000Z",
    crawledPages: 32,
    status: "completed"
  }
];

export default function AuditsPage() {
  const router = useRouter();
  const { language, direction } = useTheme();
  const { session } = useAuth();
  const isRtl = language === "fa";

  const [audits, setAudits] = useState(initialAudits);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAuditOpen, setIsNewAuditOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlError, setNewUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered audits
  const filteredAudits = audits.filter(audit =>
    audit.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewUrlError("");

    // Simple URL check
    const trimmed = newUrl.trim();
    if (!trimmed) return;

    try {
      const withProto = trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`;
      const parsed = new URL(withProto);
      if (!parsed.hostname.includes(".")) {
        throw new Error();
      }
    } catch {
      setNewUrlError(isRtl ? "لطفاً یک آدرس وب‌سایت معتبر وارد کنید." : "Please enter a valid website URL.");
      return;
    }

    setIsSubmitting(true);

    // Simulate creation and redirect to [id]
    setTimeout(() => {
      const newId = `aud-${Math.floor(100 + Math.random() * 900)}`;
      const randomScore = Math.floor(Math.random() * 26) + 65; // 65-90
      const randomGrade = randomScore >= 85 ? "A" : randomScore >= 75 ? "B" : "C";

      // Insert new audit into local state
      const newAudit = {
        id: newId,
        url: trimmed,
        score: randomScore,
        grade: randomGrade as "A" | "B" | "C",
        createdAt: new Date().toISOString(),
        crawledPages: 12,
        status: "completed"
      };

      setAudits([newAudit, ...audits]);
      setIsSubmitting(false);
      setIsNewAuditOpen(false);
      setNewUrl("");

      // Redirect to the newly created audit details
      router.push(`/${language}/dashboard/audits/${newId}?url=${encodeURIComponent(trimmed)}&score=${randomScore}`);
    }, 1500);
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    if (isRtl) {
      return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    }
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 70) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={direction}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] font-display">
            {isRtl ? "پایش‌ها و ممیزی‌های دیده‌شدن" : "AI Visibility Audits"}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isRtl
              ? "لیست گزارش‌های گذشته و نتایج خزش هوشمند وب‌سایت‌ها توسط کراولرهای پیشرفته."
              : "Overview of your generated audit files, crawlers performance logs, and AI footprint metrics."}
          </p>
        </div>

        <Button onClick={() => setIsNewAuditOpen(true)} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          <span>{isRtl ? "اجرای پایش جدید" : "Run New Audit"}</span>
        </Button>
      </div>

      {/* Filter and search controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] ${isRtl ? "right-3.5" : "left-3.5"}`} />
          <input
            type="text"
            placeholder={isRtl ? "جستجوی وب‌سایت..." : "Filter by website url..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2.5 text-xs rounded-xl outline-none border border-[var(--border)] bg-[var(--muted-surface)]/30 text-[var(--text-primary)] transition-colors ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"}`}
          />
        </div>
      </div>

      {/* Audits List Grid */}
      {filteredAudits.length === 0 ? (
        <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 border border-[var(--border)] bg-[var(--card)]">
          <div className="p-4 bg-[var(--muted-surface)] rounded-full text-[var(--text-muted)]">
            <FileText size={36} />
          </div>
          <div className="max-w-xs space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {isRtl ? "هیچ پایشی یافت نشد" : "No Audits Found"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {isRtl
                ? "وب‌سایتی با این مشخصات یافت نشد یا هنوز پایش جدیدی ثبت نکرده‌اید."
                : "No historical crawls match your query. Try registering a new brand domain."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudits.map((audit) => (
            <Card key={audit.id} className="border border-[var(--border)] bg-[var(--card)] hover:border-[var(--sky-blue-500)]/40 transition-all duration-300 flex flex-col justify-between">
              <CardHeader className="pb-3 text-start">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{audit.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getScoreColor(audit.score)}`}>
                    {isRtl ? `امتیاز: ${audit.score}` : `Score: ${audit.score}`}
                  </span>
                </div>
                <CardTitle className="text-sm font-black truncate text-[var(--text-primary)]" title={audit.url}>
                  {audit.url}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 text-xs font-semibold text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-[var(--text-muted)]" />
                    <span>{formatDate(audit.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-[var(--text-muted)]" />
                    <span>{isRtl ? `${audit.crawledPages} صفحه خزش شده` : `${audit.crawledPages} Pages Crawled`}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold gap-2 flex items-center justify-center cursor-pointer hover:bg-[var(--sky-blue-500)]/10 hover:text-[var(--text-primary)]"
                    onClick={() => router.push(`/${language}/dashboard/audits/${audit.id}?url=${encodeURIComponent(audit.url)}&score=${audit.score}`)}
                  >
                    <span>{isRtl ? "مشاهده گزارش کامل" : "View Full Report"}</span>
                    {isRtl ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* NEW AUDIT DIALOG */}
      <Dialog
        isOpen={isNewAuditOpen}
        onClose={() => setIsNewAuditOpen(false)}
        title={isRtl ? "اجرای پایش و ممیزی جدید" : "Create Technical Visibility Audit"}
      >
        <form onSubmit={handleStartAudit} className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isRtl
              ? "آدرس وب‌سایت اصلی یا صفحه لندینگ خود را وارد کنید. سیستم به صورت خودکار شروع به خزش، استخراج موجودیت‌ها و بررسی رتبه‌بندی در چت‌بات‌ها می‌کند."
              : "Register your product or domain URL below. Our crawling agents will scrape, extract semantic tags, and score your LLM footprint."}
          </p>

          <Input
            label={isRtl ? "آدرس وب‌سایت" : "Target Domain Address"}
            placeholder="e.g. company.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            disabled={isSubmitting}
            required
          />

          {newUrlError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span className="font-bold">{newUrlError}</span>
            </div>
          )}

          <div className="flex items-center gap-3 justify-end pt-4 border-t border-[var(--border)]">
            <Button variant="outline" type="button" onClick={() => setIsNewAuditOpen(false)} disabled={isSubmitting}>
              {isRtl ? "انصراف" : "Cancel"}
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting || !newUrl.trim()}>
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                  <span>{isRtl ? "در حال اجرای خزش..." : "Executing Crawl..."}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>{isRtl ? "شروع خزش و تحلیل" : "Start Crawling & Analyze"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
