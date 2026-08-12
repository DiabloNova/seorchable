/**
 * Production-Grade Recommendation & Action Engine
 * Converts diagnostic findings into prioritized, evidence-backed actionable recommendations.
 * Implements deterministic prioritization, lifecycle state machine validation, and append-only status histories.
 */

import {
  DiagnosticFinding,
  Recommendation,
  RecommendationStatus,
  PriorityLevel,
  ImpactLevel,
  EffortLevel
} from "../../features/ai-intelligence/domain/types";

export interface RecommendationResult {
  recommendations: Recommendation[];
  timestamp: string;
}

// Centrally defined, versioned prioritization weights
export const PRIORITY_WEIGHTS = {
  version: "1.0",
  impactScale: {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
    unknown: 0
  },
  confidenceScale: {
    low: 1,
    medium: 2,
    high: 3
  },
  effortScale: {
    trivial: 5,
    small: 4,
    medium: 3,
    large: 2,
    very_large: 1,
    unknown: 1
  }
};

/**
 * Deterministically computes composite impactScore (0-100)
 */
export function calculateImpactScore(
  business: ImpactLevel,
  seo: ImpactLevel,
  ai: ImpactLevel
): number {
  const bVal = PRIORITY_WEIGHTS.impactScale[business] || 0;
  const sVal = PRIORITY_WEIGHTS.impactScale[seo] || 0;
  const aVal = PRIORITY_WEIGHTS.impactScale[ai] || 0;

  // Weighted average: Business (30%), SEO (30%), AI Visibility (40%)
  const weighted = bVal * 0.3 + sVal * 0.3 + aVal * 0.4;
  // Map range 0-4 to 0-100
  return Math.round((weighted / 4) * 100);
}

/**
 * Deterministically computes priority level (low, medium, high) based on Impact, Confidence and Effort
 */
export function calculatePriorityLevel(
  impactScore: number,
  confidence: "low" | "medium" | "high",
  effort: EffortLevel
): PriorityLevel {
  const confVal = PRIORITY_WEIGHTS.confidenceScale[confidence] || 2;
  const effortVal = PRIORITY_WEIGHTS.effortScale[effort] || 1;

  // Composite formula: Impact (50%), Confidence (25%), Effort (25%)
  // effortVal is inverted in the scale so higher effortVal (less effort) yields higher priority!
  const priorityScore = (impactScore * 0.5) + (confVal * 10) + (effortVal * 5);

  if (priorityScore >= 65) return "high";
  if (priorityScore >= 40) return "medium";
  return "low";
}

/**
 * Strict Recommendation Lifecycle Transition State Machine.
 * Validates status transitions and throws on illegal paths.
 */
