# CURRENT STATE AUDIT REPORT

---

## 1. EXECUTIVE SUMMARY

This document establishes the verified technical state of the `seorchable` repository as of August 2026. This audit was performed strictly as a read-only architectural investigation to record real repository facts, configurations, and implementation details.

### 1.1 Core System Description
- **Application Type:** Enterprise SaaS Web Application.
- **Primary Framework:** Next.js (v16) App Router with bilingual localization (English / Persian) in LTR/RTL layouts.
- **Primary Runtime / Languages:** Node.js, TypeScript.
- **Architectural Patterns:** Clean Architecture / Domain-Driven Design (DDD) layered architecture with clear boundaries between the presentation, core/database, application service, and infrastructure feature layers.
- **Major Implemented Capabilities:**
  - Real-time AI Visibility & Search Engine Optimization (AEO) Audit Engine.
  - Interactive Live Knowledge Graph Explorer (Radar chart representation of metrics).
  - Bilingual Documentation Portal (Farsi first, loaded from unified static dataset with rich Markdown rendering).
  - Multi-Tenant logical isolation built directly on Postgres Row Level Security (RLS) with context leasing.
  - Active offline simulated databases and mock fallback drivers enabling zero-infrastructure localized execution.
- **Major Integrations:**
  - **Scraping / Crawling:** Firecrawl (via `@mendable/firecrawl-js`) for remote content extraction.
  - **AI / LLM:** Google Gemini API (via `@ai-sdk/google` and Vercel `ai` core SDK) or an automated fallback `MockLLMClient`.
- **Major Gaps / Anomalies:**
  - Discrepancy between documentation claiming active Drizzle ORM usage and the actual implementation, which uses raw parameterized SQL via the PostgreSQL `pg` driver.
  - Active client-side session mocking using `localStorage` instead of server-side stateful session providers, though secure cookies are synced to prevent SSR failures.

---

## 2. REPOSITORY STATE

### 2.1 Git Status at Commencement
- **Branch:** `main` (Default branch).
- **Tracked/Untracked Files:** The repository was initialized in a perfectly clean state.
- **Working Tree Changes:** No prior uncommitted files or modifications were present when the audit started.
- **Metadata Result:**
  ```bash
  $ git status --short
  # [Empty Output - Clean Working Directory]
  ```

### 2.2 Package Management Context
- **Package Manager:** `pnpm` (validated by the presence of `pnpm-lock.yaml`).
- **Workspace Configuration:** Single-project structure.
- **Root Manifest:** `package.json` contains runtime and build scripts, devDependencies, and client/server integrations.

---

## 3. TECH STACK & ENVIRONMENT

### 3.1 Frameworks & Runtime
- **Next.js:** `16.2.11` `[VERIFIED]` (located in `package.json`).
- **React:** `19.2.4` `[VERIFIED]` (located in `package.json`).
- **TypeScript:** `^5` (specifically `5.7.3` locked in `pnpm-lock.yaml`) `[VERIFIED]`.

### 3.2 UI Engine
- **Tailwind CSS:** `^4` (specifically `4.3.3` in `package.json` with `@tailwindcss/postcss`) `[VERIFIED]`.
- **Framer Motion:** `^12.42.2` `[VERIFIED]`.
- **Recharts:** `^3.10.1` `[VERIFIED]` (used inside the KPI and analytical trend screens).
- **Lucide React:** `^1.26.0` `[VERIFIED]` (provides accessible semantic UI iconography).

### 3.3 Backend & Application Logic
- **Route Handlers / API Routes:** Located inside `src/app/api/v1/` `[VERIFIED]`.
- **Server Actions:** Located inside `src/app/actions/` `[VERIFIED]`.
- **Domain Logic Features:** Located inside `src/features/` and `src/services/` `[VERIFIED]`.

### 3.4 Database Drivers
- **pg (PostgreSQL Client):** `^8.22.0` `[VERIFIED]` (direct connection leasing with pg Pool).
- **Drizzle ORM:** `[NOT FOUND]` in `package.json` dependencies, though mentioned in documentation.

