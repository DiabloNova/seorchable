# Seorchable Repository Agent Instructions

## 1. Source of Truth
The current repository implementation is the primary source of truth. Inspect actual code, configuration, dependencies, routes, migrations, tests, and deployment files before acting. Documentation, comments, README claims, old audits, task descriptions, and prior agent reports are not proof of implementation.

When documentation conflicts with implementation, trust the implementation and report the discrepancy. Do not change working code merely to match documentation unless the current task explicitly requires it.

## 2. Inspect Before Editing
Before modifying code, locate the relevant files, read the implementation, trace dependencies and consumers, inspect related tests, and check configuration. Do not guess file locations, APIs, routes, data models, or architecture when the repository can answer the question.

Before editing a high-risk boundary, inspect both sides of the boundary: callers and consumers, persistence and migrations, server and client code, configuration and deployment behavior, and existing security controls.

## 3. Task Scope
Implement only the current task and the minimum supporting changes required for correctness, security, tests, migrations, and integration. Do not refactor unrelated code, redesign unrelated features, migrate architecture, rename unrelated components, upgrade dependencies without a requirement, or introduce speculative features.

A supporting change is in scope only when the requested objective cannot be correctly completed without it. Otherwise, report the discovery instead of absorbing it into the task.

## 4. Preserve Existing Architecture
Prefer existing components, utilities, services, repositories, feature modules, abstractions, design tokens, validation mechanisms, and persistence boundaries. Extend an existing implementation rather than introducing a parallel implementation when it can be done safely.

Do not replace an established production mechanism with a mock, stub, in-memory store, hard-coded data, temporary bypass, or silent fallback merely to make a task pass.

## 5. Next.js and Server Boundaries
Inspect the installed Next.js version and follow repository-supported APIs. The repository currently uses Next.js 16; do not assume APIs from another version.

Keep server-only functionality on the server. Never expose database credentials, API keys, private tokens, secrets, or privileged operations to client code. Do not add client boundaries unless required by the existing architecture and the task.

Treat Server Actions, Route Handlers, API endpoints, server components, and client components as explicit trust boundaries. Validate and authorize data at the server boundary even when the caller is an internal UI.

## 6. Authentication and Authorization
Authentication and authorization are security boundaries. Protected operations must enforce access server-side. Client redirects, hidden UI, middleware-only checks, or client-provided roles/tenant IDs are not authorization.

Preserve the repository's intended authentication model and trace the complete lifecycle: sign-up, credential validation, session creation, cookie issuance, session lookup, protected-request authorization, logout, expiry/revocation, email verification, password reset, and OAuth/provider callbacks where applicable.

For password authentication, use the repository's existing password-hashing mechanism and never store or log plaintext passwords. For token-based verification or reset flows, store only a cryptographic token hash when the architecture permits it; make tokens single-use, expire them, bind them to the intended user/purpose, and consume them atomically.

For cookie-based sessions, enforce the required session secret and fail closed when it is missing or invalid. Use appropriate `HttpOnly`, `Secure`, `SameSite`, `Path`, expiry, and rotation/revocation behavior for the deployment model. Do not silently fall back to a weak or development-only secret in production.

State-changing authenticated requests must have an appropriate CSRF defense for the session model. Do not weaken cookie or CSRF protections merely to make local authentication work.

Do not reveal sensitive authentication material in URLs, responses, logs, client bundles, error messages, or analytics. Authentication failures should not unnecessarily disclose whether sensitive account data exists.

Rate limiting, replay prevention, session invalidation, and account enumeration protections must be preserved where already implemented and added when explicitly required by the security model or task.

## 7. Multi-Tenancy and Data Isolation
Never trust a client-provided tenant identifier as sufficient authorization. Tenant access must be resolved and validated server-side from authenticated identity and repository-approved context.

Do not introduce queries or repository operations that can return another tenant's data. Preserve database-level isolation, transactions, and tenant-context requirements. Every tenant-scoped read, write, update, delete, export, and background job must use the same authorization boundary.

