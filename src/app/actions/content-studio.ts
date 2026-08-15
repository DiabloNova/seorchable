"use server";

import { z } from "zod";
import { TenantContextManager } from "@/core/database/tenant-context";
import { requireSession } from "@/services/auth/session";
import { requireWorkspaceMembership } from "@/services/auth/authorization";
import { AeoContentIntelligenceService } from "@/features/ai-intelligence/services/aeo-content-intelligence-service";
import { AeoContentIntelligenceRepository, PageRepository, WebsiteRepository } from "@/features/ai-intelligence/repositories";
import { getLLMClient } from "@/services/ai/llm-client";
import { Page } from "@/features/ai-intelligence/domain/types";

const savePageSchema = z.object({
  id: z.string().uuid("شناسه صفحه نامعتبر است"),
  title: z.string().min(1, "عنوان صفحه نمی‌تواند خالی باشد"),
  description: z.string().optional().default(""),
  contentDraft: z.string().optional().default(""),
});

const aiEditSchema = z.object({
  selectedText: z.string().min(1, "متن انتخاب شده برای ویرایش نمی‌تواند خالی باشد"),
  operation: z.enum(["improve", "rewrite", "expand", "shorten", "tone_formal", "tone_friendly", "clarity"]),
  promptInstruction: z.string().optional(),
});

/**
 * Resolves active tenant context and securely retrieves all pages for the authenticated workspace.
 * Automatically seeds baseline pages if the workspace is fresh.
 */
export async function getContentStudioPagesAction() {
  let session;
  try {
    session = await requireSession();
    if (!session.user) throw new Error("Unauthorized");
    await requireWorkspaceMembership(session.user.id, session.user.workspaceId);
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }

  const tenantId = session.user.workspaceId;
  const userId = session.user.id;

  try {
    const requestId = `req-studio-pages-${Date.now()}`;

    return await TenantContextManager.runWithTenantContext(tenantId, userId, requestId, async () => {
      const pageRepo = new PageRepository();
      const websiteRepo = new WebsiteRepository();

      let website = await websiteRepo.findByDomain(tenantId, "secure-site.com");
      if (!website) {
        website = await websiteRepo.save({
          id: crypto.randomUUID(),
          organizationId: tenantId,
          domain: "secure-site.com",
          normalizedUrl: "https://secure-site.com",
          status: "active",
          audit: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            updatedBy: userId,
            version: 1
          }
        });
      }

      const pagesRes = await pageRepo.findByWebsiteId(tenantId, website.id);
      let pages = pagesRes.data;

      if (pages.length === 0) {
        const homepage = await pageRepo.save({
          id: crypto.randomUUID(),
          organizationId: tenantId,
          websiteId: website.id,
          url: "https://secure-site.com/",
          normalizedUrl: "https://secure-site.com/",
          path: "/",
          statusCode: 200,
          indexability: "indexable",
          title: "شرکت رشا گستر - صفحه اصلی بهینه‌سازی موتورهای هوش مصنوعی AEO",
          description: "درباره ما: شرکت رشا گستر با راه‌حل‌های هوشمند سئو معنایی و بهینه‌سازی موتورهای هوش مصنوعی AEO.",
          contentDraft: "درباره ما: شرکت رشا گستر با آدرس اینترنتی secure-site.com ارائه‌دهنده راه‌حل‌های هوشمند سئو معنایی و بهینه‌سازی موتورهای هوش مصنوعی AEO است.\nخدمات ما شامل پایش دقیق رویت‌پذیری هوش مصنوعی و تحلیل گراف‌های دانش معنایی می‌باشد.\nسوالی که مطرح می‌شود این است: سئو معنایی چقدر زمان می‌برد؟ سئو معنایی معمولاً طی ۲ الی ۶ هفته اثربخشی نشان می‌دهد.",
          audit: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            updatedBy: userId,
            version: 1
          }
        });

        const pricingPage = await pageRepo.save({
          id: crypto.randomUUID(),
          organizationId: tenantId,
          websiteId: website.id,
          url: "https://secure-site.com/pricing",
          normalizedUrl: "https://secure-site.com/pricing",
          path: "/pricing",
          statusCode: 200,
          indexability: "indexable",
          title: "تعرفه و قیمت خدمات سئو معنایی و هوش مصنوعی رشا گستر",
          description: "هزینه و قیمت پلن‌های مختلف پایش رویت‌پذیری هوش مصنوعی و سئو فنی.",
          contentDraft: "تعرفه و هزینه‌های بهینه‌سازی هوش مصنوعی رشا گستر:\n- پلن پایه: ماهیانه ۵ میلیون تومان شامل پایش ۱۰ کلمه کلیدی.\n- پلن حرفه‌ای: ماهیانه ۱۵ میلیون تومان شامل پایش ۵۰ کلمه کلیدی و سناریوهای استنادی کامل.\nجهت استعلام دقیق قیمت با تیم فروش ما ارتباط بگیرید.",
          audit: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            updatedBy: userId,
            version: 1
          }
        });

        pages = [homepage, pricingPage];
      }

      return { success: true, pages };
    });
  } catch (err: any) {
    return { success: false, error: err.message || "Internal Server Error" };
  }
}

