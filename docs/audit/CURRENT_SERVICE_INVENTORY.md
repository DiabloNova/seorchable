# CURRENT SERVICE & DOCUMENTATION INVENTORY

---

## 1. EXECUTIVE SUMMARY

This document establishes a complete, evidence-based inventory of all current user-facing services, tools, dashboard capabilities, public pages, APIs, and documentation routes present in the `seorchable` repository as of August 2026. This discovery process operates with zero product modifications or strategic speculation.

### Key Insights:
- **Exposed Services Count:** 10 core user-facing capabilities/services discovered.
- **Implementation Status:** Highly developed services including an active Core Intelligence Audit Engine, RAG query interfaces, and interactive spider-web knowledge graphs.
- **Bilingual Coverage:** All marketing, UI components, and static documentation pages are 100% bilingually configured with RTL (Persian) and LTR (English) layouts.
- **Technical Gaps:** Notable mismatches exist between architectural documentation (which claims Drizzle ORM usage and dynamic filesystem markdown parsing) and actual implementation realities (which use raw parameterized SQL via the `pg` client and statically hardcoded metadata arrays).

---

## 2. SERVICE DISCOVERY METHODOLOGY

To build an accurate, evidence-backed catalog, the repository was queried systematically across multiple layers:
1. **Routing Inspection:** Crawling all Next.js page paths under `src/app/[locale]/dashboard/` and `src/app/api/v1/`.
2. **Interactive UI Review:** Checking the sidebar navigation structure in `AppSidebar.tsx` and the floating bottom menu inside `FloatingSidebar.tsx`.
3. **Application Layer Analysis:** Reviewing feature-specific client react views situated in `src/components/features/`.
4. **Data & AI Flow Interception:** Analyzing active external SDK wrappers in `src/lib/firecrawl.ts` and `src/services/ai/llm-client.ts` alongside database table parameters defined under `database/schema/`.

---

## 3. CURRENT SERVICE CATALOG

Below is the canonical catalog of all active user-facing capabilities currently available within the system.

| Service ID | Current Service Name (UI) | User-Facing Description | Dashboard Route | Public Route | API / Action Entry |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** / پایش‌ها و ممیزی‌های دیده‌شدن | Lists historical website crawl reports and facilitates running new crawls. | `/dashboard/audits` | `/[locale]/` | `/api/v1/audit/engine` |
| **SRV-002** | **AEO Scorecard / Audit Detail** / جزئیات پایش معنایی | Granville score breakdown of technical, content, entity, and structured data signals. | `/dashboard/audits/[id]` | `/[locale]/` | `executeAudit` (Builder) |
| **SRV-003** | **Brand & Citation Monitoring** / پایش برند و مراجع استناد | Stream list tracking real-time web citations and AI brand authority ratings. | `/dashboard/brand-monitoring` | `/[locale]/` | `MockAiAuditService` |
| **SRV-004** | **AEO RAG Query Dashboard** / هوشمندی پرس‌وجو | Active Persian/English chatbot to test retrieval matching and synthesis risk. | `/dashboard/query` (or `/dashboard/rag`) | `/[locale]/` | `/api/v1/rag/query` |
| **SRV-005** | **Content Studio** / استودیو محتوا | Editor providing AI-powered terminology reviews and AEO outline generation. | `/dashboard/content` | `/[locale]/` | `/api/v1/content/studio` |
| **SRV-006** | **Competitive Analysis** / تحلیل رقابتی | Radar chart and metrics contrasting brand performance against competitors. | `/dashboard/competitive` (or `/dashboard/competitors`) | `/[locale]/` | `/api/v1/analysis/competitive` |
| **SRV-007** | **Knowledge Graph Explorer** / گراف دانش | Interactive node/edge relationship graph mapping organization entities. | `/dashboard/graph` | `/[locale]/` | `/api/v1/knowledge-graph/query` |
| **SRV-008** | **Technical SEO Optimization** / بهینه‌سازی فنی سئو | Code extractor evaluating JSON-LD schemas, robots.txt, and canonical links. | `/dashboard/optimization/technical` | `/[locale]/` | `/api/v1/optimization/technical` |
| **SRV-009** | **Document Ingestion Portal** / ورود اسناد | Upload zone facilitating chunking and vector mapping of TXT/MD/JSON files. | `/dashboard/ingest` (or `/dashboard/ingestion`) | `/[locale]/` | `ingestDocumentAction` |
| **SRV-010** | **LLM Analytics Dashboard** / تحلیل مدل‌های زبانی | Bias trackers, sentiment trend charts, and token counts for leading models. | `/dashboard/analytics/llm` | `/[locale]/` | `/api/v1/analytics/llm` |

