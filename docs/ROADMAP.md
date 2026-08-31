# SEOrchable — Prototype → Product Execution Roadmap
### A Jules-optimized, single-task, chained prompt program

**Repository:** `DiabloNova/seorchable`
**Stack:** Next.js 16.2.11 (App Router) · React 19.2.4 · TypeScript · Drizzle ORM + PostgreSQL · Inngest · Upstash Redis · Zod · Tailwind v4
**Method:** one Jules session = one task = one branch = one PR = one merge. 47 tasks, 8 phases.

---

## 0. Point A → Point B

### Point A (where the repository is today)
Working, ambitious feature surface with correct architectural patterns present but unevenly applied. Authentication accepts any email without a credential. Two spend-heavy API routes trust a client header as identity. The database layer converts outages into fake empty successes. The SEO product ships no `robots.txt`, no sitemap, and generic metadata on 48 of 49 pages. Rate-limiting code exists but is wired to nothing. Scratch files, logs and a committed `.env` sit in the repo root.

### Point B (definition of "ready product")
| Dimension | Exit condition |
|---|---|
| Authentication | Password credential required and verified; no enumeration; reset and verification flows backed by persisted tokens |
| Authorization | Every route resolves identity server-side; no route trusts a client header alone; tenant isolation provable by test |
| Reliability | Every dependency failure produces a visible error with a correct status code; zero fabricated-data paths in production |
| Cost control | Every metered endpoint rate limited and quota-checked before spend; limiter fails closed |
| SEO | `robots.txt` + full sitemap; unique metadata + canonical + hreflang on every public page; JSON-LD graph; public pages server-rendered |
| Performance | Homepage TTI and bundle within a written budget; client islands memoized; images via `next/image` |
| Quality gates | CI runs typecheck + lint + tests + build on every PR and blocks merge on failure |
| Operability | Health endpoint, DB-outage alerting, deploy checklist with required env vars, load-test evidence |

---

## 1. How to run this program

### 1.1 The chain rule
Tasks are numbered `T<phase>.<n>` and are ordered by dependency. **Do not run two tasks in one Jules session, and do not start `T(n+1)` before `T(n)` is merged to `main`.** Jules clones the branch at session start; an unmerged predecessor means the next task builds on code Jules cannot see.

Per task:
1. Open Jules, select the repo, select branch `main`.
2. Paste the task's prompt block verbatim. Nothing else.
3. Click **Give me a plan**. Read the plan.
4. If the plan touches files outside the task's `SCOPE`, reply: *"Your plan modifies files outside the authorized scope. Revise to touch only: `<list>`."* Do not approve until the plan is in scope.
5. Approve. Let it run.
6. Review the diff against the task's **Acceptance criteria**. Read the report.
7. Merge the PR. Only then move to the next task.

### 1.2 Why the prompts look the way they do
`AGENTS.md` is read automatically at the start of every Jules session, so **the guardrails never go in the prompt.** They are already in the repo. Each prompt therefore carries only five things:

| Block | Purpose |
|---|---|
| `TASK` | One sentence. One deliverable. If it contains "and also", it is two tasks. |
| `CONTEXT` | The exact file paths and current behaviour, so Jules does not have to guess or search. |
| `REQUIREMENTS` | Numbered, verifiable statements. No adjectives like "clean" or "robust". |
| `SCOPE` | Explicit allowlist of files. The single most effective anti-drift control. |
| `DONE WHEN` | Machine-checkable acceptance criteria plus the verification commands to run. |

Two more rules that matter in practice:
- **Never ask Jules to "fix the SEO" or "harden auth".** Broad verbs produce sprawling diffs that are unreviewable. One file, one behaviour, one prompt.
- **Split "investigate" from "change."** Read-only inventory tasks (T2.5, T3.5, T6.1) cost one session and make the following change-task prompts precise instead of speculative.

### 1.3 Prerequisite (do this yourself, before T0.1)
Commit the replacement `AGENTS.md` and `.env.example` to `main` manually. Everything downstream depends on those guardrails already being in the repository when the first session starts.

---

## PHASE 0 — Ground truth and safety net
*No product behaviour changes. Establishes a repository Jules can be trusted in.*

### T0.1 — Repository hygiene sweep

```
TASK
Remove committed files that .gitignore already excludes, and delete root-level scratch artefacts.

CONTEXT
The repository root contains files that .gitignore already lists, meaning they were force-added
at some point and are now tracked:
- 14 log files: dev_server.log, dev_server_2.log, dev_server_3.log, dev_server_4.log,
  dev_server_light_diag.log, dev_server_redesign.log, dev_server_verify.log,
  dev_server_verify_floating.log, next_prod_aeo_content.log, next_prod_server.log,
  next_prod_server_run.log, next_prod_verify.log, next_run.log, next_run_3001.log,
  next_run_3002.log, next_run_start.log
- A committed .env file
Additional root-level scratch artefacts that are not part of the application:
- final_report.md, part1_report.md
- replace_auth_auth.sh, replace_auth_import.sh, replace_schema.sh,
  replace_schema_credit_transactions.sh, replace_schema_credits.sh
- test_db.ts, assertions.json, eval_results.json, brand-test-output.txt
- fix-actions.patch, verify_aeo_content.py
- .Jules/ directory, jules_master_rules.md

REQUIREMENTS
1. Untrack every file above using `git rm --cached` for .env (so the local copy survives) and
   `git rm` for the rest.
2. Before deleting any file, grep the repository for imports or references to it. If ANY source
   file, script, or package.json script references a file on the list, do not delete it: leave it
   in place and name it in your report.
3. Add `.Jules/` and `*_report.md` to .gitignore.
4. Do not modify any file under src/, database/, docs/, or tests/.
5. Do not print the contents of .env at any point.

SCOPE
.gitignore, plus deletions of the root-level files listed above. No other file may be modified.

DONE WHEN
- `git status` shows no tracked file matching a .gitignore pattern.
- `pnpm exec tsc --noEmit` exits 0.
- `pnpm build` exits 0.
- Your report lists every deleted path and every path you kept because it was referenced.
```
**Acceptance:** diff is deletions plus a two-line `.gitignore` change. Nothing under `src/`.

---

### T0.2 — Delete the drifted duplicate schema file

```
TASK
Delete database/schema/index.ts.tmp2 after proving nothing imports it.

CONTEXT
database/schema/index.ts.tmp2 is a 1175-line stale copy of database/schema/index.ts. It has
diverged: it is missing tables present in the real schema and uses looser typing. Its presence
creates a real risk that a future change is applied to the wrong file.

REQUIREMENTS
1. Search the entire repository (src/, database/, scripts/, tests/, drizzle.config.ts,
   tsconfig.json path aliases) for any reference to "index.ts.tmp2" or "tmp2".
2. If there are zero references, delete the file.
3. If there is even one reference, do NOT delete. Report the referencing file and stop.
4. Confirm drizzle.config.ts points only at the canonical schema entry point, and report which
   path it points at. Do not change it.

SCOPE
database/schema/index.ts.tmp2 (deletion only).

DONE WHEN
- The file is gone, or you have reported the blocking reference.
- `pnpm exec tsc --noEmit` exits 0.
- `pnpm db:generate` produces no new migration (proving the canonical schema is unchanged).
```

---

### T0.3 — Add a typecheck script and record the verification baseline

```
TASK
Add a "typecheck" npm script and record the current output of every verification command in
docs/BASELINE.md.

CONTEXT
package.json defines dev, build, start, lint, test:acquisition, db:generate, db:migrate,
db:push. There is no typecheck script, so every agent session has to guess the invocation.
No document records which checks currently pass, so there is no way to tell a pre-existing
failure from a regression introduced by a later task.

REQUIREMENTS
1. Add to package.json scripts: "typecheck": "tsc --noEmit".
2. Create docs/BASELINE.md containing, for each of `pnpm typecheck`, `pnpm lint`, `pnpm build`,
   and `pnpm test:acquisition`:
   - the exact command
   - the exit code you observed
   - the full error and warning count
   - the first 20 distinct error messages, verbatim, if any
3. Record results exactly as observed. Do NOT fix any error you find. Recording failures
   accurately is the deliverable.
4. If a command cannot run (for example a missing environment variable), record precisely why,
   naming the variable but never its value.

SCOPE
package.json, docs/BASELINE.md.

DONE WHEN
- docs/BASELINE.md exists with all four command results.
- No source file under src/ or database/ was modified.
```
**Acceptance:** this is your regression reference for the next 44 tasks. Keep it.

---

### T0.4 — CI quality gate

```
TASK
Add a GitHub Actions workflow that runs typecheck, lint and build on every pull request.

CONTEXT
The repository contains a .circleci directory but no GitHub Actions workflow, so pull requests
merge with no automated verification. package.json now defines a "typecheck" script (added in
the previous change). The package manager is pnpm; pnpm-lock.yaml is the authoritative lockfile.

REQUIREMENTS
1. Create .github/workflows/ci.yml triggered on pull_request and on push to main.
2. Jobs must run, in order: pnpm install --frozen-lockfile, pnpm typecheck, pnpm lint, pnpm build.
3. Use pnpm/action-setup with the pnpm major version implied by pnpm-lock.yaml, and Node 20.
4. Provide only the environment variables the build genuinely requires. Inspect the build to
   determine which. Use dummy non-secret placeholder values supplied via the workflow env block,
   and add a comment naming each variable and why the build needs it.
5. If docs/BASELINE.md records that typecheck or lint currently fails, set continue-on-error:true
   on that specific step ONLY, with a comment referencing docs/BASELINE.md and a TODO to remove
   it once the baseline is clean. Do not fix the underlying errors in this task.
6. Do not modify .circleci.

SCOPE
.github/workflows/ci.yml only.

DONE WHEN
- The workflow file is valid YAML and parses.
- Every step's command matches a script that exists in package.json.
- Your report lists each env var the workflow sets and the reason.
```

---

## PHASE 1 — Authentication
*The login bypass is the single most severe defect in the repository. Nothing else ships first.*

### T1.1 — Credential columns: migration + Drizzle schema

```
TASK
Add password credential columns to the users table, in both the Drizzle schema and a SQL migration.

CONTEXT
database/schema/organization.ts defines the users table with: id (uuid), name (text),
email (text, unique), createdAt, updatedAt, deletedAt. There is NO credential column of any
kind, which is why src/app/actions/auth.ts loginAction cannot verify a password even in
principle. Hand-written SQL migrations live in database/migrations/ and are numbered
sequentially; the highest existing number is 0018.

REQUIREMENTS
1. In database/schema/organization.ts, add to the users table:
   - passwordHash: text("password_hash")  -- NULLABLE
   - passwordUpdatedAt: timestamp("password_updated_at", { withTimezone: true })
   - failedLoginAttempts: integer("failed_login_attempts").notNull().default(0)
   - lockedUntil: timestamp("locked_until", { withTimezone: true })
2. passwordHash MUST be nullable. Existing rows have no credential. Add a code comment stating
   that NULL means "cannot authenticate with a password" and must never be interpreted as
   "any password accepted".
3. Create database/migrations/0019_user_credentials.sql using the same style and conventions as
   the existing files in that directory. Wrap in BEGIN/COMMIT. Use ADD COLUMN IF NOT EXISTS.
4. Add a unique index on lower(email) where deleted_at IS NULL, so case-insensitive login
   lookups cannot match two rows.
5. Do not modify any application code. Do not run the migration.
6. Verify that `integer` is already imported in organization.ts before using it; add it to the
   existing import if not.

SCOPE
database/schema/organization.ts, database/migrations/0019_user_credentials.sql.

DONE WHEN
- `pnpm typecheck` exits 0.
- The SQL file is syntactically valid PostgreSQL and idempotent on re-run.
- Your report states the exact column names, types and nullability added.
```

