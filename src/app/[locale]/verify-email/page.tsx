"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { SeorchableLogo } from "@/components/marketing/SeorchableLogo";
import { AlertCircle, CheckCircle2, ShieldAlert, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

export default function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams?.get("token") || "";

  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const strings = {
    title: isFa ? "تایید ایمیل سازمانی" : "Verify Your Email Address",
    desc: isFa
      ? "در حال تایید آدرس ایمیل شما، لطفاً شکیبا باشید..."
      : "Verifying your email address, please wait...",
    submitBtn: isFa ? "تایید نهایی و فعال‌سازی" : "Verify & Activate Workspace",
    loading: isFa ? "در حال اعتبارسنجی توکن..." : "Validating token...",
    successTitle: isFa ? "فعال‌سازی با موفقیت انجام شد!" : "Verification Complete!",
    successDesc: isFa
      ? "ایمیل سازمانی شما تایید گردید. در حال انتقال به صفحه ورود..."
      : "Your workspace has been successfully verified. Redirecting to login...",
    backToHome: isFa ? "بازگشت به صفحه اصلی" : "Back to landing page",
    missingToken: isFa ? "لینک تایید نامعتبر است. لطفاً از طریق ایمیل ارسال شده اقدام کنید." : "Invalid verification link. Please use the link sent to your email.",
  };

  useEffect(() => {
    if (!tokenParam || hasAttempted) return;
    setHasAttempted(true);

    const verifyToken = async () => {
      setIsLoading(true);
      try {
        const { verifyEmailAction } = await import("@/app/actions/auth");
        await verifyEmailAction(tokenParam);

        setIsSuccess(true);
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 2000);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setSubmitError(errMsg);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [tokenParam, hasAttempted, locale, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[var(--background)] relative overflow-hidden" style={{ direction: isFa ? "rtl" : "ltr" }}>
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--sky-blue-500)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--orange-500)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-[460px] space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href={`/${locale}`} className="flex items-center gap-2 group cursor-pointer">
            <SeorchableLogo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" />
            <span className="font-display font-black text-xl bg-gradient-to-r from-[var(--sky-blue-500)] to-[var(--orange-500)] bg-clip-text text-transparent">
              {isFa ? "سئورچبل" : "seorchable.ir"}
            </span>
          </Link>
        </div>

        {/* Card */}
        <Card className="glass-panel border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl rounded-3xl p-2 sm:p-4">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-black font-display text-[var(--text-primary)]">
              {isSuccess ? strings.successTitle : strings.title}
            </CardTitle>
            <CardDescription className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mt-1">
              {isSuccess ? strings.successDesc : (tokenParam ? strings.desc : strings.missingToken)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={36} className="animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                {submitError && (
                  <div className="w-full p-3.5 rounded-xl border border-[var(--color-error)]/25 bg-[var(--color-error)]/10 text-[var(--color-error)] text-xs flex items-start gap-2 animate-shake">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <p className="font-bold">{submitError}</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center py-6 gap-3">
                    <span className="w-8 h-8 border-4 border-[var(--sky-blue-500)]/20 border-t-[var(--sky-blue-500)] rounded-full animate-spin" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">{strings.loading}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-bold cursor-pointer"
          >
            {isFa ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{strings.backToHome}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
