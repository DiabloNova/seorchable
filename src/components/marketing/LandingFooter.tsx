"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Globe,
  AtSign,
  Send,
  Code2,
  Rss,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";
import { SeorchableLogo } from "./SeorchableLogo";

/**
 * Full enterprise footer — 5 link-column groups, social links, status badge,
 * and a bottom-bar with legal copy. Built without any new packages.
 */
export function LandingFooter() {
  const { language } = useTheme();
  const isFa = language === "fa";
  const l = language;

  const columns = [
    {
      heading: isFa ? "پلتفرم" : "Platform",
      links: [
        { label: isFa ? "پایش دیده‌شدن هوش مصنوعی" : "AI Visibility Monitoring", href: `/${l}/platform/ai-visibility` },
        { label: isFa ? "هوش برند" : "Brand Intelligence", href: `/${l}/platform/brand-intelligence` },
        { label: isFa ? "ردیابی استنادهای هوش مصنوعی" : "AI Citation Tracking", href: `/${l}/platform/citation-tracking` },
        { label: isFa ? "تحلیل رقبا" : "Competitor Analysis", href: `/${l}/platform/competitor-analysis` },
        { label: isFa ? "بهینه‌سازی GEO" : "GEO Optimization", href: `/${l}/platform/geo` },
        { label: isFa ? "تحلیل‌های جستجوی هوش مصنوعی" : "AI Search Analytics", href: `/${l}/platform/analytics` },
      ],
    },
    {
      heading: isFa ? "راهکارها" : "Solutions",
      links: [
        { label: isFa ? "محافظت از برند" : "Brand Protection", href: `/${l}/solutions/protection` },
        { label: isFa ? "بهینه‌سازی AEO" : "AEO Optimization", href: `/${l}/solutions/aeo` },
        { label: isFa ? "یکپارچه‌سازی گراف دانش" : "Knowledge Graph", href: `/${l}/solutions/knowledge-graph` },
        { label: isFa ? "برای سازمان‌ها" : "Enterprise", href: `/${l}/solutions/enterprise` },
        { label: isFa ? "برای آژانس‌ها" : "For Agencies", href: `/${l}/solutions/agencies` },
      ],
    },
    {
      heading: isFa ? "مستندات" : "Documentation",
      links: [
        { label: isFa ? "شروع سریع" : "Getting Started", href: `/${l}/docs/getting-started` },
        { label: isFa ? "مرجع API" : "API Reference", href: `/${l}/docs/api` },
        { label: isFa ? "راهنمای یکپارچه‌سازی" : "Integration Guides", href: `/${l}/docs/integrations` },
        { label: isFa ? "آموزش‌ها" : "Tutorials", href: `/${l}/docs/tutorials` },
        { label: isFa ? "بهترین شیوه‌ها" : "Best Practices", href: `/${l}/docs/best-practices` },
        { label: isFa ? "گزارش تغییرات" : "Changelog", href: `/${l}/docs/changelog` },
      ],
    },
    {
      heading: isFa ? "شرکت" : "Company",
      links: [
        { label: isFa ? "درباره ما" : "About Us", href: `/${l}/about` },
        { label: isFa ? "وبلاگ" : "Blog", href: `/${l}/blog` },
        { label: isFa ? "مطبوعات" : "Press", href: `/${l}/press` },
        { label: isFa ? "شغل‌ها" : "Careers", href: `/${l}/careers` },
        { label: isFa ? "شرکا" : "Partners", href: `/${l}/partners` },
        { label: isFa ? "تماس با ما" : "Contact Us", href: `/${l}/contact` },
      ],
    },
    {
      heading: isFa ? "قانونی و منابع" : "Resources & Legal",
      links: [
        { label: isFa ? "قیمت‌گذاری" : "Pricing", href: `/${l}/pricing` },
        { label: isFa ? "مطالعات موردی" : "Case Studies", href: `/${l}/resources/case-studies` },
        { label: isFa ? "وبینار‌ها" : "Webinars", href: `/${l}/resources/webinars` },
        { label: isFa ? "حریم خصوصی" : "Privacy Policy", href: `/${l}/privacy` },
        { label: isFa ? "شرایط استفاده" : "Terms of Service", href: `/${l}/terms` },
        { label: isFa ? "امنیت" : "Security", href: `/${l}/security` },
      ],
    },
  ];

  const socials = [
    { icon: Globe, label: "Website", href: "#" },
    { icon: AtSign, label: "LinkedIn", href: "#" },
    { icon: Send, label: "X (Twitter)", href: "#" },
    { icon: Code2, label: "GitHub", href: "#" },
    { icon: Rss, label: "Blog RSS", href: "#" },
  ];

  return (
    <footer className="mt-12 border-t border-[var(--border)]">
      {/* Newsletter / final CTA band */}
      <div className="bg-[var(--muted-surface)]/40 border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-start">
            <h3 className="font-display font-black text-lg text-[var(--text-primary)]">
              {isFa ? "اولین نفری باشید که بروزرسانی‌ها را دریافت می‌کنید" : "Stay ahead with AI search insights"}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {isFa ? "خبرنامه هفتگی ما را دریافت کنید." : "Subscribe to our weekly digest on AI visibility & GEO."}
            </p>
          </div>
          <form
            className="flex w-full max-w-sm gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label={isFa ? "فرم اشتراک خبرنامه" : "Newsletter subscription form"}
          >
            <input
              type="email"
              placeholder={isFa ? "ایمیل شما" : "your@company.com"}
              aria-label={isFa ? "آدرس ایمیل" : "Email address"}
              className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-[var(--radius-full)] bg-[var(--card)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary-600)] transition-colors"
            />
            <button
              type="submit"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white text-sm font-bold hover:scale-[1.03] active:scale-[0.98] transition-transform"
              aria-label={isFa ? "اشتراک" : "Subscribe"}
            >
              <Sparkles size={13} />
              <span>{isFa ? "اشتراک" : "Subscribe"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main link grid */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_repeat(5,1fr)]">
          {/* Brand block */}
          <div className="space-y-5">
            <Link href={`/${l}`} className="flex items-center gap-2.5" aria-label="Seorchable home">
              <SeorchableLogo className="w-9 h-9" />
              <span className="font-display font-black text-lg text-[var(--text-primary)]">
                {C.brand[language]}
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[240px] text-pretty">
              {isFa
                ? "پلتفرم هوشمند پایش دیده‌شدن برند در موتورهای جستجوی هوش مصنوعی و مدل‌های زبانی بزرگ."
                : "The enterprise platform for AI visibility monitoring, brand intelligence, and GEO optimization across LLMs."}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid place-items-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--border)] transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href={`/${l}/audit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-full)] bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white text-xs font-bold shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              <Sparkles size={12} />
              <span>{isFa ? "شروع ممیزی رایگان" : "Start Free Audit"}</span>
              <ArrowRight size={12} className="rtl:-scale-x-100" />
            </Link>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-primary-600)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-[var(--text-muted)]">
            <span>
              © {new Date().getFullYear()} {C.brand[language]}.{" "}
              {isFa ? "تمامی حقوق محفوظ است." : "All rights reserved."}
            </span>
            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>
            <Link href={`/${l}/privacy`} className="hover:text-[var(--text-secondary)] transition-colors">
              {isFa ? "حریم خصوصی" : "Privacy"}
            </Link>
            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>
            <Link href={`/${l}/terms`} className="hover:text-[var(--text-secondary)] transition-colors">
              {isFa ? "شرایط استفاده" : "Terms"}
            </Link>
            <span className="hidden sm:inline text-[var(--border-strong)]">·</span>
            <Link href={`/${l}/security`} className="hover:text-[var(--text-secondary)] transition-colors">
              {isFa ? "امنیت" : "Security"}
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-[var(--color-success)]">
              <ShieldCheck size={13} />
              {isFa ? "تمامی سامانه‌ها ایمن و برقرار" : "All systems operational"}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isFa ? "آپ‌تایم ۹۹.۹٪" : "99.9% uptime"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
