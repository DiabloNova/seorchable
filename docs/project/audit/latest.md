Technical audit: seorchable

Blunt verdict: this is a polished prototype, not a production SaaS yet. The landing page renders, but release is blocked by dependency and schema drift, demo authentication, simulated audit results, missing job execution wiring, and tenant identity vulnerabilities.

I audited the public main branch and live deployment: https://github.com/DiabloNova/seorchable, https://github.com/DiabloNova/seorchable/commit/d8e0b8c1785cc22942b693600a6274fc66f46aaa, and live app.
Phase 1: Deep technical audit
Release blockers and architecture

1. Dependency manifest is out of syncSeverity: CriticalFiles: https://github.com/DiabloNova/seorchable/blob/main/package.json, https://github.com/DiabloNova/seorchable/blob/main/pnpm-lock.yaml

The lockfile includes drizzle-orm, drizzle-kit, inngest, @upstash/redis, @ai-sdk/openai, dompurify, gsap, and resend, while package.json does not declare them. Runtime code imports several of these packages. pnpm install --frozen-lockfile and likely production builds will fail or produce inconsistent installs.

Fix:
pnpm add drizzle-orm inngest @ai-sdk/openai @upstash/redis dompurify resend
pnpm add -D drizzle-kit
pnpm add pg
pnpm install --lockfile-only
pnpm install --frozen-lockfile


Remove packages that are not genuinely used. Keep pg in production dependencies, not only development dependencies.
---

2. Audit schema import is broken and there are two competing audit modelsSeverity: CriticalFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/actions/dashboard.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/actions/audit.ts, https://github.com/DiabloNova/seorchable/blob/main/src/services/dashboard-home/index.ts, https://github.com/DiabloNova/seorchable/tree/main/database/schema

dashboard.ts imports ../../../database/schema/audits, but no database/schema/audits.ts exists in the repository. Separately, triggerAuditAction() writes to an audits table while the dashboard service reads premium_audits. A user can run an audit that never appears in the dashboard.

Fix: choose one canonical audits model, export it from one barrel file, and use it everywhere.
// database/schema/audits.ts
export const audits = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  userId: text("user_id").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"),
  score: integer("score"),
  result: jsonb("result"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});


Then use audits for creation, dashboard summaries, detail pages, and background processing. Drop the duplicate premium_audits path after a controlled migration.
---

3. Inngest events are sent, but no worker route was foundSeverity: CriticalFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/actions/audit.ts, https://github.com/DiabloNova/seorchable/blob/main/src/lib/inngest/client.ts

The application calls inngest.send({ name: "audit.requested" }), but the inspected API tree contains no src/app/api/inngest/route.ts or registered Inngest function. The event has nowhere to execute, so audits can remain permanently pending.

Fix:
// src/app/api/inngest/route.ts
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processAudit } from "@/lib/inngest/functions/process-audit";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processAudit],
});

// src/lib/inngest/functions/process-audit.ts
export const processAudit = inngest.createFunction(
  {
    id: "process-audit",
    retries: 3,
    concurrency: { limit: 5 },
  },
  { event: "audit.requested" },
  async ({ event, step }) => {
    const { auditId, workspaceId, url } = event.data;

    await step.run("mark-running", () =>
      auditRepository.markRunning(auditId, workspaceId)
    );

    try {
      const result = await step.run("crawl-and-analyze", () =>
        auditEngine.run({ auditId, workspaceId, url })
      );

      await step.run("persist-result", () =>
        auditRepository.complete(auditId, workspaceId, result)
      );
    } catch (error) {
      await auditRepository.fail(auditId, workspaceId, error);
      throw error;
    }
  }
);

Frontend, hydration, UI, and UX

4. The public landing page is a 75 KB client componentSeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/page.tsx

The entire marketing page uses "use client" and eagerly imports Framer Motion, multiple graphs, the audit panel, hundreds of icons, and interactive dashboard previews. This unnecessarily ships application JavaScript to anonymous visitors and makes a 95+ Lighthouse score unlikely.

