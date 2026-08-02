"use client";

import React, { useEffect, useRef, use } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Network,
  Activity,
  CheckCircle,
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { FreeAuditPanel } from "@/components/features/audit/FreeAuditPanel";

// Interfaces for our interactive Canvas Knowledge Graph
interface GraphNode {
  id: string;
  label: string;
  type: "brand" | "competitor" | "model" | "feature";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

/**
 * Enterprise AI Brand Intelligence Home Page.
 * Showcases the interactive knowledge graph canvas, brand credibility,
 * trust indicators, and embeds the live technical audit panel directly.
 */
export default function MarketingLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isFa = locale === "fa";

  // References for Canvas animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isOver: false, hoveredNodeId: null as string | null });

  // References for scrolling to sections
  const freeAuditRef = useRef<HTMLDivElement | null>(null);

  // Initialise and run interactive Canvas Knowledge Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const nodes: GraphNode[] = [
      { id: "optimus", label: isFa ? "اپتیموس هوش مصنوعی" : "Optimus AI", type: "brand", x: 250, y: 180, vx: 0, vy: 0, radius: 45 },
      { id: "digikala", label: isFa ? "دیجی‌کالا" : "Digikala", type: "competitor", x: 100, y: 100, vx: 0, vy: 0, radius: 32 },
      { id: "snapp", label: isFa ? "اسنپ" : "Snapp", type: "competitor", x: 120, y: 280, vx: 0, vy: 0, radius: 32 },
      { id: "gpt4", label: "GPT-4o", type: "model", x: 400, y: 90, vx: 0, vy: 0, radius: 35 },
      { id: "claude", label: "Claude 3.5", type: "model", x: 420, y: 260, vx: 0, vy: 0, radius: 35 },
      { id: "aeo", label: isFa ? "تولید محتوای AEO" : "AEO Generation", type: "feature", x: 250, y: 50, vx: 0, vy: 0, radius: 30 },
      { id: "semantic", label: isFa ? "تحلیل معنایی" : "Semantic Analysis", type: "feature", x: 260, y: 320, vx: 0, vy: 0, radius: 30 },
    ];

    const links: GraphLink[] = [
      { source: "optimus", target: "digikala", label: isFa ? "رقابت معنایی" : "Semantic Rivalry" },
      { source: "optimus", target: "snapp", label: isFa ? "رقابت معنایی" : "Semantic Rivalry" },
      { source: "optimus", target: "gpt4", label: isFa ? "تحلیل‌شده توسط" : "Analyzed By" },
      { source: "optimus", target: "claude", label: isFa ? "تحلیل‌شده توسط" : "Analyzed By" },
      { source: "optimus", target: "aeo", label: isFa ? "موتور بهینه‌سازی" : "Optimization Engine" },
      { source: "optimus", target: "semantic", label: isFa ? "هسته فناوری" : "Tech Core" },
      { source: "digikala", target: "gpt4", label: isFa ? "سهم صدای رقیب" : "Competitor VoS" },
      { source: "snapp", target: "claude", label: isFa ? "سهم صدای رقیب" : "Competitor VoS" },
    ];

    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (parent && canvas) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        nodes[0].x = canvas.width / 2;
        nodes[0].y = canvas.height / 2;
        nodes[1].x = canvas.width * 0.2;
        nodes[1].y = canvas.height * 0.25;
        nodes[2].x = canvas.width * 0.25;
        nodes[2].y = canvas.height * 0.75;
        nodes[3].x = canvas.width * 0.8;
        nodes[3].y = canvas.height * 0.22;
        nodes[4].x = canvas.width * 0.75;
        nodes[4].y = canvas.height * 0.72;
        nodes[5].x = canvas.width / 2;
        nodes[5].y = canvas.height * 0.15;
        nodes[6].x = canvas.width * 0.48;
        nodes[6].y = canvas.height * 0.82;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.isOver = true;

      let hoveredId: string | null = null;
      for (const node of nodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.radius) {
          hoveredId = node.id;
          break;
        }
      }
      mouseRef.current.hoveredNodeId = hoveredId;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false;
      mouseRef.current.hoveredNodeId = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let particleOffset = 0;
    const animate = () => {
      particleOffset += 0.5;
      if (particleOffset > 100) particleOffset = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hoveredNodeId = mouseRef.current.hoveredNodeId;

      nodes.forEach((node) => {
        const time = Date.now() * 0.001;
        const indexOffset = nodes.indexOf(node) * 1.5;
        const floatX = Math.sin(time + indexOffset) * 0.15;
        const floatY = Math.cos(time * 0.8 + indexOffset) * 0.15;

        node.x += floatX;
        node.y += floatY;

        if (mouseRef.current.isOver) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 10) {
            const pullStrength = 0.04 * (1 - dist / 200);
            node.x += (dx / dist) * pullStrength;
            node.y += (dy / dist) * pullStrength;
          }
        }

        if (node.x < node.radius) node.x = node.radius;
        if (node.x > canvas.width - node.radius) node.x = canvas.width - node.radius;
        if (node.y < node.radius) node.y = node.radius;
        if (node.y > canvas.height - node.radius) node.y = canvas.height - node.radius;
      });

      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);

        if (!sourceNode || !targetNode) return;

        const isRelatedToHover = hoveredNodeId
          ? link.source === hoveredNodeId || link.target === hoveredNodeId
          : false;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (hoveredNodeId) {
          ctx.strokeStyle = isRelatedToHover
            ? "rgba(56, 189, 248, 0.7)"
            : "rgba(148, 163, 184, 0.08)";
          ctx.lineWidth = isRelatedToHover ? 2.5 : 1;
        } else {
          ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
          ctx.lineWidth = 1.2;
        }
        ctx.stroke();

        if (!hoveredNodeId || isRelatedToHover) {
          const segmentCount = 2;
          for (let i = 0; i < segmentCount; i++) {
            const t = ((particleOffset + i * (100 / segmentCount)) % 100) / 100;
            const px = sourceNode.x + (targetNode.x - sourceNode.x) * t;
            const py = sourceNode.y + (targetNode.y - sourceNode.y) * t;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = link.source === "optimus" ? "#38bdf8" : "#f97316";
            ctx.shadowBlur = 8;
            ctx.shadowColor = ctx.fillStyle as string;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      nodes.forEach((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isRelated = hoveredNodeId
          ? node.id === hoveredNodeId || links.some(l => (l.source === hoveredNodeId && l.target === node.id) || (l.target === hoveredNodeId && l.source === node.id))
          : true;

        ctx.save();
        ctx.globalAlpha = isRelated ? 1.0 : 0.25;

        ctx.shadowBlur = isHovered ? 24 : 12;
        if (node.type === "brand") {
          ctx.shadowColor = "rgba(56, 189, 248, 0.4)";
        } else if (node.type === "competitor") {
          ctx.shadowColor = "rgba(249, 115, 22, 0.3)";
        } else if (node.type === "model") {
          ctx.shadowColor = "rgba(168, 85, 247, 0.3)";
        } else {
          ctx.shadowColor = "rgba(16, 185, 129, 0.25)";
        }

        const gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, node.radius);
        if (node.type === "brand") {
          gradient.addColorStop(0, "rgba(15, 23, 42, 0.85)");
          gradient.addColorStop(1, "rgba(56, 189, 248, 0.15)");
        } else if (node.type === "competitor") {
          gradient.addColorStop(0, "rgba(15, 23, 42, 0.85)");
          gradient.addColorStop(1, "rgba(249, 115, 22, 0.12)");
        } else {
          gradient.addColorStop(0, "rgba(15, 23, 42, 0.9)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (node.type === "brand") {
          ctx.strokeStyle = isHovered ? "#38bdf8" : "rgba(56, 189, 248, 0.45)";
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
        } else if (node.type === "competitor") {
          ctx.strokeStyle = isHovered ? "#f97316" : "rgba(249, 115, 22, 0.35)";
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
        } else if (node.type === "model") {
          ctx.strokeStyle = isHovered ? "#c084fc" : "rgba(168, 85, 247, 0.3)";
          ctx.lineWidth = isHovered ? 2 : 1;
        } else {
          ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = `600 ${node.type === "brand" ? "13px" : "11px"} system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 0;
        ctx.fillText(node.label, node.x, node.y - 2);

        ctx.fillStyle = node.type === "brand" ? "#38bdf8" : node.type === "competitor" ? "#f97316" : "rgba(255, 255, 255, 0.4)";
        ctx.font = `700 8px system-ui, -apple-system, sans-serif`;
        ctx.fillText(node.type.toUpperCase(), node.x, node.y + (node.type === "brand" ? 14 : 12));

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isFa]);

  // Smooth scroll handler
  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]" style={{ direction: isFa ? "rtl" : "ltr" }}>
      {/* Glassmorphic Navigation Bar */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative isolate pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Animated Sky Blue / Orange Background Orbs */}
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-gradient-to-br from-[#38bdf8]/15 to-[#f97316]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[35vw] h-[35vw] bg-gradient-to-tr from-[#f97316]/10 to-[#38bdf8]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute inset-0 grid-backdrop opacity-[0.3] pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Headline block */}
          <div className="space-y-8 text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-2 text-xs font-bold text-[#38bdf8]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
              </span>
              {isFa ? "موتور تحلیل هوش مصنوعی نسل جدید" : "Next-Generation Brand AI Analytics"}
            </span>

            <h1 className="font-display font-black tracking-tight text-4xl sm:text-5xl md:text-6xl leading-[1.2] text-balance">
              <span className="text-[var(--text-primary)] block">
                {isFa ? "هوش مصنوعی برند شما را" : "AI Analyzes"}
              </span>
              <span className="text-gradient-brand font-extrabold inline-block mt-2">
                {isFa ? "تحلیل می‌کند" : "Your Brand Context"}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {isFa
                ? "پلتفرم تحلیل معنایی، پایش توهم و بهینه‌سازی موتورهای پاسخگو (AEO). از نحوه درک برند خود در ChatGPT، Claude و Perplexity مطلع شوید."
                : "The world's premium semantic analysis and answer engine optimization (AEO) platform. Manage how LLMs perceive and recommend your brand."}
            </p>

            {/* Shimmer CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => scrollToRef(freeAuditRef)}
                className="relative overflow-hidden group px-8 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-[#38bdf8] to-[#f97316] shadow-lg shadow-[#38bdf8]/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:animate-shimmer" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />
                <span className="relative flex items-center gap-2">
                  <span>{isFa ? "شروع تحلیل رایگان" : "Start Free Audit"}</span>
                  <ArrowRight size={18} className="rtl:-scale-x-100" />
                </span>
              </button>

              <Link
                href={`/${locale}/platform`}
                className="px-8 py-4 rounded-xl font-bold bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[#38bdf8]/30 hover:border-[#38bdf8]/80 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer shadow-md text-sm"
              >
                <span>{isFa ? "مشاهده پلتفرم" : "Explore Platform"}</span>
                <ArrowDown size={18} className="animate-bounce" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[var(--border)] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm font-bold text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#38bdf8] font-display">۱۲,۰۰۰+</span>
                  <span>{isFa ? "صفحه تحلیل‌شده" : "Pages Analyzed"}</span>
                </div>
                <div className="h-4 w-[1px] bg-[var(--border)]" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-[#f97316] font-display">۸۵۰+</span>
                  <span>{isFa ? "برند پایش‌شده" : "Brands Tracked"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Knowledge Graph Canvas Container */}
          <div ref={containerRef} className="relative w-full h-[380px] sm:h-[450px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-2xl overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-[#38bdf8]/20 text-xs text-[#38bdf8] backdrop-blur-lg">
              <Network size={14} className="animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider">{isFa ? "گراف روابط زنده" : "Interactive KG Core"}</span>
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full cursor-pointer" />

            <div className="absolute bottom-4 inset-x-4 text-center pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[10px] text-slate-400">
                {isFa ? "موس خود را روی موجودیت‌ها بکشید یا نگه دارید تا ارتباطات معنایی را کاوش کنید" : "Hover or slide over nodes to inspect real-time semantic relationships"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Platform Quick Benefits Overview */}
      <section className="py-20 border-t border-[var(--border)] bg-[var(--background-subtle)]/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <h2 className="font-display font-black text-3xl text-gradient-brand">
              {isFa ? "بهینه‌سازی برترین پلتفرم‌های هوش مصنوعی" : "Pioneering AI Engine Optimization"}
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base font-medium">
              {isFa
                ? "ارتقای سهم بازار و حضور معنایی برند شما در مدل‌های زبانی از طریق گراف دانش و رفع توهم."
                : "Secure higher brand visibility and factual consistency across OpenAI, Claude, Perplexity, and Gemini."}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mx-auto text-lg font-bold">A</div>
              <h3 className="text-base font-bold font-display">{isFa ? "بهینه‌سازی پاسخگو (AEO)" : "Answer Optimization (AEO)"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                {isFa ? "استناد مستقیم و پاسخ‌دهی دقیق به عنوان مرجع اصلی در موتورهای پاسخگو." : "Structure outbound references so Perplexity cites your brand as the primary source."}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#f97316] flex items-center justify-center mx-auto text-lg font-bold">G</div>
              <h3 className="text-base font-bold font-display">{isFa ? "بهینه‌سازی موتورهای مولد (GEO)" : "Generative Optimization (GEO)"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                {isFa ? "پایش گرامری و قرارگیری برند در خوشه‌های معنایی و سیستم‌های RAG." : "Embed brand entities in vector representations for language model training datasets."}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-lg font-bold">P</div>
              <h3 className="text-base font-bold font-display">{isFa ? "محافظت و پایش توهم" : "Hallucination Protection"}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                {isFa ? "ردیابی برخط پاسخ‌های نادرست و اصلاح اطلاعات مربوط به موجودیت برند." : "Instantly flag and correct factual inaccuracies in generated search outputs."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Technical Audit Suite */}
      <section ref={freeAuditRef} className="py-24 bg-[var(--background)] relative border-t border-[var(--border)]">
        <div className="absolute inset-0 grid-backdrop opacity-[0.2] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-400">
              <Sparkles size={12} className="animate-pulse" />
              <span>{isFa ? "سامانه تحلیل ساختار وب‌سایت" : "Online Audit Suite"}</span>
            </span>
            <h2 className="font-display font-black text-3xl text-[var(--text-primary)]">
              {isFa ? "ساختار وب‌سایت خود را تحلیل کنید" : "Audit Your Brand SEO Core"}
            </h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-base font-medium">
              {isFa
                ? "دامنه سایت خود را وارد کنید تا تگ‌های متادیتا، ساختار ربات‌ها و کیفیت خوانش وب‌سایت با Firecrawl بررسی گردد."
                : "Submit your domain URL. Retrieve standard diagnostics on crawlability, declared lang structures, and heading scores."}
            </p>
          </div>

          <div className="glass-panel p-2 sm:p-4 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl">
            <FreeAuditPanel onUpgradeClick={() => {}} />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <LandingFooter />
    </div>
  );
}
