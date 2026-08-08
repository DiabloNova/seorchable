# TASK 0.3 — AUDIT VERIFICATION & EVIDENCE VALIDATION

---

## 1. EXECUTIVE SUMMARY

This verification audit conducts a rigorous, evidence-based review of the architectural claims, service classifications, and technical implementations present within the `seorchable` repository as of August 2026. This investigation operates strictly on read-only static analysis and direct local verification execution to establish the technical truth.

### Key Conclusions:
- **Authentication Bypass Vulnerability:** While database operations are technically guarded by PostgreSQL Row-Level Security (RLS) policies, client-side route access depends strictly on mock `localStorage` values (`auth_session_user`). This allows any malicious client to inspect dashboard routes by spoofing `localStorage`, though cross-tenant queries will fail database transaction parsing.
- **Drizzle ORM Deception:** Database files under `database/schema/` are designed with highly precise types mimicking ORM patterns, but **Drizzle ORM and Drizzle Kit are completely uninstalled and missing** from the application manifest (`package.json`). All persistent operations execute using raw SQL strings parsed via the native PostgreSQL `pg` driver client pool.
- **Service Catalog Maturity:** Five out of ten cataloged services are fully operational, utilizing actual LLM completions or web scraping. However, multiple redundant paths (duplicates/wrappers) exist for key operations like RAG and Ingestion, which act as simple re-export file routers.

---

## 2. VERIFICATION METHODOLOGY

Claims were verified against the codebase using the following analytical operations:
- **Static Code Path Tracing:** Manually tracing route-to-handler connections, middleware imports, and transactional boundaries.
- **Grep Inspection:** Searching for specific class constructs, library packages, and database pool methods (e.g. `pg.Pool`, `localStorage`, `TenantContextManager`).
- **Local Test Execution:** Running automated unit tests via the direct TypeScript compiler environment (`pnpm exec tsx`) to confirm mathematical outputs and security interceptors.

---

## 3. AUTHENTICATION & AUTHORIZATION VERIFICATION

### 3.1 Verified Authentication Flow Trace
```
  [Login/Register Page] ──► Stores 'auth_session_user' in localStorage
         │
         ▼
  [AuthProvider Component] (Syncs session data client-side)
         │
         ├──► Executes 'loginAction' (Server Action in src/app/actions/auth.ts)
         │           │
         │           ▼
         │       Sets standard 'tenant_id' and 'user_id' httpOnly Cookies
         │
         ▼
  [ProtectedRoute Component] (Client-side routing guard)
         │
         ├──► Allows navigation or redirects to home page / '/'
         │
         ▼
  [API / Action Route] (Reads 'x-tenant-id' or httpOnly cookies)
         │
         ▼
  [TenantContextManager] ──► Binds tenant_id using AsyncLocalStorage
         │
         ▼
  [PostgresClient SQL] ──► Triggers 'SET LOCAL app.current_tenant_id = <tenant_id>'
         │
         ▼
  [PostgreSQL Engine] ──► Evaluates RLS policies checking current_setting
```

### 3.2 Key Verification Observations
- **Client-Side Storage Dependency:** The primary session state is tracked via `localStorage.getItem("auth_session_user")` inside `src/components/AuthProvider.tsx`. No server-side stateful session checks or JWT verifications exist.
- **Trust in Header Parameters:** In several crucial API routes, the tenant ID is extracted from client-supplied HTTP headers (e.g. `req.headers.get("x-tenant-id")` or `req.headers.get("x-user-id")`) or standard mock parameters (located in `src/app/api/v1/rag/query/route.ts`).
- **Tampering Risk:** Since there is no server-side cryptographic signature (such as a verified JWT or cookie session lookup) matching `user_id` to `tenant_id`, a malicious authenticated user can manually inject or modify the `x-tenant-id` header to lease cross-tenant database contexts if RLS does not fail during query evaluation.

---

## 4. POSTGRES RLS VERIFICATION

The PostgreSQL database relies on native Row-Level Security (RLS) to enforce partition isolation.

### RLS Status Matrix:
| Table Name | RLS Enabled | Policy Exists | Tenant Variable Checked | Policy Verified | Evidence Path |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **organizations** | `[NOT FOUND]` | NO | None | NO | `database/schema/organization.ts` |
| **brands** | `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/brand.ts` (sql property) |
| **entities** | `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/entity.ts` (sql property) |
| **prompts** | `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/prompt.ts` (sql property) |
| **ai_observations**| `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/observation.ts` (sql property) |
| **citations** | `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/citation.ts` (sql property) |
| **visibility_scores**| `[VERIFIED]`| YES | `app.current_tenant_id` | YES | `database/schema/visibility.ts` (sql property) |
| **recommendations**| `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/recommendation.ts` (sql property) |
| **premium_audits** | `[VERIFIED]` | YES | `app.current_tenant_id` | YES | `database/schema/premium-audit.ts` (sql property) |