---

### T1.2 — Password hashing module + unit tests

```
TASK
Create src/lib/password.ts providing scrypt-based password hashing, verification and policy
validation, with unit tests.

CONTEXT
The repository has no password hashing utility. package.json dependencies include no bcrypt or
argon2, and adding either introduces a native compilation step into the deploy pipeline. Node's
built-in crypto.scrypt is memory-hard and available on every runtime this app targets, so no new
dependency is required. Existing tests live under tests/.

REQUIREMENTS
1. Export from src/lib/password.ts:
   - hashPassword(password: string): Promise<string>
   - verifyPassword(password: string, storedHash: string | null | undefined): Promise<boolean>
   - needsRehash(storedHash: string | null | undefined): boolean
   - validatePasswordPolicy(password: string): { valid: boolean; violations: string[] }
   - performDummyVerification(): Promise<void>
2. Storage format must be self-describing so cost parameters can be raised later:
   scrypt$<N>$<r>$<p>$<keylen>$<saltBase64>$<hashBase64>
   Use N=16384, r=8, p=1, keylen=64, 16-byte random salt, and set maxmem to accommodate them.
3. verifyPassword must use crypto.timingSafeEqual, must return false (never throw) for a null,
   empty or malformed stored hash, and must read the cost parameters from the stored string
   rather than assuming the current ones.
4. validatePasswordPolicy must return machine-readable violation codes, not prose, so the UI can
   localize them into Persian and English. Minimum length 12, maximum 200, and require at least
   one lowercase letter, one uppercase letter and one digit.
5. performDummyVerification runs a throwaway scrypt derivation with the current parameters. It
   exists so the login path can equalise response timing when no user row is found, preventing
   account enumeration through latency.
6. Normalise passwords with String.prototype.normalize("NFKC") before hashing and before
   verifying, so the same typed password always produces the same result.
7. Add tests covering: hash then verify succeeds; wrong password fails; null stored hash returns
   false; malformed stored hash returns false; two hashes of the same password differ (salted);
   needsRehash is false for a freshly generated hash; every policy violation code triggers.
8. Add no new npm dependency.

SCOPE
src/lib/password.ts, and one new test file under tests/.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm lint` reports no new errors.
- The new tests run and pass; paste the runner output into your report.
```

---

### T1.3 — Require a password in registerAction

```
TASK
Change registerAction in src/app/actions/auth.ts to accept and hash a password.

CONTEXT
src/app/actions/auth.ts exports registerAction(name: string, email: string). It creates a user
row, an organization, and a workspace_admin membership, then calls createSession, all without
any credential. Combined with the current loginAction this means anyone can create an account
for any email address and immediately obtain a session. src/lib/password.ts now provides
hashPassword and validatePasswordPolicy. The users table now has a password_hash column.

REQUIREMENTS
1. New signature: registerAction(name: string, email: string, password: string): Promise<User>.
2. Validate the password with validatePasswordPolicy BEFORE any database write. On failure throw
   with the violation codes, and do not create a user, organization or membership.
3. Hash with hashPassword and store into users.password_hash, setting password_updated_at to NOW().
4. Normalise the email to trimmed lower case for both the existence check and the insert. Trim
   the display name.
5. Preserve every existing behaviour: the duplicate-email rejection, the organization and
   membership creation, the workspace_admin role, and the session creation on success.
6. The email-verification token generated at the end of the function is not persisted anywhere,
   so /verify-email cannot validate it. Do not attempt to fix that here. Leave the code as is and
   add a comment stating that verification is not yet a security control, then name it in your
   report as out of scope.
7. Do not modify loginAction, requestPasswordResetAction, logoutAction or getServerSessionAction.
8. Do not modify any UI component. Callers are updated in a later task.

SCOPE
src/app/actions/auth.ts only.

DONE WHEN
- `pnpm typecheck` reports errors ONLY at the call sites of registerAction (expected: they still
  pass two arguments). List those call sites in your report.
- No code path can create a user row with a NULL password_hash.
```

---

### T1.4 — Verify the password in loginAction

```
TASK
Change loginAction in src/app/actions/auth.ts to require and verify a password.

CONTEXT
src/app/actions/auth.ts exports loginAction(email: string). It runs
`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`, and if a row exists it immediately
calls createSession with that user's identity and workspace role. There is no credential check.
Anyone who knows a registered email address can obtain an authenticated session, including
workspace_admin access to that organization's data. This is the most severe defect in the
repository. src/lib/password.ts provides verifyPassword, needsRehash, hashPassword and
performDummyVerification.

REQUIREMENTS
1. New signature: loginAction(email: string, password: string): Promise<User>.
2. Select id, name, email and password_hash explicitly. Do not use SELECT *.
3. Match on lower(email) = <normalised input> so login is case-insensitive.
4. If no user row is found: call performDummyVerification, then throw the generic error. This
   equalises timing so a missing account is not detectable.
5. If a user row is found: call verifyPassword against password_hash. On mismatch, throw the
   generic error. A NULL password_hash must fail (verifyPassword already returns false).
6. Use the exact same error message for "no such user" and "wrong password" so the endpoint
   cannot be used to enumerate accounts. Never include the email address in the error.
7. Only after successful verification, resolve workspace membership and role, and call
   createSession. Preserve the existing "User does not belong to any active workspace" behaviour.
8. If needsRehash(password_hash) is true after a successful verification, rehash with the current
   parameters and UPDATE users.password_hash and password_updated_at. Do not let a failure of
   this upgrade block the login.
9. Do not implement account lockout here; failed_login_attempts and locked_until are wired in a
   later task.
10. Do not modify registerAction or any other export.

SCOPE
src/app/actions/auth.ts only.

DONE WHEN
- No code path reaches createSession without a successful verifyPassword.
- `pnpm typecheck` reports errors ONLY at loginAction call sites. List them.
- Your report states, in one sentence each, what happens for: unknown email, known email with
  wrong password, known email with correct password, known email with NULL password_hash.
```

---

### T1.5 — Forward the password through the client auth layer

```
TASK
Update AuthProvider and the login and register pages to send passwords to the server actions.

CONTEXT
src/components/AuthProvider.tsx exposes login(email, password?) and never forwards the password
argument to loginAction. The login page is src/app/[locale]/login/page.tsx and the register page
is src/app/[locale]/register/page.tsx. The server actions now have the signatures
loginAction(email, password) and registerAction(name, email, password), so these call sites are
currently type errors. The app supports fa (RTL) and en (LTR) locales.

REQUIREMENTS
1. In AuthProvider, make password a required parameter on login and on register, and forward it
   to the corresponding server action.
2. Update the login and register pages so the password input value reaches the action. Add a
   confirm-password field to register that is validated client-side before submitting.
3. Render the server's password-policy violation codes as localized messages in both fa and en,
   using the repository's existing localization mechanism. Do not hardcode strings.
4. Display the generic authentication error from loginAction verbatim in intent: do not add any
   client-side text that distinguishes "user not found" from "wrong password".
5. Never store, log, or place the plaintext password in component state that outlives submission,
   in localStorage, in sessionStorage, or in a URL.
6. Preserve the existing visual design, both themes, and RTL/LTR correctness. This is a wiring
   change, not a redesign.
7. Do not modify src/app/actions/auth.ts.

SCOPE
src/components/AuthProvider.tsx, src/app/[locale]/login/page.tsx,
src/app/[locale]/register/page.tsx, and localization message files only.

DONE WHEN
- `pnpm typecheck` exits 0 with zero errors repository-wide.
- `pnpm lint` reports no new errors.
- `pnpm build` exits 0.
- Your report confirms which localization files you edited and lists the message keys added.
```
**Acceptance: the auth bypass is closed here.** Manually verify: correct password logs in, wrong password does not, unknown email gives the identical error.

---

### T1.6 — Make SESSION_SECRET mandatory in production

```
TASK
Require SESSION_SECRET at runtime in production instead of generating a random per-process secret.

CONTEXT
src/services/auth/session.ts line ~20 contains:
  const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
This is evaluated once per process. In any serverless or horizontally scaled deployment, a
session cookie signed by instance A fails HMAC verification on instance B, producing apparently
random logouts. The existing comment claims the fallback exists so that `next build` page data
collection can run. Next.js sets NEXT_PHASE="phase-production-build" during the production build.
SESSION_SECRET is absent from .env.example.

REQUIREMENTS
1. Replace the module-level constant with a lazily resolved, cached secret so that importing the
   module never throws during a build.
2. Resolution rules:
   - SESSION_SECRET set and at least 32 characters -> use it.
   - NODE_ENV === "production" and NEXT_PHASE !== "phase-production-build" and the secret is
     missing or too short -> throw an explicit configuration error.
   - Otherwise (development, test, or the production build phase) -> generate an ephemeral secret
     and emit a console warning that sessions will not survive a restart.
3. Export assertSessionConfiguration(): void which forces resolution, so a health check or boot
   sequence can fail fast on a misconfigured deployment.
4. Do not change the cookie name, the payload shape, the HMAC algorithm, the 24-hour expiry, or
   the behaviour of signPayload, verifyPayload, createSession, getSession, requireSession,
   getAuthenticatedUser or invalidateSession.
5. Add SESSION_SECRET to .env.example with a comment stating that it is required in production,
   must be at least 32 characters, and can be generated with `openssl rand -hex 32`. Leave the
   value empty.

SCOPE
src/services/auth/session.ts, .env.example.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm build` exits 0 without SESSION_SECRET set, proving the build-phase exemption works.
- Your report states the exact condition under which the code now throws.
```

---

### T1.7 — Login rate limiting and account lockout

```
TASK
Add per-account lockout and per-IP rate limiting to the login path.

CONTEXT
loginAction now verifies passwords, but nothing limits attempt volume, so offline-speed online
brute force is possible. The users table has failed_login_attempts (integer, default 0) and
locked_until (timestamptz, nullable) from migration 0019, both currently unused.
src/lib/rate-limit.ts provides checkRateLimit, RateLimitError and RATE_LIMIT_RULES including an
authLogin rule. Server Actions cannot read a NextRequest, so the IP must be obtained via
next/headers.

REQUIREMENTS
1. In loginAction, before the credential check, read locked_until. If it is in the future, throw
   the generic authentication error without performing any password verification.
2. On a failed verification, increment failed_login_attempts. When it reaches 10, set locked_until
   to NOW() + 15 minutes.
3. On a successful verification, reset failed_login_attempts to 0 and locked_until to NULL.
4. Add per-IP rate limiting using checkRateLimit with RATE_LIMIT_RULES.authLogin. Read the client
   IP from the x-forwarded-for header via next/headers. If no IP is resolvable, fall back to
   per-email keying rather than skipping the limit.
5. A lockout must produce the same error message as a wrong password. Do not tell the caller the
   account is locked: that confirms the account exists.
6. Inspect src/lib/rate-limit.ts before use and match its actual exported signatures. Do not
   assume them.
7. Do not change registerAction.

SCOPE
src/app/actions/auth.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- 11 consecutive wrong passwords lock the account for 15 minutes; one correct password resets
  both counters.
- Your report confirms that lockout and wrong-password responses are byte-identical.
```

---

### T1.8 — Persisted password reset tokens

