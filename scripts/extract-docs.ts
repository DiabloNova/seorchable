import fs from "fs";
import path from "path";
import { DOCS_TOPICS } from "../src/lib/docsData";

const CONTENT_DIR = path.join(__dirname, "..", "content", "docs");

// Categories mapping
const FILE_MAPS: Record<string, { cat: string; slug: string; titleEn: string; titleFa: string }> = {
  "ADMIN_ARCHITECTURE.md": {
    cat: "architecture",
    slug: "admin-architecture",
    titleEn: "Administration Module Architecture",
    titleFa: "معماری کلی ماژول مدیریت سیستم"
  },
  "RBAC_MODEL.md": {
    cat: "security",
    slug: "rbac-model",
    titleEn: "Role-Based Access Control (RBAC) Model",
    titleFa: "مدل کنترل دسترسی مبتنی بر نقش (RBAC)"
  },
  "DEPENDENCY_INJECTION.md": {
    cat: "development",
    slug: "dependency-injection",
    titleEn: "Dependency Injection Framework",
    titleFa: "الگوی تزریق وابستگی و وارونگی کنترل (IoC)"
  },
  "INFRASTRUCTURE_ARCHITECTURE.md": {
    cat: "database",
    slug: "infrastructure-architecture",
    titleEn: "Infrastructure & Network Topology",
    titleFa: "زیرساخت شبکه و همگام‌سازی توزیع‌شده"
  },
  "TENANT_OPERATIONS.md": {
    cat: "security",
    slug: "tenant-operations",
    titleEn: "Tenant Management & Isolation Operations",
    titleFa: "عملیات مستأجرها و فرآیندهای ایزولاسیون"
  },
  "AUDIT_DESIGN.md": {
    cat: "security",
    slug: "audit-design",
    titleEn: "Audit Log & Event Logging Design",
    titleFa: "طراحی سیستم ثبت لاگ‌ها و حسابرسی رویدادها"
  },
  "PLATFORM_MONITORING.md": {
    cat: "development",
    slug: "platform-monitoring",
    titleEn: "Platform Monitoring & Error Telemetry",
    titleFa: "پایش پلتفرم و تله‌متری بلادرنگ خطاها"
  },
  "PERSISTENCE_MODEL.md": {
    cat: "database",
    slug: "persistence-model",
    titleEn: "Enterprise Persistence & Data Modeling",
    titleFa: "مدل ماندگاری داده‌ها و کوئری‌های بهینه دیتابیس"
  },
  "EVENT_PIPELINE.md": {
    cat: "architecture",
    slug: "event-pipeline",
    titleEn: "Event-Driven Asynchronous Pipeline",
    titleFa: "خط لوله رویدادها و مدیریت پردازش ناهمگام"
  },
  "ARCHITECTURE.md": {
    cat: "architecture",
    slug: "architecture",
    titleEn: "AI Core Architecture Specification",
    titleFa: "معماری کلی سیستم تحلیل معنایی"
  },
  "DATA_FLOW.md": {
    cat: "ai-intelligence",
    slug: "data-flow",
    titleEn: "AI Feature Data Flow & Pipelines",
    titleFa: "خط لوله جریان داده، استخراج و پردازش معنایی متون"
  },
  "AI_PIPELINE_ARCHITECTURE.md": {
    cat: "ai-intelligence",
    slug: "ai-pipeline-architecture",
    titleEn: "Large Language Model Integration",
    titleFa: "ساختار محاسباتی و ادغام مدل‌های زبانی بزرگ (LLMs)"
  },
  "EVENT_ARCHITECTURE.md": {
    cat: "ai-intelligence",
    slug: "event-architecture",
    titleEn: "Real-Time AI Event Architecture",
    titleFa: "مکانیزم‌های ارتباطاتی بلادرنگ و توزیع رویدادها"
  },
  "SECURITY_MODEL.md": {
    cat: "security",
    slug: "security-model",
    titleEn: "AI Security & Core Isolation",
    titleFa: "مدل جامع امنیت هوش مصنوعی و رمزنگاری داده‌ها"
  },
  "KNOWLEDGE_GRAPH_DESIGN.md": {
    cat: "ai-intelligence",
    slug: "knowledge-graph-design",
    titleEn: "Knowledge Graph Design Spec",
    titleFa: "طراحی پایگاه گراف دانش و نگاشت ارتباطات معنایی"
  },
  "FUTURE_EVOLUTION.md": {
    cat: "ai-intelligence",
    slug: "future-evolution",
    titleEn: "Future Evolution & AI Horizons",
    titleFa: "نقشه راه توسعه و افق‌های نوین یادگیری نیمه‌نظارتی"
  },
  "CQRS_DESIGN.md": {
    cat: "architecture",
    slug: "cqrs-design",
    titleEn: "CQRS Architectural Pattern in AI",
    titleFa: "طراحی تفکیک پرس‌وجو و فرمان (CQRS) در سیستم تحلیل"
  },
  "APPLICATION_LAYER.md": {
    cat: "development",
    slug: "application-layer",
    titleEn: "Application Layer & Web Frameworks",
    titleFa: "لایه وب اپلیکیشن و رابط‌های برنامه‌نویسی"
  },
  "DOMAIN_MODEL.md": {
    cat: "architecture",
    slug: "domain-model",
    titleEn: "AI Domain Entities & Value Objects",
    titleFa: "مدل دامنه هوش مصنوعی، موجودیت‌ها و الگوها"
  },
  "SERVICE_BOUNDARIES.md": {
    cat: "architecture",
    slug: "service-boundaries",
    titleEn: "Service Boundaries & Microservices Layout",
    titleFa: "مرزهای خدمات و معماری تفکیک سرویس‌ها"
  }
};

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function main() {
  console.log("Starting docs extraction and transformation...");

  // Categories list
  const categories = [
    "getting-started",
    "architecture",
    "ai-intelligence",
    "security",
    "database",
    "development",
    "api",
    "design-system"
  ];

  for (const cat of categories) {
    ensureDir(path.join(CONTENT_DIR, cat));
  }

  // 1. Process files from admin docs and ai-intelligence docs
  const adminDocsPath = path.join(__dirname, "..", "src", "features", "admin", "docs");
  const aiDocsPath = path.join(__dirname, "..", "src", "features", "ai-intelligence", "docs");

  const processFolder = (folderPath: string) => {
    if (!fs.existsSync(folderPath)) return;
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const mapping = FILE_MAPS[file];
      if (!mapping) {
        console.warn(`No mapping found for file: ${file}`);
        continue;
      }

      const filePath = path.join(folderPath, file);
      const enContent = fs.readFileSync(filePath, "utf-8");

      // Find Persian translation from DOCS_TOPICS
      const topicTranslation = DOCS_TOPICS.find((t) => t.slug === mapping.slug);
      let faContent = "";
      if (topicTranslation) {
        faContent = topicTranslation.contentFa;
      } else {
        faContent = `# ${mapping.titleFa}\n\nمستند ترجمه نشده است. به مستندات انگلیسی مراجعه کنید.\n\n${enContent}`;
      }

      // Write English file
      const enDest = path.join(CONTENT_DIR, mapping.cat, `${mapping.slug}.en.md`);
      const enFrontmatter = `---
title: "${mapping.titleEn}"
description: "Technical reference documentation for ${mapping.titleEn} in Seorchable system."
category: "${mapping.cat}"
lastUpdated: "2026-08-02"
author: "Seorchable Engineering Team"
keywords: "seorchable, ${mapping.slug}, technical, architecture"
---

${enContent}`;
      fs.writeFileSync(enDest, enFrontmatter, "utf-8");

      // Write Persian file
      const faDest = path.join(CONTENT_DIR, mapping.cat, `${mapping.slug}.fa.md`);
      const faFrontmatter = `---
title: "${mapping.titleFa}"
description: "مستندات فنی و راهنمای سیستم برای ${mapping.titleFa} در پلتفرم سئورچبل."
category: "${mapping.cat}"
lastUpdated: "1404-05-11"
author: "تیم فنی سئورچبل"
keywords: "سئورچبل, ${mapping.slug}, فنی, معماری"
---

${faContent}`;
      fs.writeFileSync(faDest, faFrontmatter, "utf-8");

      console.log(`Extracted and processed: ${mapping.slug}`);
    }
  };

  processFolder(adminDocsPath);
  processFolder(aiDocsPath);

  // 2. Process database/schema files
  const schemaPath = path.join(__dirname, "..", "database", "schema");
  if (fs.existsSync(schemaPath)) {
    // Tenant context spec
    const tcFile = path.join(schemaPath, "tenant-context-spec.md");
    if (fs.existsSync(tcFile)) {
      const tcContent = fs.readFileSync(tcFile, "utf-8");
      const enDest = path.join(CONTENT_DIR, "database", "tenant-context-spec.en.md");
      const faDest = path.join(CONTENT_DIR, "database", "tenant-context-spec.fa.md");

      fs.writeFileSync(enDest, `---
title: "Tenant Context & RLS Specification"
description: "Detailed architecture of Postgres Row-Level Security for strict tenant isolation."
category: "database"
lastUpdated: "2026-08-02"
author: "Database Security Architect"
keywords: "postgres, rls, row level security, multi tenancy"
---

${tcContent}`, "utf-8");

      fs.writeFileSync(faDest, `---
title: "مشخصات فنی امنیت چندمستأجری و RLS"
description: "معماری جامع امنیت سطح سطر در پایگاه داده PostgreSQL جهت ایزولاسیون صددرصدی داده‌های سازمانی."
category: "database"
lastUpdated: "1404-05-11"
author: "تیم پایگاه داده سئورچبل"
keywords: "پستگرس, rls, امنیت, چند مستاجری"
---

# مشخصات فنی امنیت چندمستأجری و RLS (PostgreSQL Row Level Security)

این مستند جزئیات مربوط به نحوه پیاده‌سازی Row Level Security (RLS) در پایگاه داده PostgreSQL برای تضمین عدم نشت اطلاعات میان سازمان‌ها (Tenant Leakage) در پلتفرم سئورچبل را تشریح می‌کند.

---

${tcContent.substring(tcContent.indexOf("## 1. Architectural Overview"))}`, "utf-8");

      console.log("Processed tenant-context-spec.md");
    }

    // Migration strategy
    const msFile = path.join(schemaPath, "migration-strategy.md");
    if (fs.existsSync(msFile)) {
      const msContent = fs.readFileSync(msFile, "utf-8");
      const enDest = path.join(CONTENT_DIR, "database", "migration-strategy.en.md");
      const faDest = path.join(CONTENT_DIR, "database", "migration-strategy.fa.md");

      fs.writeFileSync(enDest, `---
title: "Relational Database Migration Strategy"
description: "Drizzle ORM execution and zero-downtime deployment strategy for relational schema."
category: "database"
lastUpdated: "2026-08-02"
author: "Database Engineering"
keywords: "drizzle, migration, postgresql, zero downtime"
---

${msContent}`, "utf-8");

      fs.writeFileSync(faDest, `---
title: "استراتژی مهاجرت و تغییرات پایگاه داده"
description: "برنامه بروزرسانی بدون قطعی و اجرای اسکریپت‌های مهاجرت با استفاده از Drizzle ORM."
category: "database"
lastUpdated: "1404-05-11"
author: "تیم زیرساخت سئورچبل"
keywords: "درایور, مایگریشن, دیتابیس, بدون قطعی"
---

# استراتژی مهاجرت و بروزرسانی پایگاه داده (Relational Database Migration Strategy)

این مستند نحوه اجرای تغییرات ساختاری در دیتابیس با استفاده از Drizzle ORM و تکنیک توسعه بدون قطعی (Zero-Downtime) در سامانه سئورچبل را بیان می‌کند.

---

${msContent.substring(msContent.indexOf("## 1. Migration Tech Stack"))}`, "utf-8");

      console.log("Processed migration-strategy.md");
    }
  }

  // 3. Create Introduction in getting-started
  fs.writeFileSync(path.join(CONTENT_DIR, "getting-started", "introduction.en.md"), `---
title: "Introduction to Seorchable"
description: "Get started with Seorchable, the ultimate AI Visibility and Generative Engine Optimization platform."
category: "getting-started"
lastUpdated: "2026-08-02"
author: "Seorchable Product Team"
keywords: "introduction, getting started, seo, geo, aeo"
---

# Introduction to Seorchable Platform

Welcome to the **Seorchable** developer and enterprise architecture documentation portal!

Seorchable is a next-generation SaaS ecosystem designed to analyze, monitor, and optimize your brand's presence across artificial intelligence engines, chat interfaces, and semantic search systems.

## Key Capabilities

- **GEO & AEO Optimization**: Align your web content to rank high inside LLMs (like OpenAI GPT-4o, Anthropic Claude, Perplexity, Gemini).
- **Knowledge Graph Visualizer**: Fully interact with discovered brand entities and their contextual relationships.
- **Strict Multi-Tenant Isolation**: PostgreSQL level Row-Level Security ensuring absolute safety of your enterprise records.
- **Real-Time Sentiment Analysis**: Immediate ML pipeline to evaluate brand sentiment scores.

## How to Get Started

1. Set up an account via the Dashboard.
2. Ingest your documents or crawl your website using our **Firecrawl-powered crawler**.
3. View the AI visibility metrics and recommendations.
`, "utf-8");

  fs.writeFileSync(path.join(CONTENT_DIR, "getting-started", "introduction.fa.md"), `---
title: "معرفی پلتفرم سئورچبل"
description: "شروع کار با پلتفرم هوشمند بهینه‌سازی موتورهای پاسخگو و مدیریت حضور برند در هوش مصنوعی."
category: "getting-started"
lastUpdated: "1404-05-11"
author: "تیم مدیریت محصول سئورچبل"
keywords: "معرفی, شروع سریع, سئو, هوش مصنوعی, بهینه سازی"
---

# معرفی پلتفرم سئورچبل (Introduction to Seorchable)

به پرتال مستندات تخصصی و راهنمای ساختاری **سئورچبل** خوش آمدید!

پلتفرم سئورچبل یک اکوسیستم پیشرو برای تحلیل، پایش و ارتقای سهم صدای برند شما در چت‌بات‌ها و دستیارهای هوشمند صوتی و متنی (مانند ChatGPT, Claude, Perplexity, Gemini) است.

## قابلیت‌های کلیدی

- **بهینه‌سازی GEO و AEO**: بهینه‌سازی ساختار و محتوای وب‌سایت برای جلب اعتماد مدل‌های بزرگ زبانی.
- **نمایش تعاملی گراف دانش**: ترسیم زنده روابط معنایی ثبت‌شده پیرامون برند شما در جهان هوش مصنوعی.
- **ایزولاسیون کامل چندمستأجری**: بهره‌گیری از امنیت سطح سطر (RLS) در لایه پایگاه داده برای حفظ محرمانگی داده‌ها.
- **تحلیل بلادرنگ احساسات برند**: ارزیابی احساسات و میزان ارجاع مثبت چت‌بات‌ها به خدمات شما.

## نحوه شروع کار

۱. ایجاد حساب کاربری از طریق پیشخوان.
۲. اضافه کردن دامنه و خزش محتوای سایت با استفاده از خزشگر هوشمند **Firecrawl**.
۳. دریافت نمره کلی سلامت حضور برند و راهکارهای گام‌به‌گام بهینه‌سازی.
`, "utf-8");

  // 4. Create API guide
  fs.writeFileSync(path.join(CONTENT_DIR, "api", "api-reference.en.md"), `---
title: "REST API Reference Guide"
description: "Complete REST API reference and standard HTTP responses schema specification."
category: "api"
lastUpdated: "2026-08-02"
author: "API Platform Architects"
keywords: "rest api, integration, headers, JSON, auth tokens"
---

# Seorchable REST API Reference

Integrate your enterprise workflows directly with Seorchable's NLP & AEO optimization engine.

## Authentication

All API requests must include your secure workspace bearer token inside the HTTP Headers:

\`\`\`http
Authorization: Bearer <your_api_token_here>
\`\`\`

## Endpoints Summary

### 1. Start Web Crawling
- **POST** \`/api/v1/crawler/start\`
- Starts crawling a given URL to feed Seorchable's knowledge extraction parser.

### 2. Query Knowledge Graph
- **POST** \`/api/v1/knowledge-graph/query\`
- Retrieves active entity clusters and relational link weights.

### 3. Generate Free Brand Audit
- **POST** \`/api/v1/audit/free\`
- Instantly analyzes basic visibility metrics on Gemini/GPT mock adapters.
`, "utf-8");

  fs.writeFileSync(path.join(CONTENT_DIR, "api", "api-reference.fa.md"), `---
title: "مرجع خطوط ارتباطی REST API"
description: "راهنمای ادغام و مرجع کامل فراخوانی‌های برنامه‌نویسی پلتفرم."
category: "api"
lastUpdated: "1404-05-11"
author: "تیم توسعه هسته سئورچبل"
keywords: "ای پی ای, مستندات فنی, توکن امنیت, ادغام"
---

# راهنمای مرجع خطوط ارتباطی REST API

با استفاده از سرویس‌های REST API سئورچبل، جریان‌های کاری سازمان خود را مستقیماً به سیستم تحلیل هوش مصنوعی متصل کنید.

## احراز هویت (Authentication)

تمام درخواست‌ها باید دارای توکن معتبر اهدا شده در هدر درخواست باشند:

\`\`\`http
Authorization: Bearer <your_api_token_here>
\`\`\`

## خلاصه وب‌سرویس‌ها

### ۱. شروع فرآیند خزش دامنه
- **POST** \`/api/v1/crawler/start\`
- خزش و استخراج خودکار متون و مفاهیم صفحات وب‌سایت.

### ۲. کوئری گراف دانش
- **POST** \`/api/v1/knowledge-graph/query\`
- دریافت نودها و یال‌های روابط معنایی کشف‌شده پیرامون برند.
`, "utf-8");

  // 5. Create Design System Guide
  fs.writeFileSync(path.join(CONTENT_DIR, "design-system", "design-system-tokens.en.md"), `---
title: "Design System & Tokens"
description: "Enterprise design language, branding guide, colors, typography, glassmorphism, and UI rules."
category: "design-system"
lastUpdated: "2026-08-02"
author: "Design Lead"
keywords: "design, ui, ux, theme, colors, glassmorphism, branding"
---

# Seorchable Enterprise Design System

The visual identity of Seorchable is styled to convey deep tech intelligence, developer accessibility, and enterprise reliability.

## Color Tokens

We utilize CSS custom variables defining our core gradients:

- **Sky Blue**: \`--sky-blue-500\` (\`#38bdf8\`)
- **Orange**: \`--orange-500\` (\`#f97316\`)
- **Glass Panel CSS**:
  \`\`\`css
  .glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
  }
  \`\`\`

## Typography

- LTR font: Robust Sans-serif (Inter/Geist) combined with a premium monospace for code blocks.
- RTL font: Persian Vazirmatn / IRANSans / Estedad font, delivering extreme mathematical readability and alignment.
`, "utf-8");

  fs.writeFileSync(path.join(CONTENT_DIR, "design-system", "design-system-tokens.fa.md"), `---
title: "سیستم طراحی بصری و توکن‌ها"
description: "زبان بصری پلتفرم، توکن‌های رنگی، استانداردهای تایپوگرافی و افکت‌های شیشه‌ای."
category: "design-system"
lastUpdated: "1404-05-11"
author: "تیم محصول و دیزاین سئورچبل"
keywords: "دیزاین سیستم, رنگ ها, تایپوگرافی, تم, شیشه ای"
---

# سیستم طراحی بصری و توکن‌های گرافیکی سئورچبل

زبان طراحی سئورچبل منعکس‌کننده پایداری سازمانی، پویایی تحلیل هوش مصنوعی و راحتی کاربری توسعه‌دهندگان است.

## توکن‌های رنگی (Color Tokens)

طیف رنگی گرادیان انحصاری برند ما از ترکیب زیر شکل گرفته است:

- **آبی آسمانی (Sky Blue)**: \`--sky-blue-500\`
- **نارنجی پرتقالی (Orange)**: \`--orange-500\`
- **کلاس پانل شیشه‌ای (Glassmorphism)**:
  \`\`\`css
  .glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
  }
  \`\`\`

## تایپوگرافی و خوانایی متون

فونت اصلی متون فارسی **وزیرمتن** یا هم‌خانواده‌های هندسی آن است تا خوانایی طولانی‌مدت اسناد فنی ارتقا یابد.
`, "utf-8");

  console.log("Docs migration and transformation successfully completed!");
}

main().catch((err) => {
  console.error("Failed to run docs extraction:", err);
  process.exit(1);
});
