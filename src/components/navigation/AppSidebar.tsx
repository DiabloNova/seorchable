"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard, Database, Search, Network,
  BarChart3, Star, Settings, User, X, Menu,
  LogOut, Sun, Moon, Languages, Receipt
} from "lucide-react";
import { SeorchableLogo } from "../marketing/SeorchableLogo";

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelEn: string;
  labelFa: string;
  badge?: string;
  badgeBg?: string;
}

interface AppSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export default function AppSidebar({
  mobileOpen,
  setMobileOpen
}: AppSidebarProps) {
  const pathname = usePathname();
  const { language, setLanguage, theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const isFa = language === "fa";

  // Unified menu open state for both desktop and mobile
  const [isOpen, setIsOpen] = useState(false);

  // Sync with layout mobile trigger if needed
  React.useEffect(() => {
    if (mobileOpen !== undefined) {
      setIsOpen(mobileOpen);
    }
  }, [mobileOpen]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (setMobileOpen) {
      setMobileOpen(nextState);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const getLocalizedHref = (href: string) => {
    return `/${language}${href === "/" ? "" : href}`;
  };

  const isItemActive = (href: string) => {
    const localizedHref = getLocalizedHref(href);
    return pathname === localizedHref || (href !== "/dashboard" && pathname?.startsWith(localizedHref));
  };

  const baseItems: NavItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, labelEn: "Command Center", labelFa: "میز فرماندهی هوشمند" },
    { href: "/dashboard/ingest", icon: Database, labelEn: "Data Ingestion Engine", labelFa: "موتور ورود و پایش اسناد" },
    { href: "/dashboard/rag", icon: Search, labelEn: "AI Semantic Discovery", labelFa: "جستجوی پیشرفته معنایی RAG" },
    { href: "/dashboard/graph", icon: Network, labelEn: "Enterprise Knowledge Graph", labelFa: "گراف دانش سازمانی" },
  ];

  const analysisItems: NavItem[] = [
    { href: "/dashboard/audit/free", icon: BarChart3, labelEn: "Standard Brand Audit", labelFa: "تحلیل استاندارد برند" },
    { href: "/dashboard/audit/premium", icon: Star, labelEn: "Enterprise Cognitive Audit", labelFa: "تحلیل پیشرفته و همه‌جانبه برند", badge: "Pro" },
    { href: "/dashboard/optimization/technical", icon: Settings, labelEn: "Engine Optimization Studio", labelFa: "کارگاه بهینه‌سازی موتورهای پاسخگو", badge: "Pro" },
    { href: "/dashboard/content", icon: LayoutDashboard, labelEn: "Cognitive Content Studio", labelFa: "استودیو تولید محتوای هوشمند" },
    { href: "/dashboard/analytics/llm", icon: BotIcon, labelEn: "Language Model Analytics", labelFa: "تحلیل پاسخ‌های مدل‌های زبانی" },
    { href: "/dashboard/competitors", icon: CompassIcon, labelEn: "Competitive Intelligence Radar", labelFa: "رادار تحلیل رقابتی برند", badge: "Pro" },
  ];

  // Custom inline components for SVGs to ensure exact lucide representation
  function BotIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    );
  }

  function CompassIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  return (
    <>
      {/* HAMBURGER TOGGLE BUTTON IN TOP LEFT */}
      <div className="fixed top-3 left-4 z-[60]">
        <button
          onClick={handleToggle}
          aria-label="Toggle navigation menu"
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-500 shadow-lg border border-[var(--glass-border)] backdrop-blur-2xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white/60 hover:bg-slate-950/85 text-[var(--sky-blue-500)] hover:text-[var(--orange-500)] cursor-pointer hover:scale-105 active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} className="text-[var(--orange-500)]" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} className="text-[var(--sky-blue-500)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* OVERLAY DRAWER PANEL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[55]" dir={isFa ? "rtl" : "ltr"}>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl"
              onClick={handleClose}
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="absolute top-0 bottom-0 left-0 w-80 sm:w-85 border-r border-white/10 bg-slate-950/95 text-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <SeorchableLogo className="w-8 h-8" glow={false} />
                  <span className="font-bold text-slate-100 text-sm">
                    {isFa ? "ناوبری سئورچبل" : "seorchable.ir Navigation"}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Controls Row (Language, Theme, Invoice icon placement) */}
              <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-around bg-slate-900/50 shrink-0">
                {/* Language Toggle */}
                <button
                  onClick={() => setLanguage(language === "fa" ? "en" : "fa")}
                  title={isFa ? "Switch to English" : "تغییر به فارسی"}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <Languages size={16} className="text-[var(--sky-blue-500)]" />
                  <span>{isFa ? "EN" : "فا"}</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title={isFa ? "تغییر پوسته تم" : "Toggle Color Theme"}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Sun size={16} className="text-[var(--orange-500)]" />
                  ) : (
                    <Moon size={16} className="text-[var(--orange-500)]" />
                  )}
                </button>

                {/* Invoice Icon placed next to Language and Theme */}
                <Link
                  href={`/${language}/invoice`}
                  onClick={handleClose}
                  title={isFa ? "پرداخت صورتحساب" : "Invoice Payment"}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Receipt size={16} className="text-[var(--sky-blue-500)]" />
                </Link>
              </div>

              {/* Navigation links inside Drawer */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-none">
                {/* Base Section */}
                <div className="space-y-1.5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isFa ? "مرکز عملیات هسته" : "Core Operations"}
                  </p>
                  <div className="space-y-1">
                    {baseItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={getLocalizedHref(item.href)}
                          onClick={handleClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border
                            ${isActive
                              ? "bg-gradient-to-r from-[var(--sky-blue-500)]/20 to-[var(--orange-500)]/10 text-white border-[var(--sky-blue-500)]/40 font-bold"
                              : "text-slate-300 hover:bg-white/10 hover:text-white border-transparent"
                            }`}
                        >
                          <Icon size={16} className="shrink-0 text-[var(--sky-blue-500)]" />
                          <span className="truncate">{isFa ? item.labelFa : item.labelEn}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Analysis & Intelligence Section */}
                <div className="space-y-1.5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isFa ? "هوشمندی و تحلیل‌های ژرف" : "Intelligence & Deep Analysis"}
                  </p>
                  <div className="space-y-1">
                    {analysisItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={getLocalizedHref(item.href)}
                          onClick={handleClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border relative
                            ${isActive
                              ? "bg-gradient-to-r from-[var(--sky-blue-500)]/20 to-[var(--orange-500)]/10 text-white border-[var(--sky-blue-500)]/40 font-bold"
                              : "text-slate-300 hover:bg-white/10 hover:text-white border-transparent"
                            }`}
                        >
                          <Icon size={16} className="shrink-0 text-[var(--orange-500)]" />
                          <span className="truncate">{isFa ? item.labelFa : item.labelEn}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 text-[8px] font-bold bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Settings, Profile & Logout Section */}
                <div className="space-y-1.5 pt-4 border-t border-white/10">
                  <Link
                    href={getLocalizedHref("/settings")}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border
                      ${isItemActive("/settings")
                        ? "bg-white/10 text-white border-white/20 font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white border-transparent"
                      }`}
                  >
                    <Settings size={16} className="shrink-0 text-slate-400" />
                    <span>{isFa ? "پیکربندی سیستم" : "System Configuration"}</span>
                  </Link>
                  <Link
                    href={getLocalizedHref("/profile")}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border
                      ${isItemActive("/profile")
                        ? "bg-white/10 text-white border-white/20 font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white border-transparent"
                      }`}
                  >
                    <User size={16} className="shrink-0 text-slate-400" />
                    <span>{isFa ? "حساب کاربری" : "User Account Profile"}</span>
                  </Link>
                  {/* Logout Button in Drawer */}
                  <button
                    onClick={async () => {
                      handleClose();
                      await logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border-transparent cursor-pointer text-start"
                  >
                    <LogOut size={16} className="shrink-0 text-rose-400" />
                    <span>{isFa ? "خروج از سیستم" : "Logout of System"}</span>
                  </button>
                </div>
              </nav>

              {/* Drawer Footer / Powered By */}
              <div className="p-6 border-t border-white/10 bg-black/20 flex items-center justify-between text-[10px] text-slate-500 select-none shrink-0" dir={isFa ? "rtl" : "ltr"}>
                <span>{isFa ? "سئورچبل (seorchable.ir)" : "Powered by seorchable.ir"}</span>
                <SeorchableLogo className="w-5 h-5" glow={false} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