export function validateStatusTransition(
  current: RecommendationStatus,
  next: RecommendationStatus
): void {
  // If no change, it's valid
  if (current === next) return;

  const validTransitions: Record<RecommendationStatus, RecommendationStatus[]> = {
    proposed: ["accepted", "rejected", "deferred"],
    accepted: ["in_progress", "deferred", "rejected"],
    in_progress: ["completed", "blocked", "deferred"],
    blocked: ["in_progress", "deferred", "rejected"],
    deferred: ["accepted", "proposed"],
    rejected: ["proposed", "accepted"],
    completed: ["proposed"], // Allow reopening
    // Pre-existing fallback states
    pending: ["accepted", "rejected", "applied", "ignored"],
    applied: ["completed"],
    ignored: ["proposed"]
  };

  const allowed = validTransitions[current] || [];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid Status Transition: Action cannot move from status '${current}' directly to '${next}'.`);
  }
}

export class RecommendationEngine {
  /**
   * Generates prioritized recommendations originating from real diagnostic findings.
   */
  public async generateRecommendations(
    findings: DiagnosticFinding[],
    context: { organizationId: string; brandId: string; websiteId: string }
  ): Promise<Recommendation[]> {
    const { organizationId, brandId, websiteId } = context;
    const recommendations: Recommendation[] = [];
    const timestamp = new Date().toISOString();

    const createAudit = () => ({
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: "recommendation-engine",
      updatedBy: "recommendation-engine",
      version: 1
    });

    for (const finding of findings) {
      const category = finding.category;
      let title = "";
      let problemStatement = "";
      let recommendedAction = "";
      let rationale = "";
      let businessImpact: ImpactLevel = "unknown";
      let seoImpact: ImpactLevel = "unknown";
      let aiVisibilityImpact: ImpactLevel = "unknown";
      let effort: EffortLevel = "unknown";
      const confidence = finding.confidence;

      // Map finding code to concrete recommended actions and impacts
      switch (finding.code) {
        case "ERR_TECH_HTTP_FAILED":
          title = "رفع خطاهای ارتباطی سرور و HTTP";
          problemStatement = `کد پاسخ ناموفق ${finding.evidence.statusCode || ""} روی آدرس ارجاعی مشاهده شد.`;
          recommendedAction = "رفع اشکال اتصالات شبکه و کدهای پردازش سمت سرور برای این صفحه.";
          rationale = "صفحاتی که خطای سرور ۵۰۰ برمی‌گردانند توسط الگوهای یادگیری هوش مصنوعی دور ریخته می‌شوند.";
          businessImpact = "high";
          seoImpact = "critical";
          aiVisibilityImpact = "high";
          effort = "medium";
          break;

        case "ERR_TECH_REDIRECT_LOOP":
          title = "شکستن حلقه‌ها و زنجیره‌های ریدایرکت طولانی";
          problemStatement = "یک مسیر ریدایرکت چند جهتی یا حلقوی مانع دسترسی کاوشگر شده است.";
          recommendedAction = "آدرس‌های ریدایرکت میانی را حذف و کاربر را مستقیماً به صفحه نهایی هدایت کنید.";
          rationale = "حلقه‌های ریدایرکت مانع ایندکس و کاوش معنایی بات‌های هوش مصنوعی رشا گستر/Snapp می‌شوند.";
          businessImpact = "medium";
          seoImpact = "high";
          aiVisibilityImpact = "high";
          effort = "small";
          break;

        case "ERR_CONTENT_THIN":
          title = "توسعه و غنی‌سازی محتوای متنی صفحات ضعیف";
          problemStatement = `تعداد کلمات صفحه (${finding.evidence.wordCount || 0} کلمه) بسیار کم است.`;
          recommendedAction = "افزودن پاسخ‌های تفصیلی، تعاریف دقیق واژگان، و جداول داده برای ارزش‌دهی بیشتر.";
          rationale = "محتوای عمیق شانس بازخوانی توسط الگوهای زبانی را برای پاسخ به سوالات چند برابری می‌کند.";
          businessImpact = "high";
          seoImpact = "high";
          aiVisibilityImpact = "critical";
          effort = "large";
          break;

        case "ERR_SEO_ROBOTS_BLOCKED":
          title = "رفع محدودیت‌ها و قوانین مسدودکننده ایندکس (robots.txt)";
          problemStatement = "بات‌های هوش مصنوعی اجازه کاوش و ایندکس محتوا را ندارند.";
          recommendedAction = "قوانین فایل robots.txt یا تگ‌های نو ایندکس هدر را اصلاح کنید تا دسترسی بات‌ها برقرار شود.";
          rationale = "بات‌های مدرن هوش مصنوعی بدون مجوز ایندکس هرگز محتوا را در نتایج زنده ارجاع نمی‌دهند.";
          businessImpact = "critical";
          seoImpact = "critical";
          aiVisibilityImpact = "critical";
          effort = "trivial";
          break;

        case "ERR_SEO_ORPHAN_PAGE":
          title = "ایجاد ساختار لینک‌دهی داخلی برای صفحات یتیم";
          problemStatement = "صفحه فاقد هرگونه لینک ورودی از صفحات دیگر وب‌سایت شما است.";
          recommendedAction = "افزودن لینک‌های داخلی از صفحات مرتبط، منوی اصلی، یا پاورقی وب‌سایت به این صفحه.";
          rationale = "ساختار ضعیف اتصالات مانع کشف سریع اطلاعات به روز توسط بات‌های هوشمند می‌شود.";
          businessImpact = "low";
          seoImpact = "medium";
          aiVisibilityImpact = "medium";
          effort = "small";
          break;

        case "ERR_AEO_WEAK_PRESENCE":
          title = "تقویت حضور و ارجاع برند در چت‌بات‌های هوشمند";
          problemStatement = `سهم حضور نام برند در پرسش‌های ارزیابی پایین است (نرخ حضور ${Math.round((finding.evidence.presenceRatio as number || 0) * 100)}٪).`;
          recommendedAction = "ایجاد صفحات هاب اطلاعاتی، ثبت برند در گراف‌های بین‌المللی مانند ویکی‌دیتا و افزایش رپورتاژ ارجاعی.";
          rationale = "حضور کم در چت‌بات‌ها سهم بازار برند شما در نسل جدید جستجو را از بین می‌برد.";
          businessImpact = "high";
          seoImpact = "low";
          aiVisibilityImpact = "critical";
          effort = "very_large";
          break;

        case "ERR_ENTITY_SCHEMA_MISSING":
          title = "افزودن ساختارهای نشانه‌گذاری کدهای معنایی (JSON-LD)";
          problemStatement = "موتورهای زبانی فاقد فریم‌ورک ساختاریافته معنایی روی وب‌سایت هستند.";
          recommendedAction = "افزودن اسکیماهای استاندارد Organization و Article به صفحات برای معرفی یکپارچه برند.";
          rationale = "ساختارهای معنایی مستقیماً شانس ثبت هویت برند در گراف دانش موتورهای جستجو را بالا می‌برند.";
          businessImpact = "medium";
          seoImpact = "high";
          aiVisibilityImpact = "high";
          effort = "small";
          break;

        case "ERR_COMP_VISIBILITY_GAP":
          title = "بهینه‌سازی سهم حضور رقابتی در برابر رقبای تجاری";
          problemStatement = `شاخص دیده شدن رقیب (${finding.evidence.competitorVisibility || 0}) از برند شما بیشتر است.`;
          recommendedAction = "آنالیز کلیدواژه‌های ارجاعی رقیب و غنی‌سازی خلاهای محتوایی وب‌سایت خودمان.";
          rationale = "پر کردن خلاهای رقابتی سهم ارجاعات برند در Perplexity و ChatGPT را افزایش می‌دهد.";
          businessImpact = "high";
          seoImpact = "medium";
          aiVisibilityImpact = "high";
          effort = "large";
          break;

        case "ERR_AEO_VISIBILITY_DEGRADATION":
          title = "مهندسی معکوس و بازیابی شاخص سهم حضور افت‌کرده";
          problemStatement = `شاخص حضور برند با روند کاهشی از ${finding.evidence.oldestValue || 0} به ${finding.evidence.latestValue || 0} رسیده است.`;
          recommendedAction = "بررسی استنادات از دست رفته در هفته گذشته و تقویت کدهای کانونیکال و ارجاع دهنده.";
          rationale = "بازیابی سریع روندهای نزولی مانع از جانشینی آدرس‌های رقبا در پاسخ الگوها می‌شود.";
          businessImpact = "high";
          seoImpact = "medium";
          aiVisibilityImpact = "high";
          effort = "medium";
          break;

        default:
          // Skip if finding code is unmapped/unsupported to avoid fabricating recommendations
          continue;
      }

      // Compute score and priority deterministically
      const impactScore = calculateImpactScore(businessImpact, seoImpact, aiVisibilityImpact);
      const priority = calculatePriorityLevel(impactScore, confidence, effort);

      const description = `${title}: ${problemStatement} ${recommendedAction}`;

      recommendations.push({
        id: `rec-val-${finding.id.replace("df-", "")}`,
        organizationId,
        brandId,
        websiteId,
        affectedResource: finding.affectedResource,
        sourceFindingIds: [finding.id],
        category,
        title,
        problemStatement,
        recommendedAction,
        rationale,
        priority,
        businessImpact,
        seoImpact,
        aiVisibilityImpact,
        effort,
        confidence,
        impactScore,
        description,
        status: "proposed",
        ruleVersion: PRIORITY_WEIGHTS.version,
        audit: createAudit()
      });
    }

    return recommendations;
  }
}
export default RecommendationEngine;