### Context Lease Mechanics:
The RLS security boundary is enforced strictly by executing:
```sql
CREATE POLICY select_tenant_isolation_policy ON <table_name>
  FOR SELECT
  USING (organization_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
```
And set dynamically in Node.js via `TenantContextManager` during `runWithTenantContext`:
```typescript
await leasedClient.query(`SET LOCAL app.current_tenant_id = $1`, [tenantId]);
```
This serves as the final system boundary. However, if a developer invokes the fallback `pg` instance directly without using `TenantContextManager`, the `app.current_tenant_id` variable is unset, causing RLS to fail open or restrict all reads depending on database configurations.

---

## 5. BILLING & ENTITLEMENT VERIFICATION

The previous audit's claim was subjected to rigorous validation:
> **Original Claim:** "No active billing validation, gating, subscription, or licensing checks exist inside the application."

### Verified Findings:
- **Billing UI:** `[VERIFIED]` Present under `src/app/[locale]/dashboard/billing/page.tsx`, displaying interactive enterprise, pro, and free tier pricing options.
- **Data Model:** `[VERIFIED]` Schema columns for quotas exist inside the `organizations` configuration tables in `database/schema/organization.ts`.
- **Active Subscription Logic:** `[NOT FOUND]` There is no code checking active plans or subscriptions inside the billing flow. No integration with stripe, lemon squeezy, or checkout providers exists.
- **Server-Side Enforcement / Gating:** `[NOT FOUND]` The application endpoints (e.g. `/api/v1/audit/premium`) do not block access if the tenant's quota is exceeded or if their plan is "Free". All endpoints execute mock completions or scrape routines without checking organizational quotas.

---

## 6. DOCUMENTATION ARCHITECTURE VERIFICATION

Trace path for the Documentation Portal:
```
  [/[locale]/docs Route] ──► Loads docs index matching DOCS_TOPICS
         │
         ▼
  [src/lib/docsData.ts] (Authoritative in-memory dataset)
         │
         ▼
  [renderRichContent Parser] (Performs line-by-line Markdown heading parsing)
         │
         ▼
  [Next.js Client Layout] (Renders final visual HTML output)
```

### Verified Facts:
- **Markdown File Usage:** `[NOT FOUND]` No actual `.md` or `.en.md` files are loaded or parsed at runtime in `main`.
- **fs / path imports:** `[NOT FOUND]` No Node.js filesystem modules are imported inside `src/app/[locale]/docs/`.
- **Static hardcoding:** `[VERIFIED]` The content, titles, and localized Persian texts are hardcoded inside the static array `DOCS_TOPICS` in `src/lib/docsData.ts`. Documents cannot be updated dynamically without committing and building code changes.

---

## 7. DRIZZLE ORM VS NATIVE PG DRIVER VERIFICATION

We executed a comprehensive text match search for Drizzle references.

### Results:
- **package.json:** `[NOT FOUND]` Neither `drizzle-orm` nor `drizzle-kit` is listed in dependencies.
- **pnpm-lock.yaml:** `[NOT FOUND]` No drizzle compiler files are locked.
- **SQL Execution Paths:** `[VERIFIED]` Database connections are managed via raw `pg` Pool instances inside `src/features/admin/infrastructure/persistence/postgres/index.ts`. All queries use literal SQL template strings.
- **Conclusion:** Drizzle ORM is **completely absent** from the active runtime environment. Its references are present only within documentation guides and metadata specs.

---

## 8. 10-SERVICE VERIFICATION MATRIX

