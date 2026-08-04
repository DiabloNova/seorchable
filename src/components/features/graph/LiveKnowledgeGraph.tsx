"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import {
  Network,
  Layers,
  Activity,
  TrendingUp,
  Award,
  Calendar,
  Cpu,
  Search,
  Eye,
  Globe,
  BookOpen,
  Users,
  HeartHandshake,
  AlertTriangle
} from "lucide-react";

interface Node {
  id: string;
  labelEn: string;
  labelFa: string;
  typeEn: string;
  typeFa: string;
  confidence: number;
  lastUpdatedEn: string;
  lastUpdatedFa: string;
  visibilityEn: string;
  visibilityFa: string;
  mentions: number;
  strengthEn: string;
  strengthFa: string;
  connectedEn: string[];
  connectedFa: string[];
  // Graphics & Physics
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  labelEn: string;
  labelFa: string;
}

const INITIAL_NODES: Omit<Node, "x" | "y" | "vx" | "vy" | "color">[] = [
  {
    id: "brand",
    labelEn: "Rasha Gostar",
    labelFa: "راشا گستر",
    typeEn: "Core Brand",
    typeFa: "برند اصلی",
    confidence: 99,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Outstanding (99%)",
    visibilityFa: "بسیار عالی (۹۹٪)",
    mentions: 1240,
    strengthEn: "100%",
    strengthFa: "۱۰۰٪",
    connectedEn: ["rashagostar.ir", "Rasha Holding", "GEO Optimization", "Semantic Analysis", "ISNA News", "Novin Pardaz Co"],
    connectedFa: ["rashagostar.ir", "هلدینگ راشا", "بهینه‌سازی GEO", "تحلیل معنایی", "خبرگزاری ایسنا", "شرکت نوین‌پرداز"],
  },
  {
    id: "website",
    labelEn: "rashagostar.ir",
    labelFa: "rashagostar.ir",
    typeEn: "Website",
    typeFa: "وب‌سایت",
    confidence: 98,
    lastUpdatedEn: "2 hours ago",
    lastUpdatedFa: "۲ ساعت پیش",
    visibilityEn: "Optimized",
    visibilityFa: "بهینه‌شده و منطبق",
    mentions: 850,
    strengthEn: "95%",
    strengthFa: "۹۵٪",
    connectedEn: ["Rasha Gostar", "Google", "React Technology"],
    connectedFa: ["راشا گستر", "گوگل", "تکنولوژی ری‌اکت"],
  },
  {
    id: "service_geo",
    labelEn: "GEO Optimization",
    labelFa: "بهینه‌سازی GEO",
    typeEn: "Service",
    typeFa: "خدمت",
    confidence: 95,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Excellent",
    visibilityFa: "بسیار عالی",
    mentions: 680,
    strengthEn: "96%",
    strengthFa: "۹۶٪",
    connectedEn: ["Rasha Gostar", "GPT-4o", "Claude 3.5"],
    connectedFa: ["راشا گستر", "GPT-4o", "Claude 3.5"],
  },
  {
    id: "service_semantic",
    labelEn: "Semantic Analysis",
    labelFa: "تحلیل معنایی",
    typeEn: "Service",
    typeFa: "خدمت",
    confidence: 96,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Outstanding",
    visibilityFa: "بسیار عالی",
    mentions: 710,
    strengthEn: "97%",
    strengthFa: "۹۷٪",
    connectedEn: ["Rasha Gostar", "Tejarat Bank", "Alborz Insurance"],
    connectedFa: ["راشا گستر", "بانک تجارت", "بیمه البرز"],
  },
  {
    id: "product_cms",
    labelEn: "Content Studio",
    labelFa: "سامانه مدیریت محتوا",
    typeEn: "Product",
    typeFa: "محصول",
    confidence: 94,
    lastUpdatedEn: "Yesterday",
    lastUpdatedFa: "دیروز",
    visibilityEn: "High",
    visibilityFa: "عالی",
    mentions: 420,
    strengthEn: "90%",
    strengthFa: "۹۰٪",
    connectedEn: ["Rasha Gostar", "React Technology"],
    connectedFa: ["راشا گستر", "تکنولوژی ری‌اکت"],
  },
  {
    id: "product_radar",
    labelEn: "Intelligent Radar",
    labelFa: "رادار هوشمند",
    typeEn: "Product",
    typeFa: "محصول",
    confidence: 92,
    lastUpdatedEn: "3 days ago",
    lastUpdatedFa: "۳ روز پیش",
    visibilityEn: "Active",
    visibilityFa: "در حال پایش",
    mentions: 310,
    strengthEn: "88%",
    strengthFa: "۸۸٪",
    connectedEn: ["Rasha Gostar", "Python Technology"],
    connectedFa: ["راشا گستر", "تکنولوژی پایتون"],
  },
  {
    id: "organization",
    labelEn: "Rasha Holding",
    labelFa: "هلدینگ راشا",
    typeEn: "Parent Org",
    typeFa: "سازمان مادر",
    confidence: 91,
    lastUpdatedEn: "1 week ago",
    lastUpdatedFa: "۱ هفته پیش",
    visibilityEn: "Stable",
    visibilityFa: "پایدار",
    mentions: 150,
    strengthEn: "85%",
    strengthFa: "۸۵٪",
    connectedEn: ["Rasha Gostar", "Dana Accelerator"],
    connectedFa: ["راشا گستر", "شتاب‌دهنده دانا"],
  },
  {
    id: "industry",
    labelEn: "Artificial Intelligence",
    labelFa: "هوش مصنوعی",
    typeEn: "Industry",
    typeFa: "صنعت",
    confidence: 97,
    lastUpdatedEn: "Continuous",
    lastUpdatedFa: "پیوسته",
    visibilityEn: "Very High",
    visibilityFa: "بسیار بالا",
    mentions: 4500,
    strengthEn: "92%",
    strengthFa: "۹۲٪",
    connectedEn: ["Rasha Gostar"],
    connectedFa: ["راشا گستر"],
  },
  {
    id: "customer_tejarat",
    labelEn: "Tejarat Bank",
    labelFa: "بانک تجارت",
    typeEn: "Customer",
    typeFa: "مشتری",
    confidence: 89,
    lastUpdatedEn: "2 days ago",
    lastUpdatedFa: "۲ روز پیش",
    visibilityEn: "High",
    visibilityFa: "عالی",
    mentions: 280,
    strengthEn: "85%",
    strengthFa: "۸۵٪",
    connectedEn: ["Semantic Analysis"],
    connectedFa: ["تحلیل معنایی"],
  },
  {
    id: "customer_alborz",
    labelEn: "Alborz Insurance",
    labelFa: "بیمه البرز",
    typeEn: "Customer",
    typeFa: "مشتری",
    confidence: 88,
    lastUpdatedEn: "3 days ago",
    lastUpdatedFa: "۳ روز پیش",
    visibilityEn: "Good",
    visibilityFa: "خوب",
    mentions: 190,
    strengthEn: "82%",
    strengthFa: "۸۲٪",
    connectedEn: ["Semantic Analysis"],
    connectedFa: ["تحلیل معنایی"],
  },
  {
    id: "model_gpt",
    labelEn: "GPT-4o",
    labelFa: "GPT-4o",
    typeEn: "AI Model",
    typeFa: "مدل هوش مصنوعی",
    confidence: 93,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Outstanding",
    visibilityFa: "بسیار عالی",
    mentions: 3200,
    strengthEn: "88%",
    strengthFa: "۸۸٪",
    connectedEn: ["GEO Optimization"],
    connectedFa: ["بهینه‌سازی GEO"],
  },
  {
    id: "model_claude",
    labelEn: "Claude 3.5",
    labelFa: "Claude 3.5",
    typeEn: "AI Model",
    typeFa: "مدل هوش مصنوعی",
    confidence: 94,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Outstanding",
    visibilityFa: "بسیار عالی",
    mentions: 2900,
    strengthEn: "89%",
    strengthFa: "۸۹٪",
    connectedEn: ["GEO Optimization"],
    connectedFa: ["بهینه‌سازی GEO"],
  },
  {
    id: "engine_google",
    labelEn: "Google",
    labelFa: "گوگل",
    typeEn: "Search Engine",
    typeFa: "موتور جستجو",
    confidence: 97,
    lastUpdatedEn: "Today",
    lastUpdatedFa: "امروز",
    visibilityEn: "Complete",
    visibilityFa: "کامل",
    mentions: 9800,
    strengthEn: "94%",
    strengthFa: "۹۴٪",
    connectedEn: ["rashagostar.ir"],
    connectedFa: ["rashagostar.ir"],
  },
  {
    id: "mention_isna",
    labelEn: "ISNA News",
    labelFa: "خبرگزاری ایسنا",
    typeEn: "Media Mention",
    typeFa: "ارجاع رسانه‌ای",
    confidence: 85,
    lastUpdatedEn: "Yesterday",
    lastUpdatedFa: "دیروز",
    visibilityEn: "Verified",
    visibilityFa: "تایید شده",
    mentions: 45,
    strengthEn: "78%",
    strengthFa: "۷۸٪",
    connectedEn: ["Rasha Gostar"],
    connectedFa: ["راشا گستر"],
  },
  {
    id: "partner_dana",
    labelEn: "Dana Accelerator",
    labelFa: "شتاب‌دهنده دانا",
    typeEn: "Partner",
    typeFa: "شریک تجاری",
    confidence: 90,
    lastUpdatedEn: "2 weeks ago",
    lastUpdatedFa: "۲ هفته پیش",
    visibilityEn: "Stable",
    visibilityFa: "پایدار",
    mentions: 110,
    strengthEn: "84%",
    strengthFa: "۸۴٪",
    connectedEn: ["Rasha Holding"],
    connectedFa: ["هلدینگ راشا"],
  },
  {
    id: "competitor_novin",
    labelEn: "Novin Pardaz Co",
    labelFa: "شرکت نوین‌پرداز",
    typeEn: "Competitor",
    typeFa: "رقیب",
    confidence: 82,
    lastUpdatedEn: "Yesterday",
    lastUpdatedFa: "دیروز",
    visibilityEn: "Moderate",
    visibilityFa: "متوسط",
    mentions: 410,
    strengthEn: "65%",
    strengthFa: "۶۵٪",
    connectedEn: ["Rasha Gostar"],
    connectedFa: ["راشا گستر"],
  },
  {
    id: "tech_react",
    labelEn: "React Technology",
    labelFa: "تکنولوژی ری‌اکت",
    typeEn: "Technology",
    typeFa: "فناوری",
    confidence: 96,
    lastUpdatedEn: "Continuous",
    lastUpdatedFa: "پیوسته",
    visibilityEn: "Standard",
    visibilityFa: "استاندارد",
    mentions: 12500,
    strengthEn: "91%",
    strengthFa: "۹۱٪",
    connectedEn: ["rashagostar.ir", "Content Studio"],
    connectedFa: ["rashagostar.ir", "سامانه مدیریت محتوا"],
  },
  {
    id: "tech_python",
    labelEn: "Python Technology",
    labelFa: "تکنولوژی پایتون",
    typeEn: "Technology",
    typeFa: "فناوری",
    confidence: 95,
    lastUpdatedEn: "Continuous",
    lastUpdatedFa: "پیوسته",
    visibilityEn: "Standard",
    visibilityFa: "استاندارد",
    mentions: 19800,
    strengthEn: "89%",
    strengthFa: "۸۹٪",
    connectedEn: ["Intelligent Radar"],
    connectedFa: ["رادار هوشمند"],
  }
];

