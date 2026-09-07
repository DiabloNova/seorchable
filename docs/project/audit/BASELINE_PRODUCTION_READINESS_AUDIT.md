# Baseline Production Readiness Audit

## 1. Executive Summary

This audit assesses the baseline production readiness of the Seorchable repository. The assessment is strictly evidence-based, derived from inspecting the repository's configuration, schema, Next.js routing, database migrations, CI/CD pipeline, and tests.

Key themes observed in the repository:
1. **Architecture & Tenant Isolation:** There is a robust foundational architecture implementing a `TenantContextManager` for database queries and Row-Level Security (RLS) across a number of tenant-scoped tables. However, evidence suggests missing or bypassed constraints in some areas (e.g. Auth).
2. **Security & Authentication:** The repository contract (`AGENTS.md`) mandates strict multi-step authentication, IP locking, and progressive delays. The actual implementation in `src/app/actions/auth.ts` is simplistic, lacks password hashing (Argon2), and does not enforce the progressive delays or multi-step challenge requirements.
3. **CI/CD & Testing:** While a comprehensive suite of test files exists (e.g. `tests/features/`, `tests/services/`), the CI/CD pipeline (`.circleci/config.yml`) only runs `npm run build` and an evals step. It does not execute the test suites, typechecking, or linting. Deployment steps are mocked.

## 2. Architecture Map

Based on an inventory of the `src` and `database` directories, the following application boundaries and architectural layers are implemented:

**Major Application Areas:**
- **Next.js App Router (Frontend & API):** Located in `src/app/[locale]` (UI), `src/app/api` (HTTP endpoints), and `src/app/actions` (Server Actions).
- **Core Engine:** Located in `src/core`, managing caching, configuration, database connection, events, and the `TenantContextManager` which propagates context to database queries.
- **Domain Features:** Located in `src/features`, encompassing domain logic for areas such as `acquisition`, `admin`, `ai-intelligence`, `billing`, `monitoring`, `public-api`, and `recommendations`.
- **Services:** Located in `src/services`, handling operations for `auth`, `audit-engine`, `crawler`, `observability`, `jobs` (Inngest), `knowledge-graph`, and `rag`.
- **Background Processing:** Mediated by Inngest. Functions are defined in `src/lib/inngest/functions.ts` and `run-audit.ts` and served via `src/app/api/inngest/route.ts`.
- **Database / Schema:** Managed via Drizzle ORM in `database/schema/` and migrations in `database/migrations/`.

**Implementation Gaps (Evidence-based):**
- **Authentication Service Boundary:** The current auth logic in `src/app/actions/auth.ts` does not integrate with a separate authentication boundary that enforces progressive delays or challenge requirements (as defined in `AGENTS.md`).

## 3. Route and API Inventory

The repository exposes the following HTTP endpoints and Server Actions based on the contents of `src/app/api` and `src/app/actions`:

**API Routes (`src/app/api`):**
- **Inngest:** `GET/POST/PUT src/app/api/inngest/route.ts` - Serves Inngest functions (`runAudit`, `helloWorld`, `scheduledMonitoring`, `automatedRecommendationsDiagnosis`).
- **Webhooks:** `POST src/app/api/webhooks/payment/route.ts` - Payment success processor using `x-webhook-secret` verification.
- **V1 Domain Endpoints:**
  - `src/app/api/v1/dashboard/summary/route.ts`
  - `src/app/api/v1/crawl/route.ts`
  - `src/app/api/v1/crawler/start/route.ts`
  - `src/app/api/v1/content/studio/route.ts`
  - `src/app/api/v1/ingest/document/route.ts`
  - `src/app/api/v1/optimization/technical/route.ts`
  - `src/app/api/v1/analysis/competitive/route.ts`
  - `src/app/api/v1/analytics/llm/route.ts`
  - `src/app/api/v1/analytics/summary/route.ts`
  - `src/app/api/v1/ai/chunk/route.ts`
  - `src/app/api/v1/ai/sentiment/route.ts`
  - `src/app/api/v1/audit/free/route.ts`
  - `src/app/api/v1/audit/premium/route.ts`
  - `src/app/api/v1/audit/aeo-insight/route.ts`
  - `src/app/api/v1/audit/engine/route.ts`
  - `src/app/api/v1/knowledge-graph/query/route.ts`
  - `src/app/api/v1/rag/query/route.ts`
  - `src/app/api/v1/docs/route.ts`

