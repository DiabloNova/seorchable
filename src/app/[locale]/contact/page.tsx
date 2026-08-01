"use client";

import React, { useState, use } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Mail, MapPin, Phone, MessageSquare, Check } from "lucide-react";

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-bold text-[#38bdf8]">
            {isFa ? "ارتباط با تیم کارشناسان پلتفرم" : "Get In Touch"}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">
            {isFa ? "با تیم‌های بازاریابی و مهندسی ما در ارتباط باشید" : "Contact Our Growth & Support Teams"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "سوالی درباره تحلیل معنایی برند، روش پیاده‌سازی متاداده‌های AEO یا اشتراک‌های سازمانی دارید؟ فرم زیر را تکمیل کنید تا با شما تماس بگیریم."
              : "Have questions about brand analytics, custom RAG pipelines, or Enterprise pricing? Contact our specialists today."}
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-12 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black font-display text-gradient-brand">
                {isFa ? "راه‌های ارتباطی مستقیم" : "Corporate Coordinates"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-semibold">
                {isFa
                  ? "تیم پشتیبانی و فروش ما آماده پاسخگویی سریع به نیازهای برند شماست."
                  : "Reach out via our secure communication lines for corporate inquiries."}
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0"><Mail size={18} /></div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{isFa ? "پست الکترونیکی" : "Email Communications"}</h4>
                  <p className="text-[var(--text-muted)] mt-1">sales@brandgraph.ai</p>
                  <p className="text-[var(--text-muted)]">support@brandgraph.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#f97316] flex items-center justify-center shrink-0"><MapPin size={18} /></div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{isFa ? "موقعیت‌های استقرار" : "Global Offices"}</h4>
                  <p className="text-[var(--text-muted)] mt-1">{isFa ? "تهران، پارک فناوری اطلاعات، فضای نوآوری برخط" : "Tehran IT Park, Online Innovation Space"}</p>
                  <p className="text-[var(--text-muted)]">{isFa ? "تورنتو، بلوار دانشگاه، مرکز کسب‌وکار هوشمند" : "University Ave, Toronto, ON, Canada"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0"><Phone size={18} /></div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{isFa ? "پشتیبانی خطوط ویژه" : "Dedicated Support Line"}</h4>
                  <p className="text-[var(--text-muted)] mt-1">+۹۸ (۲۱) ۸۸۹۹-۷۷۶۶</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact/Lead Glass Form */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl relative">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-bold font-display">{isFa ? "پیام شما با موفقیت ثبت شد" : "Message Sent Successfully"}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-semibold">
                  {isFa
                    ? "کارشناسان رشد پلتفرم ظرف ۲۴ ساعت آینده جهت هماهنگی جلسه دمو با ایمیل سازمانی شما تماس خواهند گرفت."
                    : "Our team will review your requirements and reach out to your business email within 24 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-start">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold font-display text-[var(--text-primary)]">{isFa ? "ارسال مستقیم فرم مشاوره" : "Submit Consultation Request"}</h3>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed font-semibold">
                    {isFa ? "اطلاعات شرکت خود را وارد کنید تا کارشناسان ما گراف اولیه برند شما را آماده کنند." : "Fill out this form to request a localized brand diagnostic report."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">{isFa ? "نام و نام خانوادگی" : "Your Name"}</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">{isFa ? "ایمیل سازمانی" : "Business Email"}</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">{isFa ? "دامنه وب‌سایت برند" : "Target Brand Website"}</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)] text-start"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">{isFa ? "توضیحات و نیازمندی‌ها" : "Message / Scope"}</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-white/[0.03] border border-[var(--glass-border)] focus:border-[#38bdf8]/40 focus:bg-white/[0.05] outline-none text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-black text-xs sm:text-sm shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                >
                  {isFa ? "ارسال درخواست دمو" : "Send Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