| Service ID | Route | Backend Handler | DB Dependency | AI Dependency | Firecrawl | Auth Level | Isolation | Mock/Fallback | Implementation Classification |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **SRV-001** | `/dashboard/audits` | `/api/v1/audit/engine` | YES | NO | NO | Admin | YES | Simulated DB store fallback | **PRODUCTION-LIKE** |
| **SRV-002** | `/dashboard/audits/[id]` | `executeAudit` (Direct) | YES | NO | NO | Admin | YES | Mock scorecard if DB fails | **PRODUCTION-LIKE** |
| **SRV-003** | `/dashboard/brand-monitoring` | `MockAiAuditService` | YES | NO | NO | Viewer | YES | Client-side delays mock | **MOCK / SIMULATION** |
| **SRV-004** | `/dashboard/query` | `/api/v1/rag/query` | YES | YES | NO | Viewer | YES | Hardcoded Persian answers fallback | **PARTIALLY IMPLEMENTED** |
| **SRV-005** | `/dashboard/content` | `/api/v1/content/studio` | NO | YES | YES | Admin | YES | Default Persian edits fallback | **PRODUCTION-LIKE** |
| **SRV-006** | `/dashboard/competitive` | `/api/v1/analysis/competitive`| YES | YES | YES | Admin | YES | Local mockup JSONB parsing | **PRODUCTION-LIKE** |
| **SRV-007** | `/dashboard/graph` | `/api/v1/knowledge-graph/query`| YES | NO | NO | Viewer | YES | Static node coordinate arrays | **PARTIALLY IMPLEMENTED** |
| **SRV-008** | `/dashboard/optimization/technical`| `/api/v1/optimization/technical`| YES | NO | YES | Admin | YES | Simulated cheerio selectors | **PRODUCTION-LIKE** |
| **SRV-009** | `/dashboard/ingest` | `ingestDocumentAction` | YES | YES | NO | Admin | YES | Standard sentiment structures | **PRODUCTION-LIKE** |
| **SRV-010** | `/dashboard/analytics/llm` | `/api/v1/analytics/llm` | YES | YES | NO | Viewer | YES | Predefined emotion matrix | **PRODUCTION-LIKE** |

---

## 9. DUPLICATE ROUTE VERIFICATION

The previous audit’s route redundancy claims were physically checked.

### Findings:
1. **RAG Dashboard:**
   - Directories: `src/app/[locale]/dashboard/query/` and `src/app/[locale]/dashboard/rag/` both exist.
   - `rag/page.tsx` contains `import RAGQueryPage from "../query/page"; export default RAGQueryPage;`.
   - **Status:** `[VERIFIED]` Direct file-level re-export duplication.
2. **Ingestion Portal:**
   - Directories: `src/app/[locale]/dashboard/ingest/` and `src/app/[locale]/dashboard/ingestion/` both exist.
   - `ingest/page.tsx` contains `import DocumentIngestionPage from "../ingestion/page"; export default DocumentIngestionPage;`.
   - **Status:** `[VERIFIED]` Direct file-level re-export duplication.
3. **Competitive Radar:**
   - Directories: `src/app/[locale]/dashboard/competitive/` and `src/app/[locale]/dashboard/competitors/` both exist.
   - `competitors/page.tsx` contains `import CompetitiveAnalysisPage from "../competitive/page"; export default CompetitiveAnalysisPage;`.
   - **Status:** `[VERIFIED]` Direct file-level re-export duplication.

---

## 10. FIRECRAWL USAGE VERIFICATION

Firecrawl is integrated via `@mendable/firecrawl-js`.

### Mapping:
- **Direct Usage:** `src/lib/firecrawl.ts` creates the static client.
- **Service Invocations:**
  - **Competitive Analysis (`/api/v1/analysis/competitive`):** Runs `firecrawlApp.scrapeUrl` if a live API key is configured.
  - **Content Studio (`/api/v1/content/studio`):** Runs `firecrawlApp.scrapeUrl` if a live API key is configured.
  - **Technical SEO (`/api/v1/optimization/technical`):** Runs `firecrawlApp.scrapeUrl` to retrieve markdown body structure.
- **Mock-Only Fallback:** If `FIRECRAWL_API_KEY` is not present, all three endpoints cleanly fallback to localized mock webpage string schemas.

---

## 11. LLM USAGE VERIFICATION

Trace path for the LLM abstraction:
```
  [User Action] ──► [API Route] ──► Calls getLLMClient()
                                            │
                                            ├──► Has GOOGLE_AI_API_KEY ──► GeminiLLMClient (Active Gemini)
                                            │
                                            └──► No API Key / Test ──► MockLLMClient (Predefined completions)
```

### Verified Uses:
- **AEO RAG Query:** Leverages `MockLLMClient` fallback answers to output Persian summaries.
- **Content Studio:** Generates Persian terminologies via LLM.
- **Competitive Analysis:** Uses LLM completions to compare competitor products.
- **Document Ingestion:** Employs LLM-based sentiment scoring for parsed chunks.
- **LLM Analytics:** Directly traces sentiment and retrieval risk parameters.

---

## 12. DATABASE PERSISTENCE VERIFICATION

- **PostgreSQL Persistence:** `[VERIFIED]` Active on `premium_audits`, `brands`, and `organizations`. Operations execute via parameterized PostgreSQL queries.
- **In-Memory Fallback Persistence:** `[VERIFIED]` If pg connection leasing fails, `MockPoolClient` switches automatically to standard Map stores (e.g. `PostgresTenantRepository.store`), preventing route and test failures.

---

