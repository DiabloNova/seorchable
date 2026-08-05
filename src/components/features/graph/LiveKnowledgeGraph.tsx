"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import {
  Activity,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Radio,
  Server,
  ShieldCheck,
  TrendingDown,
  Search,
  CheckCircle2,
  Cpu,
  Share2
} from "lucide-react";

interface GraphEntity {
  id: string;
  hour: number; // clock hour (1-12)
  labelEn: string;
  labelFa: string;
  typeEn: string;
  typeFa: string;
  confidence: number;
  statusEn: string;
  statusFa: string;
  mentions: number;
  strengthEn: string;
  strengthFa: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  lastUpdatedEn: string;
  lastUpdatedFa: string;
  connectedEn: string[];
  connectedFa: string[];
  descriptionEn: string;
  descriptionFa: string;
  baseRadiusTeal: number; // base radius for teal/blue wave spline
  baseRadiusRed: number;  // base radius for red/pink wave spline
}

const ENTITIES: GraphEntity[] = [
  {
    id: "ai-models",
    hour: 1,
    labelEn: "AI Models",
    labelFa: "مدل‌های هوش مصنوعی",
    typeEn: "AI Infrastructure",
    typeFa: "زیرساخت هوش مصنوعی",
    confidence: 98,
    statusEn: "Dominant Presence",
    statusFa: "حضور کاملاً غالب",
    mentions: 14820,
    strengthEn: "High (96%)",
    strengthFa: "بالا (۹۶٪)",
    trend: "up",
    trendValue: "+12.4%",
    lastUpdatedEn: "Updated 10s ago",
    lastUpdatedFa: "بروزرسانی ۱۰ ثانیه پیش",
    connectedEn: ["ChatGPT-4o", "Claude 3.5 Sonnet", "Perplexity AI", "Google Gemini"],
    connectedFa: ["ChatGPT-4o", "Claude 3.5 Sonnet", "Perplexity AI", "Google Gemini"],
    descriptionEn: "Semantic pathways fully established across key LLM context windows and recommendations.",
    descriptionFa: "مسیرهای معنایی برند به طور کامل در لایه‌های عمیق حافظه و پنجره‌های متنی مدل‌های زبانی بزرگ مستقر شده است.",
    baseRadiusTeal: 195, // High peak around sector 1 in the reference image!
    baseRadiusRed: 90
  },
  {
    id: "search-engines",
    hour: 2,
    labelEn: "Search Engines",
    labelFa: "موتورهای جستجو",
    typeEn: "Discovery Index",
    typeFa: "شاخص موتورهای اکتشافی",
    confidence: 95,
    statusEn: "Highly Optimized",
    statusFa: "کاملاً بهینه‌شده",
    mentions: 9450,
    strengthEn: "Outstanding (90%)",
    strengthFa: "بسیار عالی (۹۰٪)",
    trend: "up",
    trendValue: "+8.2%",
    lastUpdatedEn: "Updated 2 mins ago",
    lastUpdatedFa: "بروزرسانی ۲ دقیقه پیش",
    connectedEn: ["Google AI Overviews", "Bing Copilot", "SGE Crawler Optimization"],
    connectedFa: ["مرورهای هوش مصنوعی گوگل", "بینگ کوپایلت", "بهینه‌سازی کراولر SGE"],
    descriptionEn: "Excellent citation density and priority listing inside AI-guided organic search query modules.",
    descriptionFa: "چگالی عالی استنادات متنی و اولویت بالای نمایش در پاسخ‌های غنی‌سازی‌شده موتورهای جستجوی مدرن.",
    baseRadiusTeal: 155,
    baseRadiusRed: 95
  },
  {
    id: "rasha-brand",
    hour: 3,
    labelEn: "Rasha Gostar Brand",
    labelFa: "برند راشا گستر",
    typeEn: "Anchor Entity",
    typeFa: "موجودیت مرجع (هسته)",
    confidence: 99,
    statusEn: "Critical Hub",
    statusFa: "مرکز معنایی حیاتی",
    mentions: 28400,
    strengthEn: "Perfect (100%)",
    strengthFa: "کامل (۱۰۰٪)",
    trend: "up",
    trendValue: "+15.0%",
    lastUpdatedEn: "Updated in real-time",
    lastUpdatedFa: "بروزرسانی در لحظه",
    connectedEn: ["Website Node", "Key Products Node", "Executive Leadership", "SaaS Systems"],
    connectedFa: ["گره وب‌سایت", "گره محصولات کلیدی", "مدیریت ارشد", "سیستم‌های SaaS"],
    descriptionEn: "The core semantic authority node linking all corporate details, subsidiaries, and market footprints.",
    descriptionFa: "هسته مرکزی گراف دانش که تمامی اطلاعات هویتی، دارایی‌های دیجیتال و شعب فیزیکی برند را به یکدیگر پیوند می‌دهد.",
    baseRadiusTeal: 135,
    baseRadiusRed: 80
  },
  {
    id: "products",
    hour: 4,
    labelEn: "Products",
    labelFa: "محصولات کلیدی",
    typeEn: "Commercial Asset",
    typeFa: "دارایی تجاری برند",
    confidence: 96,
    statusEn: "Highly Recommended",
    statusFa: "توصیه‌شده در کوئری‌ها",
    mentions: 11200,
    strengthEn: "Very High (94%)",
    strengthFa: "بسیار بالا (۹۴٪)",
    trend: "up",
    trendValue: "+5.1%",
    lastUpdatedEn: "Updated 1 hour ago",
    lastUpdatedFa: "بروزرسانی ۱ ساعت پیش",
    connectedEn: ["Rasha SaaS Suite", "Enterprise APIs", "Analysis Core Engine"],
    connectedFa: ["سامانه نرم‌افزاری راشا", "APIهای سازمانی", "موتور هسته تحلیل"],
    descriptionEn: "Product catalog correctly parsed and persistently matched to active transactional buying queries.",
    descriptionFa: "کاتالوگ کامل خدمات و محصولات که با دقت توسط ربات‌ها تحلیل شده و به کوئری‌های خرید سازمانی متصل است.",
    baseRadiusTeal: 110,
    baseRadiusRed: 85
  },
  {
    id: "services",
    hour: 5,
    labelEn: "Services",
    labelFa: "خدمات استراتژیک",
    typeEn: "Operational Capability",
    typeFa: "قابلیت‌های عملیاتی",
    confidence: 92,
    statusEn: "Verified Indexing",
    statusFa: "نمایه‌سازی تاییدشده",
    mentions: 6800,
    strengthEn: "Strong (88%)",
    strengthFa: "پایدار و قوی (۸۸٪)",
    trend: "stable",
    trendValue: "0.0%",
    lastUpdatedEn: "Updated 4 hours ago",
    lastUpdatedFa: "بروزرسانی ۴ ساعت پیش",
    connectedEn: ["GEO Optimization", "AI Readiness Audits", "Semantic System Integrations"],
    connectedFa: ["بهینه‌سازی موتورهای هوش مصنوعی", "تحلیل آمادگی هوش مصنوعی", "یکپارچه‌سازی سیستم‌های معنایی"],
    descriptionEn: "Strategic corporate services mapped accurately across business classification systems.",
    descriptionFa: "خدمات استراتژیک سازمانی که با فرمت ساختاریافته به عنوان راه‌حل‌های بهینه در پایگاه‌های داده نمایه شده‌اند.",
    baseRadiusTeal: 115,
    baseRadiusRed: 90
  },
  {
    id: "customers",
    hour: 6,
    labelEn: "Customers",
    labelFa: "مشتریان و همکاران",
    typeEn: "Social Proof Node",
    typeFa: "شاخص اعتبار اجتماعی",
    confidence: 90,
    statusEn: "Active Verification",
    statusFa: "تاییدیه فعال اجتماعی",
    mentions: 5400,
    strengthEn: "Stable (85%)",
    strengthFa: "مستحکم (۸۵٪)",
    trend: "up",
    trendValue: "+4.2%",
    lastUpdatedEn: "Updated 1 day ago",
    lastUpdatedFa: "بروزرسانی ۱ روز پیش",
    connectedEn: ["Tejarat Bank", "MAPNA Group", "MTN Irancell", "National Industries"],
    connectedFa: ["بانک تجارت", "گروه مپنا", "ایرانسل", "صنایع ملی ایران"],
    descriptionEn: "Verified corporate clients and enterprise references establishing strong market validation in LLM weights.",
    descriptionFa: "فهرست مشتریان بزرگ و معتبر که همبستگی برند را در محاسبات ریاضی مدل‌های زبانی به شدت ارتقا داده است.",
    baseRadiusTeal: 120, // Bottom alignment sector
    baseRadiusRed: 110
  },
  {
    id: "competitors",
    hour: 7,
    labelEn: "Competitors",
    labelFa: "رقبای اصلی",
    typeEn: "Comparative Vector",
    typeFa: "بردار تحلیل مقایسه‌ای",
    confidence: 94,
    statusEn: "Absolute Leadership",
    statusFa: "پیشتازی مطلق بازار",
    mentions: 12100,
    strengthEn: "Outperformed (78%)",
    strengthFa: "برتری کامل (۷۸٪)",
    trend: "up",
    trendValue: "+11.5%",
    lastUpdatedEn: "Updated 5 mins ago",
    lastUpdatedFa: "بروزرسانی ۵ دقیقه پیش",
    connectedEn: ["Traditional SEO Agencies", "Legacy Branding Consultants", "Digital Agencies"],
    connectedFa: ["آژانس‌های سئوی سنتی", "مشاوران برندینگ قدیمی", "شرکت‌های بازاریابی دیجیتال"],
    descriptionEn: "Comparative search matrix shows Rasha Gostar dominates recommended share-of-voice over key competitors.",
    descriptionFa: "مقایسه سهم صدای برند با رقبای سنتی، پیشتازی هوشمند راشا گستر در سیستم‌های پیشنهادی را تایید می‌کند.",
    baseRadiusTeal: 105,
    baseRadiusRed: 145 // Pink wave peaks around lower left (7-8)
  },
  {
    id: "technologies",
    hour: 8,
    labelEn: "Technologies",
    labelFa: "فناوری‌های مدرن",
    typeEn: "Core Tech Stack",
    typeFa: "فناوری‌های پایه و ساختار",
    confidence: 97,
    statusEn: "Excellent Vector Match",
    statusFa: "تطابق برداری عالی",
    mentions: 8300,
    strengthEn: "High Authority (93%)",
    strengthFa: "اعتبار بالای فنی (۹۳٪)",
    trend: "up",
    trendValue: "+9.0%",
    lastUpdatedEn: "Updated 3 mins ago",
    lastUpdatedFa: "بروزرسانی ۳ دقیقه پیش",
    connectedEn: ["Vector DB Integration", "Graph Neural Networks", "JSON-LD Triplets"],
    connectedFa: ["پایگاه داده برداری", "شبکه‌های عصبی گرافی", "سه‌تایی‌های معنایی JSON-LD"],
    descriptionEn: "Advanced semantic markup and schema configurations utilized by crawlers to extract high-fidelity knowledge.",
    descriptionFa: "به‌کارگیری میکرودیتاها و معماری نشانه‌گذاری پیشرفته سمانتیک جهت برداشت دقیق اطلاعات بدون ابهام.",
    baseRadiusTeal: 110,
    baseRadiusRed: 160 // Red wave peak around sector 8
  },
  {
    id: "citations",
    hour: 9,
    labelEn: "Mentions & Citations",
    labelFa: "اشارات و استنادها",
    typeEn: "Content Footprint",
    typeFa: "ردپای محتوایی و ارجاعات",
    confidence: 93,
    statusEn: "Expanding Coverage",
    statusFa: "پوشش در حال گسترش",
    mentions: 18900,
    strengthEn: "Strong Linkage (89%)",
    strengthFa: "اتصال مستحکم (۸۹٪)",
    trend: "up",
    trendValue: "+6.7%",
    lastUpdatedEn: "Updated 30s ago",
    lastUpdatedFa: "بروزرسانی ۳۰ ثانیه پیش",
    connectedEn: ["Tech News Hubs", "Financial Journals", "Academic Publications", "Forums"],
    connectedFa: ["رسانه‌های خبری فناوری", "نشریات اقتصادی معتبر", "مقالاتی علمی و پژوهشی", "تالارهای گفتگو"],
    descriptionEn: "High citation density of markdown reference links dynamically included in Perplexity and Gemini answers.",
    descriptionFa: "میزان تراکم رفرنس‌دهی مستقیم و ارجاع با لینک‌های مارک‌داون در پاسخ به سوالات پیچیده کاربران.",
    baseRadiusTeal: 145,
    baseRadiusRed: 110
  },
  {
    id: "website-seo",
    hour: 10,
    labelEn: "Website & SEO",
    labelFa: "وب‌سایت و سئو",
    typeEn: "Digital Hub",
    typeFa: "پایگاه اطلاعات دیجیتال",
    confidence: 98,
    statusEn: "Perfect Crawling Score",
    statusFa: "نمره کراول کامل و بدون نقص",
    mentions: 22100,
    strengthEn: "Outstanding (97%)",
    strengthFa: "اعتبار فوق‌العاده (۹۷٪)",
    trend: "up",
    trendValue: "+13.1%",
    lastUpdatedEn: "Updated 1 min ago",
    lastUpdatedFa: "بروزرسانی ۱ دقیقه پیش",
    connectedEn: ["Semantic Schema Validation", "Sitemap Architecture", "Structured Content Data"],
    connectedFa: ["اعتبارسنجی طرح‌های معنایی", "ساختار بهینه نقشه وب‌سایت", "محتوای غنی‌شده با ساختار نو"],
    descriptionEn: "Perfect semantic web compatibility allowing seamless indexing by automated artificial intelligence agents.",
    descriptionFa: "سازگاری کامل زیرساخت سایت با وب معنایی جهت برداشت خودکار اطلاعات توسط عوامل هوشمند و خزنده‌ها.",
    baseRadiusTeal: 125,
    baseRadiusRed: 85
  },
  {
    id: "social-profiles",
    hour: 11,
    labelEn: "Social Profiles",
    labelFa: "شبکه‌های اجتماعی",
    typeEn: "Brand Footprint",
    typeFa: "پایگاه‌های تعاملات اجتماعی",
    confidence: 89,
    statusEn: "Active Sentiment Feed",
    statusFa: "جریان بازخورد مثبت",
    mentions: 4900,
    strengthEn: "Reliable (82%)",
    strengthFa: "پایدار و مطمئن (۸۲٪)",
    trend: "up",
    trendValue: "+2.5%",
    lastUpdatedEn: "Updated 2 hours ago",
    lastUpdatedFa: "بروزرسانی ۲ ساعت پیش",
    connectedEn: ["LinkedIn Corporate Page", "X (Twitter) Feed", "GitHub Enterprise Ecosystem"],
    connectedFa: ["صفحه شرکتی لینکدین", "جریان اخبار توییتر (X)", "مخازن گیت‌هاب سازمانی"],
    descriptionEn: "Highly positive user sentiment and active community engagement feeds tracking corporate milestones.",
    descriptionFa: "برداشت عمومی مثبت مخاطبان و تعاملات ارگانیک پیرامون رویدادها و دستاوردهای فنی راشا گستر.",
    baseRadiusTeal: 115,
    baseRadiusRed: 75
  },
  {
    id: "industry-market",
    hour: 12,
    labelEn: "Industry & Market",
    labelFa: "صنعت و بازار هدف",
    typeEn: "Contextual Domain",
    typeFa: "حوزه فعالیت و مارکت",
    confidence: 95,
    statusEn: "Absolute Category Leader",
    statusFa: "رهبر مقتدر صنف و شاخه",
    mentions: 16400,
    strengthEn: "Excellent Alignment (92%)",
    strengthFa: "تطابق کم‌نظیر (۹۲٪)",
    trend: "stable",
    trendValue: "+1.0%",
    lastUpdatedEn: "Updated 3 hours ago",
    lastUpdatedFa: "بروزرسانی ۳ ساعت پیش",
    connectedEn: ["B2B SaaS Sector", "AI Search Optimization Industry", "Enterprise Tech Solutions"],
    connectedFa: ["صنعت نرم‌افزارهای B2B SaaS", "بازار بهینه‌سازی موتورهای هوش مصنوعی", "خدمات فناوری‌های سازمانی"],
    descriptionEn: "Primary authority index registered as the pioneering force for conversational search optimization.",
    descriptionFa: "ثبت برند به عنوان نماد پیشگام و لیدر صنف در تحلیل‌های سهم بازار و پیشنهادهای هوشمند موتورهای جستجو.",
    baseRadiusTeal: 110,
    baseRadiusRed: 80
  }
];