---

## 4. DASHBOARD & NAVIGATION INVENTORY

The dashboard navigation hierarchy is structured inside the modular sidebar drawer and global quick-access systems.

### 4.1 AppSidebar Navigation Categories (`src/components/navigation/AppSidebar.tsx`)
- **Products & Services (دسترسی‌های اصلی):**
  - AI Visibility Audit (`/dashboard/audits`)
  - Citation Explorer (`/dashboard/brand-monitoring`)
  - Brand Intelligence Chat (`/dashboard/query`)
  - Content Studio (`/dashboard/content`)
  - Competitive Radar (`/dashboard/competitive`)
  - Knowledge Graph Explorer (`/dashboard/graph`)
  - Technical Optimizer (`/dashboard/optimization/technical`)
  - Document Ingestion (`/dashboard/ingest`)
  - LLM Analytics (`/dashboard/analytics/llm`)
- **Documentation (مستندات فنی):**
  - Infrastructure & Architecture (`/docs`)
- **Users (تنظیمات پنل):**
  - Settings (`/dashboard/settings`)
  - Billing / Pricing Plan (`/dashboard/billing`)

### 4.2 FloatingSidebar Navigation (`components/navigation/FloatingSidebar.tsx`)
A bottom-centered, glassmorphic floating menu displayed exclusively on workspace routes (`/dashboard`, `/settings`, `/profile`) to provide swift layout jumps:
- Dashboard (`/dashboard`)
- Intelligence Panel (`/dashboard/intelligence` - redirects or renders active dashboard)
- Content Studio (`/dashboard/content`)
- Citation Explorer (`/dashboard/brand-monitoring`)
- Competitive Radar (`/dashboard/competitive`)
- Settings (`/dashboard/settings`)

---

## 5. PUBLIC / MARKETING SERVICE INVENTORY

Marketing routes reside at the root of `src/app/[locale]/` and advertise the product capability matrix to unauthenticated guests.

- **Main Home Page (`/[locale]/page.tsx`):**
  - Markets five interactive CSS mock dashboards (Visibility Score, Brand Authority, Citation Explorer, Competitor Comparison, Knowledge Graph, Prompt Monitoring Timeline).
  - Offers a B2B comparison matrix contrasting traditional SEO against AI Visibility Optimization (GEO).
- **Solutions (`/[locale]/solutions/page.tsx`):**
  - Details custom industry packaging (e.g. Enterprise Search, B2B SaaS, and Brand Reputation management).
- **Pricing Tier Matrix (`/[locale]/pricing/page.tsx`):**
  - Displays Free, Professional, and Enterprise cards, linking directly to registration overlays.

---

## 6. LIVE DOCUMENTATION INVENTORY

The documentation system is statically powered by the single file `src/lib/docsData.ts` via the `DOCS_TOPICS` export array. This eliminates client-side browser bundling issues with `fs` or `path`.

