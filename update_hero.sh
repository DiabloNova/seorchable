cat << 'INNER_EOF' > src/components/marketing/Hero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { TrendingUp, ShieldCheck, Zap, ArrowRight, Activity, Globe, Eye, LineChart, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePathname } from "next/navigation";

export function Hero() {
  const { session } = useAuth();
  const pathname = usePathname();
  const language = pathname.startsWith("/fa") ? "fa" : "en";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isFa = language === "fa";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    window.location.href = `/${language}/register?email=${encodeURIComponent(email)}`;
  };

  const chips = [
    { icon: TrendingUp, fa: "افزایش ۳٫۸ برابری ارجاع", en: "3.8× more citations" },
    { icon: ShieldCheck, fa: "پایش لحظه‌ای توهم برند", en: "Live hallucination watch" },
    { icon: Zap, fa: "اتصال به ۴ موتور هوش مصنوعی", en: "4 AI engines connected" },
  ];

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 bg-slate-50 dark:bg-[#0B0F19]">
      {/* Premium Minimal Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center">
        {/* Copy column */}
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            {isFa ? "پلتفرم نسل‌بعدی AEO و GEO" : "Next-generation AEO & GEO platform"}
          </span>

          <h1 className="font-display font-black tracking-tight text-balance text-5xl sm:text-6xl md:text-7xl leading-[1.15] text-slate-900 dark:text-white">
            <span>
              {isFa ? "معرفی برند شما در هوش مصنوعی" : "Optimize Your Brand for AI Search"}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed md:leading-loose max-w-2xl mx-auto text-pretty">
            {isFa
              ? "آنالیز و بهینه‌سازی داده‌های هوش مصنوعی برای معرفی دقیق برند شما به میلیون‌ها کاربر ایرانی."
              : "Analyze and optimize AI search data to accurately represent your brand to millions of users."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-white text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => {
                const ref = document.getElementById("free-audit");
                if (ref) ref.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>{isFa ? "شروع رایگان" : "Start Free"}</span>
            </button>

            <Link href={`/${language}/contact`} className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl text-base font-semibold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>{isFa ? "تماس با ما" : "Contact Us"}</span>
              </button>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center mt-3">
            {isFa ? "شروع آزمایشی به مدت یک هفته کاملا رایگان." : "Start with a one-week free trial."}
          </p>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {chips.map((chip, i) => {
              const Icon = chip.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
                >
                  <Icon size={16} className="text-teal-600 dark:text-teal-400 rtl:-scale-x-100" />
                  {isFa ? chip.fa : chip.en}
                </span>
              );
            })}
          </div>
        </div>

        {/* Dashboard Showcase Wireframe Replacement */}
        <div className="w-full max-w-5xl mx-auto mb-20 relative perspective-1000 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:shadow-black/40 aspect-[16/10] md:aspect-video flex flex-col">

            {/* Top Navigation Bar of Wireframe */}
            <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-slate-50/50 dark:bg-slate-900/50">
               <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                     <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                     <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mx-4 hidden sm:block" />
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-6 w-20 bg-teal-100 dark:bg-teal-900/30 rounded-md" />
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
               </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar Wireframe */}
               <div className="w-16 sm:w-48 border-r rtl:border-l rtl:border-r-0 border-slate-200 dark:border-slate-800 flex flex-col gap-4 p-4 bg-slate-50/30 dark:bg-slate-900/20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-60">
                       <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-800 shrink-0" />
                       <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded hidden sm:block" />
                    </div>
                  ))}
               </div>

               {/* Main Content Area Wireframe */}
               <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden bg-white/50 dark:bg-slate-950/50">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                     <div className="space-y-3 w-1/3">
                        <div className="h-6 w-full max-w-[150px] bg-slate-800 dark:bg-slate-200 rounded-md" />
                        <div className="h-3 w-full max-w-[250px] bg-slate-200 dark:bg-slate-800 rounded" />
                     </div>
                     <div className="h-8 w-24 bg-slate-900 dark:bg-slate-100 rounded-lg hidden sm:block" />
                  </div>

                  {/* Stat Cards Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className="h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between shadow-sm">
                          <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800" />
                          <div className="space-y-2">
                             <div className="h-4 w-1/2 bg-slate-800 dark:bg-slate-200 rounded" />
                             <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Main Chart Area */}
                  <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col gap-4 relative shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-32 bg-slate-800 dark:bg-slate-200 rounded" />
                        <div className="flex gap-2">
                           <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                           <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                     </div>

                     {/* Simulated Chart Bars/Lines */}
                     <div className="flex-1 flex items-end gap-2 md:gap-4 justify-between px-2 pb-2">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 60].map((height, i) => (
                           <div
                             key={i}
                             className="w-full bg-teal-500/20 rounded-t-sm"
                             style={{ height: `${height}%` }}
                           >
                              <div className="w-full bg-teal-500 rounded-t-sm" style={{ height: '4px' }} />
                           </div>
                        ))}
                     </div>

                     {/* Floating Insight Card (Blur Effect) */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 p-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-black/5 animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                           <CheckCircle2 size={16} className="text-teal-500" />
                           <div className="h-3 w-20 bg-slate-800 dark:bg-slate-200 rounded" />
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                        <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Decorative glows behind the showcase (muted, elegant) */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* Email Capture & Access card column */}
        <div className="w-full max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {session.status === "authenticated" ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto grid place-items-center w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                  <ShieldCheck size={26} />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {isFa ? "نشست شما فعال است" : "Your session is active"}
                  </h2>
                  <p className="text-xs text-slate-500 break-all">
                    {session.user?.email}
                  </p>
                </div>
                <Link href={`/${language}/dashboard`} className="block">
                  <Button variant="primary" size="lg" className="w-full font-bold gap-2">
                    {isFa ? "ورود به پیشخوان کاربری" : "Enter admin console"}
                    <ArrowRight size={18} className="rtl:-scale-x-100" />
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-start">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {isFa ? "ورود سریع به میز کار" : "Access the workspace"}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isFa
                      ? "ایمیل سازمانی خود را برای مشاهده‌ی نسخه‌ی نمایشی وارد کنید."
                      : "Enter your business email to open the live sandbox demo."}
                  </p>
                </div>
                <Input
                  type="email"
                  placeholder={isFa ? "you@company.com" : "you@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label={isFa ? "ایمیل سازمانی" : "Business email"}
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isFa
                      ? "در حال اعتبارسنجی..."
                      : "Validating secure session..."
                    : isFa
                      ? "ورود به نسخه‌ی دمو"
                      : "Access live sandbox demo"}
                  {!isLoading && <ArrowRight size={18} className="rtl:-scale-x-100" />}
                </Button>
                <p className="text-[11px] text-slate-400 text-center pt-1">
                  {isFa
                    ? "بدون نیاز به کارت اعتباری — محیط آزمایشی امن"
                    : "No credit card required — secure sandbox environment"}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
INNER_EOF
sh update_hero.sh
