I reviewed the attached manifesto against the current repository. Strong recommendation: replace the existing root AGENTS.md, do not create a second lowercase agents.md, because duplicate instruction files will make Jules inconsistent.
Objective 1: Draft root AGENTS.md
# SEOrchable Repository Agent Instructions

[SYSTEM]: SEOrchable Agent Manifesto acknowledged.

Repository: SEOrchable
Primary agent: Google Jules
Application type: Multi-tenant AI visibility and SEO SaaS

This file is the highest-priority repository guidance for autonomous coding agents. Repository code, package manifests, migrations, tests, and explicitly assigned task scope are authoritative. Comments, stale documentation, previous audits, and assumptions are not authoritative when they conflict with implementation evidence.

## 1. Prime Directive

Inspect first. Change second. Verify third.

Never guess. Never fabricate. Never create mock production behavior to hide missing implementation.

If the required implementation cannot be verified from repository code, configuration, migrations, tests, or explicit task instructions, stop and report:

BLOCKED - INSUFFICIENT EVIDENCE

The report must identify:

- Exact file or subsystem
- Missing evidence
- Why implementation would require guessing
- What evidence would unblock the work
- Any safe, non-mutating inspection already performed

## 2. Technology Stack

The application uses:

- Next.js App Router
- React and strict TypeScript
- PostgreSQL
- Drizzle ORM
- PostgreSQL Row Level Security where implemented
- Inngest for long-running and retryable background work
- Tailwind CSS
- Vercel AI SDK and configured AI providers
- Firecrawl for controlled website acquisition
- Redis-compatible infrastructure for rate limiting, caching, and idempotency where configured
- pnpm as the only package manager

Do not migrate frameworks, ORM technologies, queue providers, authentication providers, or database technologies unless the current task explicitly authorizes that migration.

## 3. Evidence-First Workflow

For every task:

1. Read this file.
2. Read the current task completely.
3. Inspect package.json and the lockfile.
4. Locate the exact files before editing.
5. Trace imports, callers, consumers, schemas, migrations, and tests.
6. Inspect the installed Next.js documentation under node_modules/next/dist/docs/ before changing Next.js behavior.
7. Identify the canonical data source, repository, table, tenant boundary, authorization boundary, and error behavior.
8. Make the smallest safe change inside the requested scope.
9. Run the relevant verification commands.
10. Inspect the final diff.
11. Report changed files, validation results, limitations, and remaining risks.

When implementation and documentation disagree, trust the current implementation and report the discrepancy.

## 4. No Mock Production Behavior

Production application code MUST NOT use:

- Mock databases
- In-memory persistence
- Hardcoded demo records
- Random application results
- Random user identities
- Fabricated audit scores
- Fake fallback responses
- Silent database fallbacks
- Fake successful responses when an external service fails
- `Math.random()` as an identity or business-data generator
- `return mockData`
- `return demoData`
- `return fakeData`
- `databaseResult ?? fakeData`
- Catch blocks that convert infrastructure failures into fabricated success

Mocks are permitted only for:

- Unit-test isolation
- Deterministic test fixtures
- Explicit integration-test fixtures
- Development tooling explicitly designed around mocks

A mock may never be introduced merely because:

- A database is unavailable
- A repository is missing
- An API is difficult to call
- A test is difficult to write
- The agent does not understand the schema
- Existing functionality is incomplete

If a production path lacks required persistence or service evidence, stop and report BLOCKED.

## 5. Package Management

Use pnpm only.

Allowed commands include:

