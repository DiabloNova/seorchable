"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DOCS_TOPICS, DocTopic } from "@/lib/docsData";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag, Calendar, Check, Copy, Hash } from "lucide-react";
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

  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  const topicIdx = DOCS_TOPICS.findIndex((t) => t.slug === slug);
  const topic = topicIdx !== -1 ? DOCS_TOPICS[topicIdx] : null;

  // Previous and Next navigation topics
  const prevTopic = topicIdx > 0 ? DOCS_TOPICS[topicIdx - 1] : null;
  const nextTopic = topicIdx < DOCS_TOPICS.length - 1 ? DOCS_TOPICS[topicIdx + 1] : null;

  // Last Updated Date simulation
  const lastUpdated = isFa ? "آخرین بروزرسانی: مرداد ۱۴۰۴" : "Last Updated: August 2025";

  // Generate dynamic heading list for Table of Contents (TOC)
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    if (topic) {
      const lines = topic.contentFa.split("\n");
      const found: { id: string; text: string; level: number }[] = [];
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("# ")) {
          const text = trimmed.substring(2);
          const id = text.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
          found.push({ id, text, level: 1 });
        } else if (trimmed.startsWith("## ")) {
          const text = trimmed.substring(3);
          const id = text.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
          found.push({ id, text, level: 2 });
        }
      });
      setHeadings(found);
    }
  }, [topic]);

  // Handle active heading tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height + 600) {
            setActiveHeadingId(heading.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

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

  // Calculate dynamic reading time based on 200 Farsi/English words per minute
  const wordCount = topic.contentFa.split(/\s+/).length;
  const readingTimeVal = Math.max(1, Math.ceil(wordCount / 180));
  const readingTime = isFa
    ? `زمان مطالعه: ${readingTimeVal} دقیقه`
    : `Estimated Reading Time: ${readingTimeVal} min`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // Safe markdown block renderer
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
          const rawCode = codeContent.join("\n");
          codeContent = [];
          const codeId = `code-block-${idx}`;
          return (
            <div key={idx} className="relative group my-5 font-mono text-left" dir="ltr">
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => copyToClipboard(rawCode, codeId)}
                  className="p-1.5 rounded-lg bg-slate-900/80 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                  title={isFa ? "کپی کد" : "Copy Code"}
                >
                  {copiedTextId === codeId ? (
                    <>
                      <Check size={11} className="text-emerald-500" />
                      <span className="text-emerald-400 font-sans">{isFa ? "کپی شد" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span className="font-sans">{isFa ? "کپی" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-orange-400 overflow-x-auto select-all leading-relaxed pt-10">
                <code>{rawCode}</code>
              </pre>
            </div>
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

      // H1 Header with Anchor Link
      if (trimmed.startsWith("# ")) {
        const titleText = trimmed.substring(2);
        const headingId = titleText.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
        return (
          <h1
            key={idx}
            id={headingId}
            className="text-2xl sm:text-3xl font-black text-white font-display border-b border-white/10 pb-4 mb-6 mt-2 flex items-center gap-2 group scroll-mt-24"
          >
            <span>{titleText}</span>
            <a href={`#${headingId}`} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-[var(--sky-blue-500)] transition-opacity">
              <Hash size={16} />
            </a>
          </h1>
        );
      }

      // H2 Header with Anchor Link
      if (trimmed.startsWith("## ")) {
        const titleText = trimmed.substring(3);
        const headingId = titleText.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
        return (
          <h2
            key={idx}
            id={headingId}
            className="text-base sm:text-lg font-extrabold text-[var(--sky-blue-500)] font-display mt-8 mb-4 flex items-center gap-2 group scroll-mt-24"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-blue-500)]" />
            <span>{titleText}</span>
            <a href={`#${headingId}`} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-[var(--sky-blue-500)] transition-opacity">
              <Hash size={14} />
            </a>
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
          <li key={idx} className="list-none flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed my-2.5 ps-2">
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
          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed my-3 ps-2">
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 animate-fade-in text-start">
      {/* 1. MAIN COLUMN CONTENT */}
      <div className="space-y-6">

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-xs text-slate-500 font-bold">
          <Link href={`/${locale}/docs`} className="hover:text-white transition-colors">
            {isFa ? "خانه مستندات" : "Docs Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-400">{topic.categoryFa}</span>
          <span>/</span>
          <span className="text-slate-300 font-black">{isFa ? topic.titleFa : topic.titleEn}</span>
        </nav>

        {/* Article Box */}
        <div className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-slate-900/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-40 h-40 bg-[var(--sky-blue-500)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[var(--orange-500)]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Metadata Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 mb-6 text-slate-400 text-[10px] sm:text-xs">
            <div className="flex flex-wrap items-center gap-4 font-mono font-bold">
              <span className="flex items-center gap-1 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-lg">
                <Tag size={12} className="text-[var(--sky-blue-500)]" />
                <span>{topic.category.toUpperCase()}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[var(--orange-500)]" />
                <span>{readingTime}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-emerald-400" />
                <span>{lastUpdated}</span>
              </span>
            </div>

            <Link
              href={`/${locale}/docs`}
              className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold hover:text-white transition-all border border-white/5 bg-white/[0.02] px-3.5 py-1.5 rounded-xl hover:border-white/10"
            >
              <ArrowLeft size={14} className="rtl:rotate-180" />
              <span>{isFa ? "فهرست مستندات" : "Back to Index"}</span>
            </Link>
          </div>

          {/* Render Rich Markdown Content */}
          <div className="space-y-4 text-white">
            {renderRichContent(topic.contentFa)}
          </div>
        </div>

        {/* 2. PREVIOUS / NEXT TOPIC NAVIGATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {prevTopic ? (
            <Link href={`/${locale}/docs/${prevTopic.slug}`} className="group p-5 rounded-2xl border border-white/10 bg-slate-900/10 hover:bg-slate-900/20 hover:border-[var(--sky-blue-500)]/40 transition-all flex flex-col items-start text-start space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 group-hover:text-[var(--sky-blue-500)] transition-colors">
                <ArrowLeft size={11} className="rtl:rotate-180" />
                <span>{isFa ? "مبحث قبلی" : "Previous Topic"}</span>
              </span>
              <span className="text-xs font-bold text-white group-hover:underline">
                {isFa ? prevTopic.titleFa : prevTopic.titleEn}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextTopic ? (
            <Link href={`/${locale}/docs/${nextTopic.slug}`} className="group p-5 rounded-2xl border border-white/10 bg-slate-900/10 hover:bg-slate-900/20 hover:border-[var(--orange-500)]/40 transition-all flex flex-col items-end text-end space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 group-hover:text-[var(--orange-500)] transition-colors">
                <span>{isFa ? "مبحث بعدی" : "Next Topic"}</span>
                <ArrowRight size={11} className="rtl:rotate-180" />
              </span>
              <span className="text-xs font-bold text-white group-hover:underline">
                {isFa ? nextTopic.titleFa : nextTopic.titleEn}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

      </div>

      {/* 2. FLOATING RIGHT TABLE OF CONTENTS (TOC) */}
      <aside className="hidden lg:block space-y-6">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2 px-3">
            <BookOpen size={14} className="text-[var(--sky-blue-500)]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isFa ? "سرفصل‌های این صفحه" : "On This Page"}
            </h4>
          </div>

          <ul className="space-y-1.5 border-l border-white/5 pl-2">
            {headings.map((h, idx) => (
              <li key={idx} className={h.level === 2 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  className={`block text-[11px] font-bold py-1 transition-colors hover:text-white truncate ${
                    activeHeadingId === h.id
                      ? "text-[var(--sky-blue-500)] border-l-2 border-[var(--sky-blue-500)] pl-2"
                      : "text-slate-500"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
