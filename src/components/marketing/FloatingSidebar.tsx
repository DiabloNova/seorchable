"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LogIn,
  DollarSign,
  Layers,
  BookOpen,
  Info,
  Mail,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { marketingContent as C } from "./content";

/**
 * A highly interactive, responsive, right-aligned vertical floating sidebar.
 * Visually replicates the clean, dark, floating vertical pill design from Pierre Sù (f846220080dac229050f09016ead2b63.jpg).
 * Positioned near the browser's address bar area (top-right, `fixed top-6 right-6 z-50`).
 * Seamlessly collapses to a compact vertical icon-only pill, and expands on hover or click to show full labels.
 */
export function FloatingSidebar() {
  const { language } = useTheme();
  const { session } = useAuth();
  const pathname = usePathname();
  const isFa = language === "fa";

  const [isExpanded, setIsExpanded] = useState(false);

  // Exclude dashboard, profile, and settings paths to keep workspace UI clean
  if (
    pathname?.includes("/dashboard") ||
    pathname?.includes("/profile") ||
    pathname?.includes("/settings")
  ) {
    return null;
  }
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns and collapse when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setServicesDropdownOpen(false);
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent parent hover/leave from messing up active state on clicks
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Only collapse on mouse leave if dropdowns are closed
    if (!servicesDropdownOpen && !authDropdownOpen) {
      setIsExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setServicesDropdownOpen(false);
      setAuthDropdownOpen(false);
    }
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return pathname === path || pathname === `/${language}${path}`;
  };

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ direction: isFa ? "rtl" : "ltr" }}
      className={`fixed top-6 right-4 sm:right-6 z-50 flex flex-col items-center transition-all duration-300 ease-in-out ${
        isExpanded
          ? "w-64 p-5 rounded-[var(--radius-xl)]"
          : "w-16 p-3 rounded-full"
      } bg-slate-950/95 text-white border border-white/10 shadow-2xl backdrop-blur-md`}
    >
      {/* 2. Custom Logo Integration (Top of the Sidebar) */}
      <div className={`flex items-center w-full justify-between mb-4 ${isExpanded ? "px-2" : "justify-center"}`}>
        <Link
          href={`/${language}`}
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => {
            setIsExpanded(false);
            setServicesDropdownOpen(false);
            setAuthDropdownOpen(false);
          }}
        >
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5 shadow-lg shrink-0 transform hover:scale-105 transition-transform">
            <img
              src="/custom-logo.png"
              alt="Brand Intelligence Logo"
              className="w-full h-full object-contain"
            />
          </div>
          {isExpanded && (
            <span className="font-display font-black text-sm tracking-tight text-white animate-fade-in truncate">
              {C.brand[language]}
            </span>
          )}
        </Link>

        {/* Collapsible Trigger Toggle (for manual expansion & mobile access) */}
        {isExpanded && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Vertical Spacer Line */}
      <div className="w-full h-px bg-white/10 mb-4" />

      {/* 4. Menu Items */}
      <nav className="w-full flex flex-col gap-2.5 items-center overflow-y-auto max-h-[70vh] no-scrollbar">

        {/* HOME */}
        <Link
          href={`/${language}`}
          onClick={() => setIsExpanded(false)}
          className={`flex items-center ${isExpanded ? "w-full px-3 py-2.5 rounded-xl gap-3" : "w-10 h-10 rounded-full justify-center"} transition-all duration-200 ${
            isActive("")
              ? "bg-white text-slate-950 shadow-md font-bold"
              : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
          }`}
          title={C.nav.home[language]}
        >
          <Home size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-bold animate-fade-in">{C.nav.home[language]}</span>}
        </Link>

        {/* LOGIN / REGISTER DROPDOWN / LINK */}
        <div className="w-full flex flex-col items-center">
          {isExpanded ? (
            <div className="w-full">
              <button
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl gap-3 transition-all duration-200 ${
                  isActive("/login") || isActive("/register")
                    ? "bg-slate-900 text-white border border-white/20 font-bold"
                    : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LogIn size={18} className="shrink-0" />
                  <span className="text-xs font-bold">{C.nav.login[language]} / {C.nav.register[language]}</span>
                </div>
                {authDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {authDropdownOpen && (
                <div className="mt-1.5 ml-2 mr-2 pl-2 border-l border-white/10 pr-2 border-r border-transparent flex flex-col gap-1.5 bg-slate-950/40 p-2 rounded-lg">
                  <Link
                    href={`/${language}/login`}
                    onClick={() => {
                      setIsExpanded(false);
                      setAuthDropdownOpen(false);
                    }}
                    className={`block px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors ${isActive("/login") ? "text-[#38bdf8] font-bold" : "text-slate-400 hover:text-white"}`}
                  >
                    {C.nav.login[language]}
                  </Link>
                  <Link
                    href={`/${language}/register`}
                    onClick={() => {
                      setIsExpanded(false);
                      setAuthDropdownOpen(false);
                    }}
                    className={`block px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors ${isActive("/register") ? "text-[#f97316] font-bold" : "text-slate-400 hover:text-white"}`}
                  >
                    {C.nav.register[language]}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/${language}/login`}
              className={`flex items-center w-10 h-10 rounded-full justify-center transition-all duration-200 ${
                isActive("/login") || isActive("/register")
                  ? "bg-white text-slate-950 shadow-md font-bold"
                  : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
              }`}
              title={`${C.nav.login[language]} / ${C.nav.register[language]}`}
            >
              <LogIn size={18} className="shrink-0" />
            </Link>
          )}
        </div>

        {/* PRICING */}
        <Link
          href={`/${language}/pricing`}
          onClick={() => setIsExpanded(false)}
          className={`flex items-center ${isExpanded ? "w-full px-3 py-2.5 rounded-xl gap-3" : "w-10 h-10 rounded-full justify-center"} transition-all duration-200 ${
            isActive("/pricing")
              ? "bg-white text-slate-950 shadow-md font-bold"
              : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
          }`}
          title={C.nav.pricing[language]}
        >
          <DollarSign size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-bold animate-fade-in">{C.nav.pricing[language]}</span>}
        </Link>

        {/* SERVICES DROPDOWN (dropdown / submenu) */}
        <div className="w-full flex flex-col items-center">
          {isExpanded ? (
            <div className="w-full">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl gap-3 transition-all duration-200 ${
                  servicesDropdownOpen
                    ? "bg-slate-900 text-white border border-white/20 font-bold"
                    : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers size={18} className="shrink-0" />
                  <span className="text-xs font-bold">{C.nav.services[language]}</span>
                </div>
                {servicesDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {servicesDropdownOpen && (
                <div className="mt-1.5 ml-2 mr-2 pl-2 border-l border-white/10 pr-2 border-r border-transparent flex flex-col gap-1.5 bg-slate-950/40 p-2 rounded-lg">
                  <Link
                    href={`/${language}/platform`}
                    onClick={() => {
                      setIsExpanded(false);
                      setServicesDropdownOpen(false);
                    }}
                    className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {C.nav.servicesFeatures[language]}
                  </Link>
                  <Link
                    href={`/${language}/solutions`}
                    onClick={() => {
                      setIsExpanded(false);
                      setServicesDropdownOpen(false);
                    }}
                    className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {C.nav.servicesEnterprise[language]}
                  </Link>
                  <Link
                    href={`/${language}/pricing`}
                    onClick={() => {
                      setIsExpanded(false);
                      setServicesDropdownOpen(false);
                    }}
                    className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {C.nav.servicesAudit[language]}
                  </Link>
                  <Link
                    href={`/${language}/status`}
                    onClick={() => {
                      setIsExpanded(false);
                      setServicesDropdownOpen(false);
                    }}
                    className="block px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {C.nav.servicesStatus[language]}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={toggleSidebar}
              className={`flex items-center w-10 h-10 rounded-full justify-center transition-all duration-200 bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white`}
              title={C.nav.services[language]}
            >
              <Layers size={18} className="shrink-0" />
            </button>
          )}
        </div>

        {/* DOCUMENTATION */}
        <Link
          href={`/${language}/documentation`}
          onClick={() => setIsExpanded(false)}
          className={`flex items-center ${isExpanded ? "w-full px-3 py-2.5 rounded-xl gap-3" : "w-10 h-10 rounded-full justify-center"} transition-all duration-200 ${
            isActive("/documentation")
              ? "bg-white text-slate-950 shadow-md font-bold"
              : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
          }`}
          title={C.nav.documentation[language]}
        >
          <BookOpen size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-bold animate-fade-in">{C.nav.documentation[language]}</span>}
        </Link>

        {/* ABOUT US */}
        <Link
          href={`/${language}/about`}
          onClick={() => setIsExpanded(false)}
          className={`flex items-center ${isExpanded ? "w-full px-3 py-2.5 rounded-xl gap-3" : "w-10 h-10 rounded-full justify-center"} transition-all duration-200 ${
            isActive("/about")
              ? "bg-white text-slate-950 shadow-md font-bold"
              : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
          }`}
          title={C.nav.about[language]}
        >
          <Info size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-bold animate-fade-in">{C.nav.about[language]}</span>}
        </Link>

        {/* CONTACT US */}
        <Link
          href={`/${language}/contact`}
          onClick={() => setIsExpanded(false)}
          className={`flex items-center ${isExpanded ? "w-full px-3 py-2.5 rounded-xl gap-3" : "w-10 h-10 rounded-full justify-center"} transition-all duration-200 ${
            isActive("/contact")
              ? "bg-white text-slate-950 shadow-md font-bold"
              : "bg-slate-900/50 hover:bg-white/15 text-slate-300 hover:text-white"
          }`}
          title={C.nav.contact[language]}
        >
          <Mail size={18} className="shrink-0" />
          {isExpanded && <span className="text-xs font-bold animate-fade-in">{C.nav.contact[language]}</span>}
        </Link>

      </nav>

      {/* Vertical Spacer Line */}
      <div className="w-full h-px bg-white/10 my-4" />

      {/* Expand/Collapse Toggle Button at bottom of vertical pill */}
      <button
        onClick={toggleSidebar}
        className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/5 hover:bg-white text-slate-400 hover:text-slate-950 flex items-center justify-center transition-all shadow-md cursor-pointer"
        title={isExpanded ? (isFa ? "بستن منو" : "Collapse Menu") : (isFa ? "باز کردن منو" : "Expand Menu")}
      >
        {isExpanded ? (
          isFa ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
        ) : (
          <Menu size={18} />
        )}
      </button>
    </div>
  );
}
