AGENTS.md

Purpose

You are Jules working on Seorchable, a Next.js 16 / React 19 / TypeScript SaaS for SEO, AI visibility, brand intelligence, crawling, citations, GEO/AEO, monitoring, and reporting.

This file is the repository operating contract.

Read it before every task.

The task prompt is the change request; this file supplies the safety, scope, verification, and delivery rules.

Explicit user instructions override this file, but never override security requirements or the prohibition on exposing secrets.

---

Jules Operating Model

Jules runs asynchronously in an isolated VM, reads the repository, proposes a plan, and returns a diff/PR.

For every task:

1. Read this file and any nearer "AGENTS.md" file.
2. Inspect the current branch and the exact files named in the task.
3. Inspect the repository state before making changes.
4. Run only the permitted baseline commands and record the result.
5. Produce a plan limited to the task scope.
6. Do not expand scope after planning.
7. Proceed only within the approved task scope.
8. Change only the allowed files/directories.
9. One task means one concern and one reviewable commit/PR.
10. Add or update focused tests before broad refactoring.
11. Run the task verification commands.
12. If a command cannot run because an environment service or variable is absent, report it as blocked; do not weaken the check.
13. Review the final diff for scope creep, secrets, tenant-boundary regressions, generated-file edits, and fake success paths.
14. Report:
    - summary
    - changed files
    - tests and commands
    - known failures
    - security implications
    - residual risks
    - follow-up task IDs
15. Stop at the task's STOP CONDITION.
16. Do not continue into another Jules task.

Recommended branch/commit convention:

branch: jules/JULES-###-short-slug
commit: <type>: <single task outcome>

Do not combine multiple Jules task IDs in one commit unless the task prompt explicitly states that they are inseparable.

---

Repository Map

- "src/app/[locale]/": public, auth, dashboard, docs, pricing, legal, and localized routes.
- "src/app/actions/": server actions. Authentication and tenant-sensitive decisions stay server-side.
- "src/app/api/": HTTP routes, Inngest endpoint, v1 APIs, and payment webhook.
- "src/core/": configuration, cache, events, database tenant context, transactions, and dependency wiring.
- "src/features/": feature modules. Prefer domain -> application -> infrastructure dependency direction.
- "src/services/": application services and integrations.
- "src/inngest/": background functions and job orchestration.
- "database/schema/": canonical Drizzle schema. Do not introduce a second schema source or change schema ownership unless explicitly authorized by the task.
- "database/drizzle/": canonical Drizzle migration surface unless a dedicated migration task changes that decision.
- "database/migrations/": legacy migration surface. Do not delete, rewrite, reorder, or reconcile it unless a dedicated migration task explicitly authorizes that work.
- "tests/": focused unit, integration, security, and feature tests.
- "docs/": architecture, audits, product, security, and release evidence.
- "scripts/": workers, docs generation, database guards, and verification utilities.
- "public/": public assets and fonts. Do not add credentials or customer data.

---

Commands and Environment

The current manifest defines these scripts:

npm run dev
npm run build
npm run start
npm run lint
npm run test:acquisition
npm run db:generate
npm run db:migrate
npm run db:push

There is currently no guaranteed "npm test" script.

Do not claim that "npm test" passed unless a task explicitly adds it and documents the test runner.

Do not invent a test command.

Inspect "package.json" and the existing test structure before selecting a test command.

The repository may contain multiple package-manager lockfiles.

Before choosing a package-manager command:

1. Inspect "package.json".
2. Inspect the available lockfiles.
3. Determine the repository's current package-manager convention.
4. Use the package manager appropriate to the task and current repository state.

Do not remove, regenerate, replace, or arbitrarily choose a lockfile unless a dedicated package-manager task explicitly authorizes it.

Required variable names are documented in ".env.example".

Use names only, never values:

- "DATABASE_URL"
- "MIGRATION_DATABASE_URL"
- "STAGING_MIGRATION_DATABASE_URL"
- "SESSION_SECRET"
- "UPSTASH_REDIS_REST_URL"
- "UPSTASH_REDIS_REST_TOKEN"
- "FIRECRAWL_API_KEY"
- "GOOGLE_GENERATIVE_AI_API_KEY"
- "RESEND_API_KEY"
- "PAYMENT_WEBHOOK_SECRET"
- "DATA_SOURCE"
- "NEXT_PUBLIC_APP_ENV"

Jules may use disposable test credentials and test doubles at adapter boundaries.

Never request, print, paste, commit, or place production secret values in a prompt, log, test fixture, PR, or documentation.

---

Non-Negotiable Security Rules