```
TASK
Implement a real password reset flow backed by a persisted, hashed, single-use token.

CONTEXT
src/app/actions/auth.ts exports requestPasswordResetAction(email). It generates a randomUUID,
builds a reset link, sends it via sendPasswordResetEmail, and discards the token. Nothing is
persisted, so no endpoint can validate the link. src/app/[locale]/forgot-password/page.tsx exists;
there is no reset-password page. src/lib/email.ts provides sendPasswordResetEmail.
Hand-written migrations are in database/migrations/, highest number 0019.

REQUIREMENTS
1. Create migration database/migrations/0020_password_reset_tokens.sql defining
   password_reset_tokens with: id, user_id (FK to users, ON DELETE CASCADE), token_hash (text,
   unique), expires_at (timestamptz), consumed_at (timestamptz nullable), created_at, and an
   index on user_id. Follow the conventions of the existing migration files.
2. Add the matching Drizzle table definition in database/schema/organization.ts and export it
   from the schema index the way sibling tables are exported.
3. Store only a SHA-256 hash of the token. The plaintext token goes in the emailed URL and is
   never written to the database or to any log.
4. Token lifetime: 30 minutes. Single use: set consumed_at on redemption and reject any token
   that already has consumed_at set or whose expires_at has passed.
5. On a reset request, invalidate all of that user's outstanding unconsumed tokens before
   issuing a new one.
6. Add resetPasswordAction(token: string, newPassword: string) which validates the policy via
   validatePasswordPolicy, verifies the token, updates users.password_hash and
   password_updated_at, resets failed_login_attempts and locked_until, and marks the token
   consumed. Perform all of it in a single transaction.
7. requestPasswordResetAction must keep returning identically whether or not the email exists.
8. Do not build the reset-password UI page in this task. Report it as a follow-up.

SCOPE
database/migrations/0020_password_reset_tokens.sql, database/schema/organization.ts,
the schema index export, src/app/actions/auth.ts.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm db:generate` reports no drift between the Drizzle definition and the migration.
- Your report states the token lifetime, the hash algorithm, and confirms the plaintext token is
  never persisted.
```

---

### T1.9 — Persisted email verification tokens

```
TASK
Persist email verification tokens and make the verify-email route actually verify.

CONTEXT
registerAction generates a randomUUID verification token, builds a link, sends it via
sendVerificationEmail, and discards the token. src/app/[locale]/verify-email/page.tsx exists but
cannot validate anything. The users table has no email-verified flag. Migration 0020 established
the password_reset_tokens pattern; mirror it.

REQUIREMENTS
1. Create migration database/migrations/0021_email_verification.sql adding
   users.email_verified_at (timestamptz, nullable) and an email_verification_tokens table
   mirroring the structure and hashing approach of password_reset_tokens. Token lifetime 24 hours.
2. Add the matching Drizzle definitions and exports.
3. registerAction must persist the hashed token instead of discarding it.
4. Add verifyEmailAction(token: string) which validates the token, sets users.email_verified_at,
   and marks the token consumed, in one transaction.
5. Do NOT gate login on email verification in this task. Changing who can log in is a separate
   product decision. State in your report that verification is now recorded but not yet enforced.
6. Do not modify the verify-email page UI.

SCOPE
database/migrations/0021_email_verification.sql, database/schema/organization.ts,
the schema index export, src/app/actions/auth.ts.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm db:generate` reports no drift.
- Your report confirms login behaviour is unchanged.
```

**PHASE 1 EXIT GATE.** Do not proceed until, on a real database: registration requires a policy-compliant password; login fails without the correct password; unknown-email and wrong-password responses are identical; 11 bad attempts lock the account; the app boots with a fixed `SESSION_SECRET`; reset and verification tokens exist in the database.

---

## PHASE 2 — Access control and spend protection
*Two routes currently let an anonymous caller spend your Firecrawl and LLM budget against arbitrary tenants.*

### T2.1 — Distributed rate limiter

```
TASK
Create src/lib/rate-limit.ts: an Upstash-Redis-backed fixed-window rate limiter that fails closed.

CONTEXT
The repository already depends on @upstash/redis and src/lib/redis.ts initialises a client from
UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN with a deliberately fail-open design for
caching. Rate limiting has the opposite requirement: it protects paid upstreams, so it must fail
closed. src/features/public-api/middleware/api-middleware.ts and
src/features/public-api/services/api-quota-service.ts exist but are imported by nothing under
src/app/api/. api-quota-service uses an in-memory store, which cannot work across serverless
instances.

REQUIREMENTS
1. Export from src/lib/rate-limit.ts:
   - types RateLimitScope ("ip" | "tenant"), RateLimitRule, RateLimitResult
   - class RateLimitError with a statusCode field
   - resolveClientIp(req: NextRequest): string | null
   - checkRateLimit(rule, identifier): Promise<RateLimitResult>
   - enforceRateLimit(rule, identifier): Promise<{ rejection: NextResponse | null; result }>
   - rateLimitHeaders(result): Record<string, string>
   - RATE_LIMIT_RULES constant registry
2. Algorithm: fixed window via Redis INCR on a key containing the rule name, scope, identifier and
   window index, with EXPIRE set on first increment.
3. FAIL CLOSED. If Upstash env vars are absent and NODE_ENV === "production", throw
   RateLimitError(503). If a Redis call throws, also throw RateLimitError(503). Never allow the
   request through because the limiter is unavailable.
4. In non-production only, when Upstash is unconfigured, use an in-process Map so local
   development exercises the same code path. Gate this strictly on NODE_ENV !== "production".
5. resolveClientIp reads x-forwarded-for (first entry), then x-real-ip, then
   x-vercel-forwarded-for. Return null when none is present; callers decide what to do.
6. RATE_LIMIT_RULES must define: auditFree (5/hour, ip), auditPremium (20/hour, tenant),
   crawlerStart (10/hour, tenant), ragQuery (120/hour, tenant), authLogin (10/15min, ip).
7. rateLimitHeaders returns X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset.
   enforceRateLimit's 429 response must also carry Retry-After.
8. Do not modify src/lib/redis.ts. Its fail-open caching semantics are correct for its purpose.
9. Do not wire this into any route in this task.
10. Add no new npm dependency.

SCOPE
src/lib/rate-limit.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm lint` reports no new errors.
- Your report explains, in one sentence, the behaviour when Redis is unreachable in production.
```

---

### T2.2 — Fix broken access control on the crawler start route

```
TASK
Replace the unverified header-based identity in src/app/api/v1/crawler/start/route.ts with
authorizeApiRequest, and rate limit the route.

CONTEXT
src/app/api/v1/crawler/start/route.ts reads req.headers.get("x-tenant-id") and treats it as
authoritative tenant identity. There is no session check and no membership verification, so any
anonymous caller can start crawl jobs against any tenant id they choose. The correct pattern
already exists: authorizeApiRequest(req) in src/services/auth/authorization.ts prefers the signed
session cookie and, for header-based developer integrations, verifies the user is an actual member
of the requested organization. src/app/api/v1/rag/query/route.ts and
src/app/api/v1/dashboard/summary/route.ts already use it correctly. Read rag/query/route.ts first
and follow its pattern exactly. src/lib/rate-limit.ts provides RATE_LIMIT_RULES.crawlerStart.

REQUIREMENTS
1. Remove the direct x-tenant-id and x-user-id header reads. Obtain userId and tenantId only from
   `await authorizeApiRequest(req)`.
2. Catch AuthorizationError and return its statusCode with a body of
   { error: "Unauthorized" | "Forbidden", message }.
3. After authorization and BEFORE constructing CrawlerOrchestrator, apply
   enforceRateLimit(RATE_LIMIT_RULES.crawlerStart, tenantId) keyed on the verified tenant. Return
   the rejection response when present.
4. Catch RateLimitError and return its statusCode (503).
5. Attach the rate limit headers to every response path, including errors.
6. Add .max(50) to the seedUrls Zod array so a single request cannot enqueue unbounded work.
7. Keep the x-request-id header handling and the randomUUID fallback exactly as they are.
8. Stop returning the raw error message in the 500 response. Log it server-side, return a generic
   message. Upstream error text can leak internal details.
9. Do not modify CrawlerOrchestrator, authorization.ts, or rate-limit.ts.

SCOPE
src/app/api/v1/crawler/start/route.ts only.

DONE WHEN
- The string "x-tenant-id" no longer appears in the file.
- `pnpm typecheck` exits 0.
- A request with no session and no valid headers returns 401 and starts no crawl.
- Your report lists every status code the route can now return and the condition for each.
```

---

### T2.3 — Fix broken access control and mock fallbacks on the premium audit route

```
TASK
Rewrite src/app/api/v1/audit/premium/route.ts to use verified identity, rate limiting, and no
fabricated data.

CONTEXT
This route has four defects that must all be fixed together because they are entangled in one
handler:
(a) It reads req.headers.get("x-tenant-id") as authoritative identity with no session or
    membership check, and defaults userId to the literal "usr-premium-default". Any anonymous
    caller can trigger a Firecrawl crawl plus an LLM call against any tenant id.
(b) When FIRECRAWL_API_KEY is missing or a placeholder it enters "mock mode" and returns three
    hardcoded fake Persian pages as if they were a real crawl of the customer's site.
(c) When the Firecrawl call throws, it falls back to a hardcoded fake page, and when the LLM call
    or JSON parse fails it substitutes hardcoded Persian recommendations, so a total upstream
    outage still returns a confident-looking paid audit.
(d) The database INSERT into premium_audits is wrapped in a try/catch that logs and continues, so
    a paid audit can be silently lost. The response also contains hardcoded
    competitorComparison values (industryAverage: 68, topCompetitor: 88) that are not derived
    from anything.
Read src/app/api/v1/rag/query/route.ts first for the correct authorization pattern.
src/lib/rate-limit.ts provides RATE_LIMIT_RULES.auditPremium.

REQUIREMENTS
1. Obtain userId and tenantId only from `await authorizeApiRequest(req)`. Delete the header reads
   and the "usr-premium-default" default. Map AuthorizationError to its statusCode.
2. Apply enforceRateLimit(RATE_LIMIT_RULES.auditPremium, tenantId) before any spend. Map
   RateLimitError to 503. Attach rate limit headers to every response.
3. Delete the mock mode entirely. If FIRECRAWL_API_KEY is missing or a placeholder, return 503
   with a localized message. Never return invented crawl pages.
4. If the Firecrawl call throws or returns an unsuccessful response, return 502. If it returns
   zero pages, return 422. Never substitute a fabricated page.
5. If the LLM call or the JSON parse fails, do NOT substitute hardcoded recommendations. Instead
   return the audit with recommendations: [] and a boolean field semanticAnalysisUnavailable: true
   so the frontend can tell the user the semantic section is missing.
6. Validate the LLM's parsed recommendations: each item must have a priority of exactly "high",
   "medium" or "low" plus string insight and estimatedImpact. Discard anything malformed. Cap at
   20 items.
7. Score semanticCoverage as 0 when no semantic analysis exists, and renormalise the overall score
   across the remaining weights rather than letting a missing component silently drag the grade
   down. Document the renormalisation in a comment.
8. A failed INSERT into premium_audits must return 500. The stored audit is part of the paid
   deliverable and must not be silently dropped.
9. Remove the hardcoded competitorComparison block. It is fabricated data. Note in your report
   that this is a breaking response-shape change and list the frontend files that read it.
10. Pass the real userId into the INSERT's created_by and updated_by instead of the literal
    'system'.
11. Return the generated audit id in the response as auditId.
12. Keep the Persian user-facing messages, the Zod schema, the heuristic scoring formulas, and the
    TenantContextManager.runWithTenantContext wrapper.