Fix: make the page a server component. Move only the tab selector, audit form, and graph interactions into client islands.
// src/app/[locale]/page.tsx
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import FeaturesSection from "@/components/marketing/FeaturesSection";

const FreeAuditPanel = dynamic(
  () => import("@/components/features/audit/FreeAuditPanel"),
  { loading: () => <AuditSkeleton /> }
);

const LiveKnowledgeGraph = dynamic(
  () => import("@/components/features/graph/LiveKnowledgeGraph"),
  { ssr: false, loading: () => <GraphSkeleton /> }
);

export default async function LandingPage({ params }) {
  const { locale } = await params;

  return (
    <>
      <Hero locale={locale} />
      <FreeAuditPanel />
      <FeaturesSection locale={locale} />
      <LiveKnowledgeGraph />
    </>
  );
}

---

5. The public audit is simulated, not connected to the backendSeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/components/features/audit/FreeAuditPanel.tsx, https://github.com/DiabloNova/seorchable/blob/main/src/services/auditService.ts

FreeAuditPanel calls MockAiAuditService.simulateCrawlingAndAnalysis(). It waits several seconds, generates a random score between 65 and 90, and returns fabricated Gemini, Firecrawl, and provider results. The real /api/v1/audit/free route is not used by the primary funnel.

Fix: call a server action or API route, return a job ID, and poll or stream the real job state. Never present random mock scores in production.
---

6. Dashboard protection is client-side onlySeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/dashboard/layout.tsx, https://github.com/DiabloNova/seorchable/blob/main/src/components/ProtectedRoute.tsx, https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/dashboard/page.tsx

The dashboard layout relies on a client component to redirect unauthenticated users. The server page still calls dashboardHomeService.getDashboardSummary() before the client redirect and catches the failure by rendering an empty dashboard. This wastes database work and creates an unsafe authorization boundary.

Fix:
// src/app/[locale]/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/services/auth/session";

export default async function DashboardPage({ params }) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const summary = await dashboardHomeService.getDashboardSummary(
    locale === "fa" ? "fa" : "en"
  );

  return <DashboardHomeClient initialData={summary} user={session.user} />;
}


Keep the client guard for UX, but never rely on it for security.
---

7. Redirects lose the locale and can produce 404sSeverity: MediumFile: https://github.com/DiabloNova/seorchable/blob/main/src/components/ProtectedRoute.tsx

The component redirects to / and /dashboard, but the actual routes are /{locale}/dashboard. /dashboard is not a valid route in this architecture.

Fix: pass locale into ProtectedRoute or derive it from the pathname and redirect to /${locale}/dashboard.
---

8. Registration collects a workspace name and discards itSeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/register/page.tsx

workspaceName is validated in the UI but never passed to register(). The server action always creates the user in ws-default.

Fix:
await register(name, email, password, workspaceName);


Then create the organization and membership transactionally on the server. Do not let the client choose workspaceId.
---

9. OAuth and password recovery are placeholdersSeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/login/page.tsx, https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/register/page.tsx

Google and Microsoft buttons only call alert(). The forgot-password control has no real recovery flow. Registration redirects to email verification even though no actual verification email is sent.

Fix: implement one real identity provider first, preferably Auth.js, Clerk, Supabase Auth, or a properly implemented database session system. Do not advertise SSO, MFA, or email verification until those flows work.
---

10. Local storage parsing can crash the dashboard shellSeverity: MediumFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/dashboard/layout.tsx

JSON.parse(localStorage.getItem("sidebar-collapsed")) is unguarded. Corrupt browser storage can crash the entire dashboard.

Fix:
try {
  const saved = localStorage.getItem("sidebar-collapsed");
  if (saved !== null) {
    setCollapsed(JSON.parse(saved) === true);
  }
} catch {
  localStorage.removeItem("sidebar-collapsed");
}