const EDGES: Edge[] = [
  { source: "brand", target: "website", labelEn: "resolves", labelFa: "دارای وب‌سایت" },
  { source: "brand", target: "service_geo", labelEn: "provides", labelFa: "ارائه دهنده" },
  { source: "brand", target: "service_semantic", labelEn: "provides", labelFa: "ارائه دهنده" },
  { source: "brand", target: "product_cms", labelEn: "operates", labelFa: "توسعه‌دهنده" },
  { source: "brand", target: "product_radar", labelEn: "operates", labelFa: "توسعه‌دهنده" },
  { source: "brand", target: "organization", labelEn: "part of", labelFa: "زیرمجموعه" },
  { source: "brand", target: "industry", labelEn: "operates in", labelFa: "فعال در صنعت" },
  { source: "brand", target: "mention_isna", labelEn: "cited in", labelFa: "استناد شده در" },
  { source: "brand", target: "competitor_novin", labelEn: "competes with", labelFa: "رقابت با" },
  { source: "service_semantic", target: "customer_tejarat", labelEn: "serves", labelFa: "تحلیل مشتری" },
  { source: "service_semantic", target: "customer_alborz", labelEn: "serves", labelFa: "تحلیل مشتری" },
  { source: "service_geo", target: "model_gpt", labelEn: "optimized for", labelFa: "بهینه‌شده برای" },
  { source: "service_geo", target: "model_claude", labelEn: "optimized for", labelFa: "بهینه‌شده برای" },
  { source: "website", target: "engine_google", labelEn: "indexed by", labelFa: "نمایه‌شده در" },
  { source: "organization", target: "partner_dana", labelEn: "partnered with", labelFa: "همکاری با" },
  { source: "tech_react", target: "website", labelEn: "powers", labelFa: "پشتیبانی فنی" },
  { source: "tech_react", target: "product_cms", labelEn: "powers", labelFa: "پشتیبانی فنی" },
  { source: "tech_python", target: "product_radar", labelEn: "powers", labelFa: "پشتیبانی فنی" }
];

