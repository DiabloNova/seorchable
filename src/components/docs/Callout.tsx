"use client";

import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Lightbulb } from "lucide-react";

export type CalloutType = "info" | "warning" | "success" | "error" | "note";

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
  title?: string;
}

export function Callout({ type = "info", children, title }: CalloutProps) {
  const styles = {
    info: {
      border: "border-sky-500/30",
      bg: "bg-sky-500/5",
      text: "text-sky-800 dark:text-sky-300",
      icon: <Info size={18} className="text-sky-500 shrink-0 mt-0.5" />,
      titleColor: "text-sky-900 dark:text-sky-400",
    },
    warning: {
      border: "border-orange-500/30",
      bg: "bg-orange-500/5",
      text: "text-orange-800 dark:text-orange-300",
      icon: <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />,
      titleColor: "text-orange-900 dark:text-orange-400",
    },
    success: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      text: "text-emerald-800 dark:text-emerald-300",
      icon: <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />,
      titleColor: "text-emerald-900 dark:text-emerald-400",
    },
    error: {
      border: "border-rose-500/30",
      bg: "bg-rose-500/5",
      text: "text-rose-800 dark:text-rose-300",
      icon: <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />,
      titleColor: "text-rose-900 dark:text-rose-400",
    },
    note: {
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/5",
      text: "text-indigo-800 dark:text-indigo-300",
      icon: <Lightbulb size={18} className="text-indigo-500 shrink-0 mt-0.5" />,
      titleColor: "text-indigo-900 dark:text-indigo-400",
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div className={`p-4 rounded-xl border ${current.border} ${current.bg} flex items-start gap-3 my-5 transition-all text-xs sm:text-sm`}>
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && (
          <h5 className={`font-black tracking-wide ${current.titleColor}`}>
            {title}
          </h5>
        )}
        <div className={`leading-relaxed ${current.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Export specialized shorthand boxes
export function InfoBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Callout type="info" title={title}>{children}</Callout>;
}

export function WarningBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Callout type="warning" title={title}>{children}</Callout>;
}

export function SuccessBox({ children, title }: { children: React.ReactNode; title?: string }) {
  return <Callout type="success" title={title}>{children}</Callout>;
}