Backend, API, authentication, and data layer

11. Login and registration accept any credentialsSeverity: CriticalFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/actions/auth.ts

loginAction(email) ignores the password, creates a new random user every time, assigns workspace_admin, and always uses ws-default. Registration does not persist a user or hash a password. Anyone can obtain an authenticated session for any email address.

Fix: use a real users table, password hashing, unique email constraints, email verification, rate limiting, and generic credential errors.
const input = loginSchema.parse({ email, password });

const user = await userRepository.findByEmail(input.email);
if (!user || !await argon2.verify(user.passwordHash, input.password)) {
  throw new Error("Invalid credentials");
}

if (!user.emailVerifiedAt || user.status !== "active") {
  throw new Error("Account is not active");
}

await createDatabaseSession({
  userId: user.id,
  workspaceId: user.workspaceId,
});


Never generate identities with Math.random().
---

12. API tenant headers are spoofableSeverity: CriticalFiles: https://github.com/DiabloNova/seorchable/blob/main/src/services/auth/authorization.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/premium/route.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/aeo-insight/route.ts

authorizeApiRequest() falls back to client-supplied x-user-id and x-tenant-id. Premium and AEO routes directly trust those headers. An attacker can impersonate another user or workspace.

Fix: remove header fallback for browser requests. For external API clients, use signed API keys mapped server-side to a workspace.
export async function requireApiIdentity() {
  const session = await getSession();

  if (!session?.user) {
    throw new AuthorizationError(401, "Unauthorized");
  }

  return {
    userId: session.user.id,
    tenantId: session.user.workspaceId,
    role: session.user.role,
  };
}


All route queries must use the resolved tenantId, never a request header.
---

13. Premium audit has no subscription or role checkSeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/premium/route.ts

The route checks only whether x-tenant-id exists. It does not verify that the user belongs to the workspace, owns an active paid subscription, or has permission to run premium audits.

Fix:
const identity = await requireApiIdentity();
await requirePermission(identity, "audit:premium");
await subscriptionService.assertFeatureEnabled(
  identity.tenantId,
  "premium_audit"
);

---

14. Public and premium audit routes lack abuse protectionSeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/free/route.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/premium/route.ts

There is no visible rate limiting, idempotency key, request size limit, abuse detection, or per-workspace quota enforcement. Premium requests can trigger Firecrawl and LLM costs synchronously.

Fix: add Redis rate limits, workspace quotas, an idempotency key, and asynchronous processing.
const key = `audit:${identity.tenantId}:${request.headers.get("x-idempotency-key")}`;
const existing = await redis.get(key);

if (existing) {
  return NextResponse.json(existing, { status: 200 });
}

await rateLimiter.consume(`audit:${identity.tenantId}`, 1);

---

15. URL validation is not enough to prevent SSRFSeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/free/route.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/premium/route.ts

z.string().url() verifies syntax, not safety. The free and premium endpoints do not visibly reuse the repository’s stronger SSRF guard. Private IPs, localhost, cloud metadata endpoints, DNS rebinding, and dangerous redirects must be blocked.

Fix: reuse https://github.com/DiabloNova/seorchable/blob/main/src/features/acquisition/infrastructure/security/ssrf-guard.ts for every crawl entry point, including Firecrawl-backed routes. Enforce HTTP and HTTPS only, resolve DNS before connecting, reject private ranges, and validate every redirect target.
---

16. Premium crawling and LLM analysis run inside the HTTP requestSeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/premium/route.ts

The route crawls pages, constructs a large prompt, calls an LLM, calculates metrics, and writes to PostgreSQL before responding. This is fragile on Vercel/serverless runtimes and creates timeout and cost risks.

Fix: return 202 Accepted immediately after creating an audit job. Process crawl, extraction, analysis, and persistence in Inngest. The frontend should poll /api/v1/audit/{id} or subscribe to a realtime channel.
---