SCOPE
src/app/api/v1/audit/premium/route.ts only.

DONE WHEN
- The strings "x-tenant-id", "isMockMode" and "usr-premium-default" no longer appear in the file.
- No hardcoded crawl page, recommendation, or comparison number remains.
- `pnpm typecheck` exits 0.
- Your report lists every status code, its condition, and the frontend files that consume the
  removed competitorComparison field.
```

---

### T2.4 — Rate limit and honestly label the free audit route

```
TASK
Add per-IP rate limiting to src/app/api/v1/audit/free/route.ts and make its mock mode explicit.

CONTEXT
src/app/api/v1/audit/free/route.ts is fully anonymous by design (it is the marketing funnel) and
calls Firecrawl on every request with no limit whatsoever, which is a direct path to runaway
billing or trivial denial of service. It also falls back to hardcoded fake scrape results when
FIRECRAWL_API_KEY is missing or a placeholder, with no signal to the caller that the audit is not
real. src/lib/rate-limit.ts provides RATE_LIMIT_RULES.auditFree (5/hour, ip scope) and
resolveClientIp.

REQUIREMENTS
1. Apply enforceRateLimit(RATE_LIMIT_RULES.auditFree, resolveClientIp(req)) before the Firecrawl
   call. Return the rejection when present. Attach rate limit headers to every response.
2. If resolveClientIp returns null, reject the request with 400 rather than allowing an unlimited
   anonymous call. State this in a comment.
3. Map RateLimitError to its statusCode.
4. Gate the mock fallback on NODE_ENV !== "production". In production, a missing or placeholder
   FIRECRAWL_API_KEY must return 503, not fabricated results.
5. When the development mock path is used, add "mock": true to the response body so the frontend
   can render a "demo data" notice, and log a warning naming the reason.
6. Keep the existing FreeAuditResponse shape apart from the additive optional mock field, keep the
   Zod validation, and keep the Persian messages.
7. Do not modify src/lib/firecrawl.ts.

SCOPE
src/app/api/v1/audit/free/route.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- A sixth request from the same IP inside an hour returns 429 without calling Firecrawl.
- In a production build with no Firecrawl key the route returns 503, never fake data.
- Your report confirms the mock path is unreachable when NODE_ENV === "production".
```

---

### T2.5 — Route security inventory (read-only)

```
TASK
Produce docs/API_SECURITY_INVENTORY.md documenting the authorization and rate-limit status of
every route handler. Change no application code.

CONTEXT
Routes under src/app/api/ have inconsistent security. Some use authorizeApiRequest correctly
(rag/query, dashboard/summary), some read headers directly, and rate limiting has only just been
introduced on three routes. There is no single document showing which routes are protected, so
gaps cannot be prioritised.

REQUIREMENTS
1. Enumerate EVERY file matching src/app/api/**/route.ts, including webhooks and the Inngest
   handler.
2. For each, record in a Markdown table: path, HTTP methods, identity mechanism used (verbatim,
   for example "authorizeApiRequest" / "req.headers.get('x-tenant-id')" / "none"), whether input
   is Zod-validated, whether it is rate limited and with which rule, whether it spends money
   (Firecrawl, LLM, crawl compute, email), whether it writes to the database, and whether the
   query path is tenant-scoped.
3. Add a "Gaps" section ordered by severity: anonymous spend paths first, then unverified tenant
   identity, then missing validation, then missing rate limits.
4. Report only what the code actually does. Do not infer intent from route names or comments.
5. Modify no file under src/.

SCOPE
docs/API_SECURITY_INVENTORY.md only.

DONE WHEN
- Every route.ts file under src/app/api/ appears in the table. State the total count.
- `git diff --stat` shows exactly one added file.
```
**This document drives T2.6. Read it before writing that prompt.**

---

### T2.6 — Close the remaining route gaps

```
TASK
Apply authorizeApiRequest and rate limiting to the routes listed in the Gaps section of
docs/API_SECURITY_INVENTORY.md.

CONTEXT
docs/API_SECURITY_INVENTORY.md, produced in the previous task, lists routes that still lack
verified identity or rate limiting. src/services/auth/authorization.ts provides
authorizeApiRequest and AuthorizationError. src/lib/rate-limit.ts provides checkRateLimit,
enforceRateLimit and RATE_LIMIT_RULES. src/app/api/v1/rag/query/route.ts is the reference
implementation.

REQUIREMENTS
1. Handle ONLY the routes named in the Gaps section. Do not touch any route the document already
   marks as correctly protected.
2. For each: replace direct identity header reads with authorizeApiRequest, and add rate limiting
   with an appropriate existing RATE_LIMIT_RULES entry.
3. If a route needs a limit that has no rule yet, add the rule to RATE_LIMIT_RULES and justify the
   numbers in a comment. Do not invent per-route inline limits.
4. Do NOT add session-based authorization to the payment webhook route. Webhooks authenticate by
   shared secret, not by session. Note it as handled separately.
5. Do not change any route's success response shape.
6. Update docs/API_SECURITY_INVENTORY.md to reflect the new state.
7. If the Gaps section lists more than eight routes, handle the highest-severity eight, update the
   document, and report the remainder as requiring a follow-up session. Do not attempt all of them
   in one change.

SCOPE
Only the route files named in the Gaps section, plus src/lib/rate-limit.ts (rule additions only)
and docs/API_SECURITY_INVENTORY.md.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm build` exits 0.
- Your report lists each route changed, the rule applied, and any routes deferred.
```

---

### T2.7 — Payment webhook idempotency and constant-time secret comparison

```
TASK
Make src/app/api/webhooks/payment/route.ts idempotent and compare its secret in constant time.

CONTEXT
src/app/api/webhooks/payment/route.ts compares the webhook secret with a plain !== string
comparison, which is a timing side channel, and performs no event deduplication, so a retried
payment_success webhook calls addCredits again and grants duplicate credits. Payment providers
retry aggressively, so this is a live double-credit bug rather than a theoretical one. Migration
0019 created the processed_webhook_events table with columns event_id (primary key), provider,
event_type, payload_hash and processed_at.

REQUIREMENTS
1. Replace the secret comparison with crypto.timingSafeEqual over equal-length Buffers. Compare
   digests, not the raw strings, so unequal lengths cannot throw and cannot leak length.
2. Require an event id in the payload. Reject with 400 when absent.
3. Insert the event id into processed_webhook_events BEFORE performing any side effect. Treat a
   unique-violation (PostgreSQL code 23505) as "already processed" and return 200 without
   re-crediting. Acknowledging a duplicate is correct: a non-2xx makes the provider retry forever.
4. Perform the insert and the credit grant in one transaction so a crash between them cannot
   leave the event recorded but the credit ungranted.
5. Store a SHA-256 hash of the raw request body in payload_hash. If the same event id arrives with
   a different payload hash, log an error and return 409.
6. Add the Drizzle definition for processed_webhook_events to the schema if it is missing, and
   export it as sibling tables are exported.
7. Add PAYMENT_WEBHOOK_SECRET to .env.example with an empty value if it is absent.
8. Do not change the credit amounts or the addCredits business logic.

SCOPE
src/app/api/webhooks/payment/route.ts, database/schema (table definition and export only),
.env.example.

DONE WHEN
- `pnpm typecheck` exits 0.
- The same event id delivered twice grants credits exactly once and returns 200 both times.
- Your report confirms the comparison is constant time and names the transaction boundary.
```

**PHASE 2 EXIT GATE.** No unauthenticated path can spend money or write to another tenant. `docs/API_SECURITY_INVENTORY.md` shows zero critical or high gaps. A duplicate webhook grants credits once.

---

## PHASE 3 — Fail loud
*Today a Postgres hiccup looks like "you have no data", and writes silently no-op while reporting success. That is the worst possible failure mode for a paid product.*

### T3.1 — DatabaseUnavailableError and connectivity classification

```
TASK
Add a DatabaseUnavailableError class and an isConnectivityError helper to the Postgres adapter.
Change no existing behaviour yet.

CONTEXT
src/features/admin/infrastructure/persistence/postgres/index.ts (~1380 lines) defines
PostgresClient and OptimisticLockingError. It currently has no way to distinguish "the database
is unreachable" from "the query was wrong", which is why the next three tasks cannot map failures
to correct HTTP status codes. This task only introduces the vocabulary.

REQUIREMENTS
1. Export class DatabaseUnavailableError extends Error with a readonly statusCode = 503 and an
   optional cause. Document in a JSDoc comment that API boundaries must map it to HTTP 503,
   distinct from 500, so infrastructure unavailability is never confused with an empty result.
2. Export isConnectivityError(code: string | undefined, message: string): boolean, matching libpq
   socket codes (ECONNREFUSED, ECONNRESET, ETIMEDOUT, EHOSTUNREACH, ENOTFOUND, EPIPE) and
   PostgreSQL SQLSTATE connection classes (57P01, 57P02, 57P03, 08000, 08001, 08003, 08004, 08006),
   plus a lowercase substring check for "econnrefused", "connection terminated",
   "timeout exceeded when trying to connect" and "getaddrinfo".
3. Place both immediately above the existing OptimisticLockingError declaration.
4. Do NOT change connectClient, query, MockPoolClient, or any repository class in this task.

SCOPE
src/features/admin/infrastructure/persistence/postgres/index.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- `git diff` shows only additions.
```

---

### T3.2 — Stop faking a database connection

```
TASK
Remove the unconditional mock-client fallback from PostgresClient.connectClient.

CONTEXT
In src/features/admin/infrastructure/persistence/postgres/index.ts, connectClient() wraps
`await this.pool.connect()` in a try/catch and on ANY failure logs
"Initialising offline simulation driver" and substitutes `new MockPoolClient()`. MockPoolClient
returns a fabricated { rows: [], rowCount: 0 } whenever the underlying error looks like
ECONNREFUSED. This is an offline development convenience running unconditionally in production
code paths: a database outage becomes empty dashboards and writes that report success while
persisting nothing. DatabaseUnavailableError and isConnectivityError are now available in this
same file.

REQUIREMENTS
1. In connectClient, throw DatabaseUnavailableError on connection failure instead of substituting
   a mock client.
2. Keep the offline driver reachable ONLY when BOTH NODE_ENV !== "production" AND
   process.env.ALLOW_OFFLINE_DB_SIMULATION === "true". Log a warning that says explicitly that
   results from this driver are not real data.
3. In MockPoolClient.query, replace the branch that converts a connectivity error into a fake
   empty result with a throw of DatabaseUnavailableError, using isConnectivityError to classify.
   Even in development, unreachable must look unreachable.
4. Update the MockPoolClient class doc comment to state that it is development-only and describe
   the exact conditions under which it is instantiated.
5. Add ALLOW_OFFLINE_DB_SIMULATION to .env.example with an empty value and a comment stating it
   must never be set in production.
6. Preserve the existing Object.create prototype-chain wrapping, the isQueryTenantScoped check,
   the TenantContextViolationException behaviour, and the release() delegation exactly as they are.
7. Do not modify PostgresClient.query in this task.

SCOPE
src/features/admin/infrastructure/persistence/postgres/index.ts, .env.example.

DONE WHEN
- `pnpm typecheck` exits 0.
- No code path in a production build can produce a MockPoolClient.
- Your report states the exact condition under which the offline driver is now instantiated.
```

---

### T3.3 — Stop faking query results

