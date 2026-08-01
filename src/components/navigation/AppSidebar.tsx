"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
  LayoutDashboard, Database, Search, Network,
  BarChart3, Star, FileText, Bot, Compass,
  Settings, User, ChevronLeft, ChevronRight
} from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface AppSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export default function AppSidebar({
  collapsed: controlledCollapsed,
  setCollapsed: controlledSetCollapsed,
  mobileOpen,
  setMobileOpen
}: AppSidebarProps) {
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const pathname = usePathname();
  const { language } = useTheme();

  // Determine if collapsed is controlled or local
  const isCollapsedControlled = controlledCollapsed !== undefined;
  const collapsed = isCollapsedControlled ? controlledCollapsed : localCollapsed;

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    if (!isCollapsedControlled) {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        setLocalCollapsed(JSON.parse(saved));
      }
    }
  }, [isCollapsedControlled]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    if (controlledSetCollapsed) {
      controlledSetCollapsed(newState);
    } else {
      setLocalCollapsed(newState);
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    }
  };

  const getLocalizedHref = (href: string) => {
    return `/${language}${href === "/" ? "" : href}`;
  };

  const isItemActive = (href: string) => {
    const localizedHref = getLocalizedHref(href);
    return pathname === localizedHref || (href !== "/dashboard" && pathname?.startsWith(localizedHref));
  };

  const navSections: NavSection[] = [
    {
      title: "پایه",
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "داشبورد" },
        { href: "/dashboard/ingest", icon: Database, label: "ورود اسناد" },
        { href: "/dashboard/rag", icon: Search, label: "جستجوی RAG" },
        { href: "/dashboard/graph", icon: Network, label: "گراف دانش" },
      ],
    },
    {
      title: "تحلیل و هوشمندی",
      items: [
        { href: "/dashboard/audit/free", icon: BarChart3, label: "تحلیل رایگان" },
        { href: "/dashboard/audit/premium", icon: Star, label: "تحلیل پیشرفته", badge: "Pro" },
        { href: "/dashboard/optimization/technical", icon: Settings, label: "بهینه‌سازی فنی", badge: "Pro" },
        { href: "/dashboard/content", icon: FileText, label: "استودیو محتوا" },
        { href: "/dashboard/analytics/llm", icon: Bot, label: "تحلیل مدل‌های زبانی" },
        { href: "/dashboard/competitors", icon: Compass, label: "تحلیل رقابتی", badge: "Pro" },
      ],
    },
  ];

  // Helper render function that takes current collapsed state
  const renderSidebarContents = (isSidebarCollapsed: boolean, onNavItemClick?: () => void) => {
    return (
      <div className="flex flex-col h-full w-full select-none">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.08)]">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--sky-blue-500)] to-[var(--orange-500)] flex items-center justify-center text-white font-black text-sm">
                  AI
                </div>
                <span className="font-bold text-slate-100">هوش برند</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Collapse Button - Hidden on mobile drawer */}
          {!onNavItemClick && (
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer hidden md:block"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-none">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {/* Section Header */}
              {!isSidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}

              {/* Nav Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={getLocalizedHref(item.href)}
                      onClick={onNavItemClick}
                      aria-label={item.label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative
                        ${isActive
                          ? "bg-gradient-to-r from-[var(--sky-blue-500)]/20 to-[var(--orange-500)]/10 text-white border border-[var(--sky-blue-500)]/40 font-bold"
                          : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent"
                        }`}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="truncate flex-1"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && !isSidebarCollapsed && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.08)] space-y-1">
          <Link
            href={getLocalizedHref("/settings")}
            aria-label="تنظیمات"
            onClick={onNavItemClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings size={18} />
            {!isSidebarCollapsed && <span>تنظیمات</span>}
          </Link>
          <Link
            href={getLocalizedHref("/profile")}
            aria-label="پروفایل"
            onClick={onNavItemClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <User size={18} />
            {!isSidebarCollapsed && <span>پروفایل</span>}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-0 top-0 h-screen z-50 hidden md:flex flex-col"
        style={{
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "inset 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(56, 189, 248, 0.05)"
        }}
      >
        {renderSidebarContents(collapsed)}
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                if (setMobileOpen) setMobileOpen(false);
              }}
            />
            {/* Drawer Body (always 280px wide on mobile, non-collapsed) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.35 }}
              className="absolute right-0 top-0 h-full w-72 flex flex-col"
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(148, 163, 184, 0.2)",
                boxShadow: "inset 1px 0 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(56, 189, 248, 0.05)"
              }}
            >
              {renderSidebarContents(false, () => {
                if (setMobileOpen) setMobileOpen(false);
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
