"use client";

import React, { use, useState } from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import AppSidebar from "@/components/navigation/AppSidebar";
import {
  Sparkles, Mail, MapPin, Phone, Send, Info, ShieldCheck, HeartHandshake,
  MessageSquare, HelpCircle, CheckCircle2, Headphones, ArrowRight, CheckCircle
} from "lucide-react";

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const [formType, setFormType] = useState<"support" | "business" | "partnership">("business");
  const [formState, setFormState] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormState({ name: "", email: "", company: "", message: "" });
    }, 4000);
  };

  const supportSteps = isFa
    ? [
        { title: "ارسال فرم یا تیکت", desc: "مشخصات و موضوع مشکل فنی خود را در قالب دسته‌بندی پشتیبانی فنی برای ما ارسال می‌کنید." },
        { title: "بررسی مهندسی زیرساخت", desc: "تیم پشتیبانی فنی سئورچبل ظرف کمتر از ۳۰ دقیقه لاگ‌ها و تراکنش دامنه‌های شما را بازبینی می‌کند." },
        { title: "ارائه پچ یا پاسخ مستقیم", desc: "راهکار گام‌به‌گام، کدهای اصلاحی اسکیما یا پچ‌های دسترسی برای حل مشکل خدمتتان تقدیم می‌شود." }
      ]
    : [
        { title: "Submit Ticket or Inquiry", desc: "Input your technical or corporate request under our specialized support channels." },
        { title: "Infrastructure Engineering Review", desc: "Our customer success engineers audit your domain logs and crawl paths in under 30 minutes." },
        { title: "Factual Resolution Issued", desc: "A tailored step-by-step resolution, schema patch, or priority routing setup is delivered." }
      ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <AppSidebar />
      <LandingHeader />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background Lights */}
        <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.25] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "ارتباط با سئورچبل" : "Get in Touch"}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-gradient-brand">
              {isFa ? "با کارشناسان و مهندسان ما گفتگو کنید" : "Talk to Our Specialist Engineers"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
              {isFa
                ? "برای استعلام همکاری‌های تجاری، پشتیبانی فنی فوری یا درخواست شراکت‌های استراتژیک، کانال تخصصی مدنظرتان را انتخاب نمایید."
                : "Questions about generative search optimization? Reach out to our dedicated business, partnership, or tech teams."}
            </p>
          </div>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 pt-6 items-start">

            {/* Contact Form with Tab selectors */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 shadow-xl space-y-6 text-start">

              {/* Specialized Channels Tabs */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  {isFa ? "۱. کانال ارتباطی تخصصی را انتخاب کنید" : "1. Select Specialized Channel"}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType("business")}
                    className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      formType === "business"
                        ? "bg-[var(--sky-blue-500)]/20 border-[var(--sky-blue-500)] text-white"
                        : "border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    {isFa ? "استعلام همکاری تجاری" : "Business Inquiry"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("support")}
                    className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      formType === "support"
                        ? "bg-[var(--orange-500)]/20 border-[var(--orange-500)] text-white"
                        : "border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    {isFa ? "پشتیبانی و رفع خطا" : "Support Ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("partnership")}
                    className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      formType === "partnership"
                        ? "bg-purple-500/20 border-purple-500 text-white"
                        : "border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    {isFa ? "درخواست مشارکت" : "Partnership"}
                  </button>
                </div>
              </div>

              {/* Form Render */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-[var(--sky-blue-500)]" />
                  <span>
                    {formType === "business" && (isFa ? "ارسال استعلام همکاری تجاری" : "Submit Corporate Business Inquiry")}
                    {formType === "support" && (isFa ? "ارسال تیکت پشتیبانی فنی" : "Submit Priority Technical Ticket")}
                    {formType === "partnership" && (isFa ? "ارسال درخواست شراکت استراتژیک" : "Submit Strategic Partnership Application")}
                  </span>
                </h3>

                {sent ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle size={15} />
                    <span>{isFa ? "درخواست شما با موفقیت ثبت شد. مهندسان ما به زودی با شما مکاتبه خواهند کرد!" : "Your request was received successfully. Our engineers will reply shortly!"}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">{isFa ? "نام کامل شما" : "Full Name"}</label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white focus:outline-none focus:border-[var(--sky-blue-500)] transition-colors"
                          placeholder={isFa ? "مثال: حسام محمدی" : "e.g. Samuel J."}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">{isFa ? "ایمیل رسمی" : "Corporate Email"}</label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white focus:outline-none focus:border-[var(--sky-blue-500)] transition-colors"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">{isFa ? "نام سازمان / شرکت" : "Company / Brand Name"}</label>
                      <input
                        type="text"
                        required
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white focus:outline-none focus:border-[var(--sky-blue-500)] transition-colors"
                        placeholder={isFa ? "مثال: هلدینگ پارس" : "e.g. Acme Corp"}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">{isFa ? "شرح جزئیات درخواست" : "Details of Request"}</label>
                      <textarea
                        rows={4}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white focus:outline-none focus:border-[var(--sky-blue-500)] transition-colors resize-none"
                        placeholder={isFa ? "لطفاً توضیحات یا لینک دامنه‌ی مورد نظر را یادداشت فرمایید..." : "Please describe your query or target domain details..."}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#f97316] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Send size={14} className="rtl:-scale-x-100" />
                      <span>{isFa ? "ثبت نهایی درخواست" : "Submit Request"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Support workflow / Side details column */}
            <div className="space-y-6 text-start">

              {/* Direct coordinates cards */}
              <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/20 space-y-4">
                <h4 className="text-sm font-black text-white">{isFa ? "اطلاعات تماس مستقیم سازمانی" : "Direct Corporate Coordinates"}</h4>
                <div className="space-y-4 text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                      <Mail size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">{isFa ? "ایمیل رسمی روابط عمومی" : "Official Public Relations"}</p>
                      <p className="text-white">info@seorchable.ir</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-[#f97316]">
                      <Phone size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">{isFa ? "پشتیبانی دپارتمان فروش" : "Sales Department Line"}</p>
                      <p className="text-white" dir="ltr">+۹۸ (۲۱) ۷۶۲۵-۰۰۰۰</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">{isFa ? "نشانی مرکز استقرار" : "Tech Center Hub"}</p>
                      <p className="text-white leading-relaxed">
                        {isFa ? "تهران، کیلومتر ۲۰ جاده دماوند، پارک فناوری پردیس" : "Pardis Technology Park, Tehran, Iran"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Workflow */}
              <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] bg-purple-500/[0.01] hover:border-purple-500/10 transition-all space-y-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Headphones className="text-purple-400" size={16} />
                  <span>{isFa ? "چرخه و فرایند پاسخ‌دهی و پشتیبانی" : "Our Support & Ticket Life Cycle"}</span>
                </h4>

                <div className="relative border-l border-white/5 pl-4 ml-2 space-y-6">
                  {supportSteps.map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-[8px] font-black text-purple-400 font-mono">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-black text-white">{step.title}</h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