```bash
pnpm install
pnpm install --frozen-lockfile
pnpm add <package>
pnpm add -D <package>
pnpm exec <command>
pnpm run <script>


Never use npm or yarn to modify the dependency graph.

Before adding a dependency:
1. Search package.json.
2. Search the lockfile.
3. Search existing source utilities.
4. Confirm the dependency is genuinely required.
5. Update package.json and pnpm-lock.yaml together.

Never claim a dependency is installed merely because it appears in pnpm-lock.yaml. Runtime dependencies must be declared in package.json.
6. TypeScript and Code Quality

Strict TypeScript is mandatory.

Do not:
• Add any unless the existing boundary makes it unavoidable and the use is documented
• Suppress errors with @ts-ignore
• Disable lint rules globally
• Weaken compiler settings
• Remove tests to make validation pass
• Hide errors with empty catch blocks
• Return untyped database rows from application boundaries

Prefer:
• Explicit input and output types
• Zod validation at external boundaries
• Narrow domain types
• Typed repository methods
• Typed API response contracts
• Exhaustive status and error handling
• Small pure functions
• Dependency injection for infrastructure services

If typecheck is not defined in package.json, use:
pnpm exec tsc --noEmit


Only add a typecheck script when the assigned task explicitly permits package-script changes.
7. Next.js Server and Client Boundaries

Use server-first rendering.

Default to:
• Server Components
• Server Actions for authenticated mutations
• Route Handlers for explicit HTTP APIs
• Server-side session validation
• Server-side data fetching
• Streaming or background jobs for long-running work

Use "use client" only when the component requires:
• Browser APIs
• Local interactive state
• Event handlers
• Client-only visualization libraries
• Client-side subscriptions

Never move database access, API keys, privileged operations, session signing, or authorization logic into client code.

Do not put the entire marketing page or dashboard shell behind "use client" merely for convenience.

Before modifying Next.js code:
node -p "require('next/package.json').version"
find node_modules/next/dist/docs -type f | sort


Read the relevant installed documentation before using new framework APIs.
8. Authentication and Authorization

Authentication and authorization are different controls.

Every protected operation must:
1. Resolve the server-side session.
2. Validate session integrity and expiry.
3. Resolve the authenticated user.
4. Resolve the authorized workspace or tenant.
5. Enforce role or permission checks.
6. Execute business logic only after those checks.

Sessions must use secure HTTP-only cookies or the repository's verified session mechanism.

Never trust:
• Client state
• Hidden form fields
• URL parameters
• Local storage
• x-user-id
• x-tenant-id
• Any other client-provided identity header

A client-provided identifier may be treated only as an untrusted lookup hint and must never establish authorization.

For external API clients, use a server-validated API key or signed credential mapped to a workspace. Do not use arbitrary identity headers.

Never:
• Ignore passwords
• Generate users on login
• Assign every user the same workspace
• Assign elevated roles by default
• Create sessions for unverified accounts
• Expose whether an email exists
• Remove an authorization check for convenience
• Treat authentication as proof of workspace authorization

Authorization must fail closed.
9. Tenant Isolation

Tenant isolation must be enforced at every layer:
• Session resolution
• Authorization
• Service methods
• Repository methods
• SQL predicates
• PostgreSQL RLS
• Cache keys
• Background job payloads
• Logs and observability context

Before changing tenant-scoped functionality, verify:
1. Canonical tenant identifier
2. Tenant context propagation
3. Repository scoping
4. PostgreSQL RLS policy
5. Authorization boundary
6. Cache isolation
7. Expected unauthorized behavior

Every tenant-scoped query must include a verified tenant boundary or execute under verified RLS.

Never use a tenant ID supplied only by the browser.

Never use a global mutable tenant variable.
10. PostgreSQL and Drizzle Rules

Use Drizzle ORM for application database access where the existing architecture uses Drizzle.

Use parameterized SQL for raw queries.

Never interpolate user-controlled values into SQL.

Every database operation must use a request-scoped or transaction-scoped client.

Connection handling must follow this pattern:
1. Lease a PoolClient.
2. Begin the transaction.
3. Set tenant context with SET LOCAL or the established equivalent.
4. Execute the work.
5. Commit on success.
6. Roll back on failure.
7. Release the client in finally.

Never store transaction state on a global singleton.

Never reuse a PoolClient after release.

Never swallow database errors.

Never convert connection failure into empty rows, in-memory data, or success.

Never run migrations:
• During next build
• During application startup
• During Vercel deployment hooks
• Automatically inside request handling

DATABASE_URL is for normal application runtime queries.

MIGRATION_DATABASE_URL is only for explicitly executing migrations.

Never expose, print, log, commit, or report connection-string values.

Before database changes, establish evidence for:
• Canonical table
• Canonical columns
• Existing migration history
• Existing repository
• Existing repository behavior
• Tenant boundary
• Authorization boundary
• Error semantics

If any item is unknown, stop with:

BLOCKED - INSUFFICIENT EVIDENCE

Do not invent tables, columns, relations, repositories, migration behavior, or RLS policies.
11. Schema and Migration Protection

Database and migration changes are high-risk.

Only modify schema or migration infrastructure when the current task explicitly authorizes it.

Before generating a migration:
pnpm exec drizzle-kit --help
pnpm exec drizzle-kit generate


Inspect the generated SQL before applying it.

Never apply a migration to production from an autonomous coding session.

Never delete migration history to make Drizzle generate a clean migration.

Never modify an existing applied migration unless the task explicitly authorizes a controlled migration repair.
12. Background Jobs and External Services

Long-running work MUST NOT execute synchronously inside a request when it includes:
• Website crawling
• Firecrawl calls
• LLM generation
• Embedding generation
• Large content parsing
• Competitive analysis
• Report generation

Use Inngest or the repository's verified background-job mechanism.

Every job must have:
• Stable event name
• Idempotency behavior
• Retry policy
• Concurrency limit
• Explicit tenant ID from server authorization
• Explicit user ID from server authorization
• Correlation or request ID
• Persisted status
• Failure state
• Error observability

Do not send an event unless a registered worker can consume it.

Do not report a job as completed before the result is persisted.

External-service failures must remain distinguishable from valid empty results.
13. URL Acquisition and SSRF

Any server-side request to a user-provided URL is security-sensitive.

All crawl entry points must reuse the verified SSRF guard and crawl policy.

Reject:
• Unsupported protocols
• Localhost
• Loopback addresses
• Private IP ranges
• Link-local addresses
• Cloud metadata endpoints
• Internal hostnames
• Dangerous redirects
• DNS rebinding
• Excessive response sizes
• Excessive redirects
• Unbounded crawl depth
• Unbounded concurrency

Validate every redirect target, not only the original URL.

Respect robots policy according to the established product rules.
14. API Route Rules

Every route must define:
• Supported HTTP methods
• Input schema
• Authentication requirement
• Authorization requirement
• Tenant boundary
• Rate limit behavior
• Idempotency behavior when needed
• Success response
• Validation error response
• Unauthorized response
• Forbidden response
• External-service failure response
• Internal error behavior

Use stable public error contracts.

Never return stack traces, secrets, SQL, provider credentials, or internal infrastructure details.

Do not accept an unbounded JSON body.
15. Localization and UI

The application supports:
• /fa with RTL
• /en with LTR

Preserve:
• Locale routing
• RTL and LTR layout behavior
• Persian text expansion
• English text expansion
• Light theme
• Dark theme
• Keyboard navigation
• Reduced-motion behavior
• Semantic HTML

Do not hard-code user-facing text when the existing localization architecture provides a suitable mechanism.

Invalid locales must not silently render duplicate content.
16. Performance

Protect the critical rendering path.

Prefer:
• Server-rendered public content
• Small client islands
• Lazy loading for graphs and charts
• Reserved dimensions for visualizations
• Optimized fonts
• Optimized images
• Stable skeletons
• Database aggregation
• Pagination
• Cache keys containing tenant identity
• Cache invalidation after writes

Do not optimize by weakening security or data correctness.

Do not promise a performance target without measuring it against a defined device, network, and Lighthouse profile.
17. Scope Control

Modify only files explicitly listed in the current task.

Do not:
• Refactor unrelated features
• Rename unrelated files
• Upgrade dependencies without authorization
• Migrate architecture without authorization
• Change API contracts silently
• Change tenant behavior implicitly
• Change authorization semantics implicitly
• Fix unrelated technical debt

If a required dependency is outside scope, stop and report BLOCKED.
18. Verification

Run the repository's actual scripts from package.json.

At minimum, when relevant:
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:acquisition
pnpm exec drizzle-kit generate


For local route checks:
pnpm dev
curl -i http://localhost:3000/api/inngest
curl -i -X POST http://localhost:3000/api/v1/audit/free \
  -H 'content-type: application/json' \
  --data '{"url":"https://example.com"}'


Do not claim a command passed unless it was executed and its exit status was verified.
19. Final Diff Review

Before completion:
git status --short
git diff --check
git diff --stat
git diff


Verify:
• No secrets
• No debug logs
• No temporary files
• No mock production data
• No unrelated files
• No weakened authorization
• No weakened tenant isolation
• No unreviewed migration
• No unused imports
• No accidental API contract changes
20. Required Completion Report

Report:
• Summary of implementation
• Exact modified files
• Exact created files
• Previous data source, if changed
• New data source
• Canonical repository
• Canonical table
• Tenant boundary
• Authorization behavior
• Error behavior
• Commands executed
• Exit status of each command
• Tests added or updated
• Remaining limitations
• Any blocked work

For blocked work, use this exact heading:

BLOCKED - INSUFFICIENT EVIDENCE

Never claim completion when only compilation succeeded.
21. Acknowledgement

When explicitly asked to read this file, begin the response with:

[SYSTEM]: SEOrchable Agent Manifesto acknowledged.

## Objective 2: Jules execution prompts

### Milestone 1 prompt: Stabilization and critical fixes

```md
You are Google Jules working on the SEOrchable repository.

