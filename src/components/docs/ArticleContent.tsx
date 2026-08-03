"use client";

import React from "react";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import Link from "next/link";

interface ArticleContentProps {
  content: string;
  locale: "en" | "fa";
}

export function ArticleContent({ content, locale }: ArticleContentProps) {
  const isFa = locale === "fa";

  // Helper to slugify a text for headers
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0600-\u06FF-]/g, "") // English and Persian support
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Inline formatter helper (handles Bold **, Code `, Links [text](href))
  const formatInline = (text: string) => {
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const matches = text.split(regex);

    return matches.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-extrabold text-[var(--text-primary)]">
            {part.substring(2, part.length - 2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 rounded-md bg-slate-900 text-orange-400 font-mono text-xs border border-white/5 mx-0.5"
            dir="ltr"
          >
            {part.substring(1, part.length - 1)}
          </code>
        );
      }
      if (part.startsWith("[") && part.includes("](")) {
        const labelEnd = part.indexOf("]");
        const hrefStart = part.indexOf("(", labelEnd);
        const hrefEnd = part.indexOf(")", hrefStart);
        if (labelEnd !== -1 && hrefStart !== -1 && hrefEnd !== -1) {
          const label = part.substring(1, labelEnd);
          const href = part.substring(hrefStart + 1, hrefEnd);
          const isExternal = href.startsWith("http");

          if (isExternal) {
            return (
              <a
                key={pIdx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--sky-blue-500)] hover:underline font-semibold"
              >
                {label}
              </a>
            );
          } else {
            return (
              <Link
                key={pIdx}
                href={href}
                className="text-[var(--sky-blue-500)] hover:underline font-semibold"
              >
                {label}
              </Link>
            );
          }
        }
      }

      return part;
    });
  };

  // Blocks Parser
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  let inList = false;
  let isOrderedList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length === 0) return null;
    const items = [...listItems];
    const ordered = isOrderedList;
    listItems = [];
    inList = false;

    if (ordered) {
      return (
        <ol key={`ol-${key}`} className="space-y-2.5 my-4 ps-5 list-decimal text-slate-300 text-start">
          {items.map((item, iIdx) => (
            <li key={iIdx} className="leading-relaxed text-xs sm:text-sm">
              {formatInline(item)}
            </li>
          ))}
        </ol>
      );
    } else {
      return (
        <ul key={`ul-${key}`} className="space-y-2 my-4 ps-2 list-none text-slate-300 text-start">
          {items.map((item, iIdx) => (
            <li key={iIdx} className="flex items-start gap-2.5 leading-relaxed text-xs sm:text-sm my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange-500)] shrink-0 mt-2" />
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
  };

  const flushTable = (key: number) => {
    if (tableHeaders.length === 0 && tableRows.length === 0) return null;
    const headers = [...tableHeaders];
    const rows = [...tableRows];
    tableHeaders = [];
    tableRows = [];
    inTable = false;

    return (
      <div key={`table-wrapper-${key}`} className="my-6 overflow-x-auto rounded-xl border border-white/10 shadow-md">
        <table className="w-full text-xs text-start border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-white font-bold border-b border-white/10">
              {headers.map((h, hIdx) => (
                <th key={hIdx} className="px-4 py-3 text-start">
                  {formatInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-950/20">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-slate-300 leading-normal">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block Handler
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        inCodeBlock = false;
        blocks.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBlockLines.join("\n")}
            language={codeBlockLang}
          />
        );
        codeBlockLines = [];
        codeBlockLang = "";
      } else {
        // Flush any active structures first
        if (inList) {
          const fl = flushList(i);
          if (fl) blocks.push(fl);
        }
        if (inTable) {
          const ft = flushTable(i);
          if (ft) blocks.push(ft);
        }

        inCodeBlock = true;
        codeBlockLang = trimmed.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Table Handler
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      // Flush lists
      if (inList) {
        const fl = flushList(i);
        if (fl) blocks.push(fl);
      }

      inTable = true;
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      // If this is a divider line (contains dashes like ---), skip it
      const isDivider = cells.every((cell) => /^:?-+:?$/.test(cell));

      if (isDivider) {
        continue;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) {
        const ft = flushTable(i);
        if (ft) blocks.push(ft);
      }
    }

    // 3. Lists Handler (Unordered & Ordered)
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const isNum = /^\d+\.\s/.test(trimmed);

    if (isBullet || isNum) {
      inList = true;
      const currentOrdered = isNum;

      if (listItems.length > 0 && isOrderedList !== currentOrdered) {
        // Flush active list of different type
        const fl = flushList(i);
        if (fl) blocks.push(fl);
      }

      isOrderedList = currentOrdered;

      if (currentOrdered) {
        const dotIdx = trimmed.indexOf(".");
        listItems.push(trimmed.substring(dotIdx + 1).trim());
      } else {
        listItems.push(trimmed.substring(2).trim());
      }
      continue;
    } else {
      if (inList && trimmed !== "") {
        const fl = flushList(i);
        if (fl) blocks.push(fl);
      }
    }

    // Empty Lines
    if (trimmed === "") {
      if (inList) {
        const fl = flushList(i);
        if (fl) blocks.push(fl);
      }
      continue;
    }

    // 4. Headers Handler
    if (trimmed.startsWith("# ")) {
      const text = trimmed.substring(2).trim();
      blocks.push(
        <h1
          key={`h1-${i}`}
          id={slugify(text)}
          className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display border-b border-white/10 pb-3 mb-6 mt-10 scroll-mt-20 text-start"
        >
          {formatInline(text)}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      const text = trimmed.substring(3).trim();
      blocks.push(
        <h2
          key={`h2-${i}`}
          id={slugify(text)}
          className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] font-display mt-8 mb-4 flex items-center gap-2 scroll-mt-20 text-start"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--sky-blue-500)]" />
          <span>{formatInline(text)}</span>
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      const text = trimmed.substring(4).trim();
      blocks.push(
        <h3
          key={`h3-${i}`}
          id={slugify(text)}
          className="text-base font-bold text-[var(--text-primary)] font-display mt-6 mb-3 scroll-mt-20 text-start"
        >
          {formatInline(text)}
        </h3>
      );
      continue;
    }

    // 5. Blockquotes / Callout Syntax Handler
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/, "").trim();

      if (quoteText.startsWith("[!NOTE]") || quoteText.startsWith("[!INFO]")) {
        blocks.push(
          <Callout key={`cq-${i}`} type="info">
            {formatInline(quoteText.substring(7).trim())}
          </Callout>
        );
      } else if (quoteText.startsWith("[!WARNING]") || quoteText.startsWith("[!IMPORTANT]")) {
        blocks.push(
          <Callout key={`cq-${i}`} type="warning">
            {formatInline(quoteText.substring(10).trim())}
          </Callout>
        );
      } else if (quoteText.startsWith("[!TIP]") || quoteText.startsWith("[!SUCCESS]")) {
        blocks.push(
          <Callout key={`cq-${i}`} type="success">
            {formatInline(quoteText.substring(6).trim())}
          </Callout>
        );
      } else {
        blocks.push(
          <blockquote
            key={`bq-${i}`}
            className="border-s-4 border-[var(--sky-blue-500)] bg-white/[0.01] px-5 py-3 rounded-r-xl text-slate-400 italic my-5 text-xs sm:text-sm leading-relaxed text-start"
          >
            {formatInline(quoteText)}
          </blockquote>
        );
      }
      continue;
    }

    // 6. Dividers
    if (trimmed === "---") {
      blocks.push(<hr key={`hr-${i}`} className="border-white/10 my-8" />);
      continue;
    }

    // Default: Normal Paragraph
    blocks.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed my-4 text-justify">
        {formatInline(trimmed)}
      </p>
    );
  }

  // Final flushes
  if (inList) {
    const fl = flushList(lines.length);
    if (fl) blocks.push(fl);
  }
  if (inTable) {
    const ft = flushTable(lines.length);
    if (ft) blocks.push(ft);
  }

  return <div className="space-y-2">{blocks}</div>;
}
