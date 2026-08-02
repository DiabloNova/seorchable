"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocHeading {
  text: string;
  level: number;
  slug: string;
}

interface TableOfContentsProps {
  content: string;
  locale: "en" | "fa";
}

export function TableOfContents({ content, locale }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const isFa = locale === "fa";

  useEffect(() => {
    // Parse markdown lines to extract headings (H1, H2, H3)
    const lines = content.split(/\r?\n/);
    const parsedHeadings: TocHeading[] = [];

    let inCodeBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip lines inside code blocks
      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      if (trimmed.startsWith("#") && !trimmed.startsWith("##")) {
        // H1
        const text = trimmed.replace(/^#\s+/, "").trim();
        const slug = slugify(text);
        parsedHeadings.push({ text, level: 1, slug });
      } else if (trimmed.startsWith("##") && !trimmed.startsWith("###")) {
        // H2
        const text = trimmed.replace(/^##\s+/, "").trim();
        const slug = slugify(text);
        parsedHeadings.push({ text, level: 2, slug });
      } else if (trimmed.startsWith("###")) {
        // H3
        const text = trimmed.replace(/^###\s+/, "").trim();
        const slug = slugify(text);
        parsedHeadings.push({ text, level: 3, slug });
      }
    }

    setHeadings(parsedHeadings);
  }, [content]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0600-\u06FF-]/g, "") // support English and Persian characters
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
        <List size={14} className="text-[var(--sky-blue-500)]" />
        <span>{isFa ? "در این صفحه" : "On This Page"}</span>
      </div>

      <nav className="space-y-2 text-xs">
        {headings.map((h, idx) => (
          <a
            key={idx}
            href={`#${h.slug}`}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(h.slug);
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                // Update URL hash
                window.history.pushState(null, "", `#${h.slug}`);
              }
            }}
            className={`block hover:text-white transition-all text-slate-400 font-medium leading-relaxed border-s ${
              h.level === 1
                ? "ps-2 border-slate-800 font-bold"
                : h.level === 2
                ? "ps-4 border-slate-800"
                : "ps-6 border-transparent opacity-80"
            } hover:border-[var(--sky-blue-500)]`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