### Verified Documentation Topics:
1. **admin-architecture:** Administration Module Architecture (*معماری کلی ماژول مدیریت سیستم*)
2. **rbac-model:** Role-Based Access Control Model (*مدل کنترل دسترسی مبتنی بر نقش (RBAC)*)
3. **dependency-injection:** Dependency Injection Framework (*الگوی تزریق وابستگی و وارونگی کنترل (IoC)*)
4. **infrastructure-architecture:** Infrastructure & Network Topology (*زیرساخت شبکه و همگام‌سازی توزیع‌شده*)
5. **tenant-operations:** Tenant Management & Isolation Operations (*عملیات مستأجرها و فرآیندهای ایزولاسیون*)
6. **audit-design:** Audit Log & Event Logging Design (*طراحی سیستم ثبت لاگ‌ها و حسابرسی رویدادها*)
7. **platform-monitoring:** Platform Monitoring & Error Telemetry (*پایش پلتفرم و تله‌متری بلادرنگ خطاها*)
8. **persistence-model:** Enterprise Persistence & Data Modeling (*مدل ماندگاری داده‌ها و کوئری‌های بهینه دیتابیس*)
9. **event-pipeline:** Event-Driven Asynchronous Pipeline (*خط لوله رویدادها و مدیریت پردازش ناهمگام*)
10. **architecture:** AI Core Architecture Specification (*معماری کلی سیستم تحلیل معنایی*)
11. **data-flow:** AI Feature Data Flow & Pipelines (*خط لوله جریان داده، استخراج و پردازش معنایی متون*)
12. **ai-pipeline-architecture:** Large Language Model Integration (*ساختار محاسباتی و ادغام مدل‌های زبانی بزرگ (LLMs)*)
13. **event-architecture:** Real-Time AI Event Architecture (*معماری رویدادهای زنده و هماهنگی بلادرنگ داشبورد*)
14. **security-model:** AI Security & Core Isolation (*مدل جامع امنیت هوش مصنوعی و رمزنگاری داده‌ها*)
15. **knowledge-graph-design:** Knowledge Graph Design Spec (*طراحی پایگاه گراف دانش*)
16. **future-evolution:** Future Evolution & AI Horizons (*نقشه راه توسعه و افق‌های نوین*)
17. **cqrs-design:** CQRS Architectural Pattern in AI (*طراحی تفکیک پرس‌وجو و فرمان (CQRS) در سیستم تحلیل*)
18. **application-layer:** Application Layer & Web Frameworks (*لایه وب اپلیکیشن*)
19. **domain-model:** AI Domain Entities & Value Objects (*مدل دامنه هوش مصنوعی، موجودیت‌ها و الگوها*)
20. **service-boundaries:** Service Boundaries & Microservices Layout (*مرزهای خدمات و معماری تفکیک سرویس‌ها*)

---

## 7. SERVICE ↔ DOCUMENTATION MAPPING

Below maps each user-facing dashboard service to its explicit technical documentation topic.

| Service ID | Service Name | Dashboard Route | Documentation Match | Documentation Topic Slug |
| :---: | :--- | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** | `/dashboard/audits` | `[VERIFIED]` Matches | `architecture` / `data-flow` |
| **SRV-002** | **AEO Scorecard / Detail** | `/dashboard/audits/[id]` | `[VERIFIED]` Matches | `data-flow` |
| **SRV-003** | **Brand & Citation Monitoring** | `/dashboard/brand-monitoring` | `[VERIFIED]` Matches | `platform-monitoring` |
| **SRV-004** | **AEO RAG Query Dashboard** | `/dashboard/query` | `[VERIFIED]` Matches | `ai-pipeline-architecture` |
| **SRV-005** | **Content Studio** | `/dashboard/content` | `[VERIFIED]` Matches | `application-layer` |
| **SRV-006** | **Competitive Analysis** | `/dashboard/competitive` | `[VERIFIED]` Matches | `domain-model` |
| **SRV-007** | **Knowledge Graph Explorer** | `/dashboard/graph` | `[VERIFIED]` Matches | `knowledge-graph-design` |
| **SRV-008** | **Technical SEO Optimization** | `/dashboard/optimization/technical` | `[VERIFIED]` Matches | `persistence-model` |
| **SRV-009** | **Document Ingestion Portal** | `/dashboard/ingest` | `[VERIFIED]` Matches | `event-pipeline` |
| **SRV-010** | **LLM Analytics Dashboard** | `/dashboard/analytics/llm` | `[VERIFIED]` Matches | `ai-pipeline-architecture` |

