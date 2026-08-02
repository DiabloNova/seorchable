"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  Languages,
  Receipt,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  BarChart2,
  Brain,
  Search,
  Globe,
  Shield,
  TrendingUp,
  BookOpen,
  FileText,
  Layers,
  Users,
  Mail,
  LayoutGrid,
  Zap,
  Bot,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/Button";
import { marketingContent as C } from "./content";
import { SeorchableLogo } from "./SeorchableLogo";

/** Mega-menu dropdown item */
interface DropdownItem {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  desc: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  locale: string;
}

function NavDropdown({ label, items, locale: _locale }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 w-72 rounded-[var(--radius-xl)] glass-panel border border-[var(--glass-border)] shadow-2xl p-2 z-50 animate-fade-in"
          role="menu"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-[var(--radius-lg)] hover:bg-[var(--muted-surface)] transition-colors group"
              >
                <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-[var(--muted-surface)] group-hover:bg-[var(--color-primary-600)]/10 flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--color-primary-600)] transition-colors">
                  <Icon size={16} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</span>
                  <span className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">{item.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Enterprise-grade sticky navigation bar.
 * Exposes Platform, Solutions, Pricing, Docs, Resources plus auth actions.
 */
export function LandingHeader() {
  const { session } = useAuth();
  const { language, setLanguage, theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFa = language === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const platformItems: DropdownItem[] = [
    {
      icon: BarChart2,
      label: isFa ? "پایش دیده‌شدن هوش مصنوعی" : "AI Visibility Monitoring",
      desc: isFa ? "رصد لحظه‌ای حضور برند در موتورهای هوش مصنوعی" : "Real-time brand presence across AI search engines",
      href: `/${language}/platform/ai-visibility`,
    },
    {
      icon: Brain,
      label: isFa ? "هوش برند" : "Brand Intelligence",
      desc: isFa ? "درک عمیق از نحوه بازنمایی برند در مدل‌های زبانی" : "Deep understanding of how LLMs represent your brand",
      href: `/${language}/platform/brand-intelligence`,
    },
    {
      icon: Search,
      label: isFa ? "ردیابی استنادهای هوش مصنوعی" : "AI Citation Tracking",
      desc: isFa ? "پایش هر بار که هوش مصنوعی برند شما را ذکر می‌کند" : "Track every time AI models mention your brand",
      href: `/${language}/platform/citation-tracking`,
    },
    {
      icon: TrendingUp,
      label: isFa ? "تحلیل رقبا" : "Competitor Analysis",
      desc: isFa ? "مقایسه جایگاه برند در برابر رقبا در مدل‌های هوش مصنوعی" : "Compare brand positioning vs. competitors in AI models",
      href: `/${language}/platform/competitor-analysis`,
    },
    {
      icon: Globe,
      label: isFa ? "بهینه‌سازی GEO" : "GEO Optimization",
      desc: isFa ? "بهینه‌سازی نتایج جستجوی موتورهای مولد" : "Optimize for Generative Engine Optimization",
      href: `/${language}/platform/geo`,
    },
    {
      icon: LayoutGrid,
      label: isFa ? "تحلیل‌های جستجوی هوش مصنوعی" : "AI Search Analytics",
      desc: isFa ? "داده‌های جامع از رفتار جستجوی هوش مصنوعی" : "Comprehensive analytics on AI search behavior",
      href: `/${language}/platform/analytics`,
    },
  ];

  const solutionsItems: DropdownItem[] = [
    {
      icon: Shield,
      label: isFa ? "محافظت از برند" : "Brand Protection",
      desc: isFa ? "جلوگیری از توهمات و اطلاعات نادرست درباره برند" : "Prevent hallucinations and misinformation",
      href: `/${language}/solutions/protection`,
    },
    {
      icon: Zap,
      label: isFa ? "بهینه‌سازی AEO" : "AEO Optimization",
      desc: isFa ? "بهینه‌سازی برای موتورهای پاسخگو مثل Perplexity" : "Optimize for answer engines like Perplexity",
      href: `/${language}/solutions/aeo`,
    },
    {
      icon: Bot,
      label: isFa ? "یکپارچه‌سازی دانش گراف" : "Knowledge Graph Integration",
      desc: isFa ? "ساختاردهی به دانش برند برای درک بهتر مدل‌های زبانی" : "Structure brand knowledge for LLM comprehension",
      href: `/${language}/solutions/knowledge-graph`,
    },
    {
      icon: Users,
      label: isFa ? "برای سازمان‌ها" : "For Enterprise",
      desc: isFa ? "راهکارهای مقیاس‌پذیر برای تیم‌های بزرگ" : "Scalable solutions for large organizations",
      href: `/${language}/solutions/enterprise`,
    },
  ];

  const docsItems: DropdownItem[] = [
    {
      icon: BookOpen,
      label: isFa ? "شروع سریع" : "Getting Started",
      desc: isFa ? "اتصال و راه‌اندازی پلتفرم در چند دقیقه" : "Connect and configure the platform in minutes",
      href: `/${language}/docs/getting-started`,
    },
    {
      icon: FileText,
      label: isFa ? "مستندات API" : "API Reference",
      desc: isFa ? "مستندات کامل API برای توسعه‌دهندگان" : "Full API documentation for developers",
      href: `/${language}/docs/api`,
    },
    {
      icon: Layers,
      label: isFa ? "راهنمای یکپارچه‌سازی" : "Integration Guides",
      desc: isFa ? "اتصال با ابزارهای موجود شما" : "Connect with your existing toolchain",
      href: `/${language}/docs/integrations`,
    },
    {
      icon: Sparkles,
      label: isFa ? "بهترین شیوه‌ها" : "Best Practices",
      desc: isFa ? "الگوها و توصیه‌های آزمایش‌شده در سطح سازمانی" : "Battle-tested patterns and enterprise recommendations",
      href: `/${language}/docs/best-practices`,
    },
  ];

  const simpleLinkItems = [
    { key: "pricing" as const, href: `/${language}/pricing` },
    { key: "resources" as const, href: `/${language}/resources` },
    { key: "about" as const, href: `/${language}/about` },
    { key: "contact" as const, href: `/${language}/contact` },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
        <div
          className={`mx-auto max-w-[1280px] flex items-center justify-between gap-2 rounded-[var(--radius-full)] px-3 sm:px-5 h-14 transition-all duration-300 ${
            scrolled
              ? "glass-panel border border-[var(--glass-border)] shadow-lg"
              : "border border-transparent"
          }`}
        >
          {/* Brand */}
          <Link
            href={`/${language}`}
            className="flex items-center gap-2 sm:gap-2.5 shrink-0"
            aria-label="Seorchable home"
          >
            <SeorchableLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="font-display font-black text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
              {C.brand[language]}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            <NavDropdown label={C.nav.platform[language]} items={platformItems} locale={language} />
            <NavDropdown label={C.nav.solutions[language]} items={solutionsItems} locale={language} />
            <Link
              href={`/${language}/pricing`}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
            >
              {C.nav.pricing[language]}
            </Link>
            <NavDropdown label={C.nav.docs[language]} items={docsItems} locale={language} />
            <Link
              href={`/${language}/resources`}
              className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--radius-md)] transition-colors"
            >
              {C.nav.resources[language]}
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Language */}
            <button
              type="button"
              onClick={() => setLanguage(isFa ? "en" : "fa")}
              aria-label={isFa ? "Switch to English" : "تغییر به فارسی"}
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors text-xs font-semibold"
            >
              <Languages size={15} />
              <span className="hidden sm:inline">{isFa ? "EN" : "فا"}</span>
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Invoice */}
            <Link
              href={`/${language}/invoice`}
              aria-label={isFa ? "پرداخت صورتحساب" : "Invoice Payment"}
              className="hidden sm:grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
            >
              <Receipt size={15} />
            </Link>

            {/* Auth CTA — desktop only */}
            <div className="hidden lg:flex items-center gap-1.5 ms-1">
              {session.status === "authenticated" ? (
                <Link href={`/${language}/dashboard`}>
                  <Button size="sm" variant="primary" className="font-bold text-xs px-4">
                    {C.cta.workspace[language]}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={`/${language}/login`}>
                    <Button size="sm" variant="ghost" className="font-semibold text-xs px-3">
                      {C.cta.login[language]}
                    </Button>
                  </Link>
                  <Link href={`/${language}/audit`}>
                    <Button size="sm" variant="primary" className="font-bold text-xs px-4 gap-1.5">
                      <Sparkles size={13} />
                      {C.cta.startAudit[language]}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="lg:hidden grid place-items-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <nav
            className="absolute top-0 inset-x-0 pt-20 pb-8 px-4 glass-panel border-b border-[var(--glass-border)] shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {/* Platform group */}
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {C.nav.platform[language]}
              </p>
              {platformItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] hover:bg-[var(--muted-surface)] transition-colors"
                  >
                    <Icon size={16} className="text-[var(--color-primary-600)] flex-shrink-0" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                  </Link>
                );
              })}

              {/* Solutions group */}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {C.nav.solutions[language]}
              </p>
              {solutionsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] hover:bg-[var(--muted-surface)] transition-colors"
                  >
                    <Icon size={16} className="text-[var(--color-primary-600)] flex-shrink-0" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                  </Link>
                );
              })}

              {/* Simple links */}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {isFa ? "سریع" : "Quick Links"}
              </p>
              {simpleLinkItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-[var(--radius-lg)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--muted-surface)] transition-colors"
                >
                  {C.nav[item.key][language]}
                </Link>
              ))}

              {/* Docs group */}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {C.nav.docs[language]}
              </p>
              {docsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] hover:bg-[var(--muted-surface)] transition-colors"
                  >
                    <Icon size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
              {session.status === "authenticated" ? (
                <Link href={`/${language}/dashboard`} onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full font-bold gap-2">
                    {C.cta.workspace[language]}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={`/${language}/login`} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full font-semibold">
                      {C.cta.login[language]}
                    </Button>
                  </Link>
                  <Link href={`/${language}/audit`} onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full font-bold gap-2">
                      <Sparkles size={14} />
                      {C.cta.startAudit[language]}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