**Server Actions (`src/app/actions`):**
- Authentication: `auth.ts` (`loginAction`, `registerAction`, `requestPasswordResetAction`, `logoutAction`, `getServerSessionAction`).
- Domain Actions:
  - `audit.ts`
  - `brand-intelligence.ts`
  - `citation-intelligence.ts`
  - `dashboard.ts`
  - `ingestion.ts`
  - `keyword-intelligence.ts`
  - `prompt-intelligence.ts`
  - `prompts.ts`
  - `query.ts`
  - `recommendations.ts`
  - `site-architecture.ts`
  - `technical-seo.ts`
  - `workspace.ts`
  - `aeo-content-intelligence.ts`
  - `ai-visibility-audit.ts`

## 4. Dependency and Script Inventory

**Dependencies & Configuration (`package.json`, Lockfiles):**
- **Package Managers:** Both `pnpm-lock.yaml` and `package-lock.json` are present. `package.json` does not specify `packageManager`, but `.circleci/config.yml` uses `npm` (`pkg-manager: npm`).
- **Frameworks/Libraries:** Next.js (16.2.11), React (19.2.4), Drizzle ORM (0.45.2), AI SDK (@ai-sdk/google, ai), Inngest, Upstash Redis, Resend.

**Scripts (`package.json`):**
- `dev`: `next dev`
- `build`: `npx tsx scripts/generate-docs-data.ts && next build`
- `lint`: `eslint`
- `test:acquisition`: `tsx tests/features/acquisition/run-all.ts`
- `security:secrets`: `tsx scripts/security/secret-hygiene.ts`
- **Missing Scripts:** There is no centralized `test` or `test:all` script configured to run the broader test suite.

## 5. Test / Build Coverage Inventory

**Test Suites Configured:**
The `tests` directory contains numerous `.test.ts` files and `run-all.ts` scripts across `api`, `core`, `features`, `inngest`, `scripts`, and `services`. These tests use `node:assert/strict` and are designed to be run manually via `tsx` (e.g. `test:acquisition` script).

**Executed Checks (CI/CD Evidence):**
- `.circleci/config.yml` reveals that **only `npm run build` is executed** during the primary workflow (`build-node` job).
- **Not Verified in CI:** The pipeline does not execute typechecking (`tsc --noEmit`), linting (`eslint`), unit/integration tests (via `tsx`), or security scans (`security:secrets`). An `evals-test-assertions-job` exists but appears separated from unit testing.

**Coverage Gaps:**
While files like `tests/services/auth/session.test.ts` and `tests/features/admin/tenant-isolation-behavior.test.ts` exist, there is no automated enforcement in CI, meaning regressions could deploy unnoticed.

## 6. Security Risks

**Finding: Authentication Implementation Violates Contract**
- ID: SEC-01
- Severity: Critical
- Exact File Path(s): `src/app/actions/auth.ts`, `AGENTS.md`
- Relevant Symbol / Configuration: `loginAction`, `AGENTS.md` (Sections 18-21)
- Concrete Evidence: `AGENTS.md` mandates strict IP locking, progressive password-failure delays, and Argon2 password hashing. The implementation in `loginAction` performs a raw SQL string query (`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`) without any password hash checking, delay mechanisms, or challenge requests.
- Production Impact: Attackers can trivially bypass security measures meant to prevent brute-forcing or credential stuffing.
- Confidence: Confirmed
- Recommended Remediation Direction: Rewrite `loginAction` in `auth.ts` to implement Argon2, progressive delays, and challenge requirements as mandated by `AGENTS.md`.

**Finding: Secret Hygiene Script Unused**
- ID: SEC-02
- Severity: Medium
- Exact File Path(s): `package.json`, `.circleci/config.yml`, `scripts/security/secret-hygiene.ts`
- Relevant Symbol / Configuration: `security:secrets` script
- Concrete Evidence: `scripts/security/secret-hygiene.ts` is configured as `security:secrets` in `package.json`, but the `build-node` job in `.circleci/config.yml` does not call this script.
- Production Impact: Secrets committed to Git are not automatically prevented in CI, increasing the risk of credential exposure.
- Confidence: Confirmed
- Recommended Remediation Direction: Add a run step for `npm run security:secrets` to the CI pipeline.

**Finding: Potential Account Enumeration via Password Reset**
- ID: SEC-03
- Severity: Low
- Exact File Path(s): `src/app/actions/auth.ts`
- Relevant Symbol / Configuration: `requestPasswordResetAction`
- Concrete Evidence: The function silently returns if the user is not found, meaning the DB is queried but no mock delay or mock token generation occurs if the user does not exist. This can lead to timing discrepancies.
- Production Impact: Could allow an attacker to enumerate valid user accounts based on timing attacks.
- Confidence: Likely
- Recommended Remediation Direction: Ensure that `requestPasswordResetAction` takes a constant amount of time regardless of whether a user exists.

## 7. Database / Tenant-Isolation Risks