- Never trust tenant, user, role, subscription, or permission values from UI state, request bodies, query parameters, or plain identity headers.
- Resolve identity from a verified server session or a scoped, hashed API credential.
- Resolve membership and role server-side.
- Enter tenant context only after authorization.
- Preserve PostgreSQL transaction-local tenant context and RLS.
- Every tenant-scoped read/write must remain tenant-scoped at both application and database layers.
- System context is explicit and restricted. It is not an unrestricted RLS bypass.
- Do not add default users, default tenants, demo identities, or permissive fallback authorization.
- Do not turn database/provider failure into a successful audit, billing, alert, or crawl result.
- Mocks are allowed only in tests or an explicitly named local/demo mode.
- Production must fail closed when required dependencies are missing.
- All outbound URL fetches must use the shared SSRF-safe boundary.
- The SSRF-safe boundary must enforce HTTP(S)-only validation, private-network rejection, redirect revalidation, DNS/rebinding controls, timeout, and bounded resource use.
- If a shared SSRF-safe boundary already exists, reuse it. Do not create a second URL-fetch security implementation without explicit authorization.
- Validate webhook signatures, replay/idempotency, and event ordering where applicable.
- Do not log cookies, tokens, API keys, reset/verification tokens, payment secrets, full prompts with sensitive data, or raw customer crawl content.
- Do not run destructive database operations against production.
- Never use "db:push" against production.
- Use disposable or staging databases for migration tests.
- Do not weaken a failing security test, delete a test, or hide a failure to make a task green.

---

Scope and File Boundaries

Every task prompt must define:

ALLOWED FILES:
DO NOT TOUCH:

Treat those boundaries literally.

Always:

- Prefer the smallest diff that solves the stated problem.
- Preserve existing public response shapes unless the prompt explicitly changes them.
- Keep domain code independent of Next.js, PostgreSQL, Firecrawl, Redis, and environment access.
- Use parameterized SQL and existing repository abstractions.
- Add regression coverage for each security, authorization, tenant, persistence, or concurrency change.
- Keep generated files generated.
- Do not hand-edit ".next/", lockfiles, Drizzle metadata, or build artifacts unless the task explicitly owns them.
- Update documentation only when the task scope requires the contract to change.
- Reuse existing abstractions before introducing new ones.

Never:

- Perform a rewrite.
- Perform broad formatting.
- Perform unrelated dependency upgrades.
- Perform opportunistic refactoring.
- Modify ".env", production credentials, deployment secrets, or customer data.
- Modify "node_modules/", ".next/", build output, or vendored assets.
- Remove failing tests.
- Replace real persistence with an in-memory map.
- Add fabricated analytics, random scores, fake crawl logs, fake success messages, or placeholder OAuth behavior to production.
- Claim production readiness because TypeScript, lint, or a narrow test set passes.

---

Database and Migration Guardrails

- The canonical migration decision is controlled by a dedicated migration task.
- Until that decision is explicitly changed, preserve existing migration surfaces.
- Never reorder an already-applied migration.
- Add a new forward migration for schema changes.
- Check foreign keys, unique constraints, tenant keys, indexes, nullability, timestamps, soft deletion, enum/check constraints, and RLS policies.
- Test migrations from an empty database and representative upgrade states when the task changes migrations.
- Use a migration-only connection for migrations.
- Application runtime must not use migration credentials.
- Do not claim RLS is complete without testing with two tenants and an appropriate non-owner role.
- Never run destructive migration operations against production.

---

Product-Truth Guardrails

- Every dashboard metric, audit score, citation, mention, competitor result, and alert must be traceable to persisted source data, a provider response, and a timestamp.
- If data is unavailable, show an explicit loading, empty, unavailable, or error state.
- Never silently substitute a realistic-looking result.
- Long crawls and model observations belong in durable, idempotent, retryable jobs with bounded timeouts and visible terminal failure states.
- Billing entitlements and quotas must be checked server-side before expensive work.
- Do not fabricate provider responses, crawl results, model observations, citations, metrics, or monitoring events.

---

Deployment Guardrails

- Do not modify Vercel configuration, deployment configuration, build commands, environment configuration, or CI/CD workflows unless explicitly included in the task scope.
- Never add production secrets to repository files.
- Never expose deployment secrets in logs, prompts, commits, PRs, screenshots, or documentation.
- Never run database migrations as part of the Vercel build unless a dedicated deployment task explicitly authorizes and designs that behavior.
- A successful local build does not prove a successful Vercel deployment.
- Do not claim deployment success unless the deployment was actually verified.
- Preserve the currently working deployment path when making unrelated changes.
- A testing or feature task must not modify deployment configuration as an incidental fix.
- If a deployment failure is unrelated to the current task, report it rather than opportunistically changing deployment infrastructure.