## 8. Database and Persistence
Inspect the current persistence architecture before changing it. Preserve tenant isolation, transactions, validation, repository boundaries, migration safety, and database-level security.

Schema changes require an explicit migration when the repository uses migrations. Keep schema definitions, migrations, generated metadata, and application code consistent. Do not use `db:push` as a substitute for a required committed migration unless the task explicitly calls for it.

When adding authentication or security tables, prefer an actual foreign key to the canonical user record where the existing schema supports it. Define appropriate uniqueness, indexes, expiry, ownership, and lifecycle constraints based on the existing architecture.

Never replace production persistence with in-memory or mock storage.

## 9. Environment Variables and Secrets
Never commit, hard-code, print, log, return, or expose credentials, tokens, API keys, passwords, private keys, session secrets, or other secret values.

Inspect environment variable names and usage only. Required production settings must fail closed when missing, malformed, or unsafe. Never add a silent security fallback.

Never commit `.env` contents or generated files containing secrets. Preserve the repository's secret-hygiene checks.

## 10. External Services and AI
Inspect the actual provider integration before changing it. Preserve authentication, API contracts, validation, error handling, cost controls, retries, timeouts, and server/client boundaries.

Provider failure must produce an explicit failure state or safe fallback already defined by the product; it must never become fabricated product data presented as real provider output.

## 11. URL Fetching and SSRF
All server-side fetching of user-provided URLs must use the repository's approved SSRF protection. Reject private networks, loopback, link-local, metadata endpoints, unexpected protocols, unsafe redirects, and DNS-based bypasses.

Do not introduce unrestricted outbound fetching, even temporarily for debugging or tests. Test SSRF defenses against redirects, alternate IP representations, DNS rebinding where relevant, and IPv4/IPv6 edge cases when the implementation claims to protect against them.

## 12. Localization and UI
The application supports Persian RTL and English LTR, plus light and dark themes. Preserve locale routing, translations, responsive behavior, accessibility, RTL/LTR correctness, design tokens, and both themes.

Do not hard-code user-visible strings when the existing localization architecture provides a translation path. Do not assume LTR layout when modifying shared components.

## 13. Dependencies
Before adding a dependency, verify the repository does not already provide the capability. Do not upgrade dependencies without explicit task scope. Keep the manifest, lockfile, imports, and build configuration consistent.

Do not add a dependency solely to avoid understanding or extending an existing repository mechanism.

## 14. API and Data Contracts
Before changing an API or persisted shape, inspect implementation, consumers, request and response structures, validation, authorization, migrations, and tests.

Preserve backwards compatibility where required by existing consumers. If a breaking change is necessary, identify every affected consumer and make the contract change explicit. Do not silently change field meaning, authentication requirements, status codes, error shapes, or persisted semantics.

## 15. Testing and Validation
Use the repository's actual scripts. Do not invent commands when `package.json` provides the correct one. At minimum, run the checks relevant to the changed boundary and run the production build for changes that can affect compilation, routing, server/client boundaries, or deployment behavior.

The repository currently exposes scripts for `lint`, acquisition tests, database migration/generation, and secret hygiene. Inspect `package.json` before deciding which checks apply.

For authentication/security changes, prefer tests that exercise the real boundary rather than only testing isolated helpers: invalid credentials, successful authentication, session creation and lookup, logout/revocation, expiry, protected access, token expiry/reuse, authorization failures, and relevant cookie/security attributes.

Never claim a validation step passed unless it actually ran. Never weaken, delete, skip, or rewrite tests solely to make a change pass.

## 16. Change Hygiene
Review the final diff. Verify every changed file, remove unrelated changes, debug code, temporary files, logs, patch rejects, backup copies, unused imports, generated artifacts that should not be committed, and accidental architectural changes.