### 3.5 External Integrations
- **Firecrawl App SDK:** `@mendable/firecrawl-js@^4.31.1` `[VERIFIED]`.
- **Google Gemini Provider:** `@ai-sdk/google@^4.0.24` and `ai@^7.0.37` `[VERIFIED]`.

### 3.6 Key Environment Variables Trace
| Variable Name | Purpose | Verified Consumer |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `PostgresClient` (`src/features/admin/infrastructure/persistence/postgres/index.ts`) |
| `FIRECRAWL_API_KEY` | Remote web scraping authentication | `firecrawlApp` (`src/lib/firecrawl.ts`) |
| `GOOGLE_AI_API_KEY` | Gemini LLM generation authentication | `GeminiLLMClient` (`src/services/ai/llm-client.ts`) |

---

## 4. REPOSITORY TREE & ARCHITECTURE

The repository structure follows a highly decoupled Clean Architecture.

```
seorchable/
├── components/                  # Client-side UI visual layout primitives (e.g. live-analytics, navigation)
├── database/                    # Relational data layer mapping
│   ├── migrations/              # SQL incremental version records
│   └── schema/                  # Type-safe model and raw SQL table definitions
├── lib/                         # Standard global utility scripts
├── public/                      # Static assets, local branding icons, and Persian typography (Peyda, Yekan Bakh)
├── scripts/                     # Operational terminal validation tools
├── src/                         # Principal application bundle
│   ├── app/                     # Next.js App Router root
│   │   ├── actions/             # Unified next.js server-side mutations (auth, ingestion)
│   │   ├── api/                 # Endpoint REST handlers
│   │   └── [locale]/            # Fully localized multilingual page routing
│   ├── components/              # Shared dashboard and marketing widgets
│   ├── config/                  # Global site metadata, environment, and AI temperature settings
│   ├── core/                    # Platform plumbing (events, RLS tenant context, AsyncLocalStorage)
│   ├── features/                # Domain modular implementations (admin features, analytics)
│   ├── lib/                     # Specific scraping (Firecrawl) and static documentation models
│   ├── services/                # Heavyweight background utilities (crawler, vector store, AI client orchestration)
│   └── types/                   # Central domain contracts and authentication interface models
└── tests/                       # Complete automated validation suites
```

---

## 5. UI & ROUTE MAP

Below is the verified layout of all pages. Next.js server-side layout structures route authentication through `<ProtectedRoute>` or standard middleware-cookie context checks.

### 5.1 Public Marketing Routes
All marketing layouts support bilingualism: `en` (Left-to-Right) and `fa` (Right-to-Left).
- **Home / Landing Page:** `/[locale]/` `[VERIFIED]` (Rich dashboard previews, comparison tables, enterprise trust grids).
- **Solutions:** `/[locale]/solutions` `[VERIFIED]`.
- **Pricing Plans:** `/[locale]/pricing` `[VERIFIED]`.
- **About Us:** `/[locale]/about` `[VERIFIED]`.
- **Blog:** `/[locale]/blog` `[VERIFIED]`.
- **Contact Us:** `/[locale]/contact` `[VERIFIED]`.
- **Privacy Policy:** `/[locale]/privacy` `[VERIFIED]`.
- **Invoice & Payments:** `/[locale]/invoice` `[VERIFIED]`.

### 5.2 Guest Authentication Routes
- **Login:** `/[locale]/login` `[VERIFIED]`.
- **Register:** `/[locale]/register` `[VERIFIED]`.
- **Forgot Password:** `/[locale]/forgot-password` `[VERIFIED]`.
- **Verify Email:** `/[locale]/verify-email` `[VERIFIED]`.

