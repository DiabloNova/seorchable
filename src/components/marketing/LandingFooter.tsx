"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Globe, AtSign, Send, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";
import { SeorchableLogo } from "./SeorchableLogo";

/**
 * Enterprise-grade, high-fidelity multi-column footer for seorchable.ir.
 * Structured with clear navigation groups: Platform, Solutions, Documentation, Resources, Legal, Company, and Socials.
 * Every link maps to a valid system path with localized parameters.
 */
export function LandingFooter() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const footerGroups = [
    {
      heading: isFa ? "پلتفرم" : "Platform",
      links: [
        { label: isFa ? "میز فرماندهی هوشمند" : "Command Center", href: `/${language}/dashboard` },
        { label: isFa ? "تحلیل استاندارد برند" : "Standard Brand Audit", href: `/${language}/dashboard/intelligence` },
        { label: isFa ? "گراف دانش سازمانی" : "Enterprise Knowledge Graph", href: `/${language}/dashboard/entities` },
        { label: isFa ? "جستجوی معنایی RAG" : "AI Semantic Discovery", href: `/${language}/dashboard/query` },
      ],
    },
    {
      heading: isFa ? "راهکارها" : "Solutions",
      links: [
        { label: isFa ? "بهینه‌سازی GEO" : "GEO Optimization", href: `/${language}/solutions/geo` },
        { label: isFa ? "بهینه‌سازی پاسخ‌ها AEO" : "AEO Optimization", href: `/${language}/solutions/aeo` },
        { label: isFa ? "محافظت از برند" : "Brand Protection", href: `/${language}/solutions/protection` },
        { label: isFa ? "رادار پایش رقبا" : "Competitive Radar", href: `/${language}/solutions/radar` },
      ],
    },
    {
      heading: isFa ? "مستندات فنی" : "Documentation",
      links: [
        { label: isFa ? "مقدمه و شروع سریع" : "Getting Started", href: `/${language}/docs/introduction-to-brandgraph`, external: true },
        { label: isFa ? "معماری زیرساخت خزش" : "Crawling Infrastructure", href: `/${language}/docs/infrastructure-architecture`, external: true },
        { label: isFa ? "مدیریت چندمستأجری" : "Multi-Tenant Security", href: `/${language}/docs/multi-tenant-isolation`, external: true },
        { label: isFa ? "جریان استخراج و تحلیل" : "AI Ingestion Flow", href: `/${language}/docs/ai-pipeline-architecture`, external: true },
        { label: isFa ? "نگاشت گراف دانش" : "Knowledge Graph Design", href: `/${language}/docs/knowledge-graph-design`, external: true },
      ],
    },
    {
      heading: isFa ? "منابع و وبلاگ" : "Resources",
      links: [
        { label: isFa ? "وبلاگ شرکت" : "Corporate Blog", href: `/${language}/blog` },
        { label: isFa ? "پیش‌نویس گزارش نمونه" : "Sample Brand Report", href: "/optimus-ai-sample-report.pdf", external: true },
        { label: isFa ? "وضعیت سامانه‌ها" : "System Status", href: `/${language}/dashboard`, badge: "UP" },
      ],
    },
    {
      heading: isFa ? "حقوقی و دسترسی" : "Legal & Privacy",
      links: [
        { label: isFa ? "حریم خصوصی کاربران" : "Privacy Policy", href: `/${language}/privacy` },
        { label: isFa ? "قوانین و مقررات استفاده" : "Terms of Service", href: `/${language}/privacy` },
      ],
    },
    {
      heading: isFa ? "شرکت" : "Company",
      links: [
        { label: isFa ? "درباره ما" : "About Us", href: `/${language}/about` },
        { label: isFa ? "تماس با کارشناسان" : "Contact Sales", href: `/${language}/contact` },
      ],
    },
  ];

  const socialChannels = [
    { icon: Globe, label: "Website", href: `/${language}` },
    { icon: AtSign, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Send, label: "X / Telegram", href: "https://t.me" },
  ];

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--background-subtle)]/30 dark:bg-[#07090f]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid gap-12 xl:grid-cols-[1fr_2.2fr] pb-12 border-b border-[var(--border)]">
          {/* Brand & Mission block */}
          <div className="space-y-6 max-w-sm">
            <Link href={`/${language}`} className="flex items-center gap-2.5 shrink-0">
              <SeorchableLogo className="w-10 h-10" />
              <span className="font-display font-black text-xl tracking-tight text-[var(--text-primary)]">
                {C.brand[language]}
              </span>
            </Link>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-balance">
              {isFa
                ? "رهبر پایش و بهینه‌سازی حضور برندهای پیشرو در اکوسیستم‌های پاسخگوی مبتنی بر هوش مصنوعی و مدل‌های زبانی فردا."
                : "The category-defining AI Search Engine Optimization, GEO, and Brand Intelligence platform for modern corporate enterprises."}
            </p>

            {/* Contacts short info */}
            <div className="space-y-2.5 text-xs text-[var(--text-muted)] font-bold">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#38bdf8]" />
                <span>info@seorchable.ir</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#f97316]" />
                <span>{isFa ? "تهران، پارک فناوری پردیس" : "Tehran, Pardis Technology Park"}</span>
              </div>
            </div>

            {/* Social channels grid */}
            <div className="flex items-center gap-2 pt-2">
              {socialChannels.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid place-items-center w-9 h-9 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--border)] transition-all hover:scale-[1.03]"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Grid of 6 navigation columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerGroups.map((col) => (
              <nav key={col.heading} className="space-y-4">
                <h3 className="font-display font-black text-sm text-[var(--text-primary)] tracking-wide">
                  {col.heading}
                </h3>
                <ul className="space-y-3 text-xs font-bold">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-secondary)] hover:text-[#38bdf8] transition-colors inline-flex items-center gap-1 group cursor-pointer"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[var(--text-secondary)] hover:text-[#38bdf8] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black font-mono tracking-widest">{link.badge}</span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom copyright & system status banner */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-[var(--text-muted)] font-medium">
            © {new Date().getFullYear()} {C.brand[language]}.{" "}
            {isFa ? "تمامی حقوق مادی و معنوی محفوظ است." : "All rights reserved. BrandGraph / seorchable.ir"}
          </span>
          <div className="flex items-center gap-4 text-[var(--text-muted)] font-bold">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500">
              <ShieldCheck size={14} className="animate-pulse" />
              {isFa ? "تمام کانال‌های انتقال امن و برقرار" : "Enterprise System Channels Secure"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