```
TASK
Remove the swallowed catch that returns a fabricated empty result from PostgresClient.query.

CONTEXT
In src/features/admin/infrastructure/persistence/postgres/index.ts, the non-transactional branch
of PostgresClient.query ends with:
  try { return await this.pool.query(sql, params); }
  catch { return { rows: [], command: "SELECT", rowCount: 0, oid: 0, fields: [] }; }
Every query failure, including syntax errors, permission errors, constraint violations and
outages, becomes an indistinguishable empty result set. Callers cannot tell a genuinely empty
table from a broken database. DatabaseUnavailableError and isConnectivityError are available in
this file.

REQUIREMENTS
1. Classify the caught error. If isConnectivityError matches, throw DatabaseUnavailableError.
   Otherwise log and rethrow the original error unchanged.
2. Never return a synthesised QueryResult.
3. Add a comment explaining that a fabricated empty result is indistinguishable from a
   legitimately empty table and that API routes are responsible for mapping
   DatabaseUnavailableError to 503 and other errors to 500.
4. Do not change the tenant-scoped branch, the isQueryTenantScoped check, the
   TenantContextManager.getRequiredTenantId call, or the activeDbClient delegation.
5. Do not change any repository class in this file.

SCOPE
src/features/admin/infrastructure/persistence/postgres/index.ts only.

DONE WHEN
- No object literal containing `rows: []` is returned from a catch block in this file.
- `pnpm typecheck` exits 0.
- `pnpm build` exits 0.
- Your report notes any call site that visibly relied on the swallow, or states none was found.
```

---

### T3.4 — Fail closed in the tenant context manager

```
TASK
Make TenantContextManager.runWithTenantContext fail when it cannot lease a database client.

CONTEXT
In src/core/database/tenant-context/index.ts, runWithTenantContext calls
pgClient.connectClient() inside a try/catch. The catch logs
"[TenantContextManager] DB connection failed, creating fallback mock client." followed by a
comment reading "// Fallback" — but it never assigns any client. Execution continues with
leasedClient === null, so BEGIN is skipped, set_config('app.current_tenant_id', ...) is skipped,
and the tenant work proceeds outside its RLS isolation boundary. The log message describes
behaviour that does not exist. TenantContextViolationException is already defined in this file.

REQUIREMENTS
1. On a connection failure, log an error and rethrow. Do not swallow.
2. After the try/catch, if leasedClient is still falsy, throw TenantContextViolationException
   stating that tenant isolation cannot be enforced without a database client.
3. Replace the misleading log message and the "// Fallback" comment with an accurate comment
   explaining that a tenant transaction without a real client cannot set app.current_tenant_id
   and therefore cannot enforce RLS.
4. Do not change the transaction-reuse branch, the savepoint logic, the transactionDepth
   bookkeeping, the frozen context objects, or runWithSystemContext.
5. Every `if (leasedClient)` guard downstream in this function is now provably true. Leave those
   guards in place; removing them is out of scope.

SCOPE
src/core/database/tenant-context/index.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- No code path in runWithTenantContext can execute work with a null dbClient.
- Your report quotes the removed log line and the comment that replaced it.
```

---

### T3.5 — API error boundary helper and route mapping (read-only inventory first)

```
TASK
Create a shared API error-to-response mapper and document every route that needs it. Apply it to
no more than five routes.

CONTEXT
Phase 3 made database failures throw DatabaseUnavailableError instead of returning fake empty
results. Routes that previously never saw an exception now can, and most catch-all handlers in
src/app/api/** return a generic 500 with the raw error message. DatabaseUnavailableError carries
statusCode 503. AuthorizationError (src/services/auth/authorization.ts) carries 401/403.
RateLimitError (src/lib/rate-limit.ts) carries 503. TenantContextViolationException
(src/core/database/tenant-context) indicates a server-side programming error, which is 500.

REQUIREMENTS
1. Create src/lib/api-error.ts exporting toApiErrorResponse(error: unknown, context: string):
   NextResponse. Mapping: AuthorizationError -> its statusCode; RateLimitError -> its statusCode;
   DatabaseUnavailableError -> 503; TenantContextViolationException -> 500; ZodError -> 400 with
   the formatted issues; anything else -> 500.
2. It must log the full error server-side with the context string, and return only a generic
   client-safe message. Never return a stack trace or an upstream provider's error text.
3. Create docs/ERROR_BOUNDARY_ROLLOUT.md listing every route.ts under src/app/api/ with a
   checkbox for whether it uses the helper.
4. Apply the helper to at most five routes, chosen as the ones most likely to touch the database.
   Tick their boxes. Leave the rest for follow-up sessions.
5. Do not change any route's success response shape.

SCOPE
src/lib/api-error.ts, docs/ERROR_BOUNDARY_ROLLOUT.md, and at most five files under src/app/api/.

DONE WHEN
- `pnpm typecheck` exits 0.
- Your report names the five routes converted and the count remaining.
```
**Repeat this task in batches of five until the rollout document is fully ticked. One batch per session.**

---

### T3.6 — Health endpoint

```
TASK
Add GET /api/health reporting real dependency status.

CONTEXT
There is no health endpoint, so a database or Redis outage is invisible to monitoring until users
complain. Phase 3 removed the silent fallbacks, so failures now need to actually page someone.
PostgresClient is at src/features/admin/infrastructure/persistence/postgres.
assertSessionConfiguration is exported from src/services/auth/session.ts. Upstash configuration is
read in src/lib/redis.ts.

REQUIREMENTS
1. Create src/app/api/health/route.ts handling GET.
2. Check, and report each independently: database (execute `SELECT 1` with a 2-second timeout),
   Redis (a trivial PING or GET with a 2-second timeout), and session configuration (call
   assertSessionConfiguration and catch).
3. Return 200 when all checks pass, 503 when any fails. The body must name which check failed.
4. Never include a connection string, credential, host name, or raw driver error in the response
   body. Log details server-side only.
5. Add `export const dynamic = "force-dynamic"` so the endpoint is never statically cached.
6. Require no authentication, but return no information beyond per-check ok/failed status and a
   latency figure in milliseconds.

SCOPE
src/app/api/health/route.ts only.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm build` exits 0 and the route is not statically prerendered.
- Your report confirms no secret or host value appears in any response body.
```

**PHASE 3 EXIT GATE.** Stop the database locally: the app must show visible errors and `/api/health` must return 503. No endpoint may return an empty success.

---

## PHASE 4 — SEO foundation
*An SEO product with no sitemap and one title tag across 48 pages is a credibility problem before it is a traffic problem.*

### T4.1 — robots.ts

```
TASK
Add src/app/robots.ts.

CONTEXT
There is no src/app/robots.ts, no robots.txt in public/, and no static robots file anywhere, so
crawlers receive a 404 and every preview deployment is indexable. src/config/site.ts exports
siteConfig with name, description, url ("https://seorchable.ir"), ogImage and links. Routes are
under src/app/[locale]/** with locales fa and en. Next.js 16 supports a MetadataRoute.Robots
default export; read node_modules/next/dist/docs/ to confirm the exact expected shape for this
version before writing the file.

REQUIREMENTS
1. Default-export a function returning MetadataRoute.Robots.
2. When the environment is not production, return a rule disallowing "/" entirely so preview and
   staging deployments never enter an index. Determine production from NEXT_PUBLIC_APP_ENV, then
   VERCEL_ENV, then NODE_ENV, in that order.
3. In production: allow "/" for userAgent "*", and disallow "/api/" plus the authenticated and
   transactional surfaces for BOTH locales: /fa/dashboard, /en/dashboard, /fa/settings,
   /en/settings, /fa/profile, /en/profile, /fa/invoice, /en/invoice, /fa/verify-email,
   /en/verify-email, /fa/forgot-password, /en/forgot-password.
4. Add explicit allow rules for the answer-engine crawlers, since AEO/GEO visibility is this
   product's entire thesis: GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User,
   Google-Extended, ClaudeBot, Claude-User, anthropic-ai, Applebot-Extended, CCBot,
   meta-externalagent. Apply the same disallow list to each.
5. Set sitemap to `${siteConfig.url}/sitemap.xml` and host to siteConfig.url.
6. Do not hardcode the domain. Read it from siteConfig.

SCOPE
src/app/robots.ts only.

DONE WHEN
- `pnpm build` exits 0 and the build output lists /robots.txt as a generated route.
- `pnpm typecheck` exits 0.
- Your report states which env var decided production in your run.
```

---

### T4.2 — sitemap.ts

```
TASK
Add src/app/sitemap.ts enumerating every public route in both locales with hreflang alternates.

CONTEXT
There is no sitemap of any kind. Public page files live under src/app/[locale]/**/page.tsx.
Dynamic segments: src/app/[locale]/services/[slug]/page.tsx whose slugs come from the keys of
servicesData exported by src/data/services.ts (9 slugs), and src/app/[locale]/docs/[slug]/page.tsx
whose slugs come from DOCS_INDEX exported by src/lib/docsIndex.ts, which is generated by
scripts/generate-docs-data.ts and already runs before next build via the "build" script.
Locales are fa and en. siteConfig.url is in src/config/site.ts. Read
node_modules/next/dist/docs/ for the MetadataRoute.Sitemap shape supported by this Next version,
including whether the `alternates.languages` field is supported here.

REQUIREMENTS
1. Default-export a function returning MetadataRoute.Sitemap.
2. Include, for BOTH locales: "" (home), /pricing, /features, /solutions, /solutions/aeo,
   /solutions/geo, /solutions/protection, /solutions/radar, /industries, /resources, /blog, /docs,
   /about, /contact, /privacy.
3. Include every /services/<slug> from Object.keys(servicesData) and every /docs/<slug> from
   DOCS_INDEX. Derive them at build time; do not hardcode any slug list.
