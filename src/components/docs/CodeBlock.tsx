"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg text-left" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5 text-slate-400 text-[10px] font-mono">
        <span>{language ? language.toUpperCase() : "CODE"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 bg-slate-950/95 overflow-x-auto text-[11px] sm:text-xs text-orange-400 font-mono leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
}
