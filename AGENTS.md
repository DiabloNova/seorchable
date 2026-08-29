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

## 6. TypeScript and Code Quality

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

## 7. Next.js Server and Client Boundaries

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

## 8. Authentication and Authorization

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

## 9. Tenant Isolation

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

## 10. PostgreSQL and Drizzle Rules

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

## 11. Schema and Migration Protection

Database and migration changes are high-risk.

Only modify schema or migration infrastructure when the current task explicitly authorizes it.

Before generating a migration:
pnpm exec drizzle-kit --help
pnpm exec drizzle-kit generate


Inspect the generated SQL before applying it.

Never apply a migration to production from an autonomous coding session.

Never delete migration history to make Drizzle generate a clean migration.

Never modify an existing applied migration unless the task explicitly authorizes a controlled migration repair.

## 12. Background Jobs and External Services

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

## 13. URL Acquisition and SSRF

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

## 14. API Route Rules

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

## 15. Localization and UI

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

## 16. Performance

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

## 17. Scope Control

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

## 18. Verification

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

## 19. Final Diff Review

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

## 20. Required Completion Report

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

## 21. Acknowledgement

When explicitly asked to read this file, begin the response with:

[SYSTEM]: SEOrchable Agent Manifesto acknowledged.
