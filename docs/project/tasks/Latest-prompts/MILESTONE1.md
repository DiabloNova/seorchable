

- [SYSTEM]: SEOrchable Agent Manifesto acknowledged.

## Task: Fix only the existing JSX/TSX syntax error in:

- src/components/marketing/Hero.tsx

The file currently has a closing </button> inside a <motion.div> without the matching closing </motion.div>. Inspect the complete file, restore the correct JSX nesting, and make no unrelated changes.

Do not modify package files, routes, styling, or component behavior.

## Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm build
git diff --check

If any command fails because of an unrelated existing issue, stop and report the exact file and error. Do not fix unrelated files.

# Micro-prompt 2: Synchronize dependencies safely
- Read AGENTS.md first and acknowledge it.

## Task: Reconcile the dependency manifest with the actual imports.

Target files:

- package.json
- pnpm-lock.yaml

Inspect the repository imports before editing. Add only dependencies that are imported by production code and missing from package.json. Remove only packages proven to be unused. Use pnpm only.

Do not upgrade framework versions. Do not change application code. Do not copy every package from the lockfile into package.json.

Verify:

pnpm install --lockfile-only
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
git diff --check

Report every dependency added or removed and why it was required.

# Micro-prompt 3: Replace global transaction state with PoolClient transactions
- Read AGENTS.md first and acknowledge it.

## Task: Fix transaction concurrency safety in the PostgreSQL persistence adapter.

Target files:

- src/features/admin/infrastructure/persistence/postgres/index.ts
- One focused regression test file under the existing test convention

Replace singleton transaction state such as global inTransaction flags or shared transaction-operation arrays with request-scoped PoolClient handling.

Required behavior:

1. Acquire a PoolClient from the pool.
2. Execute BEGIN on that client.
3. Execute all transaction queries on that same client.
4. COMMIT on success.
5. ROLLBACK on failure.
6. Release the client in finally.
7. Never allow concurrent requests to share transaction state.
8. Preserve tenant-context checks and existing repository contracts.
9. Do not introduce mock production persistence.

Add a deterministic test proving concurrent transactions do not share state and clients are released after both success and failure.

Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm exec <existing focused test command>
pnpm build
git diff --check

If the test command or transaction contract cannot be established from the repository, report BLOCKED instead of guessing.

# Micro-prompt 4: Make database failures fail closed
- Read AGENTS.md first and acknowledge it.

## Task: Remove silent database failure behavior from the PostgreSQL adapter.

Target files:

- src/features/admin/infrastructure/persistence/postgres/index.ts
- One focused regression test file under the existing test convention

Find code that catches database connection or query failures and returns empty rows, mock clients, in-memory values, or fabricated success.

Change production behavior so database failures remain errors and callers receive controlled failure responses. Test-only fixtures may remain isolated in test files.

Do not redesign the repository layer. Do not change schema or migrations. Do not replace one fallback with another.

Add tests proving:

- A failed query rejects or returns the established error type.
- A failed write is not reported as successful.
- A transaction still rolls back and releases its PoolClient.

Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm exec <existing focused test command>
pnpm build
git diff --check

If the repository deliberately requires a fallback in a specific test-only path, preserve it and document why.

# Micro-prompt 5: Remove spoofable tenant identity headers
- Read AGENTS.md first and acknowledge it.

## Task: Prevent browser clients from selecting their own user or tenant identity.

Target files:

- src/services/auth/authorization.ts
- src/app/api/v1/dashboard/summary/route.ts
- src/app/api/v1/audit/premium/route.ts
- src/app/api/v1/audit/aeo-insight/route.ts
- Relevant authorization tests only

Required behavior:

1. Browser requests must derive identity from the verified server session.
2. x-user-id and x-tenant-id must never establish authorization.
3. External API access may use only an existing verified API-key or signed-credential mechanism.
4. If no verified identity exists, return 401.
5. Preserve existing role and workspace authorization behavior.
6. Do not weaken authorization and do not invent a new API-key system.

