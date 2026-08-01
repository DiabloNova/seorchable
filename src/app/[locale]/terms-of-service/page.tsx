"use client";

import React, { use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { ShieldCheck } from "lucide-react";

export default function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#f97316]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 text-xs font-bold text-[#f97316]">
            <ShieldCheck size={12} />
            <span>{isFa ? "شرایط خدمات و توافق‌نامه پلتفرم" : "Service Agreement Conditions"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] leading-tight">
            {isFa ? "توافق‌نامه خدمات پلتفرم تحلیل و بهینه‌سازی هوش مصنوعی" : "Terms of Service & Usage Agreements"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "قوانین استفاده منصفانه از خزنده‌های وب‌سایت، دسترسی به وب‌سرویس‌ها، محدودیت درخواست‌ها و حقوق معنوی گراف دانش."
              : "Read our standard commercial guidelines, fair crawler policies, and subscription clauses."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-[var(--background)] flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass-panel p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-8 font-medium">
            {/* Clause 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#38bdf8]">{isFa ? "۱. سیاست خزش منصفانه (Fair Crawling)" : "1. Fair Crawling Compliance"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "پلتفرم ما با رعایت استانداردهای خزش، سرعت درخواست‌های ارسالی به وب‌سایت شما را جهت ارزیابی بهینه‌سازی کنترل می‌کند. شما متعهد می‌شوید دامنه‌هایی را وارد کنید که حق قانونی مدیریت یا نمایندگی آن‌ها را در اختیار دارید."
                  : "By executing an audit session, you declare that you have full legal ownership or authorization to crawl and model the target domain. Automated crawlers respect standard web safety headers."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-[#f97316]">{isFa ? "۲. مالکیت گراف دانش" : "2. Intellectual Property of the Entity Network"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "تمام تگ‌های ساختاریافته‌ی AEO و ساختارهای موجودیت تولید شده متعلق به سازمان شماست. پلتفرم ادعایی بر روی کدهای بهینه‌سازی کاتالوگ شما پس از اتمام دوره تحلیل نخواهد داشت."
                  : "All produced schemas, metadata enhancements, and local relationship data belong exclusively to the client tenant. Optimus AI claims no proprietary lock-ins on your optimized code."}
              </p>
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Clause 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-display text-purple-400">{isFa ? "۳. محدودیت نرخ فراخوانی API" : "3. API Rate-Limiting & Fair Use"}</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-semibold">
                {isFa
                  ? "جهت تضمین پایداری سامانه‌ها برای تمام کاربران، درگاه‌های API متناسب با بسته‌ی انتخابی شما دارای سقف نرخ فراخوانی مشخصی هستند. تلاش برای هک یا دستکاری توابع تحلیل با برخورد قانونی مواجه خواهد شد."
                  : "API calls are rate-limited on a per-minute basis relative to your active plan layer. System abuse, DDOS, or reverse engineering will lead to immediate account termination."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
