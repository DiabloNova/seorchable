/**
 * Bilingual (fa / en) copy for the marketing landing page.
 * Farsi is the primary experience; English mirrors it for the LTR locale.
 */

export type Lang = "fa" | "en";

export const marketingContent = {
  brand: {
    fa: "هوشمندی برند",
    en: "BrandIntelligence",
  },
  nav: {
    features: { fa: "قابلیت‌ها", en: "Features" },
    platforms: { fa: "موتورها", en: "Engines" },
    process: { fa: "فرآیند", en: "How it works" },
    metrics: { fa: "دستاوردها", en: "Impact" },
  },
  cta: {
    workspace: { fa: "ورود به میز کار", en: "Go to Workspace" },
    console: { fa: "ورود به پیشخوان کاربری", en: "Enter Console" },
    demo: { fa: "درخواست دمو", en: "Request a demo" },
  },
  menu: {
    open: { fa: "باز کردن منو", en: "Open menu" },
    close: { fa: "بستن منو", en: "Close menu" },
    label: { fa: "منو", en: "Menu" },
    tagline: {
      fa: "هوشمندی برند در عصر موتورهای پاسخ‌گو",
      en: "Brand intelligence for the answer-engine era",
    },
  },
} as const;