export function LiveKnowledgeGraph() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const [selectedIdx, setSelectedIdx] = useState<number>(2); // Default to Brand Rasha Gostar
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<number>(0);

  // Real-time parameters
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastSyncSeconds, setLastSyncSeconds] = useState<number>(14);
  const [streamActive, setStreamActive] = useState<boolean>(true);

  // SVG parameters
  const cx = 300;
  const cy = 300;
  const maxR = 210;

  // Animation loop with requestAnimationFrame
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setPhase((p) => (p + 0.015) % (Math.PI * 2));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Timer ticks for telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncSeconds((prev) => {
        if (prev >= 59) return 1;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Re-sync simulation
  const handleReSync = () => {
    setIsScanning(true);
    setStreamActive(false);
    setTimeout(() => {
      setIsScanning(false);
      setStreamActive(true);
      setLastSyncSeconds(0);
    }, 1800);
  };

  // Compute smooth floating radial values based on continuous phase wave
  const getPulsedRadius = (baseVal: number, idx: number, speed: number, amp: number) => {
    if (isScanning) {
      // Create sweep scan wave
      const sweep = Math.sin(phase * 4 + idx * 0.8) * 15;
      return baseVal + sweep;
    }
    const wave = Math.sin(phase * speed + idx * 1.6) * amp;
    return baseVal + wave;
  };

  // Generate smooth closed bezier spline paths for organic wave visualizer
  const getClosedSplinePath = (isTeal: boolean) => {
    const points = ENTITIES.map((ent, i) => {
      const baseRadius = isTeal ? ent.baseRadiusTeal : ent.baseRadiusRed;
      const pulseSpeed = isTeal ? 1.0 : 1.4;
      const pulseAmp = isTeal ? 6.5 : 8.0;
      const r = Math.min(maxR + 10, Math.max(40, getPulsedRadius(baseRadius, i, pulseSpeed, pulseAmp)));
      const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2; // clock orientation
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        angle
      };
    });

    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < 12; i++) {
      const pStart = points[i];
      const pEnd = points[(i + 1) % 12];

      const cpScale = 0.36; // Tension coefficient
      const angleStart = pStart.angle + Math.PI / 2;
      const angleEnd = pEnd.angle - Math.PI / 2;

      const rStart = isTeal ? ENTITIES[i].baseRadiusTeal : ENTITIES[i].baseRadiusRed;
      const rEnd = isTeal ? ENTITIES[(i + 1) % 12].baseRadiusTeal : ENTITIES[(i + 1) % 12].baseRadiusRed;

      const cp1x = pStart.x + Math.cos(angleStart) * (rStart * cpScale);
      const cp1y = pStart.y + Math.sin(angleStart) * (rStart * cpScale);
      const cp2x = pEnd.x + Math.cos(angleEnd) * (rEnd * cpScale);
      const cp2y = pEnd.y + Math.sin(angleEnd) * (rEnd * cpScale);

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pEnd.x},${pEnd.y}`;
    }
    return path + " Z";
  };

  // Shaded gear central core disc drawing containing realistic reference notches at sector 10, 8, 6
  const centralCorePath = useMemo(() => {
    const sectors = 24;
    let path = "";
    for (let i = 0; i < sectors; i++) {
      const angle1 = (i * 2 * Math.PI) / sectors - Math.PI / 2;
      const angle2 = ((i + 1) * 2 * Math.PI) / sectors - Math.PI / 2;

      // Determine radius with indents/notches matching sector 6, 8, 10
      const currentHour = ((i / 2) + 12) % 12 || 12;
      let r = 52;
      // Recess notches at 6, 8, 10
      if (Math.abs(currentHour - 10) < 0.6 || Math.abs(currentHour - 8) < 0.6 || Math.abs(currentHour - 6) < 0.6) {
        r = 38;
      }

      const x1 = cx + Math.cos(angle1) * r;
      const y1 = cy + Math.sin(angle1) * r;
      const x2 = cx + Math.cos(angle2) * r;
      const y2 = cy + Math.sin(angle2) * r;

      if (i === 0) {
        path += `M ${cx},${cy} L ${x1},${y1}`;
      }
      path += ` A ${r},${r} 0 0,1 ${x2},${y2} L ${cx},${cy}`;
    }
    return path;
  }, []);

  const selectedEntity = ENTITIES[selectedIdx];

  return (
    <div className="space-y-10" dir={isFa ? "rtl" : "ltr"}>
      {/* 1. Header and Context Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs uppercase font-black tracking-wider text-orange-500 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
          {isFa ? "موتور هوش مصنوعی مانیتورینگ معنایی" : "AI ENGINE SEMANTIC DISCOVERY"}
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl text-gradient-brand">
          {isFa ? "گراف زنده روابط و پوشش معنایی" : "Live Semantic Discovery & Graph"}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base font-medium max-w-2xl mx-auto">
          {isFa
            ? "پایش تعاملی و مانیتورینگ زنده ارتباط برند «راشا گستر» با منابع مرجع، نهادهای بازار و مدل‌های هوش مصنوعی بزرگ به موازات استنادات ورودی."
            : "An interactive radial dial mapping Rasha Gostar's relational authority nodes, search components, and semantic link depth in real-time."}
        </p>
      </div>

      {/* Flagship Enterprise Glass Box */}
      <div className="glass-panel rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl p-6 md:p-8 relative overflow-hidden space-y-8">

        {/* Decorative dynamic glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#38bdf8]/5 via-[#2563eb]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#f43f5e]/5 via-[#d946ef]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* CONTROLS & MONITORING STATS BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6 relative z-10">

          <div className="flex items-center gap-4">
            <div className="relative">
              <span className={`absolute inset-0 rounded-full bg-emerald-500/30 scale-150 ${streamActive ? "animate-ping" : ""}`} />
              <div className={`relative w-3.5 h-3.5 rounded-full border border-black/10 flex items-center justify-center ${isScanning ? "bg-amber-500" : "bg-emerald-500"}`}>
                <Radio className="w-2 h-2 text-white" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[var(--text-primary)]">
                  {isFa ? "وضعیت زنده تحلیل" : "LIVE TELEMETRY ACTIVE"}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                  {isFa ? "جاری" : "STREAMING"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium flex items-center gap-1.5">
                <Server className="w-3 h-3 text-[#38bdf8]" />
                {isFa
                  ? `بروزرسانی‌شده در ${lastSyncSeconds} ثانیه قبل | کانال‌های مانیتورینگ فعال`
                  : `Updated ${lastSyncSeconds}s ago | Real-time AI crawlers synchronized`
                }
              </p>
            </div>
          </div>

          <button
            onClick={handleReSync}
            disabled={isScanning}
            className={`relative overflow-hidden group px-4 py-2 rounded-xl border border-[var(--border)] hover:border-[#38bdf8]/40 bg-white/[0.02] hover:bg-[#38bdf8]/5 text-xs font-bold text-[var(--text-secondary)] hover:text-[#38bdf8] flex items-center gap-2 transition-all duration-300 ${isScanning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-amber-400" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            <span>{isFa ? "همگام‌سازی مجدد جریان موتور" : "Re-sync Engine Stream"}</span>
          </button>
        </div>

        {/* 2. MAIN GRAPH VIEWPORT */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch relative z-10">

          {/* THE RADIAL DIAL GRAPH VISUALIZATION (LEFT 55%) */}
          <div className="lg:col-span-7 flex flex-col justify-between items-center bg-slate-900/5 dark:bg-black/15 border border-[var(--border)]/15 rounded-3xl p-4 md:p-6 relative overflow-hidden min-h-[520px]">

            {/* Visual sweep scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-[#38bdf8]/10 to-transparent animate-pulse pointer-events-none z-20 border border-[#38bdf8]/30 rounded-3xl" />
            )}

            {/* Glowing background hub */}
            <div
              className="absolute w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-25 transition-all duration-1000"
              style={{
                backgroundColor: selectedEntity.id === "competitors" ? "rgba(244, 63, 94, 0.4)" : "rgba(56, 189, 248, 0.4)",
                top: "20%",
                left: "20%"
              }}
            />

            <div className="w-full max-w-[480px] aspect-square relative select-none">
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full relative z-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Central Glow Filters */}
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Wave Gradients */}
                  <linearGradient id="waveTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient id="waveRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* 12 Sector Dotted Spokes and Hour Rays */}
                {ENTITIES.map((ent, idx) => {
                  const angle = (idx * 2 * Math.PI) / 12 - Math.PI / 2;
                  const isSelected = selectedIdx === idx;
                  const isHovered = hoveredIdx === idx;

                  // Radial line endpoints
                  const xStart = cx + Math.cos(angle) * 52;
                  const yStart = cy + Math.sin(angle) * 52;
                  const xEnd = cx + Math.cos(angle) * 230;
                  const yEnd = cy + Math.sin(angle) * 230;

                  return (
                    <line
                      key={`ray-${idx}`}
                      x1={xStart}
                      y1={yStart}
                      x2={xEnd}
                      y2={yEnd}
                      stroke={isSelected ? "#38bdf8" : isHovered ? "rgba(56, 189, 248, 0.4)" : "rgba(148, 163, 184, 0.12)"}
                      strokeWidth={isSelected ? "1.5" : "1"}
                      strokeDasharray="2, 4"
                      className="transition-colors duration-300"
                    />
                  );
                })}

                {/* Concentric Circle Guides */}
                {[120, 180, 230].map((rGuide) => (
                  <circle
                    key={`guide-${rGuide}`}
                    cx={cx}
                    cy={cy}
                    r={rGuide}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.08)"
                    strokeWidth="1"
                    strokeDasharray="4, 4"
                  />
                ))}

                {/* Outer Circular Bounds/Arcs matching the reference visual */}
                {/* 1. Outer Dark Blue Arc (Sectors 10 through 12, 1, 2, 3, 4, 5, 6) */}
                <path
                  d={`M ${cx + Math.cos(-Math.PI/3) * 234},${cy + Math.sin(-Math.PI/3) * 234}
                     A 234,234 0 1,1 ${cx + Math.cos(Math.PI/2) * 234},${cy + Math.sin(Math.PI/2) * 234}`}
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* 2. Outer Light Pink/Red Arc Left Bounds (Sectors 6 to 10) */}
                <path
                  d={`M ${cx + Math.cos(Math.PI/2) * 234},${cy + Math.sin(Math.PI/2) * 234}
                     A 234,234 0 0,1 ${cx + Math.cos(-Math.PI/3) * 234},${cy + Math.sin(-Math.PI/3) * 234}`}
                  fill="none"
                  stroke="#fca5a5"
                  strokeWidth="2"
                  strokeDasharray="4, 4"
                  opacity="0.6"
                />

                {/* 3. Deep Red Arc Inner Ring (Sector 7 to 8) */}
                <path
                  d={`M ${cx + Math.cos((6 * 2 * Math.PI)/12 - Math.PI/2) * 212},${cy + Math.sin((6 * 2 * Math.PI)/12 - Math.PI/2) * 212}
                     A 212,212 0 0,1 ${cx + Math.cos((8 * 2 * Math.PI)/12 - Math.PI/2) * 212},${cy + Math.sin((8 * 2 * Math.PI)/12 - Math.PI/2) * 212}`}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* 4. Active Green/Teal Outer Segment (Sector 4 to 5) */}
                <path
                  d={`M ${cx + Math.cos((3 * 2 * Math.PI)/12 - Math.PI/2) * 234},${cy + Math.sin((3 * 2 * Math.PI)/12 - Math.PI/2) * 234}
                     A 234,234 0 0,1 ${cx + Math.cos((4.5 * 2 * Math.PI)/12 - Math.PI/2) * 234},${cy + Math.sin((4.5 * 2 * Math.PI)/12 - Math.PI/2) * 234}`}
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* 5. Thick Blue Bottom Arc segment (Sector 5 to 6) */}
                <path
                  d={`M ${cx + Math.cos((4.5 * 2 * Math.PI)/12 - Math.PI/2) * 212},${cy + Math.sin((4.5 * 2 * Math.PI)/12 - Math.PI/2) * 212}
                     A 212,212 0 0,1 ${cx + Math.cos((6 * 2 * Math.PI)/12 - Math.PI/2) * 212},${cy + Math.sin((6 * 2 * Math.PI)/12 - Math.PI/2) * 212}`}
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* ORGANIC FLOATING SPLINE WAVES */}
                {/* Wave 1: Teal Wave (AI Semantic Coverage) */}
                <path
                  d={getClosedSplinePath(true)}
                  fill="url(#waveTealGrad)"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  opacity="0.85"
                  className="transition-all duration-300"
                />

                {/* Wave 2: Pink/Red Wave (Traditional Entity Vector) */}
                <path
                  d={getClosedSplinePath(false)}
                  fill="url(#waveRedGrad)"
                  stroke="#f43f5e"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  opacity="0.75"
                  className="transition-all duration-300"
                />

                {/* DIAGNOSTIC POINTER ARROWS WITH DIAMOND HEADS (Inward Pointing) */}
                {/* 1. Blue pointer inward at Sector 10 (Website) */}
                {(() => {
                  const angle = (9 * 2 * Math.PI) / 12 - Math.PI / 2; // Hour 10
                  const xOuter = cx + Math.cos(angle) * 234;
                  const yOuter = cy + Math.sin(angle) * 234;
                  const xInner = cx + Math.cos(angle) * 38;
                  const yInner = cy + Math.sin(angle) * 38;
                  return (
                    <g key="ptr-10">
                      <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#1d4ed8" strokeWidth="1.8" />
                      <g transform={`translate(${xInner}, ${yInner}) rotate(${(angle * 180) / Math.PI + 90})`}>
                        <polygon points="0,-7 5,0 0,7 -5,0" fill="#1d4ed8" />
                      </g>
                    </g>
                  );
                })()}

                {/* 2. Red pointer inward at Sector 8 (Technologies) */}
                {(() => {
                  const angle = (7 * 2 * Math.PI) / 12 - Math.PI / 2; // Hour 8
                  const xOuter = cx + Math.cos(angle) * 212;
                  const yOuter = cy + Math.sin(angle) * 212;
                  const xInner = cx + Math.cos(angle) * 38;
                  const yInner = cy + Math.sin(angle) * 38;
                  return (
                    <g key="ptr-8">
                      <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#ef4444" strokeWidth="1.8" />
                      <g transform={`translate(${xInner}, ${yInner}) rotate(${(angle * 180) / Math.PI + 90})`}>
                        <polygon points="0,-7 5,0 0,7 -5,0" fill="#ef4444" />
                      </g>
                    </g>
                  );
                })()}

                {/* 3. Red pointer inward at Sector 7 (Competitors) */}
                {(() => {
                  const angle = (6.5 * 2 * Math.PI) / 12 - Math.PI / 2; // Hour 7.5
                  const xOuter = cx + Math.cos(angle) * 212;
                  const yOuter = cy + Math.sin(angle) * 212;
                  const xInner = cx + Math.cos(angle) * 52;
                  const yInner = cy + Math.sin(angle) * 52;
                  return (
                    <g key="ptr-7">
                      <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#ef4444" strokeWidth="1.5" />
                      <g transform={`translate(${xInner}, ${yInner}) rotate(${(angle * 180) / Math.PI + 90})`}>
                        <polygon points="0,-7 5,0 0,7 -5,0" fill="#ef4444" />
                      </g>
                    </g>
                  );
                })()}

                {/* 4. Blue pointer inward at Sector 6 (Customers) */}
                {(() => {
                  const angle = (5 * 2 * Math.PI) / 12 - Math.PI / 2; // Hour 6
                  const xOuter = cx + Math.cos(angle) * 234;
                  const yOuter = cy + Math.sin(angle) * 234;
                  const xInner = cx + Math.cos(angle) * 38;
                  const yInner = cy + Math.sin(angle) * 38;
                  return (
                    <g key="ptr-6">
                      <line x1={xOuter} y1={yOuter} x2={xInner} y2={yInner} stroke="#1d4ed8" strokeWidth="1.8" />
                      <g transform={`translate(${xInner}, ${yInner}) rotate(${(angle * 180) / Math.PI + 90})`}>
                        <polygon points="0,-7 5,0 0,7 -5,0" fill="#1d4ed8" />
                      </g>
                    </g>
                  );
                })()}

                {/* INTERACTIVE LABELS & OUTER CLOCK BOUNDARIES */}
                {ENTITIES.map((ent, idx) => {
                  const angle = (idx * 2 * Math.PI) / 12 - Math.PI / 2;

                  // Position numbers around outer circumference
                  const numX = cx + Math.cos(angle) * 254;
                  const numY = cy + Math.sin(angle) * 254;

                  const isSelected = selectedIdx === idx;
                  const isHovered = hoveredIdx === idx;

                  return (
                    <g key={`clock-labels-${idx}`} className="cursor-pointer" onClick={() => setSelectedIdx(idx)}>

                      {/* Numeric Clock Label Indicator */}
                      <circle
                        cx={numX}
                        cy={numY}
                        r={isSelected ? "14" : isHovered ? "11" : "9"}
                        fill={isSelected ? "#38bdf8" : isHovered ? "rgba(56, 189, 248, 0.15)" : "transparent"}
                        stroke={isSelected ? "#2563eb" : "rgba(148, 163, 184, 0.2)"}
                        strokeWidth="1.2"
                        className="transition-all duration-300"
                      />
                      <text
                        x={numX}
                        y={numY + 3.5}
                        textAnchor="middle"
                        fontSize={isSelected ? "11" : "9.5"}
                        fontWeight="black"
                        fill={isSelected ? "#ffffff" : isHovered ? "#38bdf8" : "rgba(148, 163, 184, 0.6)"}
                        className="font-mono select-none transition-colors"
                      >
                        {ent.hour}
                      </text>

                      {/* Floating Text Nodes near sectors (Only highlight/render elegantly) */}
                      {(() => {
                        const tRadius = 280;
                        const tx = cx + Math.cos(angle) * tRadius;
                        const ty = cy + Math.sin(angle) * tRadius;

                        let textAnchor: "start" | "end" | "middle" = "middle";
                        const cosVal = Math.cos(angle);
                        if (cosVal > 0.1) textAnchor = "start";
                        else if (cosVal < -0.1) textAnchor = "end";

                        return (
                          <g
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                          >
                            <text
                              x={tx}
                              y={ty}
                              textAnchor={textAnchor}
                              fontSize="11.5"
                              fontWeight="black"
                              fill={isSelected ? "#38bdf8" : isHovered ? "rgba(56, 189, 248, 0.85)" : "var(--text-primary)"}
                              className="font-sans select-none transition-all duration-200"
                            >
                              {isFa ? ent.labelFa : ent.labelEn}
                            </text>

                            <text
                              x={tx}
                              y={ty + 11}
                              textAnchor={textAnchor}
                              fontSize="8.5"
                              fontWeight="bold"
                              fill="rgba(148, 163, 184, 0.4)"
                              className="font-mono select-none"
                            >
                              {`${ent.confidence}% AI CONF`}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })}

                {/* CENTRAL SHADED GEAR / NOTCHED CORE */}
                <g opacity="0.95" className="transition-all duration-300">
                  <path
                    d={centralCorePath}
                    fill="rgba(148, 163, 184, 0.12)"
                    stroke="rgba(148, 163, 184, 0.25)"
                    strokeWidth="1"
                  />

                  {/* Outer notched bounding ring */}
                  <circle cx={cx} cy={cy} r="52" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" strokeDasharray="2, 3" />

                  {/* Solid central blue anchor point */}
                  <circle cx={cx} cy={cy} r="9" fill="#0f172a" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2.5" />
                  <circle cx={cx} cy={cy} r="3.5" fill="#38bdf8" />
                </g>
              </svg>
            </div>

            {/* Bottom visual helper legend */}
            <div className="w-full border-t border-[var(--border)]/15 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="flex gap-5 text-xs font-bold text-[var(--text-secondary)] select-none">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#0d9488] to-[#0284c7] border border-teal-500/20" />
                  <span>{isFa ? "موج پوشش معنایی" : "Semantic Wave"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#ef4444] to-[#f43f5e] border border-rose-500/20" />
                  <span>{isFa ? "موج ردپای سنتی" : "Traditional Vector"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-medium">
                <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>{isFa ? "روی ساعت‌ها یا گره‌های اطراف کلیک کنید" : "Click outer hours or nodes to inspect"}</span>
              </div>
            </div>

          </div>

          {/* SIDEBAR METRIC CARDS / SECTORS (RIGHT 45%) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">

            {/* Hour Selector Compact Matrix Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ENTITIES.map((ent, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-2.5 rounded-xl border text-center font-mono text-xs font-black transition-all ${
                      isSelected
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/50 shadow-md ring-1 ring-sky-500/20"
                        : "bg-white/[0.01] hover:bg-white/[0.03] border-[var(--border)]/15 text-[var(--text-secondary)]"
                    }`}
                  >
                    <span>{isFa ? "ساعت " : "H"}{ent.hour}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick List Overview */}
            <div className="grid grid-cols-2 gap-3.5">
              {[0, 1, 2, 3].map((subOffset) => {
                const targetIdx = (selectedIdx + subOffset) % 12;
                const ent = ENTITIES[targetIdx];
                const isCurrent = targetIdx === selectedIdx;

                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedIdx(targetIdx)}
                    className={`group text-right relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      isCurrent
                        ? "bg-white/[0.04] dark:bg-black/30 border-sky-500/40 shadow-lg shadow-sky-500/5"
                        : "bg-white/[0.01] hover:bg-white/[0.03] border-[var(--border)]/10"
                    }`}
                  >
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[var(--text-muted)] font-black uppercase truncate max-w-[85px]">
                        {isFa ? ent.typeFa : ent.typeEn}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        ent.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {ent.trend === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <Activity className="w-2.5 h-2.5" />}
                        <span>{ent.trendValue}</span>
                      </span>
                    </div>

                    <div className="my-2 text-right">
                      <h4 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                        {isFa ? ent.labelFa : ent.labelEn}
                      </h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-black font-display text-[var(--text-primary)] tracking-tight">
                          {ent.confidence}%
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] font-bold">
                          {isFa ? "اطمینان هوش مصنوعی" : "AI CONF"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* REAL-TIME DEEP ANALYSIS CARD (Sits beneath) */}
            <div className="glass-panel border border-sky-500/20 bg-sky-500/5 rounded-2xl p-4 md:p-5 relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                    <span className="text-[10px] uppercase font-bold text-sky-400">
                      {isFa ? "بررسی عمیق موجودیت در گراف زنده روابط" : "SELECTED DEEP ANALYSIS"}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">
                    {isFa ? selectedEntity.labelFa : selectedEntity.labelEn}
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-white/5 border border-[var(--border)]/15 px-2.5 py-1 rounded-xl">
                  <Award className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="text-xs font-black text-[#38bdf8]">
                    {selectedEntity.confidence}% {isFa ? "اطمینان" : "Conf"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                {isFa ? selectedEntity.descriptionFa : selectedEntity.descriptionEn}
              </p>

              {/* Connected components */}
              <div className="space-y-2 border-t border-[var(--border)]/10 pt-3">
                <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#38bdf8]" />
                  {isFa ? "ارتباطات معنایی مانیتور شده در گراف دانش" : "Verified Reference Concept Nodes"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(isFa ? selectedEntity.connectedFa : selectedEntity.connectedEn).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] bg-slate-950/40 border border-[var(--border)]/15 hover:border-[#38bdf8]/30 px-2.5 py-0.5 rounded-lg text-slate-300 font-bold transition-all hover:-translate-y-0.5 cursor-pointer animate-fade-in"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. INFORMATION PANEL (Below the visualization) */}
        <div className="border-t border-[var(--border)]/15 pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm uppercase font-black tracking-wider text-[var(--text-primary)]">
              {isFa ? "پنل تفصیلی اطلاعات گره معنایی" : "Semantic Node Detailed Information Panel"}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Item 1: Name */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "نام موجودیت" : "Entity Name"}
              </span>
              <span className="text-sm font-black text-[var(--text-primary)] truncate block">
                {isFa ? selectedEntity.labelFa : selectedEntity.labelEn}
              </span>
            </div>

            {/* Item 2: Type */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "نوع موجودیت" : "Entity Type"}
              </span>
              <span className="text-sm font-black text-sky-400 block">
                {isFa ? selectedEntity.typeFa : selectedEntity.typeEn}
              </span>
            </div>

            {/* Item 3: Confidence Score */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "میزان اطمینان" : "Confidence Score"}
              </span>
              <span className="text-sm font-black text-emerald-500 font-mono block">
                {selectedEntity.confidence}%
              </span>
            </div>

            {/* Item 4: Last Updated */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "آخرین بروزرسانی" : "Last Updated"}
              </span>
              <span className="text-sm font-black text-[var(--text-secondary)] block">
                {isFa ? selectedEntity.lastUpdatedFa : selectedEntity.lastUpdatedEn}
              </span>
            </div>

            {/* Item 5: AI Visibility Status */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "وضعیت دیده‌شدن هوش مصنوعی" : "AI Visibility Status"}
              </span>
              <span className="text-sm font-black text-orange-400 block">
                {isFa ? selectedEntity.statusFa : selectedEntity.statusEn}
              </span>
            </div>

            {/* Item 6: Mention Count */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "تعداد اشارات پایش شده" : "Mention Count"}
              </span>
              <span className="text-sm font-black text-[var(--text-primary)] font-mono block">
                {selectedEntity.mentions.toLocaleString()}
              </span>
            </div>

            {/* Item 7: Relationship Strength */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "قدرت همبستگی" : "Relationship Strength"}
              </span>
              <span className="text-sm font-black text-indigo-400 block">
                {isFa ? selectedEntity.strengthFa : selectedEntity.strengthEn}
              </span>
            </div>

            {/* Item 8: Industry Benchmark */}
            <div className="p-4 rounded-xl bg-slate-950/20 border border-[var(--border)]/10 hover:border-sky-500/20 transition-all">
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block mb-1">
                {isFa ? "وضعیت پیوند معنایی" : "Semantic Linkage State"}
              </span>
              <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {isFa ? "فعال و ایمن" : "Active & Secure"}
              </span>
            </div>
          </div>
        </div>

        {/* 4. EXTRA ANALYTICS CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[var(--border)]/15">

          <div className="p-4 rounded-2xl bg-white/[0.01] dark:bg-black/10 border border-[var(--border)]/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block">
                {isFa ? "میزان کل استنادات برند" : "TOTAL SEMANTIC CITATIONS"}
              </span>
              <span className="text-lg font-black text-[var(--text-primary)] font-mono">
                {isFa ? "۱۴۲,۸۳۰ استناد" : "142,830 Citations"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] dark:bg-black/10 border border-[var(--border)]/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block">
                {isFa ? "ضریب ضدتوهم (پایداری)" : "HALLUCINATION SHIELD"}
              </span>
              <span className="text-lg font-black text-[var(--text-primary)] font-mono">
                {isFa ? "۹۸.۴٪ ایمن" : "98.4% Secure"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] dark:bg-black/10 border border-[var(--border)]/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block">
                {isFa ? "گره‌های فعال در گراف دانش" : "ACTIVE GRAPH NODES"}
              </span>
              <span className="text-lg font-black text-[var(--text-primary)] font-mono">
                {isFa ? "۱۲ گره دایره‌ای" : "12 Clock Nodes"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] dark:bg-black/10 border border-[var(--border)]/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-black uppercase block">
                {isFa ? "رتبه سهم بازار هوشمند" : "INTELLIGENT SHARE OF VOICE"}
              </span>
              <span className="text-lg font-black text-[var(--text-primary)] font-mono">
                {isFa ? "رتبه ۱ در صنف" : "Rank #1 Leader"}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
