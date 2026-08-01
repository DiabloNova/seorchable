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
    home: { fa: "خانه", en: "Home" },
    platform: { fa: "پلتفرم", en: "Platform" },
    solutions: { fa: "راهکارها", en: "Solutions" },
    pricing: { fa: "تعرفه‌ها", en: "Pricing" },
    documentation: { fa: "مستندات", en: "Documentation" },
    resources: { fa: "منابع", en: "Resources" },
    blog: { fa: "وبلاگ", en: "Blog" },
    about: { fa: "درباره ما", en: "About Us" },
    contact: { fa: "تماس با ما", en: "Contact Us" },
    status: { fa: "وضعیت سیستم", en: "System Status" },
    privacy: { fa: "حریم خصوصی", en: "Privacy Policy" },
    terms: { fa: "شرایط خدمات", en: "Terms of Service" },
    cookies: { fa: "سیاست کوکی‌ها", en: "Cookie Policy" },
    login: { fa: "ورود", en: "Log In" },
    register: { fa: "ثبت نام", en: "Register" },
    services: { fa: "خدمات", en: "Services" },
    servicesFeatures: { fa: "ویژگی‌های پلتفرم", en: "Platform Features" },
    servicesEnterprise: { fa: "راهکارهای سازمانی", en: "Enterprise Solutions" },
    servicesAudit: { fa: "تحلیل فنی رایگان", en: "Free Technical Audit" },
    servicesStatus: { fa: "وضعیت سیستم", en: "System Status" },
  },
  cta: {
    workspace: { fa: "ورود به میز کار", en: "Go to Workspace" },
    console: { fa: "ورود به پیشخوان کاربری", en: "Enter Console" },
    demo: { fa: "درخواست دمو", en: "Request a demo" },
  },
} as const;