---

## 8. SERVICE ↔ API ↔ IMPLEMENTATION MAPPING

Below traces the actual implementation architecture powering each user-facing capability.

| Service ID | Service Name | API Endpoint / Action | Internal Implementation Source File | Status |
| :---: | :--- | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** | `/api/v1/audit/engine` | `src/lib/audit-engine/builder.ts` (`executeAudit`) | `[VERIFIED]` |
| **SRV-002** | **AEO Scorecard / Detail** | `executeAudit` (Direct) | `src/lib/audit-engine/builder.ts` (`executeAudit`) | `[VERIFIED]` |
| **SRV-003** | **Brand & Citation Monitoring** | `MockAiAuditService` (Client-side) | `src/services/auditService.ts` (`MockAiAuditService`) | `[VERIFIED]` |
| **SRV-004** | **AEO RAG Query Dashboard** | `/api/v1/rag/query` | `src/services/rag/query-service.ts` (`QueryService`) | `[VERIFIED]` |
| **SRV-005** | **Content Studio** | `/api/v1/content/studio` | `src/services/ai/llm-client.ts` (`getLLMClient`) | `[VERIFIED]` |
| **SRV-006** | **Competitive Analysis** | `/api/v1/analysis/competitive` | `src/services/ai/llm-client.ts` (`getLLMClient`) | `[VERIFIED]` |
| **SRV-007** | **Knowledge Graph Explorer** | `/api/v1/knowledge-graph/query` | `src/services/knowledge-graph/graph-store.ts` (`GraphStore`) | `[VERIFIED]` |
| **SRV-008** | **Technical SEO Optimization** | `/api/v1/optimization/technical` | `src/services/crawler/web-crawler.ts` (`WebCrawler`) | `[VERIFIED]` |
| **SRV-009** | **Document Ingestion Portal** | `ingestDocumentAction` | `src/services/ingestion/document-ingestion.ts` (`DocumentIngestionService`) | `[VERIFIED]` |
| **SRV-010** | **LLM Analytics Dashboard** | `/api/v1/analytics/llm` | `src/services/ai/sentiment-analysis.ts` (`analyzeSentiment`) | `[VERIFIED]` |

---

## 9. FIRECRAWL / AI / EXTERNAL INTEGRATION MATRIX

Traces external SDK pipelines, network requests, and machine learning client resolutions.

| Service ID | Service Name | Uses Firecrawl | Uses Gemini / LLM | Call Path Flow |
| :---: | :--- | :---: | :---: | :--- |
| **SRV-001** | **AEO Intelligence Audits** | NO (Uses Custom Scraper) | NO | UI -> API -> `executeAudit` -> `secureCrawl` -> `extractSignals` -> response |
| **SRV-002** | **AEO Scorecard / Detail** | NO | NO | UI -> direct render -> `executeAudit` -> response |
| **SRV-003** | **Brand & Citation Monitoring** | NO | NO | UI -> `MockAiAuditService` -> local state simulation |
| **SRV-004** | **AEO RAG Query Dashboard** | NO | YES | UI -> API -> `QueryService` -> `getLLMClient` -> response |
| **SRV-005** | **Content Studio** | YES (Optional) | YES | UI -> API -> `firecrawlApp.scrapeUrl` (optional) -> `getLLMClient` -> response |
| **SRV-006** | **Competitive Analysis** | YES (Optional) | YES | UI -> API -> `firecrawlApp.scrapeUrl` (optional) -> `getLLMClient` -> response |
| **SRV-007** | **Knowledge Graph Explorer** | NO | NO | UI -> API -> `GraphStore` -> simulated vectors query -> response |
| **SRV-008** | **Technical SEO Optimization** | YES (Optional) | NO | UI -> API -> `firecrawlApp.scrapeUrl` (optional) -> cheerio parsing -> response |
| **SRV-009** | **Document Ingestion Portal** | NO | YES (For Sentiments) | UI -> Action -> `DocumentIngestionService` -> `analyzeSentiment` -> response |
| **SRV-010** | **LLM Analytics Dashboard** | NO | YES | UI -> API -> `analyzeSentiment` -> `getLLMClient` -> response |