4. EXCLUDE all authenticated and transactional routes: dashboard/**, settings, profile, invoice,
   login, register, forgot-password, verify-email, and the (dashboard) route group.
5. Every entry must carry alternates.languages mapping "fa" and "en" to the absolute URL of that
   same path in each locale.
6. Set sensible changeFrequency and priority per route class: home 1.0/daily, pricing and features
   and solutions 0.9/weekly, blog 0.8/daily, services 0.8/weekly, docs 0.5/monthly,
   privacy 0.3/yearly.
7. Do not hardcode the domain. Read it from siteConfig.
8. Do not modify src/lib/docsIndex.ts; it is generated.

SCOPE
src/app/sitemap.ts only.

DONE WHEN
- `pnpm build` exits 0 and lists /sitemap.xml as a generated route.
- The generated XML contains exactly 2 × (15 static + 9 services + <docs count>) <url> entries.
  State the total in your report.
- No excluded route appears in the output.
```

---

### T4.3 — Locale-aware metadata helper

```
TASK
Create src/lib/seo/metadata.ts with a buildPageMetadata helper producing title, description,
canonical, hreflang alternates and Open Graph tags.

CONTEXT
src/app/[locale]/services/[slug]/page.tsx is the ONLY page in the repository with a correct
generateMetadata implementation: locale-aware title and description, Open Graph block, and a
canonical URL. It does not emit hreflang alternates. The remaining 48 pages inherit only the
generic root-layout title and description from src/app/[locale]/layout.tsx. Read the
services/[slug] implementation first and generalise from it. siteConfig is in src/config/site.ts.

REQUIREMENTS
1. Export buildPageMetadata(input): Metadata where input includes: locale, path (the
   locale-relative route, e.g. "/pricing"), title and description as { en, fa } pairs, and
   optional ogImage and noIndex.
2. Emit: title, description, alternates.canonical (absolute, locale-correct),
   alternates.languages with both "fa" and "en" absolute URLs, and an openGraph block with title,
   description, url, siteName, type "website" and locale.
3. Emit a twitter card block with card "summary_large_image".
4. When noIndex is true, emit robots: { index: false, follow: false }.
5. Do not hardcode the domain. Read it from siteConfig.
6. The helper must be importable from a Server Component and must not import anything that pulls
   in React client code.
7. Also add alternates.languages to src/app/[locale]/services/[slug]/page.tsx by refactoring its
   generateMetadata to use the new helper. That page is the proof the helper works.

SCOPE
src/lib/seo/metadata.ts, src/app/[locale]/services/[slug]/page.tsx.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm build` exits 0.
- A built /en/services/seo-audit page contains a canonical link and both hreflang alternates.
  Paste the emitted <head> tags into your report.
```

---

### T4.4 — JSON-LD component and root graph

```
TASK
Add a JsonLd server component with schema builders, and inject the Organization, WebSite and
SoftwareApplication graph into the locale root layout.

CONTEXT
The site emits zero structured data. All JSON-LD code in the repository (src/lib/audit-engine/*,
src/services/technical-seo-analyzer.ts, src/types/seo-signals.ts) analyses OTHER people's sites
for structured data as part of the product; none of it emits JSON-LD on seorchable.ir's own pages.
src/app/[locale]/layout.tsx is already an async Server Component that awaits params to get the
locale, so it can render the graph without any client boundary change. siteConfig is in
src/config/site.ts.

REQUIREMENTS
1. Create src/components/seo/JsonLd.tsx exporting a JsonLd component taking a single object or an
   array. An array must be emitted as a schema.org @graph.
2. Escape "<" as "\\u003c" in the serialised JSON to prevent a </script> breakout.
3. Also export builders: organizationSchema(), websiteSchema(locale),
   softwareApplicationSchema(), pricingSchema(offers, locale), faqSchema(entries) and
   breadcrumbSchema(entries, locale). Give the Organization node a stable @id so other nodes can
   reference it.
4. pricingSchema must take its offers as a parameter. Do NOT hardcode any price. Add a comment
   stating that offers must come from the same source of truth the pricing UI renders.
5. Render <JsonLd data={[organizationSchema(), websiteSchema(locale), softwareApplicationSchema()]} />
   inside the <body> of src/app/[locale]/layout.tsx.
6. websiteSchema must set inLanguage to "fa-IR" or "en-US" from the locale.
7. Add alternates.languages to the existing root layout metadata export so the locale root gets
   hreflang too.
8. This file must NOT be a client component and must not be imported from any "use client" module.
9. Do not touch any file under src/lib/audit-engine/ or src/services/technical-seo-analyzer.ts.
   Those analyse other sites and are unrelated.

SCOPE
src/components/seo/JsonLd.tsx, src/app/[locale]/layout.tsx.

DONE WHEN
- `pnpm build` exits 0.
- The built HTML of /fa and /en each contain exactly one application/ld+json script with all three
  nodes. Paste it into your report.
- Validate the output parses as JSON and state that you did.
```

---

### T4.5 — Convert the homepage to a Server Component

```
TASK
Convert src/app/[locale]/page.tsx to a Server Component with generateMetadata, extracting its
interactive parts into client islands.

CONTEXT
src/app/[locale]/page.tsx is 947 lines, roughly 70KB, and begins with "use client". Because a
client component cannot export metadata or generateMetadata, the homepage ships only the generic
root-layout title and description. Everything hydrates on the client even though most of it is
static marketing content. Interactive elements identified in the file include: an
activeDashboardTab tab switcher, animated counters, a mock dashboard preview, RadialPolarGraph and
LiveKnowledgeGraph (recharts / framer-motion), and platformModules-driven sections.
src/lib/seo/metadata.ts now provides buildPageMetadata. This is the single largest task in the
program: work carefully and change no visual output.

REQUIREMENTS
1. Remove "use client" from src/app/[locale]/page.tsx and make it an async Server Component that
   awaits params for the locale.
2. Export generateMetadata using buildPageMetadata with a homepage-specific fa and en title and
   description. Do not reuse the generic root-layout copy.
3. Extract each interactive region into its own file under
   src/components/marketing/home/ as a small client component, each with its own "use client".
   One concern per file. Keep them as small as possible: pass static content down as props from
   the server page rather than duplicating it inside the island.
4. The rendered output must be visually and behaviourally IDENTICAL. Same DOM structure, same
   class names, same animations, same tab behaviour, both themes, fa RTL and en LTR.
5. Do not change any styling, any design token, or any copy.
6. Do not add a dependency and do not upgrade recharts or framer-motion.
7. Any hook usage (useState, useEffect, useRef, useMemo) must end up inside a client island, never
   in the server page.
8. If a region cannot be extracted without changing behaviour, leave it as a client island
   wrapping that region and explain why in your report. Do not force it.

SCOPE
src/app/[locale]/page.tsx and new files under src/components/marketing/home/ only.

DONE WHEN
- `pnpm typecheck` exits 0.
- `pnpm lint` reports no new errors.
- `pnpm build` exits 0 and the build output shows / as server-rendered rather than fully client.
- The built /fa and /en homepage HTML contains locale-specific <title> and meta description tags.
- Your report lists each extracted island, its file, and why it must be a client component, plus
  the before and after First Load JS figures from the build output.
```

---

### T4.6 — Convert the pricing page and add Product schema

```
TASK
Convert src/app/[locale]/pricing/page.tsx to a Server Component with generateMetadata and
Product/Offer JSON-LD.

CONTEXT
src/app/[locale]/pricing/page.tsx starts with "use client" and therefore cannot export metadata.
It is the highest commercial-intent page on the site and currently shares the generic homepage
title in search results and social shares. src/lib/seo/metadata.ts provides buildPageMetadata.
src/components/seo/JsonLd.tsx provides pricingSchema(offers, locale). The pattern to follow is
the homepage conversion from the previous task.

REQUIREMENTS
1. Convert to an async Server Component and export generateMetadata via buildPageMetadata with
   pricing-specific fa and en copy.
2. Extract only genuinely interactive parts (a monthly/annual toggle, plan comparison
   interactions, any accordion) into client islands under src/components/marketing/pricing/.
3. Render pricingSchema using the SAME plan data the page renders. Locate the existing source of
   the plan and price data in the file and pass it into the builder. Do NOT hardcode prices in the
   schema, and do not invent a price that is not already displayed.
4. If the page contains an FAQ section, also render faqSchema built from that same content.
5. Rendered output must be visually and behaviourally identical in both themes and both locales.
6. Do not change any price, plan name, or feature list.

SCOPE
src/app/[locale]/pricing/page.tsx and new files under src/components/marketing/pricing/ only.

DONE WHEN
- `pnpm build` exits 0.
- The built page has a unique title and description, a canonical link, both hreflang alternates,
  and a Product node whose offer prices match the visible page. Paste the JSON-LD into your report.
```

---

### T4.7 → T4.12 — Convert the remaining marketing pages

Run these as **six separate sessions**. The prompt is identical apart from the `PAGES` list. Batch by shared layout so one session's refactor stays coherent.

| Task | PAGES |
|---|---|
| T4.7 | `features/page.tsx` |
| T4.8 | `solutions/page.tsx`, `solutions/aeo/page.tsx`, `solutions/geo/page.tsx`, `solutions/protection/page.tsx`, `solutions/radar/page.tsx` |
| T4.9 | `about/page.tsx`, `contact/page.tsx`, `privacy/page.tsx` |
| T4.10 | `industries/page.tsx`, `resources/page.tsx` |
| T4.11 | `blog/page.tsx` |
| T4.12 | `docs/page.tsx`, `docs/[slug]/page.tsx` |

```
TASK
Convert the following pages under src/app/[locale]/ to Server Components with per-page
generateMetadata: <PAGES>

CONTEXT
Each listed page currently starts with "use client", which makes exporting metadata impossible, so
all of them ship the generic root-layout title and description. src/lib/seo/metadata.ts provides
buildPageMetadata(locale, path, title, description). src/components/seo/JsonLd.tsx provides
breadcrumbSchema and faqSchema. The homepage and pricing conversions in the previous tasks
established the pattern: read one of them before starting.

REQUIREMENTS
1. For each listed page: remove "use client", make it an async Server Component awaiting params,
   and export generateMetadata via buildPageMetadata with page-specific fa and en title and
   description. Every page must get genuinely distinct copy; do not reuse another page's text and
   do not paraphrase the homepage.
2. Extract interactive regions into client islands colocated under
   src/components/marketing/<page-name>/. One concern per file.
3. For any page nested more than one level below the locale root, also render breadcrumbSchema.
4. For any page containing a visible FAQ section, also render faqSchema built from that same
   visible content. Never invent a question or answer.
5. For a dynamic route, use generateMetadata with the resolved params, not a static metadata
   export, and set the canonical to the specific resolved URL.
6. Rendered output must be visually and behaviourally identical: both themes, fa RTL and en LTR.
7. Change no copy other than adding the metadata strings.
8. Convert ONLY the pages listed above. Do not touch any other page, even one with the same defect.

SCOPE
The listed page files, plus new client-island files under src/components/marketing/.

DONE WHEN
- `pnpm typecheck` exits 0 and `pnpm build` exits 0.
- Every listed route's built HTML has a unique <title>, a unique meta description, a canonical
  link, and both hreflang alternates.
- Your report contains a table: route, title (fa), title (en), islands extracted.
```

---

### T4.13 — Metadata coverage audit

```
TASK
Produce docs/SEO_COVERAGE.md verifying metadata coverage across every route, and fix nothing.

CONTEXT
Phase 4 converted the marketing pages to Server Components with per-page metadata. Some pages were
intentionally left as client components: the dashboard routes, settings, profile, invoice, login,
register, forgot-password and verify-email. Those do not need indexable metadata, but they must be
confirmed as intentional rather than missed.

REQUIREMENTS
1. Enumerate every src/app/[locale]/**/page.tsx.
2. For each, record: route path, "use client" present yes/no, exports metadata or
   generateMetadata yes/no, canonical emitted yes/no, hreflang alternates emitted yes/no, JSON-LD
   present yes/no, present in sitemap yes/no, and a classification of Public or Authenticated.
3. Add a "Remaining gaps" section listing only Public routes with a missing item.
4. Add a "Deliberately excluded" section listing Authenticated routes, confirming each is also
   excluded from the sitemap and disallowed in robots.txt.
5. Verify claims by reading the files. Do not infer from the route name.
6. Change no source file.

SCOPE
docs/SEO_COVERAGE.md only.

DONE WHEN
- Every page.tsx appears in the table. State the total count.
- `git diff --stat` shows exactly one added file.
```

**PHASE 4 EXIT GATE.** `/robots.txt` and `/sitemap.xml` respond. Every public page has a unique title, description, canonical and hreflang. The homepage is server-rendered. `docs/SEO_COVERAGE.md` shows zero public-route gaps.

---

## PHASE 5 — Performance and UX correctness

### T5.1 — Resolve the session server-side to kill the auth flash

```
TASK
Resolve the session in the locale layout and pass it into AuthProvider as initial state.

CONTEXT
src/components/AuthProvider.tsx initialises session.status to "loading" and only resolves it after
a useEffect calls getServerSessionAction(). Any layout or component gating on session.status
therefore flashes a loading or unauthenticated state on every hard navigation, even though the
session cookie is fully server-verifiable at request time. src/app/[locale]/layout.tsx is already
an async Server Component that awaits params. getServerSessionAction is exported from
src/app/actions/auth.ts and getSession from src/services/auth/session.ts.

REQUIREMENTS
1. In src/app/[locale]/layout.tsx, resolve the session on the server and pass it to AuthProvider
   as an initialSession prop.
