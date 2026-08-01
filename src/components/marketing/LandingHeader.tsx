"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Languages, Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { marketingContent as C } from "./content";

/**
 * Sticky glassmorphic navigation bar with theme + language toggles and a
 * scroll-aware backdrop. Supports full corporate multi-page routing with zero dead links.
 */
export function LandingHeader() {
  const { session } = useAuth();
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isFa = language === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { key: "platform", href: `/${language}/platform` },
    { key: "solutions", href: `/${language}/solutions` },
    { key: "pricing", href: `/${language}/pricing` },
    { key: "documentation", href: `/${language}/documentation` },
    { key: "resources", href: `/${language}/resources` },
    { key: "about", href: `/${language}/about` },
    { key: "contact", href: `/${language}/contact` },
  ] as const;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
      <div
        className={`mx-auto max-w-6xl flex items-center justify-between gap-3 rounded-[var(--radius-full)] px-3 sm:px-5 h-14 transition-all duration-300 ${
          scrolled || menuOpen
            ? "glass-panel border border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-md shadow-lg"
            : "border border-transparent"
        }`}
      >
        {/* Brand */}
        <Link href={`/${language}`} className="flex items-center gap-2.5 shrink-0">
          <span className="relative grid place-items-center w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-600)] text-white glow-ring">
            <Sparkles size={18} />
          </span>
          <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
            {C.brand[language]}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="px-3 py-1.5 text-xs xl:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)]/50 rounded-[var(--radius-md)] transition-colors"
            >
              {C.nav[item.key][language]}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage(isFa ? "en" : "fa")}
            aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
            className="inline-flex items-center gap-1 h-9 px-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors text-xs font-semibold cursor-pointer"
          >
            <Languages size={15} />
            <span>{isFa ? "EN" : "فا"}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
            className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link href={`/${language}/dashboard`} className="hidden sm:inline-block">
            <Button size="sm" variant="primary" className="font-bold text-xs">
              {session.status === "authenticated"
                ? C.cta.workspace[language]
                : C.cta.console[language]}
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="lg:hidden mx-auto max-w-6xl mt-2 p-4 rounded-2xl glass-panel border border-[var(--glass-border)] bg-[var(--background)]/95 backdrop-blur-lg shadow-xl animate-fade-in flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] rounded-xl transition-colors"
            >
              {C.nav[item.key][language]}
            </Link>
          ))}
          <div className="h-px bg-[var(--border)] my-1" />
          <Link
            href={`/${language}/dashboard`}
            onClick={() => setMenuOpen(false)}
            className="w-full text-center"
          >
            <Button size="lg" variant="primary" className="w-full font-bold">
              {session.status === "authenticated"
                ? C.cta.workspace[language]
                : C.cta.console[language]}
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
