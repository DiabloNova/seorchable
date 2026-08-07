"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { DOCS_TOPICS } from "@/lib/docsData";
import { ArrowLeft, BookOpen, Clock, Tag } from "lucide-react";
import Link from "next/link";

interface DocDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function DocDetailPage({ params }: DocDetailPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const slug = resolvedParams.slug;
  const router = useRouter();
  const isFa = locale === "fa";

  const topic = DOCS_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="text-center py-20 space-y-4 animate-fade-in">
        <h1 className="text-2xl font-black text-white font-display">
          {isFa ? "مستند مورد نظر پیدا نشد" : "Documentation Topic Not Found"}
        </h1>
        <p className="text-xs text-slate-400">
          {isFa
            ? "متأسفانه سرفصل درخواستی در لیست مستندات معتبر سامانه وجود ندارد."
            : "The requested slug does not exist in our system."}
        </p>
        <Link
          href={`/${locale}/docs`}
          className="inline-flex px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white transition-all border border-white/10"
        >
          {isFa ? "بازگشت به صفحه مستندات" : "Back to Documentation Index"}
        </Link>
      </div>
    );
  }

  // Parse lines of the translated content into custom rendered blocks
  // to support rich Markdown headings, bullet points, code blocks and paragraphs safely
  const renderRichContent = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Handle Code Blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join("\n");
          codeContent = [];
          return (
            <pre
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-orange-400 overflow-x-auto my-4 text-left select-all leading-relaxed"
              dir="ltr"
            >
              <code>{content}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Empty Lines
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // H1 Header
      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="text-xl sm:text-2xl font-black text-white font-display border-b border-white/10 pb-4 mb-6 mt-2"
          >
            {trimmed.substring(2)}
          </h1>
        );
      }

      // H2 Header
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-base sm:text-lg font-extrabold text-[var(--sky-blue-500)] font-display mt-8 mb-4 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-blue-500)]" />
            <span>{trimmed.substring(3)}</span>
          </h2>
        );
      }

      // Divider
      if (trimmed === "---") {
        return <hr key={idx} className="border-white/10 my-6" />;
      }

      // Unordered list bullet
      if (trimmed.startsWith("- ")) {
        return (
          <li key={idx} className="list-none flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed my-2.5 ps-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange-500)] shrink-0 mt-2" />
            <span>{trimmed.substring(2)}</span>
          </li>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const dotIndex = trimmed.indexOf(".");
        const num = trimmed.substring(0, dotIndex);
        const rest = trimmed.substring(dotIndex + 1).trim();
        return (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed my-3 ps-2">
            <span className="font-black text-[var(--sky-blue-500)] font-mono text-xs">{num}.</span>
            <span>{rest}</span>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-3.5 text-justify">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="space-y-6 animate-fade-in text-start">
      {/* Breadcrumb Metadata */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs text-slate-500 font-bold">
        <Link href={`/${locale}/docs`} className="hover:text-white transition-colors">
          {isFa ? "مستندات" : "Docs"}
        </Link>
        <span>/</span>
        <span className="text-slate-400">{topic.categoryFa}</span>
        <span>/</span>
        <span className="text-slate-300 font-black">{isFa ? topic.titleFa : topic.titleEn}</span>
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-slate-900/10 backdrop-blur-md shadow-2xl relative">
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[var(--sky-blue-500)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[var(--orange-500)]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Action Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-slate-400">
          <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono">
            <span className="flex items-center gap-1">
              <Tag size={12} className="text-[var(--sky-blue-500)]" />
              <span>{topic.category.toUpperCase()}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[var(--orange-500)]" />
              <span>{isFa ? "زمان مطالعه: ۵ دقیقه" : "5 min read"}</span>
            </span>
          </div>

          <Link
            href={`/${locale}/docs`}
            className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-all border border-white/5 bg-white/[0.02] px-3.5 py-1.5 rounded-xl hover:border-white/10"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            <span>{isFa ? "فهرست مستندات" : "Back to Index"}</span>
          </Link>
        </div>

        {/* Content Rendered with Premium Styling */}
        <div className="space-y-4 text-white">
          {renderRichContent(topic.contentFa)}
        </div>
      </div>
    </article>
  );
}
