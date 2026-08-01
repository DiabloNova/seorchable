"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setIsLoading(true);
    try {
      // Simulate account creation delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      // Log the user in with their registered email
      await login(email);
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

      {/* Brand Logo */}
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
        {success ? (
          <div className="text-center py-10 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <h1 className="text-xl font-bold font-display">{isFa ? "ثبت‌نام با موفقیت انجام شد" : "Account Created Successfully"}</h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-semibold">
              {isFa
                ? "حساب کاربری و میز کار اختصاصی شما ایجاد شد. در حال انتقال به پیشخوان هوشمندی برند..."
                : "Workspace established. Redirecting you to your Brand Intelligence dashboard..."}
            </p>
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs"
            >
              {isFa ? "ورود فوری به پیشخوان" : "Proceed to Dashboard"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-xl sm:text-2xl font-black font-display text-[var(--text-primary)]">
                {isFa ? "ثبت نام حساب جدید" : "Create Business Workspace"}
              </h1>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "جهت پایش نامحدود و دسترسی به گراف روابط معنایی برند، ثبت نام کنید."
                  : "Begin your brand intelligence journey and build semantic trust."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-start">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                  {isFa ? "نام و نام خانوادگی" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isFa ? "علی علوی" : "John Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                  {isFa ? "ایمیل سازمانی" : "Business Email"}
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

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                  {isFa ? "نام شرکت یا سازمان" : "Company / Organization"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isFa ? "صنایع دیجیتال آریا" : "Enterprise Inc."}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-black text-xs sm:text-sm shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>{isFa ? "در حال ایجاد حساب..." : "Creating workspace..."}</span>
                ) : (
                  <>
                    <span>{isFa ? "ثبت نام رایگان" : "Create Account"}</span>
                    <ArrowRight size={16} className="rtl:-scale-x-100" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[10px] text-[var(--text-muted)] font-semibold">
                {isFa ? "قبلاً ثبت نام کرده‌اید؟ " : "Already have an account? "}
                <Link href={`/${locale}/login`} className="text-[#38bdf8] hover:underline font-bold">
                  {isFa ? "ورود به پیشخوان" : "Log In"}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
