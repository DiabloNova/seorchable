"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
  LayoutDashboard, Database, Search, Network,
  BarChart3, Star, FileText, Bot, Compass,
  Settings, User, X, Menu
} from "lucide-react";
import { SeorchableLogo } from "../marketing/SeorchableLogo";

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelEn: string;
  labelFa: string;
  badge?: string;
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
  const { language, theme } = useTheme();
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
    { href: "/dashboard", icon: LayoutDashboard, labelEn: "Dashboard", labelFa: "داشبورد" },
    { href: "/dashboard/ingest", icon: Database, labelEn: "Ingest Documents", labelFa: "ورود اسناد" },
    { href: "/dashboard/rag", icon: Search, labelEn: "RAG Search", labelFa: "جستجوی RAG" },
    { href: "/dashboard/graph", icon: Network, labelEn: "Knowledge Graph", labelFa: "گراف دانش" },
  ];

  const analysisItems: NavItem[] = [
    { href: "/dashboard/audit/free", icon: BarChart3, labelEn: "Free Analysis", labelFa: "تحلیل رایگان" },
    { href: "/dashboard/audit/premium", icon: Star, labelEn: "Premium Analysis", labelFa: "تحلیل پیشرفته", badge: "Pro" },
    { href: "/dashboard/optimization/technical", icon: Settings, labelEn: "Technical Optimization", labelFa: "بهینه‌سازی فنی", badge: "Pro" },
    { href: "/dashboard/content", icon: FileText, labelEn: "Content Studio", labelFa: "استودیو محتوا" },
    { href: "/dashboard/analytics/llm", icon: Bot, labelEn: "LLM Analytics", labelFa: "تحلیل مدل‌های زبانی" },
    { href: "/dashboard/competitors", icon: Compass, labelEn: "Competitor Analysis", labelFa: "تحلیل رقابتی", badge: "Pro" },
  ];

  return (
    <>
      {/* HAMBURGER TOGGLE BUTTON IN TOP LEFT */}
      <div className="fixed top-3 left-4 z-[60]">
        <button
          onClick={handleToggle}
          aria-label="Toggle navigation menu"
          className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-500 shadow-lg border border-[var(--glass-border)] backdrop-blur-2xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-white/60 hover:bg-slate-950/85 text-[var(--text-primary)] cursor-pointer hover:scale-105 active:scale-95"
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
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
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
              className="absolute top-0 bottom-0 left-0 w-80 sm:w-85 border-r border-[var(--glass-border)] bg-slate-950/90 text-white shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <SeorchableLogo className="w-8 h-8" />
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

              {/* Navigation links inside Drawer */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-none">
                {/* Base Section */}
                <div className="space-y-1.5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isFa ? "پایه" : "Base"}
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
                    {isFa ? "تحلیل و هوشمندی" : "Analysis & Intelligence"}
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

                {/* Settings & Profile Section */}
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
                    <span>{isFa ? "تنظیمات" : "Settings"}</span>
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
                    <span>{isFa ? "پروفایل" : "Profile"}</span>
                  </Link>
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