### 5.3 Protected Dashboard Routes (Workspace Admin Required)
Protected via the client-side `<ProtectedRoute>` component and backed by server-side mock validation.
- **Main Portal:** `/[locale]/dashboard` `[VERIFIED]`.
- **AEO Intelligence Audits:** `/[locale]/dashboard/audits` `[VERIFIED]`.
- **Audit scorecard Detail:** `/[locale]/dashboard/audits/[id]` `[VERIFIED]`.
- **Brand & Citation Monitoring:** `/[locale]/dashboard/brand-monitoring` `[VERIFIED]`.
- **AEO RAG Query Dashboard:** `/[locale]/dashboard/query` `[VERIFIED]` (RTL-aligned playground).
- **Content Studio:** `/[locale]/dashboard/content` `[VERIFIED]`.
- **Competitive Analysis:** `/[locale]/dashboard/competitive` `[VERIFIED]`.
- **Knowledge Graph Explorer:** `/[locale]/dashboard/graph` `[VERIFIED]`.
- **Technical SEO Optimization:** `/[locale]/dashboard/optimization/technical` `[VERIFIED]`.
- **Document Ingestion:** `/[locale]/dashboard/ingest` `[VERIFIED]`.
- **LLM Analytics Dashboard:** `/[locale]/dashboard/analytics/llm` `[VERIFIED]`.
- **Global Settings:** `/[locale]/dashboard/settings` `[VERIFIED]`.
- **Billing Plans:** `/[locale]/dashboard/billing` `[VERIFIED]`.

---

## 6. UI COMPONENT & SERVICE INVENTORY

### 6.1 Major Presentation Elements
- **AppSidebar (`src/components/navigation/AppSidebar.tsx`):**
  - Left-hand navigation tree grouped into Products, Documentation, Users, and Company. On authenticated sessions, it offers direct workspace settings and billing access.
- **GlobalNavigationControls (`src/components/navigation/GlobalNavigationControls.tsx`):**
  - Floating controls with a responsive mobile-hidden back button to prevent layout conflicts.
- **FloatingSidebar (`components/navigation/FloatingSidebar.tsx`):**
  - Center-aligned floating menu bar with responsive layout overlays. Strictly active on workspace paths, returning null on main landing pages.
- **LiveKnowledgeGraph (`src/components/features/graph/LiveKnowledgeGraph.tsx`):**
  - Features an interactive Radar Chart using Canvas APIs or Recharts for metrics display.
- **LiveAnalyticsGraph (`components/live-analytics/`):**
  - High-performance, 60+ FPS delta-time driven Canvas animation system representing real-time traffic statistics with zero React state re-render in the animation loop.

---

## 7. BACKEND & API INVENTORY

All core APIs reside inside Next.js API Routes in `src/app/api/v1/`.

