"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, AtSign, Send } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";

/**
 * Rich multi-column footer with a glass surface, grouped navigation, social
 * links, and a status bar.
 */
export function LandingFooter() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const columns = [
    {
      heading: isFa ? "محصول" : "Product",
      links: [
        { label: isFa ? "قابلیت‌ها" : "Features", href: "#features" },
        { label: isFa ? "موتورها" : "Engines", href: "#platforms" },
        { label: isFa ? "فرآیند" : "How it works", href: "#process" },
        { label: isFa ? "دستاوردها" : "Impact", href: "#metrics" },
      ],
    },
    {
      heading: isFa ? "راهکارها" : "Solutions",
      links: [
        { label: isFa ? "بهینه‌سازی GEO" : "GEO optimization", href: "#features" },
        { label: isFa ? "بهینه‌سازی AEO" : "AEO optimization", href: "#features" },
        { label: isFa ? "محافظت از برند" : "Brand protection", href: "#features" },
        { label: isFa ? "رصد رقبا" : "Competitive radar", href: "#features" },
      ],
    },
    {
      heading: isFa ? "شرکت" : "Company",
      links: [
        { label: isFa ? "درباره‌ی ما" : "About", href: "#" },
        { label: isFa ? "وبلاگ" : "Blog", href: "#" },
        { label: isFa ? "تماس با ما" : "Contact", href: "#" },
        { label: isFa ? "حریم خصوصی" : "Privacy", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: Globe, label: "Website", href: "#" },
    { icon: AtSign, label: "LinkedIn", href: "#" },
    { icon: Send, label: "X", href: "#" },
  ];

  return (
    <footer className="mt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div className="glass-panel rounded-[var(--radius-xl)] p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Brand block */}
            <div className="space-y-4">
              <Link href={`/${language}`} className="flex items-center gap-2.5">
                <span className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-600)] text-white">
                  <Sparkles size={18} />
                </span>
                <span className="font-display font-extrabold text-lg text-[var(--text-primary)]">
                  {C.brand[language]}
                </span>
              </Link>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs text-pretty">
                {isFa
                  ? "سنجش و بهینه‌سازی حضور برند شما در عصر جستجوی مبتنی بر هوش مصنوعی."
                  : "Measuring and optimizing your brand's presence in the age of AI-powered discovery."}
              </p>
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--border)] transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Link columns */}
            {columns.map((col) => (
              <nav key={col.heading} className="space-y-3">
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary-600)] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              © {new Date().getFullYear()} {C.brand[language]}.{" "}
              {isFa ? "تمامی حقوق محفوظ است." : "All rights reserved."}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-success)]">
              <ShieldCheck size={14} />
              {isFa ? "تمامی سامانه‌ها ایمن و برقرار" : "All systems secure"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
