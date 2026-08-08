# TASK 1.0 — SEORCHABLE DASHBOARD INFORMATION ARCHITECTURE & SITEMAP

---

## 1. EXECUTIVE SUMMARY

### 1.1 Objective & Scope
The objective of this document is to establish the canonical **Information Architecture (IA), Navigation Model, and Sitemap** for Seorchable. This framework maps how user journeys are structured, identifies duplicate routes for immediate convergence, defines system-level layout patterns, and details the exact entry points connecting functional tools with the static technical documentation portal.

### 1.2 Core Navigation Vision
The Seorchable navigation model converges multiple scattered widgets and duplicate pages into a single, cohesive vertical navigation sidebar (`AppSidebar`) on desktop, paired with a clean global bottom action bar (`FloatingSidebar`) for quick workspace jumping. It explicitly separates the public-facing marketing hierarchy from the secure, authenticated dashboard workspace, ensuring that:
- **Unauthenticated visitors** navigate clean, fast, SEO-optimized marketing routes.
- **Authenticated tenants** operate inside an immersive dashboard workspace layout that preserves the bilingual Persian (RTL) / English (LTR) layout grid while providing seamless contextual linking directly to the technical documentation portal.

---

## 2. CANONICAL DASHBOARD STRUCTURE

To ensure the workspace feels like a single unified platform rather than a collection of independent pages, we establish a **Standardized Dashboard Shell**. Every authenticated page must reside within this shell to maintain consistent layouts, headers, and menus.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               GLOBAL UPPER BRAND HEADER                          │
│  [Logo (RTL/LTR)]                     [Tenant/Workspace Selector]   [User Profile]│
├──────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌─────────────────────────────────────────────────────┐ │
│ │  CANONICAL SIDEBAR   │ │                    ACTIVE WORKSPACE PANEL           │ │
│ │  (AppSidebar)        │ │                                                     │ │
│ │                      │ │  [Breadcrumbs]                                      │ │
│ │  • Overview          │ │                                                     │ │
│ │                      │ │  ┌───────────────────────────────────────────────┐  │ │
│ │  • SEO Tools         │ │  │                                               │  │ │
│ │  • AI Visibility    │ │  │             ACTIVE IN-DASHBOARD PAGE          │  │ │
│ │  • Content Tools     │ │  │                                               │  │ │
│ │  • Competitive       │ │  │                                               │  │ │
│ │  • Brand/Citation    │ │  └───────────────────────────────────────────────┘  │ │
│ │                      │ │                                                     │ │
│ │  • Docs Portal Link  │ │  [Documentation Help Widget]                        │ │
│ │  • Billing & Plan    │ │                                                     │ │
│ └──────────────────────┘ └─────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────┤
│               FOOTER / PERSISTENT FLOATING QUICK NAVIGATION BAR (FloatingSidebar)  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 UI Layout Standards
1. **The Left/Right Responsive Sidebar (`AppSidebar`):**
   - Locked to the right side on Farsi RTL layouts, and left on English LTR layouts.
   - Collapses into a thin icon-only column on smaller viewports and slides into a hidden drawer on mobile.
2. **The Active Workspace Panel:**
   - Occupies the remaining viewport width, fully adaptive to flex layouts.
   - Features a standardized breadcrumb header mapping the exact category and tool.
3. **The Persistent Floating Navigation Pill (`FloatingSidebar`):**
   - Centers at the bottom of the screen.
   - Appears exclusively on workspace routes, transitioning from a compact pill to an expanded quick-jump menu on desktop, or a modal drawer on mobile.
4. **Theme Consistency:**
   - Utilizes custom CSS variables (`--card`, `--border`, `--background`, `--text-muted`) to ensure a smooth transition between Light and Dark modes.

---

## 3. CANONICAL NAVIGATION TREE

This section details the structured navigation tree for the Seorchable dashboard. It organizes features into functional parent groups, specifying each path, display icon, and default localization key.

### 3.1 Sidebar Navigation Nodes (`AppSidebar`)

- **0.0 Overview (پیشخوان)**
  - Path: `/dashboard`
  - Icon: `LayoutDashboard`
  - Purpose: Real-time central KPI widget grid summarizing SEO, AI Visibility, and Citation performance.
- **1.0 SEO Tools (بهینه‌سازی سئو)**
  - **1.1 Technical Optimizer (بهینه‌سازی فنی)**
    - Path: `/dashboard/seo/technical`
    - Icon: `Settings2`
    - Purpose: Crawlability diagnostics, robots.txt validations, sitemap syntax parsers.
  - **1.2 Schema Generator (سازنده ساختار داده)**
    - Path: `/dashboard/seo/schema`
    - Icon: `Code2` (Planned Module)
    - Purpose: Visual schema and JSON-LD markup builder.
- **2.0 AI Visibility Tools (پایش‌های دیده‌شدن هوش مصنوعی)**
  - **2.1 AEO Intelligence Audits (پایش‌های معنایی)**
    - Path: `/dashboard/aeo/audits`
    - Icon: `ShieldAlert`
    - Purpose: Historical search engine crawling listings and new audit triggers.
  - **2.2 Search Engine Simulator (شبیه‌ساز موتورهای هوش مصنوعی)**
    - Path: `/dashboard/aeo/playground`
    - Icon: `Bot`
    - Purpose: Active chat playground testing brand response attribution and synthesis risks.