export function LiveKnowledgeGraph() {
  const { language } = useTheme();
  const isFa = language === "fa";

  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Colors mapping for node types
  const getNodeColor = (type: string) => {
    switch (type) {
      case "Core Brand":
        return "url(#brandGradient)";
      case "Website":
        return "#38bdf8"; // Sky Blue
      case "Product":
        return "#0ea5e9"; // Deep sky blue
      case "Service":
        return "#6366f1"; // Indigo
      case "Parent Org":
      case "Partner":
        return "#8b5cf6"; // Purple
      case "Industry":
        return "#a855f7"; // Light Purple
      case "Customer":
      case "Media Mention":
        return "#10b981"; // Emerald
      case "AI Model":
      case "Search Engine":
        return "#f97316"; // Orange
      case "Competitor":
        return "#f43f5e"; // Rose
      case "Technology":
        return "#06b6d4"; // Cyan
      default:
        return "#94a3b8";
    }
  };

  // Initialize nodes with random coordinates around center
  useEffect(() => {
    const initialized = INITIAL_NODES.map((n, idx) => {
      // Position nodes in concentric circles or random layout around (450, 275)
      const angle = (idx / INITIAL_NODES.length) * Math.PI * 2;
      const radius = n.id === "brand" ? 0 : 150 + Math.random() * 80;
      return {
        ...n,
        x: 450 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        color: getNodeColor(n.typeEn)
      };
    });
    setNodes(initialized);
    // Default selected node is the Core Brand
    setSelectedNode(initialized.find((n) => n.id === "brand") || initialized[0]);
  }, []);

  // Force-directed layout engine loop
  useEffect(() => {
    if (nodes.length === 0) return;

    const runSimulation = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      setNodes((prevNodes) => {
        const nextNodes = prevNodes.map((n) => ({ ...n }));
        const center = { x: 450, y: 250 };

        // 1. Center gravity pull
        nextNodes.forEach((node) => {
          if (node.id === "brand") {
            // Core brand stays firmly close to the center
            node.vx += (center.x - node.x) * 0.08;
            node.vy += (center.y - node.y) * 0.08;
          } else {
            node.vx += (center.x - node.x) * 0.008;
            node.vy += (center.y - node.y) * 0.008;
          }
        });

        // 2. Repulsion between all nodes (prevent overlapping)
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const u = nextNodes[i];
            const v = nextNodes[j];
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = u.id === "brand" || v.id === "brand" ? 120 : 80;

            if (dist < minDist) {
              const force = (minDist - dist) * 0.15;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (u.id !== "brand") {
                u.vx -= fx;
                u.vy -= fy;
              }
              if (v.id !== "brand") {
                v.vx += fx;
                v.vy += fy;
              }
            }
          }
        }

        // 3. Attraction along edges
        EDGES.forEach((edge) => {
          const sourceNode = nextNodes.find((n) => n.id === edge.source);
          const targetNode = nextNodes.find((n) => n.id === edge.target);

          if (sourceNode && targetNode) {
            const dx = targetNode.x - sourceNode.x;
            const dy = targetNode.y - sourceNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = 110;

            const force = (dist - desiredDist) * 0.035;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (sourceNode.id !== "brand") {
              sourceNode.vx += fx;
              sourceNode.vy += fy;
            }
            if (targetNode.id !== "brand") {
              targetNode.vx -= fx;
              targetNode.vy -= fy;
            }
          }
        });

        // 4. Continuous subtle organic floating motion
        const time = timestamp * 0.0012;
        nextNodes.forEach((node, idx) => {
          if (node.id !== "brand") {
            const floatAmp = 0.22;
            node.vx += Math.sin(time + idx * 1.7) * floatAmp;
            node.vy += Math.cos(time * 0.85 + idx * 1.3) * floatAmp;
          }
        });

        // 5. Apply velocities, damping, and boundary limits
        nextNodes.forEach((node) => {
          // Damping factor
          node.vx *= 0.82;
          node.vy *= 0.82;

          // Update positions
          node.x += node.vx;
          node.y += node.vy;

          // Boundaries clamp
          node.x = Math.max(50, Math.min(850, node.x));
          node.y = Math.max(50, Math.min(450, node.y));
        });

        return nextNodes;
      });

      requestRef.current = requestAnimationFrame(runSimulation);
    };

    requestRef.current = requestAnimationFrame(runSimulation);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [nodes.length]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const isEdgeHighlighted = (edge: Edge) => {
    const activeId = hoveredNode?.id || selectedNode?.id;
    if (!activeId) return false;
    return edge.source === activeId || edge.target === activeId;
  };

  return (
    <div className="space-y-10" dir={isFa ? "rtl" : "ltr"}>
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-black tracking-widest text-[#f97316]">{isFa ? "تحلیل روابط و حافظه معنایی" : "REAL-TIME SEMANTIC MEMORY MAP"}</span>
        <h2 className="font-display font-black text-3xl md:text-4xl text-gradient-brand">
          {isFa ? "گراف زنده روابط برند" : "Live Brand Knowledge Graph"}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {isFa
            ? "نمایش تعاملی و برخط چگونگی کشف، تفسیر و ارتباط موجودیت‌های شرکت «راشا گستر» در مدل‌های زبانی و حافظه معنایی هوش مصنوعی."
            : "An interactive, fully responsive visualization modeling how AI systems extract and map entity-relationship triples for 'Rasha Gostar'."}
        </p>
      </div>

      {/* GRAPH VISUALIZATION PANEL */}
      <div className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl p-4 md:p-6 overflow-hidden relative">
        {/* Sky Blue / Orange signature glow filters & backdrops */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-[#38bdf8]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#f97316]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/8] min-h-[380px] md:min-h-[500px]">
          {/* Main SVG Render */}
          <svg
            viewBox="0 0 900 500"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Definitions for Gradients, Glow Filters */}
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Edges Layout */}
            <g>
              {EDGES.map((edge, idx) => {
                const src = nodes.find((n) => n.id === edge.source);
                const tgt = nodes.find((n) => n.id === edge.target);
                if (!src || !tgt) return null;

                const isHighlighted = isEdgeHighlighted(edge);
                const isSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={`edge-${idx}`}>
                    {/* Background line for glow */}
                    {isHighlighted && (
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={edge.source === "brand" ? "url(#brandGradient)" : src.color}
                        strokeWidth={6}
                        strokeOpacity={0.25}
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Main Edge Line */}
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={edge.source === "brand" ? "url(#brandGradient)" : src.color}
                      strokeWidth={isHighlighted ? 2.5 : 1.2}
                      strokeOpacity={isHighlighted ? 0.85 : 0.25}
                      strokeDasharray={isHighlighted ? "6, 6" : "none"}
                      className={`transition-all duration-300 ${isHighlighted ? "animate-[marquee_15s_linear_infinite]" : ""}`}
                      style={{
                        animation: isHighlighted ? "dashAnimation 1s linear infinite" : undefined,
                      }}
                    />

                    {/* Optional small text label along highlighted edges */}
                    {isHighlighted && (
                      <g transform={`translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2 - 6})`}>
                        <rect
                          x="-45"
                          y="-9"
                          width="90"
                          height="16"
                          rx="4"
                          fill="#020617"
                          fillOpacity="0.8"
                          stroke={src.color}
                          strokeWidth="0.5"
                          strokeOpacity="0.5"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#f8fafc"
                          fontSize="8"
                          className="font-bold tracking-wider"
                        >
                          {isFa ? edge.labelFa : edge.labelEn}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes Layout */}
            <g>
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const isBrand = node.id === "brand";

                // Size mapping
                const r = isBrand ? 28 : 16;
                const activeR = isSelected || isHovered ? r + 5 : r;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Breathing outer pulse rings for brand and selected nodes */}
                    {(isBrand || isSelected) && (
                      <circle
                        cx="0"
                        cy="0"
                        r={activeR + 12}
                        fill="none"
                        stroke={isBrand ? "url(#brandGradient)" : node.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        className="animate-ping"
                        style={{ animationDuration: "3s" }}
                      />
                    )}

                    {/* Outer border glow ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={activeR + 3}
                      fill="none"
                      stroke={isBrand ? "url(#brandGradient)" : node.color}
                      strokeWidth={isSelected || isHovered ? "2.5" : "1.2"}
                      strokeOpacity={isSelected || isHovered ? "1" : "0.5"}
                      className="transition-all duration-300"
                    />

                    {/* Main Node Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={activeR}
                      fill={isBrand ? "url(#brandGradient)" : "#0f172a"}
                      className="transition-all duration-300"
                    />

                    {/* Inner fill accent for non-brand nodes */}
                    {!isBrand && (
                      <circle
                        cx="0"
                        cy="0"
                        r={activeR - 3.5}
                        fill={node.color}
                        fillOpacity={isSelected || isHovered ? 0.35 : 0.15}
                        stroke={node.color}
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Bullet dot center for selected node */}
                    {isSelected && !isBrand && (
                      <circle cx="0" cy="0" r="4" fill="#ffffff" />
                    )}

                    {/* Label/Text (Floating above or below) */}
                    <g transform={`translate(0, ${isBrand ? 45 : 30})`}>
                      {/* background bubble pill */}
                      <rect
                        x="-55"
                        y="-10"
                        width="110"
                        height="18"
                        rx="9"
                        fill="#020617"
                        fillOpacity="0.85"
                        stroke={isSelected ? "#38bdf8" : isBrand ? "#f97316" : "rgba(255,255,255,0.06)"}
                        strokeWidth={isSelected || isBrand ? "1" : "0.5"}
                        className="transition-all duration-300"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isSelected ? "#38bdf8" : isBrand ? "#ffffff" : "#cbd5e1"}
                        fontSize="9"
                        fontWeight={isSelected || isBrand ? "bold" : "normal"}
                        className="font-sans"
                      >
                        {isFa ? node.labelFa : node.labelEn}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* CSS Animation specifically for edge flow inside SVG */}
            <style>{`
              @keyframes dashAnimation {
                to {
                  stroke-dashoffset: -20;
                }
              }
            `}</style>
          </svg>

          {/* Interactive Quick Tip overlay */}
          <div className="absolute top-4 right-4 pointer-events-none text-right">
            <span className="text-[10px] bg-slate-900/80 text-[var(--sky-blue-500)] border border-[var(--sky-blue-500)]/20 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isFa ? "برای انتخاب روی گره‌ها کلیک کنید" : "Click nodes to explore"}
            </span>
          </div>
        </div>
      </div>

      {/* DYNAMIC INFORMATION PANEL */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-2xl p-6 sm:p-8 space-y-6"
          >
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#38bdf8]/10 to-[#f97316]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                  <Network size={22} className="animate-pulse text-[#f97316]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                      {isFa ? selectedNode.labelFa : selectedNode.labelEn}
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: `${selectedNode.color}20`, color: selectedNode.color }}>
                      {isFa ? selectedNode.typeFa : selectedNode.typeEn}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {isFa ? `درک برداری موجودیت در پایگاه داده‌های برخط هوش مصنوعی` : `Vector entity representation parsed dynamically inside LLM indices.`}
                  </p>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.02] border border-[var(--border)] px-4 py-2.5 shrink-0">
                <div className="text-right">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase block font-bold">{isFa ? "میزان اطمینان هوش مصنوعی" : "AI CONFIDENCE SCORE"}</span>
                  <span className="text-lg font-black font-display text-[var(--sky-blue-500)]">{selectedNode.confidence}%</span>
                </div>
                <Award size={18} className="text-[var(--sky-blue-500)] ml-1" />
              </div>
            </div>

            {/* Metrics grid - Structured information panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/[0.01]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold mb-1.5">
                  <Activity size={12} className="text-[var(--sky-blue-500)]" />
                  {isFa ? "وضعیت دیده‌شدن هوش مصنوعی" : "AI Visibility Status"}
                </span>
                <p className="text-sm font-extrabold text-[var(--text-primary)] font-display truncate">
                  {isFa ? selectedNode.visibilityFa : selectedNode.visibilityEn}
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/[0.01]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold mb-1.5">
                  <TrendingUp size={12} className="text-[#f97316]" />
                  {isFa ? "تعداد ارجاعات و استنادها" : "Mention Count"}
                </span>
                <p className="text-sm font-extrabold text-[var(--text-primary)] font-display">
                  {isFa ? `${selectedNode.mentions.toLocaleString()} ارجاع` : `${selectedNode.mentions.toLocaleString()} citations`}
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/[0.01]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold mb-1.5">
                  <Cpu size={12} className="text-indigo-400" />
                  {isFa ? "قدرت رابطه معنایی" : "Relationship Strength"}
                </span>
                <p className="text-sm font-extrabold text-[var(--text-primary)] font-display">
                  {isFa ? selectedNode.strengthFa : selectedNode.strengthEn}
                </p>
              </div>

              {/* Stat 4 */}
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/[0.01]">
                <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-bold mb-1.5">
                  <Calendar size={12} className="text-purple-400" />
                  {isFa ? "آخرین بروزرسانی نقشه" : "Last Updated"}
                </span>
                <p className="text-sm font-extrabold text-[var(--text-primary)] font-display truncate">
                  {isFa ? selectedNode.lastUpdatedFa : selectedNode.lastUpdatedEn}
                </p>
              </div>
            </div>

            {/* Connected entities list inside info panel */}
            <div className="space-y-3.5 pt-2">
              <h4 className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                <Layers size={13} className="text-[var(--sky-blue-500)]" />
                {isFa ? "موجودیت‌های متصل و هم‌بسته معنایی" : "Connected Semantic Entities"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isFa ? selectedNode.connectedFa : selectedNode.connectedEn).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white/[0.03] border border-[var(--border)] hover:border-[var(--sky-blue-500)]/30 px-3 py-1.5 rounded-xl text-[var(--text-secondary)] font-medium transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
