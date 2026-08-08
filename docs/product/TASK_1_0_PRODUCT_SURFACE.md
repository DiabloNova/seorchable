# TASK 1.0 — SEORCHABLE PRODUCT SURFACE & UX ARCHITECTURE

---

## 1. EXECUTIVE SUMMARY

### 1.1 Objective & Scope
The objective of this document is to establish the canonical **Product Surface and UX Architecture** for Seorchable. This framework defines how unauthenticated public pages transition into a single, unified, authenticated SaaS dashboard. By bringing all user-facing services under a coherent information architecture, we eliminate fragmented navigation, resolve overlapping and duplicate routes, and position SEO and AI search optimization (AEO/GEO) as complementary, first-class citizen capabilities.

### 1.2 Core Product Vision
Seorchable is an enterprise-grade AI Visibility and SEO Optimization platform. Its core premise is that **traditional search engine optimization (SEO) and modern artificial intelligence search optimization (AEO/GEO) are not mutually exclusive; they are deeply complementary.**
The product vision transitions Seorchable from a collection of isolated utilities into a **Unified Workspace** where:
1. **Unauthenticated users** are welcomed by high-fidelity educational and marketing landing pages with clear calls-to-action (CTAs) pointing to the unified workspace.
2. **Authenticated users** navigate a single SaaS dashboard environment that adapts to their active entitlement tier (Free vs. Paid) using elegant progressive disclosure and high-fidelity "glassmorphic" locking paradigms instead of jarring blocks.

### 1.3 Key Architectural Decisions
- **Bilingual Interface Support:** Maintain fully localized English (LTR) and Persian (RTL) views across both marketing and dashboard layouts.
- **Theme-Aware Aesthetic Integrity:** Maintain absolute contrast and WCAG readability across both Dark and Light themes.
- **Tenant Context Isolation:** Leverage the underlying multi-tenant context leasing architecture while presenting a clean client-side tenant/workspace selection workflow.
- **Zero-Implementation Blueprints:** This document serves as a logical planning guide. No database migrations, billing APIs, or UI codebases will be refactored or modified in this planning phase.

---

## 2. PRODUCT TAXONOMY

To eliminate fragmented nomenclature and organize Seorchable’s features into a cohesive suite, we establish a canonical taxonomy across **eight primary product categories**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SEORCHABLE PLATFORM                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
         ┌──────────────────────────────────┴──────────────────────────────────┐
         ▼                                                                     ▼
┌─────────────────────────────────┐                                 ┌──────────────────────────────────┐
│        SEO INTELLIGENCE         │                                 │     AI VISIBILITY / AEO / GEO    │
├─────────────────────────────────┤                                 ├──────────────────────────────────┤
│ • Technical SEO Optimizer       │                                 │ • AEO Intelligence Audits        │
│ • Schema & Structured Data      │                                 │ • AI Visibility Scorecard        │
│ • Crawlability & Indexability   │                                 │ • Search Engine Simulator        │
└─────────────────────────────────┘                                 └──────────────────────────────────┘
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐ ┌──────────────────────────────────┐
│      CONTENT INTELLIGENCE       │ │     COMPETITIVE INTELLIGENCE    │ │    BRAND & CITATION INTELLIGENCE │
├─────────────────────────────────┤ ├─────────────────────────────────┤ ├──────────────────────────────────┤
│ • Content Studio                │ │ • Competitor Comparison Radar   │ │ • Brand Authority Index          │
│ • Document Ingestion Portal     │ │ • Strategy Opportunity Map      │ │ • Web Citation Alert Stream     │
└─────────────────────────────────┘ └─────────────────────────────────┘ └──────────────────────────────────┘
         ┌──────────────────────────────────┴──────────────────────────────────┐
         ▼                                                                     ▼
