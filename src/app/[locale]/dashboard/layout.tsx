"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppSidebar from "@/components/navigation/AppSidebar";
import { Button } from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import {
  Menu,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Languages,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, direction, language, setLanguage } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleSetCollapsed = (val: boolean) => {
    setCollapsed(val);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(val));
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "fa" : "en";
    setLanguage(newLang);
    if (pathname) {
      const segments = pathname.split("/");
      if (segments[1] === "en" || segments[1] === "fa") {
        segments[1] = newLang;
        router.push(segments.join("/"));
      } else {
        router.push(`/${newLang}${pathname}`);
      }
    }
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const userDropdownItems = [
    { label: language === "fa" ? "پروفایل کاربری" : "My Profile", value: "profile", onClick: () => router.push(`/${language}/profile`) },
    { label: language === "fa" ? "تنظیمات" : "Settings", value: "settings", onClick: () => router.push(`/${language}/settings`) },
    { label: language === "fa" ? "خروج" : "Sign out", value: "logout" },
  ];

  // No right-side spacing since the menu is a horizontal overlay
  const spacingClasses = "mr-0 ml-0";

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-transparent text-[var(--foreground)] relative overflow-hidden" dir={direction}>
        {/* Ambient Background */}
        <div className="ambient-bg fixed inset-0 -z-10">
          <div className="ambient-orb orb-1" />
          <div className="ambient-orb orb-2" />
        </div>

        {/* Sidebar (Fixed right, full height, RTL layout) */}
        <AppSidebar
          collapsed={collapsed}
          setCollapsed={handleSetCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Layout Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${spacingClasses}`}>
          {/* TOP HEADER */}
          <header className="sticky top-0 z-40 h-16 flex items-center justify-between gap-3 px-4 border-b border-[rgba(148,163,184,0.1)] bg-[rgba(15,23,42,0.3)] backdrop-blur-md">
            {/* Search and Mobile toggle */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-[var(--radius-md)] hover:bg-[var(--muted-surface)] text-[var(--text-secondary)] cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>

              {/* Search bar */}
              <div className="relative hidden sm:flex items-center w-64 lg:w-80">
                <Search size={16} className="absolute start-3 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="search"
                  placeholder={language === "fa" ? "جستجو در اسناد..." : "Search documents..."}
                  className="w-full ps-9 pe-4 py-2 text-xs rounded-xl bg-white/[0.03] border border-[rgba(148,163,184,0.15)] focus:border-[var(--sky-blue-500)]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors"
                />
              </div>
            </div>

            {/* Header Toolbar */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="px-2 cursor-pointer" aria-label="Toggle language">
                <Languages size={16} />
                <span className="uppercase text-xs">{language}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2 cursor-pointer" aria-label="Toggle theme">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.span>
                </AnimatePresence>
              </Button>

              <span className="hidden sm:inline h-6 w-px bg-[rgba(148,163,184,0.1)] mx-1" />

              {/* User Dropdown */}
              <Dropdown
                align="right"
                trigger={
                  <button className="flex items-center gap-2 p-1 pe-2 rounded-[var(--radius-full)] hover:bg-[var(--muted-surface)] transition-colors cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white flex items-center justify-center text-xs font-bold">
                      U
                    </span>
                    <span className="hidden lg:flex flex-col items-start leading-none">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">User Admin</span>
                      <span className="text-[10px] text-[var(--text-muted)]">tehran@brandgraph.ai</span>
                    </span>
                    <ChevronDown size={14} className="hidden lg:inline text-[var(--text-muted)]" />
                  </button>
                }
                items={userDropdownItems}
              />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative z-10">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="h-10 border-t border-[rgba(148,163,184,0.1)] bg-[rgba(15,23,42,0.1)] backdrop-blur-md flex items-center justify-between px-4 text-[10px] text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              <span>{language === "fa" ? "همه سیستم‌ها عملیاتی" : "All systems operational"}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span>{language === "fa" ? "همگام‌سازی: ۱ دقیقه پیش" : "Synced 1m ago"}</span>
              <span>v2.4.0</span>
            </div>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
