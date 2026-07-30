"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/Button";
import {
  RefreshCw
} from "lucide-react";

/**
 * Renders a localized dashboard for evaluating brand representation across AI engines.
 */
export default function IntelligencePage() {
  const { language } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const brandFactors = [
    { name: language === "fa" ? "اعتبار استنادات (Citation Authority)" : "Citation Authority", score: 85, weight: "High", desc: "Outbound linked anchors on domain references." },
    { name: language === "fa" ? "تراکم اطلاعاتی (Information Density)" : "Information Density", score: 72, weight: "Medium", desc: "Unique entity claims per 1,000 words index." },
    { name: language === "fa" ? "شاخص پایداری مدل (Model Trust Score)" : "Model Trust Score", score: 80, weight: "High", desc: "Persistence of brand recommendations across chat sessions." },
    { name: language === "fa" ? "تطابق معنایی بردار (RAG Alignment)" : "RAG Cosine Alignment", score: 75, weight: "Medium", desc: "Similarity index score within semantic vector stores." }
  ];

  const aiInsights = [
    {
      id: "ins-1",
      engine: "Perplexity",
      title: language === "fa" ? "ارجاع کور در پرسش‌های با هدف خرید" : "Unlinked reference on shopping query",
      desc: "Your enterprise CRM suite is listed as a top regional recommendation but lacks standard anchor citation redirection.",
      impact: "High",
      category: "citations"
    },
    {
      id: "ins-2",
      engine: "ChatGPT",
      title: language === "fa" ? "انحراف واقعیت در پاسخ‌های مدل GPT-4" : "Incorrect claim regarding service availability",
      desc: "An outdated source caused GPT-4 model instances to state that same-day delivery is not supported in Tehran.",
      impact: "Critical",
      category: "hallucination"
    },
    {
      id: "ins-3",
      engine: "Claude",
      title: language === "fa" ? "هم‌وقوعی معنایی با رقبای سطح یک" : "High co-occurrence index in enterprise lists",
      desc: "Successfully listed within comparative grids matching international competitors for logistics queries.",
      impact: "Positive",
      category: "positioning"
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const insightsTabs = [
    {
      id: "all",
      label: language === "fa" ? "همه بینش‌ها" : "All Insights",
      content: (
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] flex items-start gap-4 transition-all duration-150 hover:shadow-xs">
              <div className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)]">
                {insight.engine}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{insight.title}</h4>
                  <Badge variant={insight.impact === "Critical" ? "error" : insight.impact === "High" ? "warning" : "success"}>
                    {insight.impact}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "critical",
      label: language === "fa" ? "هشدارهای امنیتی" : "Brand Defense (Hallucinations)",
      content: (
        <div className="space-y-4">
          {aiInsights.filter(i => i.category === "hallucination").map((insight) => (
            <div key={insight.id} className="p-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] flex items-start gap-4">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider text-[var(--color-error)]">
                {insight.engine}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{insight.title}</h4>
                  <Badge variant="error">{insight.impact}</Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {language === "fa" ? "هوشمندی برند و تحلیل معنایی" : "Brand Intelligence Analyzer"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {language === "fa"
              ? "تحلیل ارزیابی‌های پیشرفته بر روی ساختارهای متنی مدل‌های زبانی."
              : "Analytical evaluations of brand representations and sentiment contexts in model outputs."}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2 self-start sm:self-auto"
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? (language === "fa" ? "به‌روزرسانی..." : "Analyzing...") : (language === "fa" ? "بررسی مجدد" : "Re-analyze Engines")}</span>
        </Button>
      </div>

      {/* Main Score panel & Factor card layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Large Score Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{language === "fa" ? "امتیاز جامع هوشمندی برند" : "Brand Intelligence Score"}</CardTitle>
            <CardDescription>
              {language === "fa"
                ? "ارزیابی یکپارچه شده شاخص‌های چهارگانه معنایی"
                : "Aggregated index tracking representation quality across key metrics"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative flex items-center justify-center">
              {/* Outer dial layout */}
              <div className="w-36 h-36 rounded-full border-4 border-[var(--border)] border-t-[var(--color-accent-600)] animate-spin duration-1000 absolute" style={{ animationDuration: "3s" }} />
              <div className="w-32 h-32 rounded-full bg-[var(--background)] border border-[var(--border)] flex flex-col items-center justify-center shadow-[var(--shadow-sm)]">
                <span className="text-4xl font-black text-[var(--text-primary)]">78</span>
                <span className="text-xs font-bold text-[var(--text-muted)] mt-1 uppercase tracking-wider">GRADE B</span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-1">
              <Badge variant="success">
                {language === "fa" ? "رشد +۲.۴٪ این ماه" : "+2.4% MoM Growth"}
              </Badge>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {language === "fa" ? "بالاتر از متوسط رقبای صنعت (۶۴)" : "Above the industry segment average of 64"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed factors metrics block */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{language === "fa" ? "شاخص‌های چهارگانه بهینه‌سازی معنایی" : "Semantic Optimization Factors"}</CardTitle>
            <CardDescription>
              {language === "fa"
                ? "ارزیابی عمیق‌تر بر روی فاکتورهای فنی بازیابی و تولید محتوا."
                : "Performance of your semantic presence across distinct retrieval metrics."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {brandFactors.map((factor, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-primary)]">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">{factor.weight}</Badge>
                    <span className="font-black text-[var(--text-primary)]">{factor.score} / 100</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[var(--background)] border border-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-600)] rounded-full" style={{ width: `${factor.score}%` }} />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] block">{factor.desc}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Tabs containing AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "fa" ? "تحلیل سیگنال‌ها و اصلاحات متنی" : "AI Sentiment & Contextual Insights"}</CardTitle>
          <CardDescription>
            {language === "fa"
              ? "بینش‌های تولید شده با پایش هوشمند تضادهای اطلاعاتی مدل‌ها."
              : "Actionable points pinpointing inaccuracies or optimization gaps."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs tabs={insightsTabs} />
        </CardContent>
      </Card>
    </div>
  );
}
