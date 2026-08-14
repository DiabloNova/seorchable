"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Tabs } from "@/components/Tabs";
import {
  getContentStudioPagesAction,
  saveContentStudioPageAction,
  runContentStudioAnalysisAction,
  runContentStudioAIEditAction
} from "@/app/actions/content-studio";
import { Page, AeoAnalysis } from "@/features/ai-intelligence/domain/types";
import {
  BookOpen,
  Sparkles,
  Save,
  Activity,
  Award,
  AlertTriangle,
  RotateCw,
  Plus,
  PenTool,
  Check,
  X,
  Layers,
  FileText,
  Compass,
  Link,
  HelpCircle,
  HelpCircle as QuestionIcon,
  MessageSquare
} from "lucide-react";

export const ContentStudio: React.FC = () => {
  const { language, direction } = useTheme();
  const { session } = useAuth();
  const isRtl = language === "fa";

  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  // Editor Draft States
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorContent, setEditorContent] = useState("");

  // AI Assistant States
  const [selectedText, setSelectedText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{
    original: string;
    suggestion: string;
  } | null>(null);

  // Analysis State
  const [analysis, setAnalysis] = useState<AeoAnalysis | null>(null);

  // Statuses
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Textarea ref for tracking text selection
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Strings translations
  const t = {
    title: isRtl ? "استودیو خلاق تولید و بهینه‌سازی محتوا" : "AI Content Studio & Semantic Optimizer",
    desc: isRtl
      ? "ویرایشگر هوشمند معنایی، بهینه‌سازی خوانایی متون، تحلیل چگالی اصطلاحات کلیدی و امتیازدهی رویت‌پذیری."
      : "Optimize conversational flow structures, evaluate semantic layout parameters, and score visibility metrics.",
    selectPage: isRtl ? "انتخاب صفحه جهت ویرایش:" : "Select Page to Edit:",
    newPage: isRtl ? "ایجاد سند جدید" : "Create New Document",
    titleLabel: isRtl ? "عنوان صفحه (SEO Title)" : "Page Title (SEO Title)",
    titlePlaceholder: isRtl ? "عنوان جذاب و کلیدی صفحه را بنویسید..." : "Enter descriptive page title...",
    metaLabel: isRtl ? "توضیحات متا (Meta Description)" : "Meta Description",
    metaPlaceholder: isRtl ? "خلاصه‌ای کوتاه و متقاعدکننده برای موتورهای جستجو بنویسید..." : "Enter compelling meta description...",
    bodyLabel: isRtl ? "متن محتوای سند (Content Body Draft)" : "Document Content Body Draft",
    bodyPlaceholder: isRtl ? "پیش‌نویس محتوای خود را در اینجا بنویسید یا بخشی از متن را انتخاب کرده و از هوش مصنوعی کمک بگیرید..." : "Write your draft content here. Highlight text to apply AI suggestions...",
    aiToolbar: isRtl ? "میزکار هوش مصنوعی (AI Co-Writer)" : "AI Co-Writer Assistant",
    aiHelp: isRtl ? "بخشی از متن بالا را انتخاب کنید یا دستور زیر را روی کل سند اعمال کنید:" : "Highlight text above or enter instructions below:",
    btnImprove: isRtl ? "اصلاح ادبی و نگارشی" : "Improve Text",
    btnRewrite: isRtl ? "بازنویسی کامل" : "Rewrite",
    btnExpand: isRtl ? "بسط و گسترش متن" : "Expand Text",
    btnShorten: isRtl ? "کوتاه‌سازی و خلاصه" : "Shorten",
    btnToneFormal: isRtl ? "لحن رسمی و شرکتی" : "Corporate Tone",
    btnToneFriendly: isRtl ? "لحن صمیمی و دوستانه" : "Friendly Tone",
    btnClarity: isRtl ? "روان‌سازی و وضوح" : "Clarity Boost",
    aiSuggestionLabel: isRtl ? "پیشنهاد ویراستار هوش مصنوعی" : "AI Editor Proposed Suggestion",
    btnAccept: isRtl ? "اعمال پیشنهاد در متن" : "Accept & Apply Suggestion",
    btnReject: isRtl ? "رد پیشنهاد" : "Reject Suggestion",
    saveDraft: isRtl ? "ذخیره پیش‌نویس" : "Save Draft",
    runAnalysis: isRtl ? "اجرای آنالیز معنایی و رویت‌پذیری" : "Run Semantic & AEO Analysis",
    tabEditor: isRtl ? "ویرایشگر و نگارش" : "Editor",
    tabScore: isRtl ? "امتیاز رویت‌پذیری AEO" : "AEO Visibility Score",
    tabEntities: isRtl ? "موجودیت‌ها و گراف دانش" : "Entities & KG Alignment",
    tabSemantic: isRtl ? "توصیه‌های معنایی و مفاهیم" : "Semantic Gaps",
    scoreTitle: isRtl ? "شاخص جامع رویت‌پذیری محتوا" : "Overall AEO Content Score",
    scoreNoAnalysis: isRtl ? "تحلیلی انجام نشده است. لطفاً روی دکمه اجرای آنالیز کلیک کنید." : "No analysis has been run yet. Please execute analysis above.",
    componentBreakdown: isRtl ? "جزئیات مولفه‌های شاخص رویت‌پذیری (AEO)" : "AEO Component Score Breakdown",
    missingEntities: isRtl ? "موجودیت‌های مفقود و تحت‌نمایندگی در گراف دانش" : "Missing / Underrepresented Entities",
    evidence: isRtl ? "مدرک و فکت ارزیابی:" : "Evidence Trace:",
    status: isRtl ? "وضعیت پوشش:" : "Coverage Status:",
    faqTitle: isRtl ? "پرسش‌های بی‌پاسخ ارزیابی شده (فرصت‌های FAQ)" : "Observed Unanswered Q&As",
    unansweredText: isRtl ? "این پرسش در محتوا بدون پاسخ رها شده است. افزودن آن به متن احتمال بازیابی برند را افزایش می‌دهد." : "This query was evaluated as unanswered. Answering this expands discoverability.",
  };

  // Load pages initially
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = () => {
    startTransition(async () => {
      const res = await getContentStudioPagesAction();
      if (res.success && "pages" in res && res.pages) {
        setPages(res.pages);
        if (res.pages.length > 0 && !selectedPage) {
          handleSelectPage(res.pages[0]);
        }
      } else {
        const errorMsg = res && "error" in res ? String(res.error) : "خطا در دریافت صفحات";
        setMessage({ type: "error", text: errorMsg });
      }
    });
  };

  const handleSelectPage = (page: Page) => {
    setSelectedPage(page);
    setEditorTitle(page.title || "");
    setEditorDescription(page.description || "");
    setEditorContent(page.contentDraft || "");
    setAiSuggestion(null);
    setAnalysis(null);
    setMessage(null);
  };

  const handleNewPage = () => {
    const freshPage: Page = {
      id: crypto.randomUUID(),
      organizationId: session?.user?.workspaceId || "ws-default",
      websiteId: pages[0]?.websiteId || crypto.randomUUID(),
      url: "https://secure-site.com/new-draft-" + Date.now(),
      normalizedUrl: "https://secure-site.com/new-draft-" + Date.now(),
      path: "/new-draft-" + Date.now(),
      indexability: "indexable",
      title: isRtl ? "صفحه پیش‌نویس جدید" : "New Draft Document",
      description: "",
      contentDraft: "",
      audit: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session?.user?.id || "usr-default",
        updatedBy: session?.user?.id || "usr-default",
        version: 1
      }
    };
    setSelectedPage(freshPage);
    setEditorTitle(freshPage.title || "");
    setEditorDescription("");
    setEditorContent("");
    setAiSuggestion(null);
    setAnalysis(null);
    setMessage(null);
  };

  // Track text selection
  const handleTextareaSelect = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      if (start !== end) {
        const text = editorRef.current.value.substring(start, end);
        setSelectedText(text);
      } else {
        setSelectedText("");
      }
    }
  };

  // Execute AI assistance
  const handleAiOperation = async (operation: "improve" | "rewrite" | "expand" | "shorten" | "tone_formal" | "tone_friendly" | "clarity") => {
    const textToProcess = selectedText || editorContent;
    if (!textToProcess.trim()) {
      setMessage({ type: "error", text: isRtl ? "لطفاً ابتدا متنی را برای ویرایش بنویسید یا انتخاب کنید." : "Please write or select text to edit first." });
      return;
    }

    setIsAiProcessing(true);
    setMessage(null);
    try {
      const res = await runContentStudioAIEditAction({
        selectedText: textToProcess,
        operation,
        promptInstruction: customPrompt
      });

      if (res.success && "suggestion" in res && res.suggestion) {
        setAiSuggestion({
          original: textToProcess,
          suggestion: res.suggestion
        });
      } else {
        const errorMsg = res && "error" in res ? String(res.error) : "خطا در پردازش هوش مصنوعی";
        setMessage({ type: "error", text: errorMsg });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "خطای ارتباطی با سرور" });
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Explicit apply of AI suggestion to editor text
  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;

    if (selectedText && editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const originalValue = editorContent;

      const newValue =
        originalValue.substring(0, start) +
        aiSuggestion.suggestion +
        originalValue.substring(end);

      setEditorContent(newValue);
    } else {
      // Overwrite full body only with user confirmation
      setEditorContent(aiSuggestion.suggestion);
    }
    setAiSuggestion(null);
    setSelectedText("");
    setCustomPrompt("");
    setMessage({ type: "success", text: isRtl ? "پیشنهاد با موفقیت اعمال شد." : "Suggestion applied successfully." });
  };

  // Save changes
  const handleSavePage = async () => {
    if (!selectedPage) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await saveContentStudioPageAction({
        id: selectedPage.id,
        title: editorTitle,
        description: editorDescription,
        contentDraft: editorContent
      });

      if (res.success && "page" in res && res.page) {
        setMessage({ type: "success", text: isRtl ? "تغییرات با موفقیت ذخیره شد." : "Draft saved successfully." });
        loadPages();
      } else {
        const errorMsg = res && "error" in res ? String(res.error) : "خطا در ذخیره‌سازی پیش‌نویس";
        setMessage({ type: "error", text: errorMsg });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "خطا در برقراری ارتباط با پایگاه داده" });
    } finally {
      setIsSaving(false);
    }
  };

  // Run authoritative AEO analysis on current content state
  const handleRunAnalysis = async () => {
    if (!selectedPage) return;
    setIsAnalyzing(true);
    setMessage(null);

    try {
      // First save page to ensure latest metadata is in database
      await saveContentStudioPageAction({
        id: selectedPage.id,
        title: editorTitle,
        description: editorDescription,
        contentDraft: editorContent
      });

      const res = await runContentStudioAnalysisAction(selectedPage.id, editorContent);

      if (res.success && "analysis" in res && res.analysis) {
        setAnalysis(res.analysis);
        setMessage({ type: "success", text: isRtl ? "تحلیل معنایی با موفقیت انجام شد." : "AEO analysis computed successfully." });
      } else {
        const errorMsg = res && "error" in res ? String(res.error) : "خطا در اجرای تحلیل معنایی";
        setMessage({ type: "error", text: errorMsg });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "خطا در اجرای موتور ارزیابی" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <div className="space-y-6 text-start" dir={direction}>
      {/* Selection row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[var(--text-secondary)]">{t.selectPage}</label>
          <select
            value={selectedPage?.id || ""}
            onChange={(e) => {
              const matched = pages.find((p) => p.id === e.target.value);
              if (matched) handleSelectPage(matched);
            }}
            className="text-xs font-semibold py-1.5 px-3 bg-[var(--muted-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] outline-none cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.path}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleNewPage}
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-bold self-start sm:self-center"
        >
          <Plus size={14} />
          <span>{t.newPage}</span>
        </Button>
      </div>

      {/* Main split workarea */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Editor panel */}
        <div className="lg:col-span-3 space-y-5">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
                <PenTool className="text-[var(--sky-blue-500)]" size={16} />
                <span>{t.tabEditor}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)]">{t.titleLabel}</label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder={t.titlePlaceholder}
                  className="w-full py-2 px-3 text-xs font-bold rounded-lg outline-none bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--sky-blue-500)] placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)]">{t.metaLabel}</label>
                <input
                  type="text"
                  value={editorDescription}
                  onChange={(e) => setEditorDescription(e.target.value)}
                  placeholder={t.metaPlaceholder}
                  className="w-full py-2 px-3 text-xs rounded-lg outline-none bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--sky-blue-500)] placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)]">{t.bodyLabel}</label>
                <textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  onSelect={handleTextareaSelect}
                  placeholder={t.bodyPlaceholder}
                  rows={15}
                  className="w-full p-4 text-xs leading-relaxed rounded-xl outline-none bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--sky-blue-500)] placeholder:text-[var(--text-muted)] font-mono"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  onClick={handleSavePage}
                  disabled={isSaving || !selectedPage}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs font-bold"
                >
                  {isSaving ? (
                    <RotateCw size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>{t.saveDraft}</span>
                </Button>

                <Button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !selectedPage}
                  variant="primary"
                  size="sm"
                  className="gap-2 text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 border-none text-white shadow-sm"
                >
                  {isAnalyzing ? (
                    <RotateCw size={14} className="animate-spin" />
                  ) : (
                    <Activity size={14} />
                  )}
                  <span>{t.runAnalysis}</span>
                </Button>
              </div>

              {message && (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 animate-fade-in ${
                  message.type === "success"
                    ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-500"
                    : "bg-red-500/5 border-red-500/15 text-red-500"
                }`}>
                  {message.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
                  <span>{message.text}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Co-writer workspace */}
          <Card className="shadow-sm border border-[var(--sky-blue-500)]/15 bg-sky-500/[0.02]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-[var(--sky-blue-500)] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>{t.aiToolbar}</span>
              </CardTitle>
              <CardDescription className="text-[10px]">
                {t.aiHelp}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedText && (
                <div className="p-3 bg-[var(--muted-surface)]/40 rounded-lg border border-[var(--border)] text-[10px] font-mono leading-relaxed max-h-[80px] overflow-y-auto">
                  <span className="font-bold text-[var(--text-muted)] select-none">Selection: </span>
                  &ldquo;{selectedText}&rdquo;
                </div>
              )}

              {/* Action grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  onClick={() => handleAiOperation("improve")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnImprove}
                </Button>
                <Button
                  onClick={() => handleAiOperation("rewrite")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnRewrite}
                </Button>
                <Button
                  onClick={() => handleAiOperation("expand")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnExpand}
                </Button>
                <Button
                  onClick={() => handleAiOperation("shorten")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnShorten}
                </Button>
                <Button
                  onClick={() => handleAiOperation("tone_formal")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnToneFormal}
                </Button>
                <Button
                  onClick={() => handleAiOperation("tone_friendly")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnToneFriendly}
                </Button>
                <Button
                  onClick={() => handleAiOperation("clarity")}
                  disabled={isAiProcessing}
                  variant="outline"
                  className="text-[10px] font-bold py-1.5 rounded-lg border-[var(--border)] hover:bg-[var(--muted-surface)]"
                >
                  {t.btnClarity}
                </Button>
              </div>

              {/* Custom prompt input */}
              <div className="relative">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={isRtl ? "مثال: این بخش را بازنویسی کن و لحن آن را متقاعدکننده قرار بده..." : "e.g. rewrite this block to sound more persuasive..."}
                  className="w-full py-2 pl-3 pr-10 text-[10px] rounded-lg outline-none bg-[var(--muted-surface)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--sky-blue-500)] placeholder:text-[var(--text-muted)]"
                  disabled={isAiProcessing}
                />
                <Button
                  onClick={() => handleAiOperation("improve")}
                  disabled={isAiProcessing || !customPrompt.trim()}
                  size="sm"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 p-1.5 bg-[var(--sky-blue-500)] hover:bg-sky-400 text-white rounded-md border-none h-auto"
                >
                  {isAiProcessing ? (
                    <RotateCw size={10} className="animate-spin" />
                  ) : (
                    <Sparkles size={10} />
                  )}
                </Button>
              </div>

              {/* Explicit suggestion review block */}
              {aiSuggestion && (
                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[var(--sky-blue-500)] flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>{t.aiSuggestionLabel}</span>
                    </span>
                    <Badge variant="info" className="text-[9px]">Draft</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] leading-relaxed">
                    <div className="space-y-1 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-dashed border-[var(--border)]">
                      <span className="font-bold text-[var(--text-muted)] block select-none">Original:</span>
                      <p className="text-[var(--text-secondary)] italic">&ldquo;{aiSuggestion.original}&rdquo;</p>
                    </div>

                    <div className="space-y-1 p-3 rounded-lg bg-[var(--muted-surface)] border border-sky-500/10">
                      <span className="font-bold text-[var(--sky-blue-500)] block select-none">Proposed Suggestion:</span>
                      <p className="text-[var(--text-primary)] font-semibold">{aiSuggestion.suggestion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end pt-1">
                    <Button
                      onClick={() => setAiSuggestion(null)}
                      variant="outline"
                      size="sm"
                      className="text-[9px] font-bold px-3 py-1 bg-transparent hover:bg-red-500/5 text-red-400 border-red-500/15"
                    >
                      <X size={10} className="mr-1" />
                      <span>{t.btnReject}</span>
                    </Button>
                    <Button
                      onClick={handleApplyAiSuggestion}
                      variant="primary"
                      size="sm"
                      className="text-[9px] font-bold px-3 py-1 bg-[var(--sky-blue-500)] hover:bg-sky-400 border-none text-white"
                    >
                      <Check size={10} className="mr-1" />
                      <span>{t.btnAccept}</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Intelligence dashboard tabs */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardContent className="pt-4 h-full flex flex-col">
              {!analysis ? (
                <div className="flex flex-col items-center justify-center text-center p-8 py-16 flex-1 space-y-4">
                  <div className="p-4 bg-[var(--muted-surface)] rounded-full text-[var(--text-muted)] animate-bounce">
                    <Compass size={32} />
                  </div>
                  <h4 className="text-xs font-black text-[var(--text-secondary)]">{t.scoreNoAnalysis}</h4>
                </div>
              ) : (
                <Tabs
                  tabs={[
                    {
                      id: "score",
                      label: t.tabScore,
                      content: (
                        <div className="space-y-6 animate-fade-in">
                          {/* Aggregate circular indicator */}
                          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted-surface)]/10 flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-[var(--text-primary)]">{t.scoreTitle}</h4>
                              <p className="text-[10px] text-[var(--text-muted)]">
                                Normalized multi-dimensional aggregation from {analysis.scoringVersion} model.
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <Badge
                                variant={getScoreVariant(analysis.overallScore)}
                                className="text-sm font-black font-mono px-3 py-1"
                              >
                                {analysis.overallScore}%
                              </Badge>
                            </div>
                          </div>

                          {/* Components breakdown */}
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                              {t.componentBreakdown}
                            </h4>

                            <div className="space-y-2.5">
                              {/* Answerability */}
                              <div className="p-3 rounded-lg bg-[var(--muted-surface)]/20 border border-[var(--border)] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">Answerability Level</span>
                                  <Badge variant={analysis.answerability.level === "directly_answerable" ? "success" : "warning"} className="text-[9px]">
                                    {analysis.answerability.level.replace("_", " ")}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed italic">
                                  {t.evidence} {analysis.answerability.evidence}
                                </p>
                              </div>

                              {/* Question Coverage */}
                              <div className="p-3 rounded-lg bg-[var(--muted-surface)]/20 border border-[var(--border)] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">Question Coverage</span>
                                  <Badge variant={getScoreVariant(analysis.questionCoverage.score)} className="text-[9px] font-mono">
                                    {analysis.questionCoverage.score}%
                                  </Badge>
                                </div>
                                <div className="text-[9px] text-[var(--text-secondary)] space-y-1">
                                  <div className="flex justify-between font-medium">
                                    <span>Total Universe: {analysis.questionCoverage.totalQuestions}</span>
                                    <span>Answered: {analysis.questionCoverage.answeredCount}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Semantic Coverage */}
                              <div className="p-3 rounded-lg bg-[var(--muted-surface)]/20 border border-[var(--border)] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">Semantic Coverage</span>
                                  <Badge variant={getScoreVariant(analysis.semanticCoverage.score)} className="text-[9px] font-mono">
                                    {analysis.semanticCoverage.score}%
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-[var(--text-secondary)]">
                                  Conceptual overlap: {analysis.semanticCoverage.conceptsCovered.join(", ") || "None"}
                                </p>
                              </div>

                              {/* Citation Readiness */}
                              <div className="p-3 rounded-lg bg-[var(--muted-surface)]/20 border border-[var(--border)] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">Citation Readiness</span>
                                  <Badge variant={analysis.citationReadiness.level === "high" ? "success" : "warning"} className="text-[9px] font-mono">
                                    {analysis.citationReadiness.score}%
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-[var(--text-secondary)]">
                                  {analysis.citationReadiness.evidence}
                                </p>
                              </div>

                              {/* Structured HTML Quality */}
                              <div className="p-3 rounded-lg bg-[var(--muted-surface)]/20 border border-[var(--border)] space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">Structured Answer Quality</span>
                                  <Badge variant={getScoreVariant(analysis.structuredAnswerQuality.score)} className="text-[9px] font-mono">
                                    {analysis.structuredAnswerQuality.score}%
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-[var(--text-secondary)]">
                                  {analysis.structuredAnswerQuality.findings.headingStructure}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    },
                    {
                      id: "entities",
                      label: t.tabEntities,
                      content: (
                        <div className="space-y-4 animate-fade-in">
                          <h4 className="text-xs font-black text-[var(--text-primary)]">{t.missingEntities}</h4>

                          <div className="space-y-3">
                            {analysis.entityCoverage.map((ent, idx) => (
                              <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted-surface)]/10 space-y-1">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-[var(--text-primary)]">{ent.name}</span>
                                  <Badge variant={ent.status === "covered" ? "success" : ent.status === "partially_covered" ? "warning" : "error"} className="text-[9px]">
                                    {ent.status.replace("_", " ")}
                                  </Badge>
                                </div>
                                <p className="text-[9px] text-[var(--text-secondary)] font-medium leading-relaxed">{ent.evidence}</p>
                              </div>
                            ))}
                          </div>

                          {/* Knowledge Graph Alignment alerts */}
                          {analysis.kgAlignment.items.length > 0 && (
                            <div className="pt-2 border-t border-[var(--border)] space-y-2">
                              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">
                                Bi-directional KG Alignments
                              </span>
                              <div className="space-y-1.5">
                                {analysis.kgAlignment.items.map((kg, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-[9px] leading-relaxed">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${kg.status === "aligned" ? "bg-emerald-500" : "bg-red-500"}`} />
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-[var(--text-primary)]">{kg.entityName}</span>
                                      <p className="text-[var(--text-secondary)]">{kg.evidence}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    },
                    {
                      id: "semantic",
                      label: t.tabSemantic,
                      content: (
                        <div className="space-y-4 animate-fade-in">
                          {/* Unanswered FAQs */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                              <MessageSquare size={14} className="text-[var(--sky-blue-500)]" />
                              <span>{t.faqTitle}</span>
                            </h4>

                            {analysis.questionCoverage.items.filter(q => q.status === "unanswered").length === 0 ? (
                              <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-[10px] text-emerald-500 font-bold text-center">
                                All evaluated questions answered!
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                                {analysis.questionCoverage.items
                                  .filter(q => q.status === "unanswered")
                                  .map((q, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--muted-surface)]/20 space-y-1.5">
                                      <span className="text-[11px] font-black text-[var(--text-primary)] leading-normal block">
                                        {q.question}
                                      </span>
                                      <p className="text-[9px] text-[var(--text-muted)] font-medium leading-relaxed">
                                        {t.unansweredText}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
