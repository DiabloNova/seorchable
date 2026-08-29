cat << 'INNER_EOF' > src/components/marketing/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, ChevronDown, Languages, Sun, Moon, LogIn, Sparkles, Receipt, X } from "lucide-react";
import { SeorchableLogo } from "@/components/ui/SeorchableLogo";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dropdown from "@/components/ui/Dropdown";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  // Using an explicit locale switch mechanism if custom context is missing.
  // In a real app we might read from pathname.
  const [language, setLanguage] = useState("fa");
  const isFa = language === "fa";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const solutionsItems = [
    { label: isFa ? "برای مدیران سئو" : "For SEO Managers", value: "seo-managers", href: `/${language}/solutions/seo-managers` },
    { label: isFa ? "برای مدیران برند" : "For Brand Managers", value: "brand-managers", href: `/${language}/solutions/brand-managers` },
    { label: isFa ? "برای آژانس‌ها" : "For Agencies", value: "agencies", href: `/${language}/solutions/agencies` },
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
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
      {/* Outer Flex Container for Menu Button + Floating Navigation Bar */}
      <div className="mx-auto max-w-7xl flex items-center gap-3">
        {/* Navigation Menu Button - Perfectly adjacent and matches glassmorphism */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={isFa ? "باز کردن منوی ناوبری" : "Open navigation menu"}
          className={`h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center rounded-2xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:border-slate-400/40 focus:ring-2 focus:ring-slate-500/20 cursor-pointer shrink-0 ${
            scrolled || true
              ? "glass-panel border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              : "border-transparent bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Menu size={20} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300" />
        </button>

        {/* Floating Navigation Bar - Reduced slightly on the left to fit the adjacent menu button */}
        <div
          className={`flex-1 flex items-center justify-between gap-3 rounded-2xl px-3 sm:px-6 h-14 sm:h-16 transition-all duration-300 ${
            scrolled || true
              ? "glass-panel border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-sm"
              : "border border-transparent bg-transparent"
          }`}
        >
          {/* Brand & Logo */}
          <Link
            href={`/${language}`}
            aria-label={isFa ? "صفحه نخست سئورچبل" : "Seorchable Homepage"}
            className="flex items-center justify-center shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:outline-none outline-none"
          >
            <SeorchableLogo className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 hover:scale-[1.05] text-slate-800 dark:text-slate-200" />
          </Link>

          {/* Enterprise-grade Nav Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Platform Dropdown */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50">
                  <span>{isFa ? "پلتفرم" : "Platform"}</span>
                  <ChevronDown size={14} className="opacity-50" />
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
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50">
                  <span>{isFa ? "راهکارها" : "Solutions"}</span>
                  <ChevronDown size={14} className="opacity-50" />
                </button>
              }
              items={solutionsItems.map((item) => ({
                label: item.label,
                value: item.value,
                onClick: () => { window.location.href = item.href; }
              }))}
            />

            {/* Pricing Link */}
            <a
              href={`/${language}/#pricing`}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              {isFa ? "تعرفه‌ها" : "Pricing"}
            </a>

            {/* Documentation Section (Opens in new browser tab) */}
            <Link
              href={`/${language}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <span>{isFa ? "مستندات" : "Docs"}</span>
              <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium font-mono">API</span>
            </Link>
          </nav>

          {/* Global Configuration Controls + Toggles + CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLanguage(isFa ? "en" : "fa")}
              aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Languages size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Separator */}
            <span className="h-4 w-px bg-[var(--glass-border)] mx-1" />

            {/* Enterprise Action CTA Buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/${language}/dashboard`}>
                <button className="px-4 h-9 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1.5">
                  <LogIn size={14} />
                  <span>{isFa ? "ورود" : "Login"}</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile CTA (Hidden on SM and up) - Ultra minimal */}
          <div className="sm:hidden flex items-center">
             <Link href={`/${language}/dashboard`}>
                <button className="px-4 h-9 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1.5">
                  <span>{isFa ? "ورود" : "Login"}</span>
                </button>
              </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay / Bottom Sheet implementation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-slate-950/40 backdrop-blur-sm sm:hidden animate-in fade-in duration-200">
           <div className="absolute inset-0" onClick={() => setDrawerOpen(false)} />
           <div className="relative w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl p-6 pb-12 animate-in slide-in-from-bottom-full duration-300">

              <div className="flex items-center justify-between mb-8">
                 <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
                    {isFa ? "منوی ناوبری" : "Navigation"}
                 </h2>
                 <button
                   onClick={() => setDrawerOpen(false)}
                   className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                 >
                    <X size={20} />
                 </button>
              </div>

              <div className="space-y-6">
                 {/* Quick Actions */}
                 <div className="flex items-center justify-around p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
                    <button
                      onClick={() => { setLanguage(isFa ? "en" : "fa"); }}
                      className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                         <Languages size={18} />
                      </div>
                      <span className="text-xs font-medium">{isFa ? "تغییر زبان" : "Language"}</span>
                    </button>

                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                         {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                      </div>
                      <span className="text-xs font-medium">{isFa ? "پوسته روشن" : "Theme"}</span>
                    </button>

                    <Link
                      href={`/${language}/invoice`}
                      className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                         <Receipt size={18} />
                      </div>
                      <span className="text-xs font-medium">{isFa ? "صورتحساب" : "Billing"}</span>
                    </Link>
                 </div>

                 {/* Navigation Links */}
                 <nav className="space-y-1">
                    <a href={`/${language}/features`} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                       {isFa ? "قابلیت‌های پلتفرم" : "Platform Features"}
                    </a>
                    <a href={`/${language}/#pricing`} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                       {isFa ? "تعرفه‌ها" : "Pricing"}
                    </a>
                    <a href={`/${language}/docs`} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                       {isFa ? "مستندات توسعه‌دهندگان" : "API Documentation"}
                    </a>
                    <a href={`/${language}/contact`} className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                       {isFa ? "تماس با پشتیبانی" : "Contact Support"}
                    </a>
                 </nav>

                 <div className="pt-4">
                    <Link href={`/${language}/dashboard`}>
                       <button className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 dark:shadow-white/10 active:scale-[0.98] transition-transform">
                          <LogIn size={18} />
                          <span>{isFa ? "ورود به حساب کاربری" : "Sign In to Dashboard"}</span>
                       </button>
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Desktop AppSidebar - Only used on non-mobile if needed, but the original component also used it for mobile.
          We'll keep it for desktop edge cases or specific trigger logic, but our new bottom sheet handles mobile gracefully. */}
      <div className="hidden sm:block">
        <AppSidebar mobileOpen={drawerOpen} setMobileOpen={setDrawerOpen} hideToggle={true} />
      </div>
    </header>
  );
}
INNER_EOF
sh update_header.sh