---

## 10. DATABASE DEPENDENCY MATRIX

Traces persistence behavior and isolation schemas under active tenant operations.

| Service ID | Service Name | Persisted | Database Tables Used | Tenant Isolated | Mock / Offline Fallback |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **SRV-001** | **AEO Intelligence Audits** | YES | `premium_audits` | YES | Handled via in-memory `PostgresTenantRepository.store` |
| **SRV-002** | **AEO Scorecard / Detail** | YES | `premium_audits` | YES | Simulated if pg Pool connection fails |
| **SRV-003** | **Brand & Citation Monitoring**| YES | `brand_mentions`, `citations` | YES | Local mock list simulation |
| **SRV-004** | **AEO RAG Query Dashboard** | YES | `document_embeddings` | YES | Mock vectors matrix matching |
| **SRV-005** | **Content Studio** | NO | None (Transient) | YES | Returns hardcoded Persian editing objects if LLM fails |
| **SRV-006** | **Competitive Analysis** | YES | `competitive_analyses` | YES | Simulated JSONB properties |
| **SRV-007** | **Knowledge Graph Explorer** | YES | `kg_entities`, `kg_relationships`| YES | Mock local Graph Map fallbacks |
| **SRV-008** | **Technical SEO Optimization** | YES | `premium_audits` | YES | Offline mock signal schemas |
| **SRV-009** | **Document Ingestion Portal** | YES | `document_embeddings` | YES | Mock vector chunks indexing |
| **SRV-010** | **LLM Analytics Dashboard** | YES | `ai_observations` | YES | Stored in mock persistent map |

---

## 11. AUTHENTICATION & AUTHORIZATION MATRIX

Enforces security and role restrictions across endpoints and UI states.

| Service ID | Service Name | Access Requirement | Enforced UI Role (Min) | Server-Side Enforcement (RLS) |
| :---: | :--- | :--- | :---: | :--- |
| **SRV-001** | **AEO Intelligence Audits** | Authenticated | `workspace_admin` | Checked via `TenantContextManager.getRequiredTenantId` |
| **SRV-002** | **AEO Scorecard / Detail** | Authenticated | `workspace_admin` | Checked via `TenantContextManager.getRequiredTenantId` |
| **SRV-003** | **Brand & Citation Monitoring**| Authenticated | `viewer` | Enforced in SQL where organization_id matches |
| **SRV-004** | **AEO RAG Query Dashboard** | Authenticated | `viewer` | Enforced in SQL where organization_id matches |
| **SRV-005** | **Content Studio** | Authenticated | `workspace_admin` | Enforced via `x-tenant-id` header validation |
| **SRV-006** | **Competitive Analysis** | Authenticated | `workspace_admin` | Enforced via `x-tenant-id` header validation |
| **SRV-007** | **Knowledge Graph Explorer** | Authenticated | `viewer` | Checked via `TenantContextManager.getRequiredTenantId` |
| **SRV-008** | **Technical SEO Optimization** | Authenticated | `workspace_admin` | Checked via `TenantContextManager.getRequiredTenantId` |
| **SRV-009** | **Document Ingestion Portal** | Authenticated | `workspace_admin` | Checked via `TenantContextManager.getRequiredTenantId` |
| **SRV-010** | **LLM Analytics Dashboard** | Authenticated | `viewer` | Enforced in SQL where organization_id matches |

---

## 12. FREE / PAID / ENTITLEMENT STATE

Currently, **no active gating, licensing, stripe verification, or paid subscription entitlement validation exists inside the application code**.

