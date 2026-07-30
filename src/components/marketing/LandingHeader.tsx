"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Languages, Sparkles } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { marketingContent as C } from "./content";

/**
 * Sticky glassmorphic navigation bar with theme + language toggles and a
 * scroll-aware backdrop.
 */
export function LandingHeader() {
  const { session } = useAuth();
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const isFa = language === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { key: "features", href: "#features" },
    { key: "platforms", href: "#platforms" },
    { key: "process", href: "#process" },
    { key: "metrics", href: "#metrics" },
  ] as const;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
      <div
        className={`mx-auto max-w-6xl flex items-center justify-between gap-3 rounded-[var(--radius-full)] px-3 sm:px-5 h-14 transition-all duration-300 ${
          scrolled
            ? "glass-panel border border-[var(--glass-border)]"
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

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
            >
              {C.nav[item.key][language]}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setLanguage(isFa ? "en" : "fa")}
            aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
            className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors text-xs font-semibold"
          >
            <Languages size={16} />
            <span>{isFa ? "EN" : "فا"}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
            className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link href={`/${language}/dashboard`} className="hidden sm:inline-block">
            <Button size="sm" variant="primary" className="font-bold">
              {session.status === "authenticated"
                ? C.cta.workspace[language]
                : C.cta.console[language]}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