Add tests proving a request with forged x-user-id or x-tenant-id cannot access another workspace.

Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm exec <existing focused test command>
pnpm build
git diff --check

If no verified external API credential mechanism exists, remove the unsafe header fallback and report external API authentication as blocked.

# Micro-prompt 6: Align audit creation and audit reads
- Read AGENTS.md first and acknowledge it.

## Task: Trace and fix the audit persistence mismatch between creation, dashboard summaries, and audit detail pages.

Target files:

- src/app/actions/audit.ts
- src/app/actions/dashboard.ts
- src/services/dashboard-home/index.ts
- src/app/[locale]/dashboard/page.tsx
- Existing database schema files imported by these modules
- Existing audit migrations
- Relevant focused tests

Before editing, identify from repository evidence:

- Canonical audit table
- Canonical audit columns
- Canonical repository or query boundary
- Tenant boundary
- Authorization boundary
- Status values

Make audit creation, dashboard reads, and audit detail reads use the same verified persistence model.

Do not invent an audits table, column, repository, migration, or status value. Do not modify schema or migrations unless the evidence proves the correction and the task explicitly requires it.

If the canonical model cannot be established, stop with:

BLOCKED - INSUFFICIENT EVIDENCE

Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm exec drizzle-kit generate
pnpm build
git diff --check

Add or update one focused regression test proving that an inserted audit is visible through the dashboard read path.

# Micro-prompt 7: Wire the Inngest audit event
- Read AGENTS.md first and acknowledge it.

## Task: Ensure the audit.requested event has a registered Inngest consumer.

Target files:

- src/lib/inngest/client.ts
- src/app/actions/audit.ts
- Existing Inngest functions under src/lib/inngest/*
- src/app/api/inngest/route.ts, only if missing
- One focused worker test

Trace the existing event payload and locate any existing audit processing function before creating files.

Required behavior:

1. The event name and payload must match the existing producer.
2. The worker must be registered with the Inngest serve route.
3. The worker must use the verified tenant and user IDs from the event.
4. The worker must persist running, completed, and failed states through the existing audit boundary.
5. Add retries and a concurrency limit only if supported by the installed Inngest version.
6. Do not process long-running crawl or LLM work inside the request action.
7. Do not create fake results when a provider fails.

Verify:

pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec <existing focused test command>
git diff --check

Start the app and verify the worker route:

pnpm dev > /tmp/seorchable-jules-dev.log 2>&1 &
curl -i http://localhost:3000/api/inngest

The route must return the expected successful discovery response, normally HTTP 200. If the repository uses another supported method, document it.

# Micro-prompt 8: Add Milestone 1 regression and smoke coverage
- Read AGENTS.md first and acknowledge it.

## Task: Add a focused stabilization test suite for the fixes completed in Micro-prompts 1 through 7.

Target files:

- Existing test directories and test configuration
- New test files only under the existing test convention
- package.json only if a test script is genuinely missing and the change is necessary

Cover only these behaviors:

1. Hero.tsx compiles with valid JSX.
2. Frozen pnpm installation succeeds.
3. Database transaction clients are isolated per request.
4. PoolClient is released after commit and rollback.
5. Database failures do not become empty successful responses.
6. Forged tenant headers cannot establish authorization.
7. Audit creation and dashboard reads use the same canonical model.
8. audit.requested has a registered Inngest consumer.

Use deterministic fixtures only inside tests. Do not add mock databases or fake production paths.

Verify the complete stabilization baseline:

pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm exec drizzle-kit generate
pnpm test:acquisition
git diff --check

If the repository has no general test runner, do not install one automatically. Add the narrowest test possible using the existing tooling and report the missing coverage infrastructure.


- Important sequencing: Prompt 1 fixes the build blocker, Prompts 2 to 5 stabilize foundations, Prompt 6 resolves the audit data path, Prompt 7 wires execution, and Prompt 8 proves the whole milestone. This is practical Jules territory: one concern, a tiny file scope, and one green PR at a time.
