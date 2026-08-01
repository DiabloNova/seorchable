"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const { login, session } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(`/${locale}/dashboard`);
    }
  }, [session.status, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await login(email);
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--background)] text-[var(--text-primary)] px-4 py-12 relative overflow-hidden" style={{ direction: isFa ? "rtl" : "ltr" }}>
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-[#38bdf8]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Brand logo link */}
      <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-8">
        <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-[var(--color-primary-600)] text-white glow-ring">
          <Sparkles size={20} />
        </span>
        <span className="font-display font-black text-xl tracking-tight">
          {isFa ? "هوشمندی برند" : "BrandIntelligence"}
        </span>
      </Link>

      {/* Glassmorphic Card */}
      <div className="w-full max-w-md animated-border-glass p-8 rounded-3xl shadow-2xl relative">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
              {isFa ? "ورود به پیشخوان کاربری" : "Access the Workspace"}
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
              {isFa
                ? "ایمیل سازمانی خود را جهت دسترسی به پورتال مدیریت برند وارد نمایید."
                : "Enter your enterprise email to open the administrative interface."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                {isFa ? "ایمیل سازمانی" : "Enterprise Email"}
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)] text-start"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-black text-xs sm:text-sm shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>{isFa ? "در حال اعتبارسنجی..." : "Validating secure session..."}</span>
              ) : (
                <>
                  <span>{isFa ? "ورود به پیشخوان" : "Enter Console"}</span>
                  <ArrowRight size={16} className="rtl:-scale-x-100" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[10px] text-[var(--text-muted)] font-semibold">
              {isFa ? "حساب کاربری جدید دارید؟ " : "Don't have an account? "}
              <Link href={`/${locale}/register`} className="text-[#38bdf8] hover:underline font-bold">
                {isFa ? "ثبت نام رایگان" : "Register Free"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
