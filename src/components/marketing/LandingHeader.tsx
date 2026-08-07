"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Languages, Receipt, ChevronDown, Sparkles, LogIn } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { marketingContent as C } from "./content";
import { SeorchableLogo } from "./SeorchableLogo";
import { Dropdown } from "@/components/Dropdown";

/**
 * Enterprise-grade Sticky navigation bar with advanced dropdown selectors,
 * mapped to the product-first flow sections (Platform, Solutions, Comparison, Trust, Pricing, Docs, Resources).
 */
export function LandingHeader() {
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const isFa = language === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solutionsItems = [
    { label: isFa ? "بهینه‌سازی GEO" : "GEO Optimization", value: "geo", href: `/${language}/solutions/geo` },
    { label: isFa ? "بهینه‌سازی پاسخ‌ها AEO" : "AEO Optimization", value: "aeo", href: `/${language}/solutions/aeo` },
    { label: isFa ? "محافظت از برند" : "Brand Protection", value: "protection", href: `/${language}/solutions/protection` },
    { label: isFa ? "رادار تحلیل رقابتی" : "Competitive Radar", value: "radar", href: `/${language}/solutions/radar` },
  ];

  const platformItems = [
    { label: isFa ? "معماری اکوسیستم" : "Ecosystem Architecture", value: "ecosystem", href: `/${language}/#ecosystem` },
    { label: isFa ? "بررسی کلان پلتفرم" : "Platform Overview", value: "overview", href: `/${language}/#overview` },
    { label: isFa ? "داستان چرخه محصول" : "Product Lifecycle Story", value: "story", href: `/${language}/#story` },
    { label: isFa ? "پیش‌نمایش داشبوردها" : "Interactive Dashboard Sim", value: "dashboards", href: `/${language}/#dashboards` },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
      <div
        className={`mx-auto max-w-7xl flex items-center justify-between gap-3 rounded-[var(--radius-full)] px-3 sm:px-6 h-16 transition-all duration-300 ${
          scrolled || true
            ? "glass-panel border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-md"
            : "border border-transparent bg-transparent"
        }`}
      >
        {/* Brand & Logo */}
        <Link href={`/${language}`} className="flex items-center gap-2.5 shrink-0">
          <SeorchableLogo className="w-9 h-9" />
          <span className="font-display font-black text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
            {C.brand[language]}
          </span>
        </Link>

        {/* Enterprise-grade Nav Menu */}
        <nav className="hidden xl:flex items-center gap-2">
          {/* Platform Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-[var(--radius-md)]">
                <span>{isFa ? "پلتفرم" : "Platform"}</span>
                <ChevronDown size={14} />
              </button>
            }
            items={platformItems.map((item) => ({
              label: item.label,
              value: item.value,
              onClick: () => { window.location.href = item.href; }
            }))}
          />

          {/* Solutions Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-[var(--radius-md)]">
                <span>{isFa ? "راهکارها" : "Solutions"}</span>
                <ChevronDown size={14} />
              </button>
            }
            items={solutionsItems.map((item) => ({
              label: item.label,
              value: item.value,
              onClick: () => { window.location.href = item.href; }
            }))}
          />

          {/* Comparison table link */}
          <a
            href={`/${language}/#why-different`}
            className="px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
          >
            {isFa ? "تمایز ما" : "Why Us"}
          </a>

          {/* Pricing Link */}
          <a
            href={`/${language}/#pricing`}
            className="px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
          >
            {isFa ? "تعرفه‌ها" : "Pricing"}
          </a>

          {/* Documentation Section (Opens in new browser tab) */}
          <Link
            href={`/${language}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors flex items-center gap-1"
          >
            <span>{isFa ? "مستندات فنی" : "Documentation"}</span>
            <span className="text-[9px] bg-[var(--sky-blue-500)]/20 text-[var(--sky-blue-500)] px-1.5 py-0.5 rounded font-black font-mono">NEW</span>
          </Link>

          {/* Resources */}
          <Link
            href={`/${language}/#resources`}
            className="px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
          >
            {isFa ? "منابع" : "Resources"}
          </Link>

          {/* About */}
          <Link
            href={`/${language}/about`}
            className="px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
          >
            {isFa ? "درباره ما" : "About"}
          </Link>
        </nav>

        {/* Global Configuration Controls + Toggles + CTA */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLanguage(isFa ? "en" : "fa")}
            aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
            className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors text-xs font-bold border border-[var(--glass-border)]"
          >
            <Languages size={15} />
            <span className="font-mono">{isFa ? "EN" : "FA"}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
            className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--glass-border)] transition-colors"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Invoice Icon placed right next to Language and Theme Toggles */}
          <Link
            href={`/${language}/invoice`}
            aria-label={isFa ? "پرداخت صورتحساب" : "Invoice Payment"}
            className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] border border-[var(--glass-border)] transition-colors"
          >
            <Receipt size={15} />
          </Link>

          {/* Separator */}
          <span className="hidden sm:inline h-6 w-px bg-[var(--glass-border)]" />

          {/* Enterprise Action CTA Buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/${language}/dashboard`}>
              <button className="px-4 h-9 text-xs font-bold rounded-[var(--radius-md)] border border-[var(--glass-border)] hover:bg-[var(--muted-surface)] text-[var(--text-primary)] transition-all flex items-center gap-1.5">
                <LogIn size={14} />
                <span>{isFa ? "ورود" : "Login"}</span>
              </button>
            </Link>

            <Link href={`/${language}/#audit`} className="hidden sm:inline-block">
              <button className="relative overflow-hidden group px-4 h-9 text-xs font-bold rounded-[var(--radius-md)] text-white bg-gradient-to-r from-[#38bdf8] to-[#f97316] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5">
                <Sparkles size={13} className="animate-pulse" />
                <span>{isFa ? "آنالیز رایگان" : "Free Audit"}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