2. AuthProvider must initialise its state from initialSession instead of "loading", and must not
   re-fetch on mount when initialSession is present.
3. Keep the client-side refresh path for use after login, logout and register, so state stays
   correct within a session without a reload.
4. If initialSession is absent (for example in a test render), preserve the current
   fetch-on-mount behaviour as a fallback.
5. Do not change the session cookie format, the User or Session types, or any authorization logic.
6. Serialising the session into the client bundle must expose only what the client already receives
   today: id, name, email, role, workspaceId. Never pass a token, hash or secret across the
   boundary. State explicitly in your report which fields cross it.

SCOPE
src/app/[locale]/layout.tsx, src/components/AuthProvider.tsx.

DONE WHEN
- `pnpm typecheck` exits 0 and `pnpm build` exits 0.
- A hard reload of an authenticated dashboard route shows no unauthenticated or loading flash.
- Your report lists the exact fields serialised to the client.
```

---

### T5.2 — Memoization pass on the heaviest client islands

```
TASK
Add memoization boundaries to the homepage and dashboard client islands.

CONTEXT
93 files in the repository use "use client" and only 5 use useMemo, useCallback or React.memo. The
heaviest offenders are the homepage islands extracted in Phase 4: the platformModules-driven
sections, the dashboard tab data, RadialPolarGraph and LiveKnowledgeGraph. Recharts and
framer-motion children re-render on every parent state change because the arrays and objects
passed to them are recreated on each render. Do this AFTER the Phase 4 conversion, so you are
memoizing small islands rather than a 947-line monolith.

REQUIREMENTS
1. Memoize with useMemo every derived array or object passed as a prop to a recharts or
   framer-motion child.
2. Wrap purely presentational children in React.memo. Do not wrap a component whose props include
   a newly-created inline object or function on every render: fix the prop first, otherwise
   React.memo is useless.
3. Wrap event handlers passed as props in useCallback, with correct dependency arrays.
4. Split the activeDashboardTab state so switching tabs re-renders only the tab panel, not the
   whole section.
5. Do not change any rendered output, animation timing, or interaction behaviour.
6. Do not memoize a component whose props change on every render anyway. Adding a useless
   comparison costs more than it saves. Say in your report which candidates you rejected and why.
7. Do not add a dependency and do not introduce a state management library.

SCOPE
Files under src/components/marketing/home/, src/components/visualization/, and
src/components/features/dashboard-home/ only.

DONE WHEN
- `pnpm typecheck` exits 0 and `pnpm lint` reports no new errors (react-hooks/exhaustive-deps
  included).
- Behaviour is unchanged: tab switching, animations, charts.
- Your report lists each memoization added, and each candidate rejected with the reason.
```

---

### T5.3 — Images through next/image, with a11y enforced by lint

```
TASK
Route all raster imagery through next/image with mandatory alt text, and make the a11y rule
build-blocking.

CONTEXT
Only src/components/DashboardShell.tsx uses next/image. A repository-wide grep found zero raw <img>
tags in src/ and only one file with an alt attribute in src/components, meaning marketing imagery
is referenced through CSS backgrounds or inline styles instead. That gives no automatic
width/height reservation (cumulative layout shift) and no systematic alt text (accessibility).
public/ contains logo-horse.png, placeholder-logo.png, placeholder-user.jpg, placeholder.jpg,
several svg files and a logos/ directory. eslint-config-next 16.2.11 is already a devDependency
and bundles jsx-a11y.

REQUIREMENTS
1. Find every place a raster image (png, jpg, jpeg, webp, avif) is referenced from src/, including
   CSS background-image declarations, inline style objects, and dynamically built src strings.
2. Convert each to next/image with either explicit width and height, or fill plus an explicitly
   sized parent. Every one needs a meaningful alt. Decorative images get alt="" plus
   aria-hidden="true", never a missing alt attribute.
3. Leave inline SVG and svg-as-component usage alone. next/image adds nothing there.
4. In eslint.config.mjs, enable jsx-a11y/alt-text as "error" so it blocks the build.
5. Also enable, as errors: jsx-a11y/anchor-is-valid, jsx-a11y/aria-props and
   jsx-a11y/role-has-required-aria-props.
6. Fix every violation the new rules surface. If a violation requires a change outside the image
   layer, report it instead of fixing it.
7. Verify next.config.ts permits any remote host you introduce. Do not add a remote host that is
   not already used.
8. Do not change any layout dimension or visual appearance.

SCOPE
eslint.config.mjs, next.config.ts (images config only if required), and the component files
containing image references.

DONE WHEN
- `pnpm lint` exits 0 with the new rules active.
- `pnpm build` exits 0.
- Your report lists every image converted and every new lint violation fixed.
```

---

### T5.4 — Performance budget

```
TASK
Record a performance budget in docs/PERFORMANCE_BUDGET.md from the real build output.

CONTEXT
There is no written performance target, so a regression cannot be detected. Phase 4 server-rendered
the marketing pages and Phase 5 added memoization; this task captures the resulting numbers as the
baseline to defend.

REQUIREMENTS
1. Run `pnpm build` and record the First Load JS for every route in the output table.
2. Create docs/PERFORMANCE_BUDGET.md containing: the full measured table, a budget of measured
   value plus 10% for each public route, and an explicit statement of the shared-chunk size.
3. Add a "Largest contributors" section naming the heaviest routes and, from the build output, the
   packages driving their size.
4. Record only measured values. Do not estimate, and do not report a Lighthouse score you did not
   run.
5. If any public route exceeds 250KB First Load JS, list it under "Requires follow-up" with the
   figure. Do not attempt to fix it in this task.

SCOPE
docs/PERFORMANCE_BUDGET.md only.

DONE WHEN
- The document contains real build output, not estimates.
- No source file changed.
```

---

## PHASE 6 — Test coverage on the things that broke

### T6.1 — Test infrastructure inventory (read-only)

```
TASK
Document the existing test setup in docs/TEST_STRATEGY.md. Write no tests.

CONTEXT
package.json defines exactly one test script: "test:acquisition":
"tsx tests/features/acquisition/run-all.ts". There is no Jest, Vitest, or Playwright configuration
visible in package.json devDependencies. Tests live under tests/. Phase 1 added a test file for
src/lib/password.ts. Before adding more tests, the actual runner, structure and conventions need
to be established from evidence rather than assumed.

REQUIREMENTS
1. Enumerate everything under tests/ and describe how each suite is invoked and how it asserts.
2. Identify the actual test runner and assertion mechanism in use. Quote the code that provides it.
3. Document the conventions an added test must follow: file location, naming, how to run a single
   suite, how failures are signalled.
4. List which of the following have zero coverage today: password hashing, loginAction,
   registerAction, authorizeApiRequest, rate limiting, tenant isolation, API route contracts.
5. Recommend ONE runner for new unit tests, with a justification grounded in what is already
   installed. Do not install it in this task.
6. Change no source file and add no dependency.

SCOPE
docs/TEST_STRATEGY.md only.

DONE WHEN
- The document names the real runner with a code citation.
- `git diff --stat` shows exactly one added file.
```

---

### T6.2 — Authentication regression tests

```
TASK
Add tests covering the authentication defects fixed in Phase 1.

CONTEXT
Phase 1 fixed a login path that issued a session for any known email address with no credential
check. Nothing currently prevents that regression from returning. docs/TEST_STRATEGY.md documents
the runner and conventions this repository actually uses. src/services/auth/session.ts exports
setCookiesMock for cookie injection in tests.

REQUIREMENTS
1. Follow the runner and conventions recorded in docs/TEST_STRATEGY.md exactly. Do not introduce a
   second test framework.
2. Cover, at minimum:
   - loginAction with a correct password succeeds and creates a session
   - loginAction with a wrong password throws and creates NO session
   - loginAction for an unknown email throws the IDENTICAL error message as a wrong password
   - loginAction for a user with a NULL password_hash always fails
   - registerAction rejects a policy-violating password and writes no user, org or membership row
   - registerAction stores a hash, never the plaintext
   - the account lockout threshold engages and a successful login resets the counters
2b. Assert the identical-error property by comparing the two thrown messages directly, not by
   eyeballing them.
3. Use the repository's existing database test approach as documented in docs/TEST_STRATEGY.md. If
   there is no database test harness, isolate the query layer with a seam and state clearly in your
   report that these are unit tests, not integration tests.
4. Add a package.json script to run this suite.
5. Do not modify src/app/actions/auth.ts or src/services/auth/session.ts. If a test cannot be
   written without a production change, report it as BLOCKED rather than changing production code.

SCOPE
New files under tests/, plus one package.json script.

DONE WHEN
- The suite runs and passes. Paste the output.
- Reverting the loginAction password check makes at least three tests fail. Verify this locally and
  state which tests fail.
```

---

### T6.3 — Tenant isolation and authorization tests

```
TASK
Add tests proving cross-tenant access is refused and rate limits engage.

CONTEXT
Phase 2 replaced client-header identity with authorizeApiRequest on the crawler-start and
premium-audit routes, and added rate limiting. Nothing currently proves either holds.
src/services/auth/authorization.ts exports authorizeApiRequest, requireWorkspaceMembership,
requireRole and AuthorizationError. src/lib/rate-limit.ts exports checkRateLimit and
RATE_LIMIT_RULES. docs/TEST_STRATEGY.md documents the runner.

REQUIREMENTS
1. Cover authorizeApiRequest: no session and no headers -> AuthorizationError 401; headers naming a
   tenant the user is not a member of -> AuthorizationError 403; a valid session -> identity from
   the session, and the session wins over any conflicting x-tenant-id header.
2. Cover requireWorkspaceMembership: a user id mismatch against the session -> 403; a super_admin
   -> allowed for any workspace; a non-member -> 403.
3. Cover checkRateLimit: the Nth request inside the window is allowed and the (N+1)th is not; a
   missing identifier throws; and in a simulated production environment with no Redis configured it
   throws rather than allowing the request.
4. The header-override test is the specific regression guard for the vulnerability fixed in Phase 2.
   Name it so that intent is obvious to a future reader.
5. Follow docs/TEST_STRATEGY.md conventions. Add a package.json script.
6. Do not modify authorization.ts or rate-limit.ts.

SCOPE
New files under tests/, plus one package.json script.

DONE WHEN
- The suite runs and passes. Paste the output.
- Your report explains how each test would fail if the Phase 2 fix were reverted.
```

---

### T6.4 — Wire the test suites into CI

```
TASK
Add the new test suites to the GitHub Actions workflow and remove any continue-on-error escapes
that are no longer needed.

CONTEXT
.github/workflows/ci.yml runs install, typecheck, lint and build. It may carry
continue-on-error: true on typecheck or lint, added in Phase 0 because docs/BASELINE.md recorded
pre-existing failures. Phases 1 through 6 added test scripts to package.json.

REQUIREMENTS
1. Add a step for every test script now defined in package.json.
2. Run `pnpm typecheck` and `pnpm lint` locally. If both now exit 0, remove their
   continue-on-error and the associated TODO comments. If either still fails, leave the escape and
   record the current error count in docs/BASELINE.md.
3. Tests requiring a live database must be in a separate job that is skipped when the connection
   secret is absent, not one that fails. State which suites need a database.
4. Never place a real credential in the workflow file. Reference GitHub secrets by name only.
5. Do not modify any test file or any source file.

SCOPE
.github/workflows/ci.yml, docs/BASELINE.md.