/**
 * Saves a Page meta-parameters and its core draft body content.
 */
export async function saveContentStudioPageAction(data: {
  id: string;
  title: string;
  description?: string;
  contentDraft?: string;
}) {
  const parsed = savePageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "فیلدهای ارسالی معتبر نیستند", details: parsed.error.format() };
  }

  let session;
  try {
    session = await requireSession();
    if (!session.user) throw new Error("Unauthorized");
    await requireWorkspaceMembership(session.user.id, session.user.workspaceId);
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }

  const tenantId = session.user.workspaceId;
  const userId = session.user.id;

  try {
    const requestId = `req-studio-save-${Date.now()}`;

    return await TenantContextManager.runWithTenantContext(tenantId, userId, requestId, async () => {
      const pageRepo = new PageRepository();
      const existing = await pageRepo.findById(tenantId, parsed.data.id);

      let updatedPage: Page;

      if (!existing) {
        const websiteRepo = new WebsiteRepository();
        let website = await websiteRepo.findByDomain(tenantId, "secure-site.com");
        const websiteId = website?.id || crypto.randomUUID();

        updatedPage = {
          id: parsed.data.id,
          organizationId: tenantId,
          websiteId,
          url: `https://secure-site.com/draft-${parsed.data.id.slice(0, 8)}`,
          normalizedUrl: `https://secure-site.com/draft-${parsed.data.id.slice(0, 8)}`,
          path: `/draft-${parsed.data.id.slice(0, 8)}`,
          statusCode: 200,
          indexability: "indexable",
          title: parsed.data.title,
          description: parsed.data.description,
          contentDraft: parsed.data.contentDraft,
          audit: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId,
            updatedBy: userId,
            version: 1
          }
        };
      } else {
        updatedPage = {
          ...existing,
          title: parsed.data.title,
          description: parsed.data.description,
          contentDraft: parsed.data.contentDraft,
          audit: {
            ...existing.audit,
            updatedAt: new Date().toISOString(),
            updatedBy: userId,
            version: existing.audit.version + 1
          }
        };
      }

      await pageRepo.save(updatedPage);
      return { success: true, page: updatedPage };
    });
  } catch (err: any) {
    return { success: false, error: err.message || "Internal Server Error" };
  }
}

/**
 * Direct orchestrator over the authoritative, existing AEO Content Intelligence analysis.
 * Takes current manual editor edits/drafts to calculate the overall deterministic score.
 */
export async function runContentStudioAnalysisAction(pageId: string, overrideContent?: string) {
  let session;
  try {
    session = await requireSession();
    if (!session.user) throw new Error("Unauthorized");
    await requireWorkspaceMembership(session.user.id, session.user.workspaceId);
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }

  const tenantId = session.user.workspaceId;
  const userId = session.user.id;

  try {
    const requestId = `req-studio-analyze-${Date.now()}`;

    return await TenantContextManager.runWithTenantContext(tenantId, userId, requestId, async () => {
      const service = new AeoContentIntelligenceService();

      // Perform the real, un-duplicated AEO Analysis
      const analysis = await service.executeAnalysis(tenantId, pageId, {
        overridePageContent: overrideContent
      });

      return { success: true, analysis };
    });
  } catch (err: any) {
    return { success: false, error: err.message || "Internal Server Error" };
  }
}

