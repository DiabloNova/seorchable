"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Languages, Sun, Moon, Receipt, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { SeorchableLogo } from "@/components/marketing/SeorchableLogo";
import { DocumentationSidebar } from "./DocumentationSidebar";
import { SearchResults } from "./SearchResults";
import type { DocumentationCategory, DocumentationArticle } from "@/lib/docsService";
import { DocsSearchClient } from "@/lib/docsSearchClient";
import { usePathname } from "next/navigation";

interface DocumentationLayoutProps {
  children: React.ReactNode;
  categories: DocumentationCategory[];
  activeSlug: string;
  locale: "en" | "fa";
}

export function DocumentationLayout({
  children,
  categories,
  activeSlug,
  locale,
}: DocumentationLayoutProps) {
  const { theme, setTheme, setLanguage } = useTheme();
  const isFa = locale === "fa";
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocumentationArticle[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearchFocused, setGlobalSearchFocused] = useState(false);

  // Compute active slug dynamically on client if not provided
  const segments = pathname ? pathname.split("/") : [];
  const docsIndex = segments.indexOf("docs");
  const computedActiveSlug = activeSlug || (docsIndex !== -1 && segments[docsIndex + 1] ? segments[docsIndex + 1] : "");

  // Search results updater
  React.useEffect(() => {
    let active = true;
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    DocsSearchClient.search(searchQuery, locale).then((results) => {
      if (active) {
        setSearchResults(results);
      }
    });

    return () => {
      active = false;
    };
  }, [searchQuery, locale]);

  const handleLangToggle = () => {
    const nextLang = locale === "fa" ? "en" : "fa";
    setLanguage(nextLang);
    const pathParts = window.location.pathname.split("/");
    pathParts[1] = nextLang;
    window.location.pathname = pathParts.join("/");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative" dir={isFa ? "rtl" : "ltr"}>
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 h-16 w-full glass-panel border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between text-[var(--text-primary)]">
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 border border-white/5"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo & title */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <SeorchableLogo className="w-8 h-8" />
            <span className="font-display font-black text-sm sm:text-base tracking-tight text-[var(--text-primary)]">
              {isFa ? "مستندات سئورچبل" : "Seorchable Docs"}
            </span>
          </Link>
        </div>

        {/* Global Search Component */}
        <div className="hidden sm:block relative max-w-md w-full mx-8">
          <div className="relative">
            <Search size={14} className="absolute start-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setGlobalSearchFocused(true)}
              onBlur={() => setTimeout(() => setGlobalSearchFocused(false), 200)}
              placeholder={isFa ? "جستجوی پیشرفته در مستندات... (مثال: RLS)" : "Advanced search... (e.g. RLS)"}
              className="w-full ps-10 pe-4 py-2 text-xs rounded-xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 focus:border-[var(--sky-blue-500)] focus:bg-white/[0.05] outline-none text-[var(--text-primary)] placeholder:text-slate-500 transition-all shadow-inner"
            />
          </div>

          {/* Real-time search results drop */}
          <AnimatePresence>
            {globalSearchFocused && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 right-0 z-50 rounded-2xl glass-panel border border-[var(--glass-border)] bg-slate-950/95 shadow-2xl overflow-hidden"
              >
                <SearchResults
                  results={searchResults}
                  locale={locale}
                  query={searchQuery}
                  onSelect={() => setSearchQuery("")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Configuration controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={handleLangToggle}
            className="h-9 px-2.5 rounded-xl border border-[var(--glass-border)] text-xs font-bold hover:bg-white/5 flex items-center gap-1"
            title={isFa ? "Switch to English" : "تغییر به فارسی"}
          >
            <Languages size={14} />
            <span className="font-mono">{locale.toUpperCase()}</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl border border-[var(--glass-border)] hover:bg-white/5 flex items-center justify-center"
            title={isFa ? "تغییر پوسته" : "Toggle theme"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Invoices */}
          <Link
            href={`/${locale}/invoice`}
            className="w-9 h-9 rounded-xl border border-[var(--glass-border)] hover:bg-white/5 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Receipt size={14} />
          </Link>
        </div>
      </header>

      {/* 2. BODY SECTION (Layout Sidebar + Main Grid) */}
      <div className="flex-1 flex flex-col md:flex-row w-full relative">
        {/* MOBILE DRAWER SIDEBAR */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex" dir={isFa ? "rtl" : "ltr"}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: isFa ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: isFa ? "100%" : "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute inset-y-0 start-0 w-80 max-w-[85vw] flex flex-col z-50 shadow-2xl h-full"
              >
                <DocumentationSidebar
                  categories={categories}
                  activeSlug={computedActiveSlug}
                  locale={locale}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onItemClick={() => setMobileSidebarOpen(false)}
                />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 h-[calc(100vh-4rem)] sticky top-16 shrink-0 overflow-hidden">
          <DocumentationSidebar
            categories={categories}
            activeSlug={computedActiveSlug}
            locale={locale}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </aside>

        {/* MAIN CONTAINER (Content + Right Sidebar Column) */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
          {/* Main content viewport */}
          <main className="flex-1 p-6 sm:p-8 lg:p-12 max-w-3xl w-full mx-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