DONE WHEN
- Every package.json test script appears as a workflow step.
- The YAML is valid.
- Your report states which escapes were removed and which remain, with counts.
```

---

## PHASE 7 — Production readiness

### T7.1 — Deployment checklist

```
TASK
Create docs/DEPLOYMENT.md: a required-configuration and pre-launch checklist derived from the code.

CONTEXT
Environment variables now have hard runtime requirements that did not exist before: SESSION_SECRET
throws in production when missing (Phase 1), the rate limiter returns 503 in production without
Upstash configuration (Phase 2), the audit routes return 503 without a real FIRECRAWL_API_KEY
(Phase 2), and ALLOW_OFFLINE_DB_SIMULATION must never be set in production (Phase 3). None of this
is documented anywhere.

REQUIREMENTS
1. Derive the variable list by searching the code for process.env. Do not copy .env.example: verify
   each variable is actually read, and name the file and line that reads it.
2. For each: name, purpose, required or optional, the exact consequence of omitting it in
   production (quote the failure), and how to generate it if applicable. Never include a value.
3. Add a migration section: how to run migrations using MIGRATION_DATABASE_URL via the dedicated
   script, and an explicit statement that migrations must never run during next build, on deploy,
   or at application startup.
4. Add a pre-launch checklist: robots.txt returns the production ruleset, sitemap.xml resolves,
   /api/health returns 200, SESSION_SECRET is set and at least 32 characters, Upstash is reachable,
   all migrations through the highest number are applied, and NEXT_PUBLIC_APP_ENV=production.
5. Add a rollback section describing how to revert a deploy and what to check afterwards.
6. Report only verified behaviour. If you cannot verify a consequence from the code, mark it
   "unverified" rather than guessing.

SCOPE
docs/DEPLOYMENT.md only.

DONE WHEN
- Every documented variable cites the file and line that reads it.
- No secret value appears anywhere in the document.
```

---

### T7.2 — Load test the metered endpoints

```
TASK
Load test the rate-limited public endpoints and record the results in docs/LOAD_TEST.md.

CONTEXT
Phase 2 added rate limiting to /api/v1/audit/free (5/hour per IP), /api/v1/audit/premium
(20/hour per tenant) and /api/v1/crawler/start (10/hour per tenant). The limits have never been
exercised under concurrency, so it is unknown whether the fixed-window INCR path holds under
parallel load or whether requests slip past the boundary.

REQUIREMENTS
1. Write the load script under scripts/load-test/ using only tooling already available in the
   repository or Node's standard library. Do not add a dependency.
2. For each endpoint: fire the limit plus 20 requests, both sequentially and with concurrency 20,
   and record how many were allowed, how many returned 429, and the observed latency distribution.
3. Verify that concurrent bursts do not exceed the limit. A fixed-window INCR should hold; if it
   does not, record the exact over-admission count. That is a finding, not a failure to hide.
4. Verify the boundary behaviour: the request immediately after a window rolls over must be
   allowed.
5. Verify that Upstash being unreachable produces 503 and not 200.
6. Point the script at a local or staging deployment. Never run it against production, and never
   let it make a real Firecrawl or LLM call: stub the upstream or use an invalid target URL that
   fails before spend. State which approach you used.
7. Record measured results only. No projections.

SCOPE
scripts/load-test/** and docs/LOAD_TEST.md.

DONE WHEN
- docs/LOAD_TEST.md contains real measurements for all three endpoints under both patterns.
- Your report states whether any request exceeded its limit under concurrency.
```

---

### T7.3 — Rewrite the README pair

```
TASK
Replace README.md with a Persian project overview and add README-ENG.md as its English counterpart.

CONTEXT
The current README.md is the untouched v0 scaffold: it describes a generic Next.js starter, links
to a v0 project chat, and says nothing about SEOrchable, its purpose, its architecture, or how to
run it. The product is Persian-first (fa is the default locale, RTL), so the primary README is
Persian and the English one is the secondary.

REQUIREMENTS
1. README.md in Persian, README-ENG.md in English. Same structure and equivalent content in both.
2. Cover: what the product does and who it is for, the AEO/GEO/SEO positioning, the architecture
   and directory map, prerequisites, setup, the required environment variables (names only), the
   database migration procedure, the command reference, the testing approach, and a link to
   AGENTS.md for agent contributors.
3. Every command and path must be verified against package.json and the real directory tree.
4. Describe only implemented functionality. Do not document a planned feature as shipped. If you
   are unsure whether something works, leave it out.
5. Remove every v0 scaffold reference and the v0 project link.
6. Cross-link the two files at the top of each.
7. Persian text must read as native technical Persian, not a literal translation. Keep established
   English technical terms (Next.js, PostgreSQL, Drizzle, AEO, GEO) in Latin script.

SCOPE
README.md, README-ENG.md.

DONE WHEN
- Every command in both files exists in package.json.
- Every path in both files exists in the repository.
- No secret value and no v0 reference appears in either file.
```

---

### T7.4 — Launch gate

```
TASK
Produce docs/LAUNCH_GATE.md: a verified pass/fail audit of every Point B exit condition.

CONTEXT
This is the final task of the program. Every preceding phase claimed an exit condition. This task
verifies each one against the current code and marks it PASS, FAIL or UNVERIFIED. It changes no
application code.

REQUIREMENTS
1. Verify each item by reading the code or running a command, and cite the file and line or paste
   the command output for every single one:
   - No code path reaches createSession without a successful password verification
   - No route under src/app/api/ reads x-tenant-id or x-user-id as authoritative identity
   - No production code path returns fabricated data on a dependency failure (search for
     `catch` blocks returning literals, `Math.random()`, and hardcoded fallback arrays)
   - Every metered endpoint applies a rate limit before spending
   - PostgresClient never returns a synthesised QueryResult
   - runWithTenantContext cannot execute with a null client
   - robots.txt and sitemap.xml are generated
   - Every public route has a unique title, description, canonical and hreflang
   - JSON-LD renders on the locale root and on pricing
   - SESSION_SECRET is enforced in production
   - CI blocks merge on typecheck, lint, tests and build
   - /api/health reports real dependency status
2. Mark UNVERIFIED, never PASS, for anything you cannot confirm from evidence.
3. Add a "Blocking before launch" section containing every FAIL, ordered by severity.
4. Change no source file.

SCOPE
docs/LAUNCH_GATE.md only.

DONE WHEN
- Every item carries a citation or command output.
- `git diff --stat` shows exactly one added file.
```

---

## Prompt chain ledger

Track every task here. A row is only closed when the PR is merged to `main`.

| # | Task | Depends on | Merged | PR |
|---|---|---|---|---|
| — | Commit `AGENTS.md` + `.env.example` (manual) | — | ☐ | |
| T0.1 | Repository hygiene sweep | — | ☐ | |
| T0.2 | Delete drifted schema duplicate | T0.1 | ☐ | |
| T0.3 | Typecheck script + baseline | T0.2 | ☐ | |
| T0.4 | CI quality gate | T0.3 | ☐ | |
| T1.1 | Credential columns + migration | T0.4 | ☐ | |
| T1.2 | `password.ts` + tests | T1.1 | ☐ | |
| T1.3 | `registerAction` password | T1.2 | ☐ | |
| T1.4 | `loginAction` verification | T1.3 | ☐ | |
| T1.5 | Client auth layer wiring | T1.4 | ☐ | |
| T1.6 | `SESSION_SECRET` enforcement | T1.5 | ☐ | |
| T1.7 | Login rate limit + lockout | T1.6, T2.1 | ☐ | |
| T1.8 | Password reset tokens | T1.7 | ☐ | |
| T1.9 | Email verification tokens | T1.8 | ☐ | |
| T2.1 | Rate limiter | T0.4 | ☐ | |
| T2.2 | Crawler start access control | T2.1 | ☐ | |
| T2.3 | Premium audit access control | T2.2 | ☐ | |
| T2.4 | Free audit rate limit | T2.3 | ☐ | |
| T2.5 | Route security inventory | T2.4 | ☐ | |
| T2.6 | Close remaining route gaps | T2.5 | ☐ | |
| T2.7 | Webhook idempotency | T2.6 | ☐ | |
| T3.1 | `DatabaseUnavailableError` | T2.7 | ☐ | |
| T3.2 | Stop faking connections | T3.1 | ☐ | |
| T3.3 | Stop faking query results | T3.2 | ☐ | |
| T3.4 | Tenant context fails closed | T3.3 | ☐ | |
| T3.5 | Error boundary rollout (repeat) | T3.4 | ☐ | |
| T3.6 | Health endpoint | T3.5 | ☐ | |
| T4.1 | `robots.ts` | T3.6 | ☐ | |
| T4.2 | `sitemap.ts` | T4.1 | ☐ | |
| T4.3 | Metadata helper | T4.2 | ☐ | |
| T4.4 | JSON-LD + root graph | T4.3 | ☐ | |
| T4.5 | Homepage → server component | T4.4 | ☐ | |
| T4.6 | Pricing + Product schema | T4.5 | ☐ | |
| T4.7 | Convert `features` | T4.6 | ☐ | |
| T4.8 | Convert `solutions/*` | T4.7 | ☐ | |
| T4.9 | Convert `about`/`contact`/`privacy` | T4.8 | ☐ | |
| T4.10 | Convert `industries`/`resources` | T4.9 | ☐ | |
| T4.11 | Convert `blog` | T4.10 | ☐ | |
| T4.12 | Convert `docs` | T4.11 | ☐ | |
| T4.13 | SEO coverage audit | T4.12 | ☐ | |
| T5.1 | Server-side session resolution | T4.13 | ☐ | |
| T5.2 | Memoization pass | T5.1 | ☐ | |
| T5.3 | `next/image` + a11y lint | T5.2 | ☐ | |
| T5.4 | Performance budget | T5.3 | ☐ | |
| T6.1 | Test infrastructure inventory | T5.4 | ☐ | |
| T6.2 | Auth regression tests | T6.1 | ☐ | |
| T6.3 | Isolation + rate limit tests | T6.2 | ☐ | |
| T6.4 | Tests into CI | T6.3 | ☐ | |
| T7.1 | Deployment checklist | T6.4 | ☐ | |
| T7.2 | Load test | T7.1 | ☐ | |
| T7.3 | README pair | T7.2 | ☐ | |
| T7.4 | Launch gate | T7.3 | ☐ | |

---

## Operating notes

**Sequencing exception.** `T1.7` depends on `T2.1` (the rate limiter). Either run `T2.1` immediately after `T1.6` and come back for `T1.7`, or defer `T1.7` until Phase 2 is done. Everything else is strictly linear.

**Repeat-until-done tasks.** `T3.5` and `T2.6` are batched by design. Re-run the same prompt in a fresh session until the tracking document is fully ticked. Never widen the batch to finish faster: a 40-file diff is not reviewable, and an unreviewed diff is how the current defects got in.

**When Jules reports BLOCKED.** That is the guardrails working. Read what evidence it says is missing, supply it in a follow-up message in the same session, or split the task. Do not tell it to proceed anyway.

**When a plan looks too big.** Reject it before approving. A plan touching more than five files for a task scoped to one or two means Jules has misread the scope. Re-state the `SCOPE` block and ask for a revision.

**If a session fails midway.** Discard the branch and re-run the prompt fresh. Do not try to steer a half-finished session back on course; the context is already polluted.

**Realistic pace.** With review discipline, 2 to 4 tasks a day. Phase 0 through 3 (the security and reliability work) is roughly two weeks. Phase 4 is the longest single stretch because `T4.5` and `T4.6` are genuine refactors, not edits. All 53 rows: 5 to 7 weeks. Anyone promising three days has not read `src/app/[locale]/page.tsx`.