/**
 * Secure AI Co-Writer using the official, server-controlled getLLMClient() provider.
 * Guarantees API credentials are never leaked and original content is preserved in suggestions.
 */
export async function runContentStudioAIEditAction(data: {
  selectedText: string;
  operation: "improve" | "rewrite" | "expand" | "shorten" | "tone_formal" | "tone_friendly" | "clarity";
  promptInstruction?: string;
}) {
  const parsed = aiEditSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "پارامترهای پرامپت معتبر نیستند" };
  }

  let session;
  try {
    session = await requireSession();
    if (!session.user) throw new Error("Unauthorized");
    await requireWorkspaceMembership(session.user.id, session.user.workspaceId);
  } catch (err: any) {
    return { success: false, error: err.message || "Unauthorized" };
  }

  const tenantId = session.user.workspaceId;
  const userId = session.user.id;

  try {
    const requestId = `req-studio-ai-edit-${Date.now()}`;

    return await TenantContextManager.runWithTenantContext(tenantId, userId, requestId, async () => {
      const llmClient = getLLMClient();
      const { selectedText, operation, promptInstruction } = parsed.data;

      let instruction = "";
      switch (operation) {
        case "improve":
          instruction = "اصلاح ادبی، گرامری و زیباتر کردن لحن نگارش فارسی بدون تغییر محتوا و مفاهیم علمی یا ارجاعات.";
          break;
        case "rewrite":
          instruction = "بازنویسی کامل متن فارسی با ساختار جمله‌بندی متفاوت و واژگان غنی‌تر، در حالی که دقیقاً همان موجودیت‌ها، نام برندها و آدرس‌های اینترنتی حفظ شوند.";
          break;
        case "expand":
          instruction = "گسترش و بسط محتوا جهت افزودن جزییات و شفافیت بیشتر، بدون اضافه کردن فکت‌های غیرواقعی یا حذف لینک‌ها.";
          break;
        case "shorten":
          instruction = "خلاصه‌سازی و ایجاز متن فارسی به طوری که بسیار ضربه‌زننده و رسا باشد و تمامی کلمات کلیدی، ارجاعات و موجودیت‌ها حفظ شوند.";
          break;
        case "tone_formal":
          instruction = "بازنویسی متن در قالب لحنی رسمی، محترمانه، حاکمیتی و شرکتی حرفه‌ای.";
          break;
        case "tone_friendly":
          instruction = "بازنویسی متن با لحنی صمیمی، دوستانه، صمیمانه و تعاملی.";
          break;
        case "clarity":
          instruction = "بهبود خوانایی، تسهیل جریان عبارات و روان‌سازی گرامر زبان فارسی.";
          break;
      }

      if (promptInstruction) {
        instruction += ` دستورالعمل تکمیلی کاربر: ${promptInstruction}`;
      }

      const prompt = `
        نقش شما: یک ویراستار متون فارسی حرفه‌ای و متخصص کپی‌رایتینگ سئو و بهینه‌سازی موتورهای هوش مصنوعی (AEO) هستید.
        شما باید متن زیر را طبق دستورالعمل داده شده ویرایش کنید:

        متن ورودی:
        "${selectedText}"

        دستورالعمل ویرایش:
        ${instruction}

        قوانین بسیار مهم:
        ۱. خروجی فقط و فقط باید متن نهایی ویرایش شده به زبان فارسی باشد. هیچ عبارت توضیحی، سلام یا مقدمه‌ای در خروجی اضافه نکنید.
        ۲. از ابداع یا تحریف حقایق خودداری کرده و موجودیت‌ها و آدرس‌های استنادی را کاملاً حفظ کنید.
      `;

      const suggestion = await llmClient.generateText(prompt, {
        temperature: 0.3,
        systemPrompt: "شما یک ویراستار متون فارسی هستید که فقط متن اصلاح شده نهایی را بدون هیچ کلام اضافی برمی‌گرداند."
      });

      return {
        success: true,
        originalText: selectedText,
        suggestion: suggestion.trim()
      };
    });
  } catch (err: any) {
    return { success: false, error: err.message || "Internal Server Error" };
  }
}
