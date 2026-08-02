"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, AtSign, Send } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";

/**
 * Rich multi-column footer with a glass surface, grouped navigation, social
 * links, and a status bar. Supports real corporate routes with zero dead links.
 */
export function LandingFooter() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const columns = [
    {
      heading: isFa ? "پلتفرم و محصول" : "Platform & Product",
      links: [
        { label: isFa ? "قابلیت‌های پلتفرم" : "Platform Features", href: `/${language}/platform` },
        { label: isFa ? "راهکارهای سازمانی" : "Enterprise Solutions", href: `/${language}/solutions` },
        { label: isFa ? "تعرفه‌ها و قیمت‌گذاری" : "Platform Pricing", href: `/${language}/pricing` },
        { label: isFa ? "وضعیت سامانه‌ها" : "System Status", href: `/${language}/status` },
      ],
    },
    {
      heading: isFa ? "منابع و مستندات" : "Resources & Docs",
      links: [
        { label: isFa ? "مستندات فنی" : "Technical Documentation", href: `/${language}/documentation` },
        { label: isFa ? "دانلود نمونه گزارش" : "Sample Report PDF", href: `/${language}/resources` },
        { label: isFa ? "وبلاگ تخصصی" : "Company Blog", href: `/${language}/blog` },
        { label: isFa ? "ارتباط با پشتیبانی" : "Support Contact", href: `/${language}/contact` },
      ],
    },
    {
      heading: isFa ? "شرکت و حقوقی" : "Company & Legal",
      links: [
        { label: isFa ? "درباره ما" : "About Us", href: `/${language}/about` },
        { label: isFa ? "تماس با فروش" : "Contact Sales", href: `/${language}/contact` },
        { label: isFa ? "قوانین و مقررات" : "Terms of Service", href: `/${language}/terms-of-service` },
        { label: isFa ? "حریم خصوصی" : "Privacy Policy", href: `/${language}/privacy-policy` },
        { label: isFa ? "کوکی‌ها" : "Cookie Policy", href: `/${language}/cookie-policy` },
      ],
    },
  ];

  const socials = [
    { icon: Globe, label: "Website", href: `/${language}` },
    { icon: AtSign, label: "LinkedIn", href: `https://linkedin.com` },
    { icon: Send, label: "X / Twitter", href: `https://x.com` },
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
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs text-pretty font-medium">
                {isFa
                  ? "سنجش، پایش و بهینه‌سازی حضور برند شما در عصر جستجو و پاسخ‌های مبتنی بر هوش مصنوعی (AEO & GEO)."
                  : "Measuring, tracking, and optimizing your brand's presence in the age of AI-powered discovery and search."}
              </p>
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  const isExternal = s.href.startsWith("http");
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--border)] transition-colors cursor-pointer"
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
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--color-primary-600)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              © {new Date().getFullYear()} {C.brand[language]}.{" "}
              {isFa ? "تمامی حقوق محفوظ است." : "All rights reserved."}
            </span>
            <Link
              href={`/${language}/status`}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-success)] font-bold hover:underline"
            >
              <ShieldCheck size={14} />
              {isFa ? "تمامی سامانه‌ها برقرار و ایمن هستند" : "All systems operational & secure"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