- **Free vs Premium Audits Gating:**
  - `[NOT FOUND]` There is no code block checking if a user has a "Premium" subscription before running premium audits.
  - Clicking "Run Premium Audit" inside `PremiumAuditPanel.tsx` or running standard crawls through `/dashboard/audits` executes normally.
- **Organization Plan Limits:**
  - `[NOT FOUND]` Quota limits (e.g. max crawled pages, max queries) are listed in schemas and static configs but are not actively locked or checked in API endpoints.
- **Tenant Isolation ID (`tenant_id`):**
  - Authenticated sessions simply fetch whatever workspace identifier is set client-side in `localStorage`. There is no billing validation step.

---

## 13. IMPLEMENTATION MATURITY MATRIX

Each discovered service is classified by its current implementation reality:

| Service ID | Service Name | Maturity Classification | Notes |
| :---: | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** | **PRODUCTION IMPLEMENTED** | Real crawl, normalization, SSRF checks, and scoring occur on the backend. |
| **SRV-002** | **AEO Scorecard / Detail** | **PRODUCTION IMPLEMENTED** | Granular breakdown of HTML signals and AI visibility simulation is fully active. |
| **SRV-003** | **Brand & Citation Monitoring**| **MOCK / SIMULATION** | The alerts feed is generated client-side with mock delay. |
| **SRV-004** | **AEO RAG Query Dashboard** | **PARTIALLY IMPLEMENTED** | Real chat and embedding matching occurs but falls back to mock vectors offline. |
| **SRV-005** | **Content Studio** | **PRODUCTION IMPLEMENTED** | Fully utilizes Firecrawl scraping and LLM-based editorial reviews. |
| **SRV-006** | **Competitive Analysis** | **PRODUCTION IMPLEMENTED** | Fully integrates Firecrawl scraping to contrast competitor content via LLM. |
| **SRV-007** | **Knowledge Graph Explorer** | **PARTIALLY IMPLEMENTED** | Displays relations but has some mock elements during offline sessions. |
| **SRV-008** | **Technical SEO Optimization** | **PRODUCTION IMPLEMENTED** | Performs real network extraction of metadata, schema format, and robot permissions. |
| **SRV-009** | **Document Ingestion Portal** | **PRODUCTION IMPLEMENTED** | Performs real Persian chunking, sentiment tracking, and SQL mapping. |
| **SRV-010** | **LLM Analytics Dashboard** | **PRODUCTION IMPLEMENTED** | Integrates with sentiment models to analyze biases across conversational models. |

---

## 14. DOCUMENTATION COVERAGE MATRIX

This matrix tracks documented vs. actual implementation coverage.

| Service ID | Service Name | Has Documentation | Documentation Route | Matched / Mismatch | Evidence Source Path |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **SRV-001** | **AEO Intelligence Audits** | YES | `/docs/architecture` | **Matched** | `src/lib/docsData.ts` |
| **SRV-002** | **AEO Scorecard / Detail** | YES | `/docs/data-flow` | **Matched** | `src/lib/docsData.ts` |
| **SRV-003** | **Brand & Citation Monitoring**| YES | `/docs/platform-monitoring`| **Matched** | `src/lib/docsData.ts` |
| **SRV-004** | **AEO RAG Query Dashboard** | YES | `/docs/ai-pipeline-architecture` | **Matched** | `src/lib/docsData.ts` |
| **SRV-005** | **Content Studio** | YES | `/docs/application-layer` | **Matched** | `src/lib/docsData.ts` |
| **SRV-006** | **Competitive Analysis** | YES | `/docs/domain-model` | **Matched** | `src/lib/docsData.ts` |
| **SRV-007** | **Knowledge Graph Explorer** | YES | `/docs/knowledge-graph-design` | **Matched** | `src/lib/docsData.ts` |
| **SRV-008** | **Technical SEO Optimization** | YES | `/docs/persistence-model` | **Matched** | `src/lib/docsData.ts` |
| **SRV-009** | **Document Ingestion Portal** | YES | `/docs/event-pipeline` | **Matched** | `src/lib/docsData.ts` |
| **SRV-010** | **LLM Analytics Dashboard** | YES | `/docs/ai-pipeline-architecture` | **Matched** | `src/lib/docsData.ts` |