17. Database errors are swallowed and converted into false successSeverity: CriticalFile: https://github.com/DiabloNova/seorchable/blob/main/src/features/admin/infrastructure/persistence/postgres/index.ts

PostgresClient.query() catches database failures and returns an empty result. The adapter also falls back to an in-memory store and mock clients. Production can report successful operations while no data was written.

Fix: remove silent fallbacks from production code. Only use mocks through explicit test dependency injection.
async query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<QueryResult<T>> {
  return this.pool.query<T>(text, values);
}


Return a controlled 503 when the database is unavailable. Do not fabricate empty rows.
---

18. Transaction state is global and unsafe under concurrencySeverity: CriticalFile: https://github.com/DiabloNova/seorchable/blob/main/src/features/admin/infrastructure/persistence/postgres/index.ts

PostgresClient stores inTransaction and currentTransactionOperations on a singleton. Concurrent requests can interleave operations, commit the wrong work, or roll back another request’s operations.

Fix: transaction state must belong to a leased PoolClient, not a singleton.
export async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

---

19. Dashboard statistics load every audit into memorySeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/actions/dashboard.ts

The action selects all audit columns and all rows, then filters and averages in JavaScript. This will degrade sharply with customer growth.

Fix: aggregate in PostgreSQL and select only required columns.
const [stats] = await db.execute(sql`
  SELECT
    COUNT(*)::int AS total_audits,
    COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_audits,
    ROUND(AVG((result->>'overallHealthScore')::numeric))::int AS seo_health,
    ROUND(AVG((result->>'technicalHealthScore')::numeric))::int AS technical_health,
    ROUND(AVG((result->>'contentHealthScore')::numeric))::int AS content_health
  FROM audits
  WHERE organization_id = ${tenantId}
`);


Add indexes on (organization_id, created_at DESC) and (organization_id, status).
---

20. RLS and application-level tenant filtering are inconsistentSeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/database/schema/index.ts, https://github.com/DiabloNova/seorchable/blob/main/src/core/database/tenant-context/index.ts, https://github.com/DiabloNova/seorchable/blob/main/src/app/api/v1/audit/aeo-insight/route.ts

Some queries rely on PostgreSQL RLS, others rely on explicit organization predicates, and some raw SQL queries such as SELECT COUNT(*) FROM kg_entities contain no tenant filter. This is safe only if RLS is always enabled and the connection role cannot bypass it.

Fix: use both protections:
ALTER TABLE kg_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE kg_entities FORCE ROW LEVEL SECURITY;

CREATE POLICY kg_entities_tenant_policy
ON kg_entities
USING (
  organization_id =
  NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
)
WITH CHECK (
  organization_id =
  NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
);


Also include organization_id = $1 in every application query.
Performance, Core Web Vitals, and assets

21. Asset payload is heavySeverity: HighFiles: https://github.com/DiabloNova/seorchable/blob/main/src/config/fonts.ts, https://github.com/DiabloNova/seorchable/tree/main/public

The repository ships multiple full TTF font files around 200 KB each and a logo-horse.png over 1 MB. Several weights reuse the same physical file, and all font families are initialized globally.

Fix: convert fonts to subsetted WOFF2, load only required weights, use font-display: swap, and optimize the logo to SVG or AVIF. Preload only the primary body font.
---

22. Global client providers are mounted on every public routeSeverity: MediumFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/layout.tsx

AuthProvider, ThemeProvider, navigation controls, and floating sidebar infrastructure are mounted across marketing, login, blog, and contact pages. The auth provider immediately calls a server action on every public page.

Fix: keep theme and locale concerns in the root layout, but move dashboard navigation and authentication synchronization into the dashboard route group.
---

23. Animation and graph work is not isolated from the first paintSeverity: MediumFiles include https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/page.tsx, https://github.com/DiabloNova/seorchable/tree/main/src/components/features/graph, and https://github.com/DiabloNova/seorchable/tree/main/src/components/visualization.