**Finding: RLS Coverage Completeness Verification Needed**
- ID: DB-01
- Severity: High
- Exact File Path(s): `src/core/database/tenant-context/index.ts`, `database/migrations/*`
- Relevant Symbol / Configuration: `TENANT_SCOPED_TABLES`, Migration files.
- Concrete Evidence: While `0016_website_monitoring.sql` correctly implements `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`, `TENANT_SCOPED_TABLES` lists 35 tables. It was not comprehensively verified if all 35 tables have RLS enforced in migrations.
- Production Impact: Any missing RLS enforcement on a tenant-scoped table could lead to cross-tenant data leaks.
- Confidence: Unknown
- Recommended Remediation Direction: Verify that all 35 tables listed in `TENANT_SCOPED_TABLES` have active `FORCE ROW LEVEL SECURITY` and correct policies applied.

**Finding: Authentication Query Scope Bypass**
- ID: DB-02
- Severity: Medium
- Exact File Path(s): `src/app/actions/auth.ts`, `src/core/database/tenant-context/index.ts`
- Relevant Symbol / Configuration: `loginAction`, `TenantContextManager.runWithSystemContext`
- Concrete Evidence: In `loginAction`, `TenantContextManager.runWithSystemContext` is used to query `users` and `organization_members`. This relies entirely on the correctness of the SQL WHERE clauses, completely bypassing RLS.
- Production Impact: While typical for authentication, any misuse of `runWithSystemContext` to query other tenant-scoped data bypasses intended security controls.
- Confidence: Confirmed
- Recommended Remediation Direction: Ensure `runWithSystemContext` usage is strictly audited and limited only to pre-authentication queries.

## 8. Deployment / Operational Risks

**Finding: Mocked Deployment Pipeline**
- ID: OPS-01
- Severity: High
- Exact File Path(s): `.circleci/config.yml`
- Relevant Symbol / Configuration: `deploy` job
- Concrete Evidence: In the `deploy` job, the deployment command is mocked as `command: "#e.g. ./deploy.sh"`, and simply marks the CircleCI release as RUNNING then SUCCESS.
- Production Impact: Code merged to the deployment branch is not actually deployed automatically by the pipeline.
- Confidence: Confirmed
- Recommended Remediation Direction: Replace the mocked `./deploy.sh` in CircleCI with the actual production deployment sequence.

**Finding: CI Lack of Verification**
- ID: OPS-02
- Severity: High
- Exact File Path(s): `.circleci/config.yml`
- Relevant Symbol / Configuration: `build-node` job
- Concrete Evidence: The `build-node` job only runs `npm run build`. Tests (`tsx`), typechecking (`tsc --noEmit`), and linting (`eslint`) are entirely absent from the CI configuration.
- Production Impact: Code can be merged and theoretically deployed even if it contains failing tests, type errors, or lint violations.
- Confidence: Confirmed
- Recommended Remediation Direction: Add testing, linting, and typechecking steps to the CI pipeline prior to the build step.

**Finding: Package Manager Ambiguity**
- ID: DEP-01
- Severity: Low
- Exact File Path(s): `package-lock.json`, `pnpm-lock.yaml`, `.circleci/config.yml`
- Relevant Symbol / Configuration: Root directory lockfiles
- Concrete Evidence: Both `pnpm-lock.yaml` and `package-lock.json` exist. The CI pipeline hardcodes `npm` (`pkg-manager: npm`), but local development may use `pnpm`.
- Production Impact: Could lead to "works on my machine" bugs due to divergent dependency resolution between local and CI environments.
- Confidence: Confirmed
- Recommended Remediation Direction: Standardize on a single package manager (either npm or pnpm) and remove the unused lockfile.

## 9. Prioritized Backlog

- **Critical:**
  - SEC-01: Authentication Contract Violation
- **High:**
  - OPS-02: CI Lack of Verification
  - OPS-01: Mocked Deployment Pipeline
  - DB-01: RLS Coverage Completeness Verification Needed
- **Medium:**
  - SEC-02: Secret Hygiene Script Unused
  - DB-02: Authentication Query Scope Bypass
- **Low:**
  - SEC-03: Potential Account Enumeration via Password Reset
  - DEP-01: Package Manager Ambiguity

## 10. Unknowns / Verification Gaps

- **Migration Execution State:** Cannot verify from the repository files alone if the production database has successfully executed all migrations.
- **RLS Coverage Completeness:** While `0016_website_monitoring.sql` shows RLS is used, a full scan of all 18 migration files for all 35 tenant-scoped tables was not exhaustively verified in this initial audit.
- **Inngest External Configuration:** The connection and operational state of the Inngest production environment is unknown.

## 11. Production Gate

**Status:** **NOT READY FOR PRODUCTION**
- Due to the implementation of `loginAction` completely bypassing the mandatory security controls (Argon2, rate limiting, progressive delays) required by the repository contract, and the absence of CI test verification, this repository must not proceed to production until these items are remediated.