- **3.0 Content Tools (ابزارهای محتوا)**
  - **3.1 Content Studio (استودیو محتوا)**
    - Path: `/dashboard/content/studio`
    - Icon: `FileEdit`
    - Purpose: Interactive editor tracking semantic word density and outline extraction.
  - **3.2 Document Ingestion (ورود و ایندکس اسناد)**
    - Path: `/dashboard/content/ingestion`
    - Icon: `UploadCloud`
    - Purpose: Document chunks vector parser and sentiment mapper.
- **4.0 Competitive Tools (تحلیل رقبا)**
  - **4.1 Competitor Radar (رادار رقابتی)**
    - Path: `/dashboard/competitors/radar`
    - Icon: `Compass`
    - Purpose: Multi-competitor polygon metrics overlay with detailed JSONB history.
- **5.0 Brand & Citation Tools (پایش استناد و برند)**
  - **5.1 Citation Explorer (جستجوگر مراجع استناد)**
    - Path: `/dashboard/brand/citations`
    - Icon: `Globe`
    - Purpose: Stream tracker showing brand mentions and real-time sentiment flags.
- **6.0 Knowledge & Entity Tools (گراف دانش)**
  - **6.1 Entity Graph Explorer (کاوشگر گراف دانش)**
    - Path: `/dashboard/entities/graph`
    - Icon: `Network`
    - Purpose: Node-edge topological representation of tenant organizations.
- **7.0 Analytics & Reporting (گزارش‌ها و تحلیل‌ها)**
  - **7.1 LLM Bias & Sentiment (تحلیل سوگیری مدل‌های زبانی)**
    - Path: `/dashboard/analytics/llm-bias`
    - Icon: `BarChart3`
    - Purpose: Multi-model sentiment indices, response bias, and token allocations.
- **8.0 Administration & Settings (تنظیمات)**
  - **8.1 Workspace Settings (تنظیمات فضای کاری)**
    - Path: `/dashboard/settings`
    - Icon: `Sliders`
    - Purpose: Core tenant metadata, API key storage, team permissions.
  - **8.2 Billing & Plans (صورت‌حساب و طرح‌ها)**
    - Path: `/dashboard/billing`
    - Icon: `Receipt`
    - Purpose: Core SaaS subscription cards with contextual upgrade paths.

---

## 4. CANONICAL SITEMAP