If the working tree already contains unrelated user changes, do not overwrite or revert them. Isolate the task changes and report pre-existing modifications when they materially affect validation or the final diff.

## 17. Documentation Governance
Documentation describes implementation; it does not define it. Do not document planned functionality as implemented.

When code and documentation disagree, report the mismatch and update documentation only when explicitly required or when the task itself is documentation maintenance.

## 18. High-Risk Changes
Authentication, authorization, tenant isolation, migrations, persistence, API contracts, route restructuring, localization architecture, security controls, dependencies, framework upgrades, deployment, and environment variables require explicit task scope and focused review.

For high-risk changes, identify the affected trust boundaries, failure modes, rollback considerations, and validation before declaring completion.

## 19. Definition of Done
A task is complete only when the requested objective is satisfied, existing architecture is respected, scope has not expanded, relevant validation has run, security boundaries are not weakened, localization remains functional, no secrets are introduced, the final diff is reviewed, and the report accurately describes the work.

A task is not complete merely because the code compiles or the happy path works.

## 20. Bilingual Documentation and RTL Safety
All explanations, analyses, requirements, risks, dependencies, acceptance criteria, and instructions for human readers in Persian documents must be written in Persian. Do not mix English prose into a Persian sentence.

Copy-paste prompts, executable agent instructions, shell commands, identifiers, file paths, URLs, and code must remain in English and must be isolated inside a visually distinct left-to-right block or isolated code span. Do not place English prose inline inside a Persian paragraph.

Technical terms may remain in English only when they are identifiers, commands, file paths, product names, protocol names, or exact API terms. Do not translate technical concepts into inaccurate or non-native equivalents. Do not use English words as decorative substitutes for Persian explanations.

Before delivery of a Persian document, inspect bidirectional rendering. Verify that punctuation, code, paths, URLs, numbered lists, tables, and every copy-paste block render in the intended order.

## 21. Execution Alignment and Self-Monitoring
Mandatory for Jules and every coding agent operating in this repository.

Before the first edit of every task, create an Alignment Record in the task report. It must contain at least these six items:
1. Objective
2. Non-objectives
3. Scope
4. Verified preconditions
5. Security/architecture boundaries touched
6. Exact verification plan

Every action must remain compatible with these six invariants:
1. Project objective
2. Task objective
3. Task scope
4. Existing architecture
5. Security and production readiness
6. Prerequisite order

If any invariant cannot be satisfied or verified, stop before making the related change. Do not continue through uncertainty by guessing.

Stop immediately for: conflict with the project or task objective; out-of-scope changes; unrelated refactoring; bypassed architecture; weakened security; violated tenant isolation; silent fallbacks; fabricated data; client-authoritative security decisions; or downstream work performed before its prerequisites.

When divergence occurs, stop the action, identify the exact trigger and breached invariant, return to the nearest valid execution point, and continue only within approved scope. Report material divergence.

Before completion, compare the actual diff with the Alignment Record and perform this final scope-alignment check:
- F1. Requested objective addressed?
- F2. No unrelated objective introduced?
- F3. No unjustified out-of-scope file changed?
- F4. No security guarantee weakened?
- F5. No technical debt, mock, fallback, or fabricated data knowingly introduced?
- F6. Tests correspond to the actual change?
- F7. Final diff is internally consistent?
- F8. Work aligns with production readiness?

Every task report must include: Alignment Record; objective and outcome; changed files; security/architecture boundary impact; verification results and unexecuted checks; divergences; final scope-alignment answers F1-F8; discovered-but-unaddressed issues; and residual risk.

## 22. Final Rules
- When uncertain: inspect first.
- When code and documentation conflict: trust the code and report the discrepancy.
- When a security boundary is involved: preserve it and fail closed.
- When another task is discovered: do not absorb it unless it is a minimum supporting change required for the current objective; otherwise report it.
- When validation was not performed: say so explicitly.
- Never claim implementation, testing, migration, deployment, or security properties that were not actually verified.