## 13. TEST VERIFICATION

Tests were analyzed and executed successfully inside the local compiler environment.

| Test Title | File Path | Command Used | Local Result | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **AI Orchestration** | `tests/services/ai/ai.test.ts` | `pnpm exec tsx tests/services/ai/ai.test.ts` | **PASSED** | Validates chunk limits & sentiment. |
| **Audit Engine** | `tests/services/audit-engine/engine.test.ts` | `pnpm exec tsx tests/services/audit-engine/engine.test.ts` | **PASSED** | Verifies SSRF & payload limits. |
| **Web Crawler** | `tests/services/crawler/web-crawler.test.ts` | `pnpm exec tsx tests/services/crawler/web-crawler.test.ts` | **PASSED** | Validates link discovery & RLS transaction depth. |

---

## 14. FALSE-POSITIVE ANALYSIS

The previous audit reports contained several overstated, ambiguous, or incorrect claims. Below is the verified correction.

| Original Claim | Identified Problem | Corrected Finding | Evidence Path |
| :--- | :--- | :--- | :--- |
| **Drizzle Schema Modeling** | Claims schemas are modeled, diffed, and executed using Drizzle Kit. | Drizzle ORM is completely absent. Schemas are defined in plain TS schemas containing raw SQL strings. | `package.json` |
| **File-Based Markdown CMS** | Claims documentation portal reads physical files under `content/docs/`. | No physical files are read. The system loads documents from an in-memory TS array. | `src/lib/docsData.ts` |
| **Real-Time Active Alert Citations** | Claims the stream tracks live citations in real-time. | The alerts stream is populated purely via hardcoded mock arrays with client-side render delays. | `src/services/auditService.ts` |

---

## 15. FINAL VERIFICATION SUMMARY

### 15.1 VERIFIED
- Next.js (v16), React (19), Tailwind CSS v4, and native `pg` PostgreSQL driver stack.
- Multi-tenant data partition utilizing PostgreSQL Row-Level Security (RLS) policies.
- Custom `TenantContextManager` wrapper powered by `AsyncLocalStorage`.
- Dual layout route re-exports (`/rag`, `/ingest`, `/competitors`).

### 15.2 PARTIALLY VERIFIED
- **RAG Chat & Knowledge Graph:** Real API endpoints exist and execute vector search queries, but heavily rely on pre-mapped mock fallback arrays during offline developer execution.

### 15.3 NOT VERIFIED
- **Production Integration with External Models:** Actual remote LLM completions or live Firecrawl crawls cannot be verified without providing verified production API keys in environment properties.

### 15.4 INCORRECT
- **Drizzle ORM Usage:** The claim that Drizzle ORM maps or generates database tables is contradicted by the complete absence of Drizzle packages inside the manifest.
- **Markdown CMS Parsing:** The claim that dynamic disk files under `content/docs/` power the portal is contradicted by the authoritative TS array inside `docsData.ts`.

---

## 16. CRITICAL RISKS

1. **Authentication Bypass Risk:** Clients can access dashboard layouts and visual components without cryptographic server-side validation, trusting un-signed cookie inputs.
2. **SQL Injection Vulnerability:** If custom SQL string concatenations are built inside feature endpoints instead of using parameterized bindings (e.g. `params: unknown[]`), there is high risk of database compromises.

---

## 17. OPEN QUESTIONS

1. **Production PostgreSQL Performance:** How well do the RLS tenant isolation policies execute on high concurrent connection pools under massive databases?
2. **Gemini Latency Limits:** What is the average API generation response time for Persian terminology completions under remote production environments?

---

## 18. EVIDENCE TRACEABILITY MATRIX

| Claim Finding | Status | Source File | Symbols / References Checked |
| :--- | :---: | :--- | :--- |
| **Drizzle Absence** | `[VERIFIED]` | `package.json` | Dependencies block (Absence of drizzle) |
| **Local LocalStorage Auth** | `[VERIFIED]` | `src/components/AuthProvider.tsx` | `localStorage.getItem("auth_session_user")` |
| **PostgreSQL Pool leasing** | `[VERIFIED]` | `src/features/admin/infrastructure/persistence/postgres/index.ts` | `new Pool({ connectionString ... })` |
| **Bilingual Docs Content** | `[VERIFIED]` | `src/lib/docsData.ts` | `DOCS_TOPICS` literal array |
| **RAG Duplicated Redirect**| `[VERIFIED]` | `src/app/[locale]/dashboard/rag/page.tsx` | `import RAGQueryPage from "../query/page";` |
| **SSRF Defenses** | `[VERIFIED]` | `src/lib/audit-engine/url-validator.ts` | `isSafeUrl` CIDR matching checks |
