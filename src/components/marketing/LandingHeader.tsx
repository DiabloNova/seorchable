"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Languages, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { marketingContent as C } from "./content";

const NAV_ITEMS = [
  { key: "features", href: "#features" },
  { key: "platforms", href: "#platforms" },
  { key: "process", href: "#process" },
  { key: "metrics", href: "#metrics" },
] as const;

/**
 * Sticky glassmorphic navigation bar with theme + language toggles, a
 * scroll-aware backdrop, and a premium full-screen overlay menu for
 * tablet / mobile. The overlay is mounted only while open (via
 * AnimatePresence), so it never intercepts pointer events when closed.
 */
export function LandingHeader() {
  const { session } = useAuth();
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isFa = language === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const ctaLabel =
    session.status === "authenticated"
      ? C.cta.workspace[language]
      : C.cta.console[language];

  // Slide the panel in from the trailing edge (respecting RTL).
  const panelX = isFa ? "-100%" : "100%";

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: 0.12 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

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
        <Link
          href={`/${language}`}
          className="flex items-center gap-2.5 shrink-0 group"
          onClick={() => setMenuOpen(false)}
        >
          <span className="relative grid place-items-center w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-600)] text-white glow-ring transition-transform duration-300 group-hover:scale-105">
            <Sparkles size={18} />
          </span>
          <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
            {C.brand[language]}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="group relative px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {C.nav[item.key][language]}
              <span className="pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-[var(--color-primary-600)] transition-transform duration-300 group-hover:scale-x-100" />
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
              {ctaLabel}
            </Button>
          </Link>

          {/* Hamburger — tablet & mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={C.menu.open[language]}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="lg:hidden grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ---------- Premium overlay menu ---------- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={C.menu.label[language]}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label={C.menu.close[language]}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-[color-mix(in_srgb,var(--background)_55%,transparent)] backdrop-blur-xl"
              variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />

            {/* Sliding panel */}
            <motion.div
              className="absolute inset-y-0 end-0 flex h-full w-full max-w-md flex-col overflow-y-auto glass-strong border-s border-[var(--glass-border)] px-6 pt-5 pb-10 sm:px-8"
              variants={{
                closed: { x: reduceMotion ? 0 : panelX, opacity: reduceMotion ? 0 : 1 },
                open: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-600)] text-white">
                    <Sparkles size={18} />
                  </span>
                  <span className="font-display font-extrabold text-lg tracking-tight text-[var(--text-primary)]">
                    {C.brand[language]}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={C.menu.close[language]}
                  className="grid place-items-center w-10 h-10 rounded-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Large nav links */}
              <motion.nav
                className="mt-10 flex flex-col"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    variants={itemVariants}
                    className="group flex items-center justify-between border-b border-[var(--border)] py-4 text-3xl font-display font-bold tracking-tight text-[var(--text-primary)] transition-colors hover:text-[var(--color-primary-600)]"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="text-xs font-mono font-medium text-[var(--text-muted)] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {C.nav[item.key][language]}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className="text-[var(--text-muted)] transition-all duration-300 group-hover:text-[var(--color-primary-600)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </motion.a>
                ))}
              </motion.nav>

              {/* Footer: CTA + tagline */}
              <motion.div
                className="mt-auto pt-10"
                variants={itemVariants}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/${language}/dashboard`}
                  onClick={() => setMenuOpen(false)}
                  className="block"
                >
                  <Button size="lg" variant="primary" className="w-full font-bold">
                    {ctaLabel}
                    <ArrowUpRight size={18} />
                  </Button>
                </Link>
                <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)] text-pretty">
                  {C.menu.tagline[language]}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