| Method | Endpoint | Auth Level | Purpose | Internal Services |
| :---: | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/audit/engine` | System Default / Tenant | Executes Core Intelligence Audit pipeline | `executeAudit` (builder) |
| `POST` | `/api/v1/content/studio` | Workspace Tenant | Generates AEO terminology suggestions | `firecrawlApp` (optional), `getLLMClient` |
| `POST` | `/api/v1/optimization/technical` | Workspace Tenant | Runs technical SEO signal extraction | `firecrawlApp` (optional), `Cheerio` |
| `POST` | `/api/v1/analysis/competitive` | Workspace Tenant | Analyzes competitors' semantic differences | `firecrawlApp` (optional), LLM Orchestrator |
| `POST` | `/api/v1/audit/free` | Public | Free limited URL discovery tool | `firecrawlApp` (optional), `MockAiAuditService` |
| `POST` | `/api/v1/rag/query` | Workspace Tenant | Executes semantic vector index search & RAG | `queryService`, `contextRetrieval` |
| `POST` | `/api/v1/knowledge-graph/query` | Workspace Tenant | Resolves entity relations queries | `graphStore` |

---

## 8. DATABASE & DATA LAYER

### 8.1 Database Architecture
The application uses **PostgreSQL** as its enterprise-grade relational layer, accessed via `PostgresClient`.
- **Connection Pooling:** Bound to `pg.Pool` with an idle timeout of 30s.
- **Offline Simulation Driver (`MockPoolClient`):**
  - Automatically intercepts connection errors (such as `ECONNREFUSED` during test or offline environments) and switches to an in-memory runtime store (`PostgresTenantRepository.store`). This enables the system to remain fully operational without a live connection.
- **Row-Level Security (RLS) Policy Execution:**
  - Multi-tenant data segregation is enforced by applying policies directly on Postgres tables (e.g., `brands`, `organizations`). Every transacted tenant connection triggers `SET LOCAL app.current_tenant_id = <tenantId>` to guarantee logical isolation.
- **Tenant Context Isolation:**
  - Tracked across async calls using `AsyncLocalStorage` via the `TenantContextManager` wrapper. Unauthenticated or cross-tenant query execution throws a `TenantContextViolationException`.

### 8.2 Database Schemas (Located in `database/schema/`)
- `organization.ts`: Holds organizational workspace contexts.
- `brand.ts`: Manages monitored brand items under each tenant.
- `entity.ts`: Stores semantic knowledge graph entities.
- `prompt.ts`: Captures prompts and LLM input logs.
- `observation.ts`: Tracks LLM responses and mentions.
- `citation.ts`: Stores extracted URL reference links.
- `visibility.ts`: Tracks historical visibility metrics.
- `recommendation.ts`: Logs suggested SEO optimizations.

---

## 9. AUTHENTICATION & SECURITY STATE

### 9.1 Authentication Mechanism
- Client-side sessions are initialized, tracked, and stored in `localStorage` under the key `auth_session_user`.
- On state transitions (login/register), the client calls server-side cookie handlers `loginAction` and `logoutAction` (located in `src/app/actions/auth.ts`) to set secure, `httpOnly`, `sameSite: "strict"` cookies (`tenant_id`, `user_id`). This ensures Next.js Server Components can read the active tenant context securely.

### 9.2 Authorization Model
- Role-based Access Control (RBAC) supports three roles: `super_admin`, `workspace_admin`, and `viewer`.
- Roles are validated client-side via the `hasPermission` utility and protected via `<ProtectedRoute>`.
- In database queries, table-level authorization is strictly verified using Postgres Row-Level Security (RLS) policies.

---

## 10. FIRECRAWL & AI/LLM INTEGRATIONS

### 10.1 Firecrawl Ingestion Flow
Firecrawl acts as the primary web scraper client.
```
  [User URL Input]
         │
         ▼
  [API Endpoint]  ── (Checks if FIRECRAWL_API_KEY is active)
         │
         ├──► [API Key Available] ──► [Calls firecrawlApp.scrapeUrl] ──► [Retrieves Markdown Payload]
         │
         └──► [Key Absent / Mock] ──► [Falls back to Local Mock Scraping Payload]
         │
         ▼
  [LLM Orchestration / Raw Signals Extraction]
