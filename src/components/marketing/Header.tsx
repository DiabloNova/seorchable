"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Languages, Receipt, ChevronDown, Sparkles, LogIn, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SeorchableLogo } from "./SeorchableLogo";
import { Dropdown } from "@/components/Dropdown";
import AppSidebar from "@/components/navigation/AppSidebar";

/**
 * Enterprise-grade Sticky navigation bar with advanced adjacent Hamburger selector and sliding drawer.
 * Polished, minimal, and Apple-like B2B SaaS aesthetic.
 */
export function Header() {
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    { label: isFa ? "همه راهکارها" : "All Solutions", value: "solutions", href: `/${language}/solutions` },
  ];

  const platformItems = [
    { label: isFa ? "قابلیت‌های پلتفرم" : "Features", value: "features", href: `/${language}/features` },
    { label: isFa ? "صنایع هدف" : "Industries", value: "industries", href: `/${language}/industries` },
    { label: isFa ? "معماری اکوسیستم" : "Ecosystem Architecture", value: "ecosystem", href: `/${language}/#ecosystem` },
    { label: isFa ? "بررسی کلان پلتفرم" : "Platform Overview", value: "overview", href: `/${language}/#overview` },
    { label: isFa ? "داستان چرخه محصول" : "Product Lifecycle Story", value: "story", href: `/${language}/#story` },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
        {/* Mobile: Hamburger Button */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={isFa ? "باز کردن منوی ناوبری" : "Open navigation menu"}
          className={`xl:hidden h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 cursor-pointer shrink-0 ${
            scrolled
              ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm text-zinc-600 dark:text-zinc-400"
              : "bg-transparent border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Menu size={20} />
        </button>

        {/* Floating Navigation Bar */}
        <div
          className={`flex-1 flex items-center justify-between gap-4 rounded-full px-4 sm:px-6 h-14 transition-all duration-500 ease-out ${
            scrolled
              ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
              : "bg-transparent border-transparent"
          }`}
        >
          {/* Brand & Logo */}
          <Link
            href={`/${language}`}
            aria-label={isFa ? "صفحه نخست سئورچبل" : "Seorchable Homepage"}
            className="flex items-center justify-center shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-zinc-500/40 focus-visible:outline-none outline-none group"
          >
            <SeorchableLogo className="w-9 h-9 transition-transform duration-500 group-hover:scale-110" monochrome={true} />
            <span className="ml-3 hidden sm:inline-block font-display font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:opacity-80 transition-opacity">
              {isFa ? "سئورچبل" : "Seorchable"}
            </span>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <nav className="hidden xl:flex items-center gap-1">
            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                  <span>{isFa ? "پلتفرم" : "Platform"}</span>
                  <ChevronDown size={14} className="opacity-70" />
                </button>
              }
              items={platformItems.map((item) => ({
                label: item.label,
                value: item.value,
                onClick: () => { window.location.href = item.href; }
              }))}
            />

            <Dropdown
              trigger={
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                  <span>{isFa ? "راهکارها" : "Solutions"}</span>
                  <ChevronDown size={14} className="opacity-70" />
                </button>
              }
              items={solutionsItems.map((item) => ({
                label: item.label,
                value: item.value,
                onClick: () => { window.location.href = item.href; }
              }))}
            />

            <a
              href={`/${language}/#pricing`}
              className="px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              {isFa ? "تعرفه‌ها" : "Pricing"}
            </a>

            <Link
              href={`/${language}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors flex items-center gap-1.5"
            >
              <span>{isFa ? "مستندات" : "Docs"}</span>
            </Link>
          </nav>

          {/* Desktop Right Actions (Hidden on Mobile, except login/audit icons if desired, but we hide all secondary on mobile) */}
          <div className="hidden xl:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 rtl:ml-2 rtl:mr-0 border-r border-zinc-200 dark:border-zinc-800 pr-3 rtl:pl-3 rtl:pr-0">
              <button
                type="button"
                onClick={() => setLanguage(isFa ? "en" : "fa")}
                aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
                className="grid place-items-center w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <Languages size={15} />
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
                className="grid place-items-center w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <Link href={`/${language}/dashboard`}>
              <button className="px-4 py-2 text-sm font-medium rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center gap-2">
                <LogIn size={15} />
                <span>{isFa ? "ورود" : "Log in"}</span>
              </button>
            </Link>

            <Link href={`/${language}/#free-audit`}>
              <button className="px-5 py-2 text-sm font-semibold rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2">
                <Sparkles size={14} className="opacity-80" />
                <span>{isFa ? "شروع رایگان" : "Start Free"}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AppSidebar mobileOpen={drawerOpen} setMobileOpen={setDrawerOpen} hideToggle={true} />
    </header>
  );
}
