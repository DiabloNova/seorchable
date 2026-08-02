/**
 * Bilingual (fa / en) copy for the marketing landing page.
 * Farsi is the primary experience; English mirrors it for the LTR locale.
 */

export type Lang = "fa" | "en";

export const marketingContent = {
  brand: {
    fa: "seorchable.ir",
    en: "seorchable.ir",
  },
  nav: {
    platform: { fa: "پلتفرم", en: "Platform" },
    solutions: { fa: "راهکارها", en: "Solutions" },
    pricing: { fa: "قیمت‌گذاری", en: "Pricing" },
    docs: { fa: "مستندات", en: "Docs" },
    resources: { fa: "منابع", en: "Resources" },
    about: { fa: "درباره ما", en: "About" },
    contact: { fa: "تماس", en: "Contact" },
    // Legacy keys – kept for any sub-component that still reads them
    features: { fa: "قابلیت‌ها", en: "Features" },
    platforms: { fa: "موتورها", en: "Engines" },
    process: { fa: "فرآیند", en: "How it works" },
    metrics: { fa: "دستاوردها", en: "Impact" },
  },
  cta: {
    workspace: { fa: "ورود به میز کار", en: "Go to Workspace" },
    console: { fa: "ورود به پیشخوان کاربری", en: "Enter Console" },
    demo: { fa: "درخواست دمو", en: "Request a demo" },
    startAudit: { fa: "شروع ممیزی رایگان", en: "Start Free Audit" },
    login: { fa: "ورود", en: "Login" },
    register: { fa: "ثبت‌نام", en: "Register" },
  },
} as const;