Framer Motion, Recharts, and @xyflow/react are expensive for a marketing page. The live graph should not be part of the critical rendering path.

Fix: lazy load below-the-fold graphs, use static SVG previews for anonymous visitors, and reserve fixed dimensions to prevent CLS.
---

24. Dashboard refresh architecture is inconsistentSeverity: MediumFile: https://github.com/DiabloNova/seorchable/blob/main/src/components/features/dashboard-home/DashboardHomeClient.tsx

The dashboard mixes server actions with a fetch to /api/v1/dashboard/summary and manually sends spoofable identity headers. The route authorizes one identity while dashboardHomeService independently reads the cookie session.

Fix: use one boundary. Prefer server actions or a typed client query that always derives tenant identity from the server session.
SEO and accessibility

25. Metadata is static and not properly localizedSeverity: HighFile: https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/layout.tsx

Metadata uses a Persian default title and one global canonical URL for both fa and en. There are no locale alternates, Twitter cards, route-specific titles, or canonical URLs for public pages.

Fix:
// src/app/[locale]/layout.tsx
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isFa = locale === "fa";

  return {
    title: isFa
      ? "سئورچبل، پایش دیده‌شدن برند در موتورهای هوش مصنوعی"
      : "Seorchable, AI Brand Visibility Intelligence",
    description: isFa
      ? "پایش و بهینه‌سازی حضور برند در ChatGPT، Gemini، Claude و Perplexity."
      : "Measure and improve your brand visibility across generative search engines.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        fa: `${siteConfig.url}/fa`,
        en: `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      images: [{ url: `${siteConfig.url}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}


The configured og.png is not present in the inspected public tree, so the OpenGraph image URL is currently broken.
---

26. Robots, sitemap, JSON-LD, and route SEO files are missingSeverity: HighFiles: https://github.com/DiabloNova/seorchable/tree/main/src/app, https://github.com/DiabloNova/seorchable/blob/main/src/config/site.ts

No robots.ts or sitemap.ts was found in the app tree. There is also no visible Organization, SoftwareApplication, WebSite, FAQPage, or BreadcrumbList JSON-LD.

Fix:
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://seorchable.ir/sitemap.xml",
    host: "https://seorchable.ir",
  };
}

// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seorchable.ir";

  return ["/fa", "/en", "/fa/about", "/en/about", "/fa/pricing", "/en/pricing"]
    .map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/fa" || path === "/en" ? 1 : 0.6,
    }));
}


Do not include dashboard, billing, or user-specific audit URLs.
---

27. Locale validation is missingSeverity: MediumFile: https://github.com/DiabloNova/seorchable/tree/main/src/app/%5Blocale%5D

Any locale other than fa is effectively treated as English. /xx, /test, and arbitrary paths can render duplicated English content.

Fix: validate against ["fa", "en"] in middleware or layout and call notFound() for invalid locales.
---

28. Accessibility needs a dedicated passSeverity: MediumFiles include https://github.com/DiabloNova/seorchable/blob/main/src/components/features/audit/FreeAuditPanel.tsx and https://github.com/DiabloNova/seorchable/blob/main/src/app/%5Blocale%5D/dashboard/layout.tsx.

The audit telemetry stream should use aria-live, the help drawer should have role="dialog" and focus management, and animated graph panels need keyboard-accessible alternatives. Reduced motion CSS exists, which is good, but it should be tested against all Framer Motion components.
Phase 2: Executive implementation roadmap
Milestone 1: Stabilization and critical fixes

Target: 3 to 5 working days
1. Align package.json and pnpm-lock.yaml.
2. Add missing Drizzle and Inngest dependencies.
3. Create one canonical audit schema and migration.
4. Remove fake database fallbacks from production code.
5. Replace singleton transaction state with per-request PoolClient transactions.
6. Add strict production environment validation, especially DATABASE_URL and SESSION_SECRET.
7. Remove all client-controlled tenant header fallbacks.
8. Add SSRF validation to every URL ingestion route.
9. Add the Inngest serve route and audit worker.
10. Add CI checks for:
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build


