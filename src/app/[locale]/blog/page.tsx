"use client";

import React, { use } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export default function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  const posts = [
    {
      title: isFa ? "تفاوت سئو و بهینه‌سازی موتور پاسخ (AEO): چرا رتبه‌بندی کلمات کلیدی دیگر کافی نیست؟" : "SEO vs. AEO: Why Keyword Ranks Don't Matter Anymore",
      desc: isFa ? "بررسی عمیق تغییر رفتار کاربران از جعبه‌های متنی گوگل به سمت پاسخ‌های مکالمه‌ای و چگونگی بهینه‌سازی ساختار محتوا برای آن." : "An in-depth exploration of conversational answer engines and how semantic models retrieve citations.",
      date: isFa ? "۱۴ اسفند ۱۴۰۳" : "March 04, 2025",
      author: isFa ? "دکتر امین رضایی" : "Dr. Amin Rezaei",
      category: "AEO Optimization",
      readTime: isFa ? "۶ دقیقه" : "6 min read",
    },
    {
      title: isFa ? "سیستم‌های RAG چگونه ساختار صفحات وب را کالبدشکافی و دسته‌بندی می‌کنند؟" : "How RAG Pipelines Process and Classify Your Corporate Website",
      desc: isFa ? "بررسی مکانیسم‌های جذب متن، تقسیم‌بندی به قطعات (Chunking) و تولید بردارهای عددی در پایگاه داده‌های برداری هوش مصنوعی." : "A developer's guide to text indexing, vector embeddings, and chunk boundaries inside LLM crawl pipelines.",
      date: isFa ? "۰۲ اسفند ۱۴۰۳" : "Feb 20, 2025",
      author: isFa ? "مهندس سارا عباسی" : "Sara Abbasi, NLP Eng.",
      category: "Technical RAG",
      readTime: isFa ? "۹ دقیقه" : "9 min read",
    },
    {
      title: isFa ? "توهم برند در هوش مصنوعی: دلایل فنی استناد اشتباه مدل‌ها به رقیبان چیست؟" : "Understanding LLM Brand Hallucinations and Citation Leakage",
      desc: isFa ? "چگونه خطاهای درک معنایی باعث ارجاع ترافیک ارگانیک شما به سمت وب‌سایت رقیبان در Perplexity و ChatGPT می‌گردد." : "Analyzing semantic drift, hallucinated claims, and why language models attribute active features to wrong brands.",
      date: isFa ? "۱۸ بهمن ۱۴۰۳" : "Feb 07, 2025",
      author: isFa ? "علیرضا نوری" : "Alireza Nouri",
      category: "Brand Protection",
      readTime: isFa ? "۵ دقیقه" : "5 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      <LandingHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 overflow-hidden border-b border-[var(--border)]">
        <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-br from-[#38bdf8]/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-1.5 text-xs font-bold text-[#38bdf8]">
            <BookOpen size={12} />
            <span>{isFa ? "وبلاگ تخصصی هوشمندی برند" : "Company Insights & Research Blog"}</span>
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight">
            {isFa ? "آخرین یافته‌ها درباره بهینه‌سازی موتورهای پاسخگو" : "The Frontiers of Generative Search Engine Optimization"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isFa
              ? "مقالات تحلیلی، پژوهش‌های مدل‌های پردازش زبان طبیعی و آموزش‌های فنی برای توسعه‌دهندگان و مدیران رشد بازاریابی."
              : "Read about the latest updates in semantic analysis, vector database index management, and citation tracking."}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {posts.map((p, idx) => (
              <article
                key={idx}
                className="glass-panel hover-lift rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col justify-between overflow-hidden shadow-lg h-full"
              >
                {/* Header Metadata */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider">
                    <span className="px-2.5 py-0.5 rounded bg-[var(--muted-surface)]">{p.category}</span>
                    <span>{p.readTime}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-display text-[var(--text-primary)] leading-snug min-h-[48px] hover:text-[#38bdf8] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-semibold line-clamp-3">
                    {p.desc}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="p-6 pt-0 border-t border-[var(--border)] mt-auto flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-[#38bdf8]" />
                      <span>{p.author}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{p.date}</span>
                    </div>
                  </div>

                  <span className="text-[#38bdf8] hover:underline flex items-center gap-0.5 cursor-pointer">
                    <span>{isFa ? "مطالعه" : "Read"}</span>
                    <ArrowRight size={10} className="rtl:-scale-x-100" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