┌─────────────────────────────────┐                                 ┌──────────────────────────────────┐
│     KNOWLEDGE & ENTITY INTEL.   │                                 │       ANALYTICS & REPORTING      │
├─────────────────────────────────┤                                 ├──────────────────────────────────┤
│ • Interactive Knowledge Graph   │                                 │ • LLM Bias & Sentiment Trackers  │
│ • Entity Extraction Engine      │                                 │ • PDF Scorecard Exports          │
└─────────────────────────────────┘                                 └──────────────────────────────────┘
```

### 2.1 The Eight Canonical Categories
1. **SEO Intelligence:** Traditional optimization tooling checking standard web parameters (schema markup, robots.txt, canonical links, tags, and crawl metadata) to verify absolute indexability.
2. **AI Visibility / AEO / GEO:** Advanced analytics measuring brand visibility across AI search assistants (Perplexity, Gemini, Claude, OpenAI). Includes simulated user prompts, response attribution tracking, and synthesis risk analysis.
3. **Content Intelligence:** AI-assisted authoring engines that check semantic density, recommend missing terminology, and map document chunks to RAG embeddings.
4. **Technical SEO:** Specific structural diagnostics detailing code compliance, mobile responsiveness, and schema validity.
5. **Competitive Intelligence:** Multi-competitor comparison models that contrast a tenant's site with industry benchmarks, mapping performance on a multi-metric radar interface.
6. **Brand & Citation Intelligence:** Scanners that discover brand mentions across reference citations, indexing search engine authority and real-time citation sentiment.
7. **Knowledge Graph / Entity Intelligence:** Graph databases and entity modeling engines displaying semantic connections between people, products, and organizations in interactive nodes.
8. **Analytics & Reporting:** Live analytics platforms presenting usage metrics, LLM response profiles, token tallies, and automated, client-ready report generators.

---

## 3. COMPLETE CURRENT-SERVICE MIGRATION MATRIX

The following matrix documents the migration path for all ten active services discovered during the repository audit. It defines how each service transitions from its current fragmented layout to a unified dashboard paradigm.

| Service ID | Current Service Name (UI) | Current Route | Implementation Maturity | Proposed Category | Proposed Destination | Type | Free / Paid Model | Public Page Disposition | Migration Priority | Dependencies & Blockers |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SRV-001** | **AEO Intelligence Audits** | `/dashboard/audits` | PRODUCTION IMPLEMENTED | AI Visibility / AEO / GEO | `/dashboard/aeo/audits` | Standalone Page | **FREE:** 3 audits/mo.<br>**PAID:** Unlimited audits, deep site crawls. | Transformed into a product showcase landing page. | **HIGH** | None. Backend is highly stable. |
| **SRV-002** | **AEO Scorecard / Audit Detail** | `/dashboard/audits/[id]` | PRODUCTION IMPLEMENTED | AI Visibility / AEO / GEO | `/dashboard/aeo/audits/[id]` | Standalone Page | **FREE:** General visibility score, first 3 recommendations.<br>**PAID:** Full scorecard, AI mitigation suggestions, interactive timeline. | Interactive mock dashboard displayed on root homepage. | **HIGH** | SRV-001 migration. |
| **SRV-003** | **Brand & Citation Monitoring** | `/dashboard/brand-monitoring` | MOCK / SIMULATION | Brand & Citation Intelligence | `/dashboard/brand/citations` | Standalone Page | **FREE:** View 5 latest citations, basic Authority index.<br>**PAID:** Live sentiment analysis, real-time alert streams, CSV export. | Product marketing landing page detailing "AI Mention Management". | **MEDIUM** | Requires real-time citation stream connection in subsequent phases. |
| **SRV-004** | **AEO RAG Query Dashboard** | `/dashboard/query` (with duplicate `/dashboard/rag`) | PARTIALLY IMPLEMENTED | AI Visibility / AEO / GEO | `/dashboard/aeo/playground` | Standalone Tool | **FREE:** 10 test queries/day, standard LLM fallback.<br>**PAID:** Unlimited queries, custom corpus loading, full source node tracer. | Playground marketing page featuring mock chat interfaces with CTAs. | **HIGH** | Consolidate duplicate `/dashboard/rag` route. |
| **SRV-005** | **Content Studio** | `/dashboard/content` | PRODUCTION IMPLEMENTED | Content Intelligence | `/dashboard/content/studio` | Standalone Tool | **FREE:** Basic Persian text editor, standard terms checker.<br>**PAID:** Firecrawl competitor URL outline generator, AI-suggested content expansion. | B2B marketing copy outlining the "AI Content Lifecycle". | **MEDIUM** | Firecrawl API key configuration. |
| **SRV-006** | **Competitive Analysis** | `/dashboard/competitive` (with duplicate `/dashboard/competitors`) | PRODUCTION IMPLEMENTED | Competitive Intelligence | `/dashboard/competitors/radar` | Dashboard Widget & Standalone View | **FREE:** Compare 1 competitor, view basic radar overlap.<br>**PAID:** Unlimited competitors, deep JSONB history, automatic threat tracking. | Competitive Comparison static pricing table on home route. | **MEDIUM** | Consolidate duplicate `/dashboard/competitors` route. |
| **SRV-007** | **Knowledge Graph Explorer** | `/dashboard/graph` | PARTIALLY IMPLEMENTED | Knowledge & Entity Intelligence | `/dashboard/entities/graph` | Standalone Page | **FREE:** Read-only node graph of first 20 entities.<br>**PAID:** Full Graph schema export, interactive entity editing, manual node inject. | Visual interactive marketing animation illustrating "Enterprise Knowledge Graphing". | **MEDIUM** | Real-time RDF/KG database population sync. |
| **SRV-008** | **Technical SEO Optimization** | `/dashboard/optimization/technical` | PRODUCTION IMPLEMENTED | SEO Intelligence | `/dashboard/seo/technical` | Standalone Tool | **FREE:** Scan robots.txt and sitemap syntax.<br>**PAID:** Extracted JSON-LD verification, depth audits, custom schema generator. | Marketing sub-page highlighting technical health diagnostic tools. | **HIGH** | Backend crawler is fully functional; needs UI layout updates. |
| **SRV-009** | **Document Ingestion Portal** | `/dashboard/ingest` (with duplicate `/dashboard/ingestion`) | PRODUCTION IMPLEMENTED | Content Intelligence | `/dashboard/content/ingestion` | Module inside Content Studio | **FREE:** Max file size 1MB, 3 docs total storage.<br>**PAID:** Unlimited documents, bulk drag-and-drop, automated text chunking tuning. | Integrate explanation into Content Studio marketing pages. | **LOW** | Consolidate duplicate `/dashboard/ingestion` route. |
| **SRV-010** | **LLM Analytics Dashboard** | `/dashboard/analytics/llm` | PRODUCTION IMPLEMENTED | Analytics & Reporting | `/dashboard/analytics/llm-bias` | Dashboard Widget & Module | **FREE:** Standard model distribution charts.<br>**PAID:** Sentiment trend analysis, multi-model bias matrices, token price calculator. | Highlighted in Pricing tier tables as "Advanced Bias Monitoring". | **LOW** | Underlying sentiment extraction services must be configured. |

---

## 4. FREE / PAID UX MODEL (THE PREMIUM GATEWAY)

To ensure high conversions without frustrating active users, Seorchable adopts a **non-intrusive progressive disclosure model**. There are no disruptive alert modal blocks. Instead, locked capabilities are woven directly into the dashboard layout.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPETITIVE RADAR PANEL                         │
├────────────────────────────────────────────────────────────────────────┤
│  Your Score: 82% (Optimized)  │  Industry Average: 68%                 │
│                                                                        │
│  [──────────────────── LOCKED DATA VIEW ────────────────────]          │
│  ┌────────────────────────────────────────────────────────┐            │
│  │                                                        │            │
│  │             🔒 UNLOCK MULTI-COMPETITOR COMPARISON       │            │
│  │  Gain absolute competitive clarity. Compare your brand  │            │
│  │  directly with up to 5 industry competitors simultaneously.│         │
│  │                                                        │            │
│  │                  [ UPGRADE TO PROFESSIONAL ]           │            │
│  └────────────────────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 UI Design Paradigms for Gating

#### 4.1.1 Glassmorphic Locking Overlay
- **Visual Presentation:** Premium charts, lists, and advanced tables render their respective containers normally with sample/blurred data, covered by a CSS class:
  ```css
  .premium-blur-overlay {
    backdrop-filter: blur(8px);
    background: rgba(var(--background-rgb), 0.35);
  }
  ```
- **Call-to-Action:** A centered, highly readable card containing:
  - An illustrative icon (Lucide `Sparkles` or `Lock` inside a gradient circle).
  - Clear, persuasive copy explaining the exact business benefit of unlocking the feature (e.g., *"Unlock real-time Google Gemini search tracking to monitor brand citation indexes daily."*).
  - A prominent gradient action button pointing to `/dashboard/billing` (e.g., `ارتقا به پنل حرفه‌ای` / "Upgrade to Professional").

#### 4.1.2 Unified Billing Hub (`/dashboard/billing`)
- A central dashboard panel displaying the three SaaS plans:
  1. **Free Plan (رایگان):** $0/mo. Limited queries, basic single-site crawlers, and read-only graphs.
  2. **Professional Plan (حرفه‌ای):** Self-service core paid workspace. Full SEO & AI audit tools, competitor tracking, and RAG playgrounds.
  3. **Enterprise Plan (سازمانی):** High-volume crawling, customized entity graphs, and dedicated LLM analytics dashboard tracking bias parameters.
- Users can simulate triggering onboarding flows directly in the interface without real Stripe credit-card configurations.

#### 4.1.3 Contextual Inline Upgrades
- Small badge labels (`PREMIUM` or `حرفه‌ای`) render on sidebar navigation items that require a paid tier.
- A user on the Free tier can click the sidebar item; instead of rendering an error page, the dashboard loads a high-fidelity landing screen detailing the tool’s power, showing interactive previews, and offering an instant upgrade form.

---

## 5. PUBLIC-PAGE ↔ DASHBOARD RELATIONSHIP

The product separates the public layer from the workspace to maintain search-engine marketing indexability while keeping the operational dashboard secure.

```
   UNAUTHENTICATED LANDING                 SECURE DASHBOARD WORKSPACE
 ┌─────────────────────────┐             ┌─────────────────────────────┐
 │  Landing Home (/[id])   │             │  Overview (/dashboard)      │
 │  • Markets SEO + GEO    ├─► Register  │  • Unified active widget map│
 ├─────────────────────────┤   / Login   ├─────────────────────────────┤
 │  Solutions (/solutions) ├────────────►│  AI Audits (/aeo/audits)    │
 ├─────────────────────────┤             ├─────────────────────────────┤
 │  Pricing (/pricing)     │             │  Billing Hub (/billing)     │
 └─────────────────────────┘             └─────────────────────────────┘
