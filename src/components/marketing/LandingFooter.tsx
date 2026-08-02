"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Globe, AtSign, Send, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";
import { SeorchableLogo } from "./SeorchableLogo";

/**
 * Enterprise Sitemap Footer for seorchable.ir.
 * Organized into comprehensive, structured columns mapping nearly the entire platform hierarchy,
 * including Platform, Solutions, Documentation, Developers, Resources, Company, Legal, and Support.
 */
export function LandingFooter() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const footerGroups = [
    {
      heading: isFa ? "پلتفرم نرم‌افزاری" : "Platform",
      links: [
        { label: isFa ? "میز فرماندهی هوشمند" : "Command Center", href: `/${language}/dashboard` },
        { label: isFa ? "تحلیل استاندارد برند" : "Standard Brand Audit", href: `/${language}/dashboard/intelligence` },
        { label: isFa ? "گراف دانش سازمانی" : "Enterprise Knowledge Graph", href: `/${language}/dashboard/entities` },
        { label: isFa ? "جستجوی معنایی RAG" : "AI Semantic Discovery", href: `/${language}/dashboard/query` },
        { label: isFa ? "پایش پرومپت‌ها" : "Prompt Monitoring", href: `/${language}/dashboard` },
        { label: isFa ? "آنالیز موتورهای پاسخگو" : "AI Search Analytics", href: `/${language}/dashboard` },
      ],
    },
    {
      heading: isFa ? "راهکارهای سازمانی" : "Solutions",
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
        { label: isFa ? "مفاهیم اساسی پلتفرم" : "Platform Concepts", href: `/${language}/docs/infrastructure-architecture`, external: true },
        { label: isFa ? "راهنمای ساختار REST API" : "REST API Reference", href: `/${language}/docs/ai-pipeline-architecture`, external: true },
        { label: isFa ? "تامین‌کنندگان هوش زبانی" : "AI Providers", href: `/${language}/docs/introduction-to-brandgraph`, external: true },
        { label: isFa ? "امنیت و جداسازی داده" : "Architecture & Security", href: `/${language}/docs/multi-tenant-isolation`, external: true },
      ],
    },
    {
      heading: isFa ? "محیط برنامه‌نویسان" : "Developers",
      links: [
        { label: isFa ? "اسناد مرجع API" : "REST API", href: `/${language}/docs/ai-pipeline-architecture`, external: true },
        { label: isFa ? "مدیریت توکن‌ها و کلید" : "Authentication Tokens", href: `/${language}/docs/multi-tenant-isolation`, external: true },
        { label: isFa ? "هوک‌های وب (Webhooks)" : "Webhooks Stream", href: `/${language}/docs/ai-pipeline-architecture`, external: true },
        { label: isFa ? "کیت‌های توسعه (SDKs)" : "Official SDK Library", href: `/${language}/docs/knowledge-graph-design`, external: true },
      ],
    },
    {
      heading: isFa ? "منابع و وبلاگ" : "Resources",
      links: [
        { label: isFa ? "وبلاگ مهندسی" : "Corporate Blog", href: `/${language}/blog` },
        { label: isFa ? "مطالعات موردی موفقیت" : "Case Studies", href: `/${language}/blog` },
        { label: isFa ? "بنچ‌مارک‌های صنعت" : "Industry Benchmarks", href: `/${language}/blog` },
        { label: isFa ? "نقشه راه محصول" : "Changelog & Roadmap", href: `/${language}/dashboard` },
      ],
    },
    {
      heading: isFa ? "شرکت" : "Company",
      links: [
        { label: isFa ? "درباره ما" : "About Us", href: `/${language}/about` },
        { label: isFa ? "تماس با کارشناسان" : "Contact Sales", href: `/${language}/contact` },
        { label: isFa ? "انطباق و امنیت" : "Compliance Stand", href: `/${language}/privacy` },
      ],
    },
    {
      heading: isFa ? "حقوقی و قوانین" : "Legal",
      links: [
        { label: isFa ? "حریم خصوصی کاربران" : "Privacy Policy", href: `/${language}/privacy` },
        { label: isFa ? "قوانین استفاده از خدمات" : "Terms of Service", href: `/${language}/privacy` },
      ],
    },
    {
      heading: isFa ? "پشتیبانی" : "Support",
      links: [
        { label: isFa ? "وضعیت سامانه‌ها" : "System Status", href: `/${language}/dashboard`, badge: "UP" },
        { label: isFa ? "مرکز راهنمایی" : "Help Center", href: `/${language}/contact` },
        { label: isFa ? "جامعه کاربری" : "Community Hub", href: `/${language}/contact` },
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
        <div className="grid gap-12 xl:grid-cols-[1fr_2.5fr] pb-12 border-b border-[var(--border)]">
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
                ? "اکوسیستم پیشرو مدیریت حضور، بهینه‌سازی موتورهای پاسخگو (GEO & AEO) و مانیتورینگ دیده‌شدن برند در مدل‌های هوش مصنوعی."
                : "The enterprise-defining AI Visibility, Generative Engine Optimization, and conversational search analytics software platform."}
            </p>

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

          {/* Grid of 8 navigation columns (exposing total website hierarchy) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerGroups.map((col) => (
              <nav key={col.heading} className="space-y-4">
                <h3 className="font-display font-black text-sm text-[var(--text-primary)] tracking-wide">
                  {col.heading}
                </h3>
                <ul className="space-y-3 text-xs font-bold">
                  {col.links.map((link) => {
                    const l = link as { label: string; href: string; external?: boolean; badge?: string };
                    return (
                      <li key={l.label}>
                        {l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-secondary)] hover:text-[#38bdf8] transition-colors inline-flex items-center gap-1 group cursor-pointer"
                          >
                            <span>{l.label}</span>
                            <ArrowUpRight size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="text-[var(--text-secondary)] hover:text-[#38bdf8] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{l.label}</span>
                            {l.badge && (
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-black font-mono tracking-widest">{l.badge}</span>
                            )}
                          </Link>
                        )}
                      </li>
                    );
                  })}
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