```

### 10.2 AI/LLM Provider Infrastructure
- Managed via `src/services/ai/llm-client.ts` with a dynamic service resolution layer (`getLLMClient`).
- **Gemini Client:** Uses Google’s Gemini API (`gemini-1.5-flash` or `gemini-1.5-pro`) through the `@ai-sdk/google` integration.
- **Mock Client:** Automatically activated when `GOOGLE_AI_API_KEY` is absent or the code runs in the `test` environment. Special intercepts are placed on prompts containing `sentiment` to return predefined Persian sentiment JSON schemas, avoiding random execution failure.

---

## 11. TESTING & VALIDATION STATE

The system is equipped with an automated, fully decoupled terminal testing layout. Because no custom command configuration exists inside `package.json`, tests are designed to execute individually using the `tsx` compiler.

- **Test Framework:** Node.js native `assert` module.
- **Test Execution Command:** `pnpm exec tsx <filepath>`

### 11.1 Verified Test Suites
All of the following tests have been executed and are confirmed to pass successfully:
- **AI Orchestration Layer (`tests/services/ai/ai.test.ts`):** `[VERIFIED]`
  - Validates text chunking, punctuation preservation, zero-width non-joiner boundary safeties, and Persian sentiment parsing.
- **Core Intelligence Audit Engine (`tests/services/audit-engine/engine.test.ts`):** `[VERIFIED]`
  - Validates URL normalization, SSRF private IP blocking, redirect loops, response payload size limits, and timeout controls.
- **Web Crawler & Multi-Tenant Ingestion (`tests/services/crawler/web-crawler.test.ts`):** `[VERIFIED]`
  - Validates full link discovery, crawler depth limits, and multi-tenant document isolation checks using simulated transacted SQL queries.

---

## 12. DOCUMENTATION VS IMPLEMENTATION

There are several interesting mismatches between existing architectural documentation claims and actual runtime implementation:

| Area | Documentation Claim | Implementation Reality | Status | Evidence Path |
| :--- | :--- | :--- | :--- | :--- |
| **ORM Database** | "We utilize Drizzle ORM paired with Drizzle Kit to handle schema modeling, SQL generation..." | Drizzle is not installed. Schemas are custom TypeScript definitions with raw SQL, executed via the native `pg` driver. | `[VERIFIED]` MISMATCH | `database/schema/migration-strategy.md` & `package.json` |
| **Session State** | Stateful server sessions via authorization providers. | Client-side session tracking in `localStorage` (`auth_session_user`), syncing cookies on transitions. | `[VERIFIED]` MISMATCH | `src/components/AuthProvider.tsx` & `src/app/actions/auth.ts` |
| **CMS docs Service** | Documentation portal powered by file-based CMS under `content/docs/` parsing `.en.md` and `.fa.md`. | Docs are hardcoded inside a static TypeScript array (`DOCS_TOPICS`) in `src/lib/docsData.ts` and rendered dynamically. | `[VERIFIED]` MISMATCH | `src/lib/docsData.ts` & `src/app/[locale]/docs/[slug]/page.tsx` |

---

## 13. KNOWN GAPS & ANOMALIES

- **Drizzle Dependency Absence:** Mentioned extensively in database guides but totally absent from the project manifest (`package.json`).
- **Client Auth Control:** The application relies on client-managed state for authenticated routes. While DB queries are protected server-side via RLS, a user can mock their client session locally in `localStorage` to view the UI.
- **Unused Feature Directories:** Several empty feature placeholders exist without direct workspace hookups (e.g., `src/features/ai-intelligence/observability`).
- **Static Documentation Portal:** Although highly professional, documentation cannot be updated dynamically without code commits since files are parsed from `src/lib/docsData.ts`.

---

## 14. EVIDENCE TRACEABILITY MATRIX

To ensure complete accountability, every core architectural claim in this audit report is linked to direct repository paths:

| Audit Finding | Verification Status | Source File Reference | Symbol / Code Section |
| :--- | :---: | :--- | :--- |
| **Next.js v16 & React 19** | `[VERIFIED]` | `package.json` | `"dependencies"` block |
| **Row Level Security (RLS) Policy** | `[VERIFIED]` | `database/schema/brand.ts` | `sql` string property / `ALTER TABLE brands ENABLE ROW LEVEL SECURITY` |
| **Postgres Offline Simulation** | `[VERIFIED]` | `src/features/admin/infrastructure/persistence/postgres/index.ts` | `MockPoolClient` & fallback connect handler |
| **Tenant Context Isolation** | `[VERIFIED]` | `src/core/database/tenant-context/index.ts` | `TenantContextManager` & `AsyncLocalStorage` |
| **Bilingual Markdown Parser** | `[VERIFIED]` | `src/app/[locale]/docs/[slug]/page.tsx` | `renderRichContent` parser |
| **Gemini AI Client** | `[VERIFIED]` | `src/services/ai/llm-client.ts` | `GeminiLLMClient` & `createGoogleGenerativeAI` |
| **Firecrawl App Integration** | `[VERIFIED]` | `src/lib/firecrawl.ts` | `new FirecrawlApp` |
| **Client Session Syncing** | `[VERIFIED]` | `src/components/AuthProvider.tsx` | `loginAction` execution in `useEffect` block |
| **Core Audit Scoring** | `[VERIFIED]` | `src/lib/audit-engine/scorer.ts` | `calculateScores` |
| **SSRF Defenses** | `[VERIFIED]` | `src/lib/audit-engine/url-validator.ts` | `isSafeUrl` CIDR block validations |