```

### 5.1 Public Transition Strategy
1. **The Root Homepage (`/[locale]/page.tsx`):**
   - Retains its interactive mock dashboard previews.
   - Provides clear explanatory sections contrasting traditional SEO with GEO (the Farsi B2B comparison matrix).
   - Serves as the primary registration acquisition node.
2. **Product Pages (/solutions, /pricing):**
   - Detail the business mechanics of Seorchable.
   - Do not contain active form fields or functional editors. Instead, they lead users to the authentication boundary (`/[locale]/register` or `/[locale]/login`).
3. **Seamless Redirects:**
   - Authenticated sessions hitting the homepage are automatically redirected to `/dashboard` to safeguard workspace continuity.
   - Unauthenticated visits to any `/dashboard/*` sub-route are safely intercepted by the `<ProtectedRoute>` component and redirected to `/[locale]/login`.

---

## 6. MIGRATION PHASES

We propose a structured, five-phase logical migration to execute this product transition seamlessly.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     PHASE 1     │     │     PHASE 2     │     │     PHASE 3     │     │     PHASE 4     │     │     PHASE 5     │
│  IA Blueprint   │ ──► │  Route Harmon.  │ ──► │  Sidebar Shell  │ ──► │ Premium Gating  │ ──► │ Validation Sync │
│   (Current)     │     │ (Merge Redund.) │     │  (Nav Consol.)  │     │ (Blur Overlays) │     │  (Full Audit)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Phase 1: Planning and IA Blueprint (Current State)
*Establish the detailed taxonomy, navigation maps, and current-service inventory. Review files are created with zero code changes.*

### Phase 2: Route Harmonization & Consolidation
*Execute the physical consolidation of redundant paths. Standardize endpoint naming and directory layouts:*
- Redirect `/dashboard/rag` strictly to `/dashboard/aeo/playground` (keeping `/dashboard/query` as an legacy router if necessary).
- Merge `/dashboard/ingestion` and `/dashboard/ingest` under `/dashboard/content/ingestion`.
- Merge `/dashboard/competitors` under `/dashboard/competitors/radar`.

### Phase 3: Sidebar Shell & Navigation Consolidation
*Update the global navigation architecture. Re-align the `AppSidebar` and `FloatingSidebar` components to use the new canonical routes:*
- Re-group links into clear taxonomy buckets: SEO, AI Visibility, Content, Competitive, Analytics, Workspace Settings.
- Implement desktop responsive sliding layouts and keep bottom floating quick-access pills focused on dashboard shortcuts.

### Phase 4: Free/Paid UI Gating Implementation
*Introduce high-fidelity UI gating parameters across all widgets. Apply glassmorphic blur CSS components to paid-tier views:*
- Inject mock entitlement properties into client-side stores or localized session states.
- Embed contextual "Upgrade" CTA cards that link smoothly to `/dashboard/billing`.

### Phase 5: Verification and Final Documentation Sync
*Run comprehensive end-to-end user flows verifying mobile responsiveness, theme contrast ratios, and localization mappings:*
- Run Playwright test suites to ensure zero layout regressions.
- Update technical documentation objects inside `src/lib/docsData.ts` to reflect consolidated paths.

---

## 7. EXPLICITLY OUT OF SCOPE

To maintain strict project boundaries and optimize architectural throughput, the following initiatives are **explicitly out of scope** during this dashboard product transition:

1. **Stripe/Payment Gateway Coding:** No actual credit card gateways or webhooks will be coded or integrated.
2. **Database Engine Refactoring:** The raw SQL driver model (`pg`) will not be rewritten to Drizzle, and the tenant isolated schema models will not be modified.
3. **Security Boundary Overhaul:** Real token-based OAuth / stateless cookie provider models will not replace the mock `localStorage` session authentication during this phase.
4. **Scraping Infrastructure Rebuilding:** No changes to Firecrawl's Node SDK execution limits, scheduling, or HTML extraction loops.
5. **UI Redesign Re-theming:** The existing tailwind configuration and core visual primitives (glassmorphic gradient frames, colors) will remain intact.