Exit criteria: clean install, clean build, migration from an empty PostgreSQL database, no fake audit results, and no unauthenticated dashboard render.
Milestone 2: Core business logic and user flow

Target: 1 to 2 weeks
1. Implement users, organizations, memberships, sessions, email_verification_tokens, and password_reset_tokens.
2. Hash passwords with Argon2id or use a managed identity provider.
3. Create the workspace during registration from the submitted workspace name.
4. Add email verification before dashboard access.
5. Add real login, logout, password recovery, and session revocation.
6. Implement workspace-level roles and permission checks server-side.
7. Convert audit creation into:
create job -> enqueue event -> crawl -> analyze -> persist -> notify.
8. Add idempotency and retry handling.
9. Replace mock audit data with persisted results.
10. Implement dashboard list, detail, loading, empty, failed, and retry states.
11. Finish or hide stub routes such as competitors, graph, ingest, and RAG pages.

Exit criteria: a new user can register, verify email, create a workspace, run an audit, refresh the page, and see the same persisted result from a second device.
Milestone 3: Speed optimization and SEO hardening

Target: 5 to 7 working days
1. Convert the landing page to server-rendered sections with small client islands.
2. Lazy load graphs, charts, audit UI, and heavy visualization packages.
3. Subset fonts into WOFF2 and optimize all raster assets.
4. Add fixed dimensions and skeletons for graphs, cards, and audit states.
5. Cache immutable public content with ISR or CDN headers.
6. Cache dashboard summaries with short Redis TTLs and invalidate on audit completion.
7. Add generateMetadata, canonical URLs, locale alternates, robots.ts, sitemap.ts, JSON-LD, and OpenGraph assets.
8. Add semantic headings, landmark regions, dialog focus management, keyboard navigation, and aria-live status updates.
9. Add Lighthouse CI budgets:
{
  "categories:performance": ["error", { "minScore": 0.95 }],
  "categories:accessibility": ["error", { "minScore": 0.95 }],
  "categories:seo": ["error", { "minScore": 0.95 }],
  "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
  "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
}


A sub-second page load and 95+ Lighthouse score cannot be honestly guaranteed globally. They can be enforced as budgets for the public landing page on a defined mobile test profile. LLM crawls and dashboard jobs should be measured separately.
Milestone 4: Deployment and production readiness

Target: 5 to 7 working days
1. Deploy the Next.js web app separately from the background worker.
2. Use managed PostgreSQL with connection pooling.
3. Store secrets only in the deployment secret manager.
4. Add Sentry for frontend, server actions, route handlers, and workers.
5. Add structured logs with request ID, workspace ID, audit ID, and job status.
6. Add uptime checks for:
/fa, /en, /api/v1/audit/free, /api/inngest.
7. Add GitHub Actions for lint, typecheck, build, migration validation, and Lighthouse CI.
8. Add staged deployments with preview, staging, and production environments.
9. Add database backups, migration rollback procedures, and retention policies.
10. Add usage metering for Firecrawl pages, LLM tokens, crawl duration, and workspace quotas.
11. Add load tests for concurrent audit creation and dashboard reads.
12. Run a security review covering SSRF, IDOR, CSRF, session fixation, rate limits, RLS bypass, and secret exposure.
Recommended production architecture

Use this shape:
Next.js server-rendered public pages
        |
Typed route handlers and server actions
        |
Auth session + workspace permission middleware
        |
PostgreSQL + Drizzle + mandatory RLS
        |
Inngest audit workers
        |
Firecrawl, LLM providers, embeddings
        |
Redis rate limits, cache, idempotency
        |
Sentry, structured logs, analytics


The biggest mistake would be polishing more dashboard screens before fixing identity, persistence, and job execution. Get those three foundations correct first, then optimize the visuals.