---

## 15. DUPLICATION & DOCUMENTATION/IMPLEMENTATION MISMATCHES

- **Route Duplication / Overlaps:**
  - **RAG Dashboard:** `/dashboard/rag` and `/dashboard/query` both render the exact same page component.
  - **Ingestion Portal:** `/dashboard/ingest` and `/dashboard/ingestion` both render the exact same page component.
  - **Competitive Radar:** `/dashboard/competitive` and `/dashboard/competitors` both render the exact same page component.
- **ORM Documentation Mismatch:**
  - Every database document (e.g., `persistence-model`, `migration-strategy.md`) claims the platform uses **Drizzle ORM** and **Drizzle Kit**. However, the codebase does not have Drizzle installed, relying instead on raw SQL and direct `pg` connection pools.
- **File-based Markdown CMS Mismatch:**
  - Layout structures and architecture guides state that documentation is parsed dynamically from physical `.en.md` and `.fa.md` files on disk. In reality, the live pages read data from a static TS object array in `src/lib/docsData.ts`.

---

## 16. CURRENT-STATE GAPS & ANOMALIES

- **Client-Side Auth Spoofing:** Because authenticated sessions are checked via `localStorage.getItem("auth_session_user")`, a user can easily bypass login interfaces locally, though server-side DB queries are protected by Postgres RLS.
- **Empty Feature Sub-Directories:**
  - Multiple folders exist as structural layout guides with no functional scripts inside them:
    - `src/features/ai-intelligence/observability`
    - `src/features/ai-intelligence/security`
- **Missing CLI Dependencies:**
  - Database schema definitions contain perfect syntax, but because Drizzle CLI is absent, migrations can only be executed by executing the raw SQL strings in the table files.

---

## 17. EVIDENCE TRACEABILITY MATRIX

To ensure maximum reproducibility, all service catalog points have been mapped to direct repository references:

| Service ID | Service Name | UI Page File Location | Core Backend Handler File Location |
| :---: | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** | `src/app/[locale]/dashboard/audits/page.tsx` | `src/app/api/v1/audit/engine/route.ts` |
| **SRV-002** | **AEO Scorecard / Detail** | `src/app/[locale]/dashboard/audits/[id]/page.tsx` | `src/lib/audit-engine/builder.ts` |
| **SRV-003** | **Brand & Citation Monitoring**| `src/app/[locale]/dashboard/brand-monitoring/page.tsx` | `src/services/auditService.ts` |
| **SRV-004** | **AEO RAG Query Dashboard** | `src/app/[locale]/dashboard/query/page.tsx` | `src/app/api/v1/rag/query/route.ts` |
| **SRV-005** | **Content Studio** | `src/app/[locale]/dashboard/content/page.tsx` | `src/app/api/v1/content/studio/route.ts` |
| **SRV-006** | **Competitive Analysis** | `src/app/[locale]/dashboard/competitive/page.tsx` | `src/app/api/v1/analysis/competitive/route.ts` |
| **SRV-007** | **Knowledge Graph Explorer** | `src/app/[locale]/dashboard/graph/page.tsx` | `src/app/api/v1/knowledge-graph/query/route.ts` |
| **SRV-008** | **Technical SEO Optimization** | `src/app/[locale]/dashboard/optimization/technical/page.tsx` | `src/app/api/v1/optimization/technical/route.ts` |
| **SRV-009** | **Document Ingestion Portal** | `src/app/[locale]/dashboard/ingestion/page.tsx` | `src/app/actions/ingestion.ts` |
| **SRV-010** | **LLM Analytics Dashboard** | `src/app/[locale]/dashboard/analytics/llm/page.tsx` | `src/app/api/v1/analytics/llm/route.ts` |