---

Git Safety

- Never force-push unless explicitly authorized.
- Never rewrite shared branch history.
- Never reset, rebase, or squash user work unless explicitly authorized.
- Before committing, inspect "git status" and "git diff".
- The commit must contain only changes belonging to the current task.
- Do not merge the PR automatically.
- Do not modify repository merge settings unless explicitly authorized.
- Do not modify branch protection rules unless explicitly authorized.
- Provide the final commit SHA.
- Request user review before merge.

---

Failure Isolation

If verification exposes a failure:

1. Determine whether the failure was introduced by the current task.
2. If unrelated, do not fix it opportunistically.
3. Record the exact failing command and relevant error.
4. Determine whether the task can still be safely verified without masking the failure.
5. If it cannot, stop and report the blocker.
6. Do not weaken tests, remove checks, alter production behavior, or introduce unrelated changes merely to obtain a green result.

Pre-existing failures are not permission to expand scope.

---

Verification Standard

For a focused code task:

- Run the narrowest relevant tests.
- Run lint when applicable.
- Run TypeScript validation when applicable.
- Run formatting checks when applicable.
- Run the full test suite only when an established full-suite command exists and it is relevant.

For database/security tasks:

- Require disposable database or staging integration tests where applicable.
- Test tenant isolation explicitly.
- Test authorization boundaries.
- Test failure and rollback behavior.

For route/UI tasks:

- Test both English and Persian/RTL paths where applicable.
- Verify loading, empty, error, and success states where relevant.
- Preserve existing responsive behavior.

For deployment-related tasks:

- Verify the actual deployment when deployment verification is within scope.
- Do not infer deployment success from a local build.

A task is complete only when:

- Acceptance criteria pass.
- Required verification commands are run or clearly blocked by missing external setup.
- The diff contains no out-of-scope changes.
- No secret or production credential is present.
- The final report names residual risks and follow-up task IDs.

Never claim a verification step passed unless it was actually executed.

---

Regression Validation

For bug fixes and security-sensitive behavior:

- Add focused regression coverage where practical.
- Prefer tests that fail if the original defect is reintroduced.
- Where practical, perform a minimal temporary mutation to confirm that the regression test actually detects the targeted defect.
- Restore production code exactly after mutation testing.
- Never commit intentional mutations.
- If mutation validation is impractical, document why.

---

Human Approval Gates

Stop and ask for human review before:

- changing migration history or database roles/policies;
- changing auth/session or API credential semantics;
- changing billing, payment, entitlement, or webhook behavior;
- changing deployment/CI permissions or production environment configuration;
- deleting routes, tables, data, assets, or dependencies;
- changing public API contracts;
- introducing a new provider, paid service, or data-retention policy;
- introducing a new security boundary;
- changing tenant-isolation architecture;
- replacing an existing infrastructure abstraction with a new one.

Do not work around an approval gate by making an equivalent change under another file or abstraction.

---

Jules Prompt Template

Each task must be executed as one isolated session and contain:

TASK ID:
TITLE:
CONTEXT:
OBJECTIVE:
CURRENT PROBLEM:
EVIDENCE:
SCOPE:
ALLOWED FILES:
DO NOT TOUCH:
IMPLEMENTATION REQUIREMENTS:
SECURITY REQUIREMENTS:
BACKWARD COMPATIBILITY:
TEST REQUIREMENTS:
VERIFICATION:
ACCEPTANCE CRITERIA:
EXPECTED FILE CHANGES:
COMMIT MESSAGE:
STOP CONDITION:

The task prompt must define one concern.

Do not combine unrelated objectives into one task.

If repository evidence differs from the prompt:

1. Do not guess.
2. Report the discrepancy.
3. Update the plan based on repository evidence.
4. Stop if the discrepancy changes scope, architecture, security, or expected behavior.
5. Request clarification when required.

---

Definition of Done

A Jules task is complete only when:

- The repository state was inspected before implementation.
- The exact implementation relevant to the task was inspected.
- Existing conventions were followed.
- Only authorized files were changed.
- The implementation satisfies the task acceptance criteria.
- Relevant regression tests exist.
- Verification commands were actually executed.
- Known failures are explicitly reported.
- No production secrets were exposed.
- No unrelated refactoring was introduced.
- No deployment path was unintentionally changed.
- The final diff was reviewed for scope creep.
- The change is committed as one reviewable task outcome.
- The commit SHA is reported.
- User review is requested.
- Jules stops instead of continuing into another task.