Read the root AGENTS.md first and begin your response with:

[SYSTEM]: SEOrchable Agent Manifesto acknowledged.

Goal: stabilize the repository without introducing mock production behavior.

Target files to inspect first:

- package.json
- pnpm-lock.yaml
- tsconfig.json
- eslint.config.mjs
- drizzle.config.ts
- database/schema/index.ts
- database/schema/*
- database/drizzle/*
- database/migrations/*
- src/app/actions/audit.ts
- src/app/actions/dashboard.ts
- src/services/dashboard-home/index.ts
- src/services/auth/session.ts
- src/services/auth/authorization.ts
- src/lib/auth.ts
- src/lib/safe-action.ts
- src/lib/inngest/client.ts
- src/core/database/tenant-context/index.ts
- src/features/admin/infrastructure/persistence/postgres/index.ts
- src/app/api/v1/dashboard/summary/route.ts
- src/app/api/v1/crawl/route.ts
- src/features/acquisition/infrastructure/security/ssrf-guard.ts
- src/features/acquisition/domain/policy.ts

Files that may be created only when supported by repository evidence:

- src/app/api/inngest/route.ts
- src/lib/inngest/functions/process-audit.ts
- A canonical audit schema file under the existing database/schema location
- A migration under the existing migration system
- A dedicated migration runner under scripts/

Required actions:

1. Inspect package.json and pnpm-lock.yaml and reconcile declared runtime dependencies with actual imports. Do not blindly copy lockfile dependencies into package.json. Add only dependencies proven necessary by source imports.

2. Confirm the installed versions of Next.js, Drizzle, Inngest, React, TypeScript, and pnpm.

3. Run the installed Next.js documentation inspection under node_modules/next/dist/docs before changing framework code.

4. Identify the canonical audit table by inspecting all schema files, migrations, imports, and database consumers. Do not invent an `audits` table or columns. If no canonical table can be proven, stop and report:
   BLOCKED - INSUFFICIENT EVIDENCE

5. Resolve the mismatch between audit creation and dashboard reads. The audit created by the authenticated workflow must be readable by the dashboard using the same canonical persistence model.

6. Remove production fallbacks that return mock data, in-memory data, empty success responses, random records, or fabricated audit results after database failure. Test-only mocks must remain isolated to test files.

7. Replace global transaction state in the PostgreSQL persistence layer with request-scoped PoolClient transaction handling:
   - Lease a PoolClient
   - Begin transaction
   - Set tenant context
   - Execute operations
   - Commit or rollback
   - Release in finally
   - Never store transaction operations in singleton fields

8. Verify that tenant context is propagated through all audit and dashboard operations.

9. Ensure no browser-provided x-user-id or x-tenant-id header can establish authorization. Existing browser routes must derive identity from the verified server session.

10. Confirm that all crawl entry points use the existing SSRF guard and crawl policy. Do not create a second URL-security implementation.

11. Inspect Inngest event producers and consumers. If `audit.requested` is sent but no registered worker exists, create the worker route and function only after confirming the event contract from source code and tests.

12. The worker must persist explicit pending, running, completed, and failed states. It must not report completion before persistence succeeds.

13. Add regression tests for:
   - Database failure does not become success
   - Cross-tenant access is rejected
   - Transaction clients are released
   - Audit creation and dashboard reads use the same canonical table
   - Inngest audit events have a registered consumer

14. Do not implement registration, password hashing, billing, SEO, Lighthouse optimization, or Sentry in this milestone.

Jules Verification Check:

Run and record the exit status of:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:acquisition
pnpm exec drizzle-kit --help
pnpm exec drizzle-kit generate
git diff --check


If an Inngest route exists or is created, start the application and run:
pnpm dev > /tmp/seorchable-jules-dev.log 2>&1 &
curl -i http://localhost:3000/api/inngest


The Inngest route must return HTTP 200 for its supported discovery or health request. If the installed framework requires a different method, document the exact supported method and response.

Run a negative authorization check against a protected endpoint without a session:
curl -i http://localhost:3000/api/v1/dashboard/summary


It must not return tenant data.

Final report must include:
• Canonical audit table
• Canonical audit repository or data-access boundary
• Tenant propagation path
• Transaction lifecycle
• Removed fallbacks
• Inngest producer and consumer
• Exact validation commands and exit statuses
• Remaining blocked work

### Milestone 2 prompt: Core business logic and user flow

```md
You are Google Jules working on the SEOrchable repository.

Read AGENTS.md first and acknowledge it exactly as required.

Goal: implement a real authenticated SaaS user journey using persisted data. Do not use mock identities, random users, `ws-default`, fake passwords, or fabricated session data.

Target files to inspect:

- src/app/actions/auth.ts
- src/services/auth/session.ts
- src/services/auth/authorization.ts
- src/lib/auth.ts
- src/lib/safe-action.ts
- src/components/AuthProvider.tsx
- src/components/ProtectedRoute.tsx
- src/app/[locale]/login/page.tsx
- src/app/[locale]/register/page.tsx
- src/app/[locale]/verify-email/*
- src/app/[locale]/forgot-password/*
- src/app/[locale]/dashboard/page.tsx
- src/app/[locale]/dashboard/layout.tsx
- src/app/actions/audit.ts
- src/services/dashboard-home/index.ts
- database/schema/index.ts
- database/schema/*
- database/migrations/*
- src/core/database/tenant-context/index.ts
- src/features/admin/infrastructure/persistence/postgres/index.ts
- src/app/api/v1/crawl/route.ts
- src/app/api/v1/dashboard/summary/route.ts

Files that may be created only when supported by existing schema evidence:

- Auth-related schema files
- Auth migrations
- Session repository
- Membership repository
- Email verification service
- Password reset service
- Route handlers required by existing UI contracts
- Tests for authentication and tenant authorization

Required actions:

1. Inspect the existing schema and migrations before changing authentication or workspace behavior. Identify canonical user, organization, membership, and session structures. Do not invent columns or relations.

2. If the repository does not contain enough evidence for a real authentication model, stop with:
   BLOCKED - INSUFFICIENT EVIDENCE

3. Replace the current login behavior that accepts an email without validating a password.

4. Store password hashes using a verified password-hashing implementation. Never store plaintext passwords. Do not log passwords or tokens.

5. Use generic login errors so the endpoint does not reveal whether an email exists.

6. Make registration transactional:
   - Validate name, email, password, and workspace name
   - Create the user
   - Create the workspace only if supported by the canonical schema
   - Create membership
   - Assign the least privileged valid role
   - Create an unverified account state where required
   - Issue a session only according to the verified product policy

7. Do not discard the workspace name collected by the registration form.

8. Replace random user IDs and hardcoded workspace IDs with persisted identifiers.

9. Implement secure session behavior:
   - HTTP-only cookie
   - Secure in production
   - SameSite policy
   - Expiry
   - Session revocation
   - Server-side validation
   - No client-controlled identity fields

10. Enforce server-side authorization for dashboard, audit, billing, workspace, and user operations.

11. Preserve workspace and tenant isolation across:
   - Server Actions
   - Route Handlers
   - Dashboard queries
   - Background jobs
   - Cache keys

12. Ensure client-side ProtectedRoute is only a UX layer. The server page and server actions must reject unauthorized requests independently.

13. Implement real email verification and password recovery only if the repository already contains a verified email provider contract. Otherwise report the missing provider as blocked rather than creating a fake verification flow.

14. Replace the mock audit path used by the authenticated dashboard with the persisted asynchronous audit workflow established in Milestone 1.

15. Add complete loading, empty, invalid-credentials, unverified-account, expired-session, forbidden, job-failed, and retry states.

16. Do not implement billing, SEO, Lighthouse work, or deployment observability in this milestone.

Jules Verification Check:

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec drizzle-kit generate
git diff --check


Start the application:
pnpm dev > /tmp/seorchable-jules-dev.log 2>&1 &


Verify public routes:
curl -i http://localhost:3000/fa
curl -i http://localhost:3000/en
curl -i http://localhost:3000/fa/login
curl -i http://localhost:3000/fa/register


Verify protected behavior without a session:
curl -i http://localhost:3000/fa/dashboard
curl -i http://localhost:3000/api/v1/dashboard/summary


These requests must not expose dashboard data.

Programmatically test:
• Wrong password is rejected
• Login with an unknown email is rejected generically
• Registration creates persisted records
• Workspace name is persisted
• A new user cannot read another workspace
• A viewer cannot perform admin operations
• Expired sessions are rejected
• Logout invalidates the server session
• A browser cannot choose another tenant using x-user-id or x-tenant-id

Do not claim end-to-end registration passed unless the required database and email provider are actually available and the test was executed.

Final report must identify:
• Canonical user table
• Canonical workspace table
• Canonical membership table
• Canonical session mechanism
• Password-hashing mechanism
• Verification-token mechanism
• Tenant boundary
• Authorization boundary
• Tests and exit statuses
• Any unavailable infrastructure

### Milestone 3 prompt: Speed optimization and SEO hardening

```md
You are Google Jules working on the SEOrchable repository.

Read AGENTS.md first and acknowledge it exactly as required.

Goal: make the public marketing experience server-first, indexable, accessible, responsive, and measurable without weakening authenticated behavior.

Target files to inspect:

- src/app/[locale]/page.tsx
- src/app/[locale]/layout.tsx
- src/app/globals.css
- src/config/site.ts
- src/config/fonts.ts
- src/components/marketing/*
- src/components/features/audit/FreeAuditPanel.tsx
- src/components/features/graph/*
- src/components/visualization/*
- src/components/ThemeProvider.tsx
- src/components/navigation/*
- next.config.ts
- public/*
- package.json
- pnpm-lock.yaml

Files that may be created:

- src/app/robots.ts
- src/app/sitemap.ts
- src/app/[locale]/opengraph-image.tsx or an approved static OpenGraph asset
- Accessibility or Lighthouse configuration under the existing project convention
- .github/workflows/lighthouse.yml, only if CI workflow creation is explicitly within scope

Required actions:

1. Inspect the installed Next.js documentation before changing metadata, routing, image handling, fonts, or server/client boundaries.

2. Convert the marketing page to a Server Component unless a specific interaction requires a client island.

3. Move only interactive behavior into client components:
   - Audit form
   - Dashboard preview tabs
   - Graph interactions
   - Scroll controls
   - Theme controls

4. Lazy load graph, chart, and visualization dependencies below the fold. Do not ship Recharts, XYFlow, or large graph code in the initial anonymous landing-page bundle unless measurement proves it is necessary.

5. Do not use the simulated audit service as production truth. The public audit CTA must call the verified production boundary or clearly display an unavailable state when the required backend is not configured.

6. Add fixed dimensions or stable skeletons for:
   - Hero media
   - Charts
   - Graphs
   - Audit result panels
   - Dialogs
   - Images

7. Optimize assets:
   - Identify the largest assets
   - Replace oversized raster logos with SVG where possible
   - Subset fonts to required weights
   - Remove unused font loading
   - Use next/font correctly
   - Do not add remote font dependencies without authorization

8. Implement localized metadata:
   - Locale-specific title
   - Locale-specific description
   - Canonical URL
   - fa and en alternate links
   - OpenGraph title, description, URL, and image
   - Twitter card
   - Correct robots behavior

9. Verify that the configured OpenGraph image actually exists or generate it using an approved Next.js metadata route.

10. Add robots.txt and sitemap.xml using Next.js supported conventions. Do not include:
    - Dashboard routes
    - Billing routes
    - User-specific audit routes
    - Internal API routes
    - Authentication callback routes

11. Add appropriate JSON-LD only for claims actually supported by the product:
    - Organization
    - WebSite
    - SoftwareApplication
    - BreadcrumbList where applicable
    - FAQPage only where visible FAQ content exists

12. Validate locale values and return notFound for unsupported locales.

13. Perform an accessibility pass:
    - One meaningful H1 per public page
    - Semantic landmarks
    - Form labels
    - Keyboard navigation
    - Focus-visible styles
    - Accessible dialogs
    - aria-live for audit progress
    - Alternative text or accessible fallback for graphs
    - Reduced-motion support
    - Correct RTL behavior

14. Add performance budgets only after measuring the existing baseline. Do not claim a 95+ Lighthouse score without running Lighthouse.

15. Do not change authentication, database schema, billing, or background worker behavior in this milestone.

Jules Verification Check:

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
git diff --check


Start the application:
pnpm dev > /tmp/seorchable-jules-dev.log 2>&1 &


Check public routes:
curl -i http://localhost:3000/fa
curl -i http://localhost:3000/en
curl -i http://localhost:3000/fa/robots.txt
curl -i http://localhost:3000/fa/sitemap.xml


Check rendered metadata:
curl -s http://localhost:3000/fa | rg -i 'canonical|og:|twitter:|application/ld\+json|<h1'
curl -s http://localhost:3000/en | rg -i 'canonical|og:|twitter:|application/ld\+json|<h1'


Run the repository's supported Lighthouse command. If no command exists, use an approved local Lighthouse or PageSpeed workflow and record the exact command.

Measure:
• Performance
• Accessibility
• Best Practices
• SEO
• LCP
• CLS
• INP or the available interaction metric
• JavaScript transfer size
• Largest image and font payloads

Required targets for the defined test profile:
• Lighthouse Performance: 95 or higher
• Lighthouse Accessibility: 95 or higher
• Lighthouse SEO: 95 or higher
• CLS: no layout-shifting media or UI
• No critical console errors
• No hydration mismatch warnings

If the target cannot be reached, report the measured score and the remaining bottleneck. Do not fabricate a passing result.

Final report must include:
• Before and after bundle or transfer-size measurements
• Before and after Lighthouse scores
• Metadata files
• Sitemap and robots coverage
• Accessibility changes
• Remaining performance limitations

### Milestone 4 prompt: Deployment and production readiness

```md
You are Google Jules working on the SEOrchable repository.

Read AGENTS.md first and acknowledge it exactly as required.

Goal: prepare the application for controlled staging and production deployment with secure secrets, CI/CD, observability, database migration discipline, and operational checks.

Target files to inspect:

- package.json
- pnpm-lock.yaml
- next.config.ts
- drizzle.config.ts
- .env.example
- .gitignore
- scripts/*
- src/app/api/inngest/route.ts
- src/lib/inngest/*
- src/core/database/*
- src/features/admin/infrastructure/persistence/postgres/*
- src/services/auth/*
- src/app/api/*
- existing .github/* files
- existing deployment documentation

Files that may be created:

- .github/workflows/ci.yml
- .github/workflows/deploy-staging.yml
- .github/workflows/lighthouse.yml
- scripts/migrate.ts
- instrumentation.ts
- sentry.client.config.ts
- sentry.server.config.ts
- sentry.edge.config.ts, only if Edge runtime code exists
- docs/operations/deployment.md
- docs/operations/rollback.md
- health-check route files only when they match the existing route convention

Required actions:

1. Inspect the current deployment architecture before adding provider-specific configuration.

2. Add CI using pnpm and a frozen lockfile. CI must run:
   - Install
   - TypeScript validation
   - Lint
   - Tests
   - Production build
   - Migration generation or schema validation
   - Diff hygiene checks

3. Do not run production migrations during build, startup, or deployment automatically.

4. Create a dedicated migration command using `MIGRATION_DATABASE_URL` only when the command is explicitly invoked.

5. Ensure normal application runtime uses `DATABASE_URL`, never `MIGRATION_DATABASE_URL`.

6. Never print or expose any environment variable value. Logs may contain variable names but never values.

7. Add environment validation that:
   - Requires production secrets
   - Rejects placeholder values
   - Distinguishes build-time public values from server-only secrets
   - Fails closed when required services are unavailable
   - Does not break static public pages unnecessarily

8. Configure connection pooling for the actual deployment runtime. Do not use global mutable transaction state. Verify PoolClient release behavior under success and failure.

9. Add Sentry or the explicitly approved observability provider to:
   - Client errors
   - Server errors
   - Route handlers
   - Server actions
   - Inngest workers
   - Database failures
   - External provider failures

10. Capture safe structured context:
    - Request ID
    - Correlation ID
    - Audit ID
    - Workspace ID, only if policy permits
    - Job ID
    - Route
    - Duration
    - Status

    Never capture passwords, tokens, API keys, cookies, database URLs, or full sensitive payloads.

11. Add health checks that verify service readiness without leaking infrastructure details.

12. Verify Inngest deployment wiring:
    - Event producer exists
    - Worker route exists
    - Function is registered
    - Retry policy exists
    - Failure state is persisted
    - Worker can be discovered by the configured environment

13. Add rate-limit, quota, and idempotency checks for expensive crawl and AI operations if the repository already has the required Redis or persistence contract. If the contract is missing, report BLOCKED rather than inventing one.

14. Add staging and production documentation covering:
    - Required secret names
    - Migration procedure
    - Rollback procedure
    - Worker deployment
    - Database backup expectations
    - Error monitoring
    - Alert ownership
    - Health-check URLs

15. Add smoke tests for:
    - Public landing page
    - Login route
    - Protected dashboard rejection without session
    - Inngest route
    - Free audit validation failure
    - SSRF rejection
    - Tenant isolation rejection
    - Database unavailable behavior

16. Do not commit secret values, sample credentials, private URLs, or provider tokens.

Jules Verification Check:

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec drizzle-kit --help
pnpm exec drizzle-kit generate
git diff --check
git status --short


Run the full project test suite using the scripts actually defined in package.json.

Start the production server in a disposable environment:
pnpm build
pnpm start > /tmp/seorchable-jules-prod.log 2>&1 &


Check public and protected routes:
curl -i http://localhost:3000/fa
curl -i http://localhost:3000/en
curl -i http://localhost:3000/api/inngest
curl -i http://localhost:3000/api/v1/dashboard/summary


The unauthenticated dashboard request must not return tenant data.

If a health route exists or is created under the approved route convention:
curl -i http://localhost:3000/api/health


It must return HTTP 200 only when the application is ready according to its documented readiness contract.

Verify that:
• No secret values appear in logs
• No migration runs during build
• No migration runs during startup
• Inngest discovery returns 200
• Worker registration is visible
• Database failures return controlled failure responses
• SSRF attempts are rejected
• Cross-tenant access is rejected
• CI uses pnpm
• CI uses pnpm install --frozen-lockfile

Inspect the final diff:
git diff --stat
git diff --check
git diff


Final report must include:
• CI workflows
• Deployment stages
• Environment variable names, never values
• Migration procedure
• Rollback procedure
• Observability configuration
• Inngest verification result
• Smoke-test results and exit statuses
• Security checks
• Remaining operational risks

The key rule across all four prompts is intentional: **Jules must block instead of inventing schema, tenant behavior, authentication behavior, or infrastructure.** That is the difference between a refactor and four increasingly expensive layers of fake confidence.