To ensure clear indexing and search-friendly visibility for unauthenticated users, while protecting authenticated features, Seorchable defines three strictly separated routing layers.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   SEORCHABLE SITEMAP                             │
├──────────────────────────┬────────────────────────────┬──────────────────────────┤
│        PUBLIC            │       AUTHENTICATED        │       DOCUMENTATION      │
├──────────────────────────┼────────────────────────────┼──────────────────────────┤
│ • /                      │ • /dashboard               │ • /docs                  │
│ • /solutions             │ • /dashboard/seo/*         │ • /docs/architecture     │
│ • /pricing               │ • /dashboard/aeo/*         │ • /docs/data-flow        │
│ • /about                 │ • /dashboard/content/*     │ • /docs/event-pipeline   │
│ • /blog                  │ • /dashboard/competitors/* │ • /docs/knowledge-graph  │
│ • /contact               │ • /dashboard/brand/*       │ • /docs/persistence      │
│ • /legal                 │ • /dashboard/entities/*    │ • /docs/admin-rbac       │
│ • /login                 │ • /dashboard/analytics/*   │                          │
│ • /register              │ • /dashboard/settings      │                          │
│                          │ • /dashboard/billing       │                          │
└──────────────────────────┴────────────────────────────┴──────────────────────────┘
```

### 4.1 Public Marketing Routes (Unauthenticated)
- `/` (Home): Primary landing page highlighting CSS-interactive mock dashboards.
- `/solutions`: Enterprise market segmentation (B2B SaaS, Finance, Brands).
- `/pricing`: Comparative SaaS subscription matrix.
- `/about`: Company history, mission, and team outline.
- `/blog`: Educational articles on traditional SEO and AEO strategy.
- `/contact`: Sales and customer support inquiries.
- `/legal`: Terms of Service and Privacy Policy.
- `/login`: Secure entrance interface.
- `/register`: Secured workspace onboarding portal.

### 4.2 Authenticated Dashboard Routes (Protected)
- `/dashboard`: Unified dashboard overview.
- `/dashboard/seo/technical`: Technical crawl diagnostics.
- `/dashboard/seo/schema`: Schema builder (planned module).
- `/dashboard/aeo/audits`: Historical listings.
- `/dashboard/aeo/audits/[id]`: High-fidelity scorecard report.
- `/dashboard/aeo/playground`: Active prompt simulator chat playground.
- `/dashboard/content/studio`: Content editor.
- `/dashboard/content/ingestion`: Text chunk upload portal.
- `/dashboard/competitors/radar`: Radar chart comparisons.
- `/dashboard/brand/citations`: Mention streams and brand sentiment alerts.
- `/dashboard/entities/graph`: Knowledge Graph node map.
- `/dashboard/analytics/llm-bias`: Analysis dashboards.
- `/dashboard/settings`: Workspace profile, database configurations, API keys.
- `/dashboard/billing`: Subscription plans and pricing tier upgrades.

### 4.3 Technical Documentation Portal (Hybrid Access)
*The existing static documentation portal is fully preserved. It reads data from `src/lib/docsData.ts` and renders technical markdown for both public visitors and authenticated tenants.*
- `/docs`: Root technical index showing documentation topics.
- `/docs/[topic-slug]`: Individual technical documentation views.

---

## 5. ROUTE CONSOLIDATION RECOMMENDATIONS

Based on the findings of the repository audit, we identify three highly redundant routes that currently run duplicate page components. To resolve layout duplication and streamline the sitemap, we recommend immediately standardizing the routing architecture as follows:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ROUTE CONSOLIDATION STRATEGY                      │
├───────────────────────────────────┬────────────────────────────────────┤
│         LEGACY PATH               │          CANONICAL DESTINATION     │
├───────────────────────────────────┼────────────────────────────────────┤
│ • /dashboard/rag                  │ ──► /dashboard/aeo/playground      │
│ • /dashboard/query                │ ──► /dashboard/aeo/playground      │
│ • /dashboard/ingest               │ ──► /dashboard/content/ingestion   │
│ • /dashboard/ingestion            │ ──► /dashboard/content/ingestion   │
│ • /dashboard/competitive          │ ──► /dashboard/competitors/radar   │
│ • /dashboard/competitors          │ ──► /dashboard/competitors/radar   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 5.1 Route Merge Actions
1. **The RAG / Query Duplicate:**
   - **Current State:** `/dashboard/rag` and `/dashboard/query` both load the exact same page component.
   - **Resolution:** Re-route both to `/dashboard/aeo/playground`. Create a Next.js middleware or config redirect mapping the legacy `/dashboard/rag` and `/dashboard/query` paths to `/dashboard/aeo/playground`.
2. **The Ingest / Ingestion Duplicate:**
   - **Current State:** `/dashboard/ingest` and `/dashboard/ingestion` are completely redundant.
   - **Resolution:** Consolidate under `/dashboard/content/ingestion`. Add redirects from legacy patterns to avoid broken historical links.
3. **The Competitive / Competitors Duplicate:**
   - **Current State:** `/dashboard/competitive` and `/dashboard/competitors` both load the competitor comparison layout.
   - **Resolution:** Unify under `/dashboard/competitors/radar`. Implement standard redirects for legacy paths.

---

## 6. SYSTEM-LEVEL UX & IA DESIGN PRINCIPLES

Every UI component added to the dashboard in subsequent phases must adhere to the following core UX/UI principles:

### 6.1 Progressive Disclosure
- Always present high-level summaries (e.g. general visibility score, core robot permission summaries) first.
- Provide detailed matrices, breakdown scorecards, and complex telemetry parameters only when the user explicitly clicks into the card detail views.

### 6.2 Visual Hierarchy & Contextual Upgrades
- Clearly distinguish between Free and Paid features.
- Lock paid features behind **glassmorphic blur layers** instead of abrupt, page-blocking modals.
- Every locked element must explain exactly what business benefit is unlocked and provide a direct path to the Billing panel.

### 6.3 Accessibility & Contrast Compliance (WCAG)
- Elements must maintain at least a **4.5:1 contrast ratio** for normal text.
- Ensure Farsi text utilizes correct font classes (`font-sans` with `Yekan` fallback) and achieves maximum readability in both light and dark modes.

### 6.4 Contextual Documentation Links
- **Goal:** Minimize user confusion by linking directly from active tools to their matching technical documentation page.
- **Implementation:** Every dashboard tool view should feature a small, elegant help widget (`HelpCircle` icon) in the breadcrumb bar or card header that links directly to its associated topic inside the static documentation portal:
  - Technical Optimizer view links directly to `/docs/persistence-model`.
  - AEO Intelligence Audits view links directly to `/docs/architecture`.
  - Content Studio view links directly to `/docs/application-layer`.
  - Competitor Radar view links directly to `/docs/domain-model`.

---

## 7. EXPLICITLY OUT OF SCOPE

The following tasks are **explicitly out of scope** during the implementation of this dashboard IA transition:

1. **Rebuilding the Documentation Portal:** The static data model (`src/lib/docsData.ts`) will NOT be migrated to physical disk markdown files.
2. **Re-architecting API Routes:** Existing functional endpoints under `/api/v1/*` will remain unchanged during routing consolidation; simple file re-routing or gateway configurations will handle path changes.
3. **Refactoring Layout Libraries:** Visual chart libraries (such as the canvas-rendered `LiveAnalyticsGraph` or SVG Radar charts) will keep their respective drawing states and mathematical engine loops.
4. **Deploying Real Database Schemes:** RLS schema rules and tenant databases will remain as-is; mock fallback modes will continue running offline.
