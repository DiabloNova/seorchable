<!-- BEGIN:nextjs-agent-rules -->
# AI AGENT MANIFESTO (JULES / COPILOT)
**Repository:** SEOrchable
**Role:** Expert AI Software Engineer

This file defines the absolute ground rules for any AI agent interacting with this codebase. When modifying files, generating plans, or reviewing code, you MUST adhere strictly to these constraints.

## 1. STRICTLY NO MOCKS (THE GOLDEN RULE)
* Never use mock data, hardcoded JSON, or fake offline variables to bypass functionality.
* UI components must fetch data via Server Actions or API routes.
* If a backend route or database table does not exist to support a feature, STOP and state that the backend must be built first.

## 2. SECURITY & TENANT ISOLATION
* **Server-Side Truth:** Never trust client-side state for authorization. Sessions must be validated via secure HTTP-only cookies on the server.
* **Tenant Isolation:** Every database query interacting with user data MUST enforce workspace/tenant isolation. Rely on PostgreSQL Row Level Security (RLS) where implemented, or explicit `workspace_id = X` clauses.
* **Action Security:** All Server Actions and API Routes must be wrapped in a secure utility (e.g., `secureServerAction`) that resolves identity before executing business logic.

## 3. ARCHITECTURE & ASYNC OPERATIONS
* **Drizzle ORM:** We use Drizzle ORM for PostgreSQL. Ensure strict type safety and relational integrity.
* **Long-Running Tasks:** Tasks involving LLM calls, web scraping, or heavy processing MUST NOT run synchronously in API routes to avoid timeouts. Use the background job queue (Inngest).

## 4. EXECUTION SCOPE (MICRO-SESSIONS)
* **Stay in Bounds:** Only read and modify the files explicitly requested in the prompt.
* **No Unrelated Refactoring:** Do not refactor or "fix" code outside the assigned task unless it directly blocks the current objective.
* **Complete Files:** When generating code, output the entire file. Do not use placeholders like `// ... existing code`.

**[ACKNOWLEDGE]** When explicitly asked to read this file, begin your response with: `[SYSTEM]: SEOrchable Agent Manifesto acknowledged.`


## Database Environment Rules

- `DATABASE_URL` is the application runtime connection for the isolated `jules-dev` branch.
- `MIGRATION_DATABASE_URL` is only for running database migrations.
- Never use `MIGRATION_DATABASE_URL` in application runtime code, API routes, tests that simulate runtime, Vercel, or client-side code.
- Never log, print, expose, commit, or include either connection string in reports or pull requests.
- Run migrations only through the dedicated migration script.
- Never run migrations automatically during `next build`, Vercel deployment, or application startup.
- Use `DATABASE_URL` for normal queries and tenant-scoped application tests.
- Use `MIGRATION_DATABASE_URL` only when explicitly executing migration commands.

# Mandatory Engineering Rules

## Evidence-First Development

The repository is governed by an evidence-first, no-guessing policy.

## Absolute Rule

Never guess. Never invent. Never fabricate missing implementation details.

## An AI agent MUST NOT:

- invent a **database table**
- invent a **column**
- invent a **repository**
- invent a **repository method**
- invent a **service**
- invent an **API contract**
- invent **tenant behavior**
- invent **authorization behavior**
- invent **migration behavior**
- invent **schema relationships**
- invent **configuration**
- invent **environment variables**
- invent **production infrastructure**
- invent a **fallback data source**
- invent a **mock implementation** to make a task appear complete
- **replace missing evidence with assumptions**

If the required implementation detail cannot be verified from the repository, approved documentation, or explicitly provided task context:

**STOP and report "BLOCKED".**

**Do not continue by making an assumption**.

---

**No Fabricated Data**

Production application code MUST NOT fabricate data.

## Forbidden patterns include:

**`Math.random()`**

used as a substitute for persisted application data.

## Also forbidden:

**`return mockData;`**
**`return demoData;`**
**``return fakeData;`**
**``return fallbackData;`**

when these values substitute for unavailable persistence or external data.

## Also forbidden:

**`databaseResult ?? fakeData`**

and:

**`try {
  return await repository.getData();
} catch {
  return mockData;
}`**

unless the fallback is explicitly verified as intentional static behavior.

---

## Mock Data Policy

Mocks are allowed **only when they are explicitly required for**:

- unit-test isolation
- integration-test fixtures
- deterministic test data
- development tooling explicitly designed around mocks

Mocks **MUST NOT** be introduced into production application paths merely because:

- a repository is missing
- a table is unclear
- an API is unavailable
- a test is difficult to write
- existing implementation is incomplete
- the agent does not understand the architecture

If a production path requires persistence that cannot be verified:

 **BLOCK the task.**

---

## Database Evidence Rule

Before changing database-backed code, the agent **MUST** be able to identify all of the following from existing evidence:

1. Canonical table
2. Relevant columns
3. Existing repository or approved query
4. Repository behavior
5. Tenant boundary
6. Authorization boundary
7. Expected error behavior

If any one of these cannot be established:

**DO NOT IMPLEMENT.**

Report:

**`BLOCKED — INSUFFICIENT EVIDENCE`**

and identify exactly what evidence is missing.

---

## Schema and Migration Protection

AI agents MUST NOT create or modify schema/migration infrastructure simply to unblock an application task unless the task explicitly authorizes it.

In particular, an agent MUST NOT:

- create a guessed table
- add a guessed column
- create a guessed relation
- create a migration based on assumptions
- modify RLS policies based on assumptions
- change tenant isolation behavior without explicit evidence

Database architecture must be established before application code is connected to it.

---

## Tenant Isolation

Tenant isolation MUST NEVER be inferred.

Before modifying tenant-scoped functionality, verify the existing mechanism for:

- tenant identification
- tenant context propagation
- repository scoping
- PostgreSQL RLS
- authorization

If the boundary cannot be demonstrated:

**BLOCK.**

Never bypass tenant isolation to make a feature work.

---

## Authorization

Authorization behavior MUST be preserved.

An agent MUST NOT:

- weaken an authorization check
- remove an authorization check
- bypass an existing policy
- expose data because a repository method is easier to call directly
- assume that authentication implies authorization

If authorization behavior is unclear:

**BLOCK.**

---

## Fail-Closed Requirement

Application code MUST fail closed when a required dependency fails.

Database failures, authorization failures, tenant-context failures, and required external-service failures MUST NOT silently become:

- mock data
- random data
- demo data
- stale data
- fabricated success responses

A legitimate empty result MUST remain distinguishable from an infrastructure failure whenever the existing architecture provides that distinction.

---

## Change Scope

Agents MUST modify only files explicitly permitted by the current task.

Do not expand scope because an unrelated problem is discovered.

If another change is required to complete the task but is outside the allowed scope:

STOP and report the dependency as BLOCKED.

Do not modify the unrelated file.

---

## Verification Before Completion

An agent **MUST NOT** claim a task is complete merely because:

- the code compiles
- TypeScript passes
- a test passes
- a mock was replaced
- an endpoint returns a response

Completion requires evidence that the implementation respects:

- canonical architecture
- persistence
- authorization
- tenant isolation
- error semantics
- approved file scope

---

## Required Reporting

For every implementation involving previously mocked, random, fallback, or in-memory data, report:

- Previous data source
- New data source
- Canonical repository
- Canonical table
- Tenant boundary
- Authorization behavior
- Error behavior
- Tests executed
- Test exit status
- Remaining limitations

For blocked work, report:

- Exact file/path
- Exact dependency that is missing
- Evidence that was searched
- Why implementation would require guessing
- What evidence would unblock the work

---

## Prime Directive

«Repository evidence is authoritative.

Approved documentation is supporting evidence.

Task instructions define scope.

Assumptions are not evidence.

When evidence is missing, STOP — do not guess, do not fabricate, and do not create a mock to hide the gap.»
- 
## This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Heed deprecation notices.

# Repository Agent Instructions
### Purpose
This file defines the permanent working rules for AI coding agents, including Jules, working in this repository.
The goal is to make changes that are correct, minimal, secure, testable, and consistent with the current repository.

## 1. Source of Truth
The current repository implementation is the primary source of truth.
Before making changes, inspect the actual code, configuration, dependencies, routes, and tests.
Do not assume that:

- documentation
- README files
- comments
- previous audit reports
- old task descriptions
- architectural diagrams

accurately describe the current implementation.

When documentation conflicts with implementation:
- Trust the current implementation.
- Do not change working code merely to match outdated documentation unless the current task explicitly requires it.

## 2. Inspect Before Editing
Before modifying code:

- Locate the relevant files.
- Read the existing implementation.
- Trace important dependencies and consumers.
- Inspect related tests.
- Check relevant configuration.
- Determine whether the requested functionality already partially exists.

Do not guess file locations, APIs, routes, data models, or architecture when the repository can answer the question.

## 3. Task Scope
Implement only what the current task requires.
Do not:

- refactor unrelated code
- redesign unrelated features
- migrate architecture
- move files unnecessarily
- rename unrelated components
- upgrade dependencies without a requirement
- introduce speculative features
- fix unrelated technical debt

If another problem is discovered, report it instead of silently expanding the task.
Do not start the next architectural or product task unless explicitly instructed.

## 4. Preserve Existing Architecture
Prefer existing:

- components
- utilities
- services
- repositories
- feature modules
- abstractions
- design tokens
- validation mechanisms

over creating parallel implementations.

* Do not introduce a new architectural pattern when an existing pattern already solves the problem.
* Do not migrate frameworks, libraries, persistence technologies, or major architectural patterns unless explicitly requested.

## 5. Next.js
This repository uses a Next.js version whose APIs and conventions may differ from general training knowledge.
Before changing Next.js-specific code:

- Inspect the installed Next.js version.
- Read the relevant documentation under node_modules/next/dist/docs/.
- Follow the APIs and conventions supported by the installed version.
- Check deprecation notices.

* Do not rely on assumptions based on older Next.js versions.
* Do not introduce deprecated APIs when the installed version provides a supported alternative.

## 6. Client / Server Boundaries
Respect Next.js server/client boundaries.
Keep server-only functionality on the server.
Never expose:

- API keys
- database credentials
- private tokens
- secrets
- privileged operations

to client-side code.

* Do not add "use client" unless required.
Before moving logic between server and client, inspect the security, rendering, and data-flow implications.

## 7. Authentication & Authorization
Treat authentication and authorization as security boundaries.
Never bypass authentication or authorization for convenience.
Protected operations must enforce authorization server-side.
Preserve the existing authentication/session architecture unless the task explicitly requires changing it.
* Never expose sensitive authentication information.

## 8. Multi-Tenancy & Data Isolation
- If functionality operates on tenant-specific data, tenant isolation must be preserved.
- Never trust a client-provided tenant identifier as sufficient authorization.
- Tenant access must be validated through the appropriate server-side/data-access boundary.
* Do not introduce queries or repository operations that can return another tenant's data.
* Do not bypass existing database-level or repository-level isolation mechanisms.

## 9. Database & Persistence
Do not assume the persistence architecture from documentation.
Inspect the current implementation before changing database-related code.
Preserve existing guarantees such as:

- tenant isolation
- transactions
- optimistic locking
- validation
- repository boundaries
- database-level security

* Do not replace production persistence with in-memory or mock storage.
* Do not change persistence architecture as part of an unrelated task.

## 10. Environment Variables & Secrets
Never expose secrets or sensitive configuration.
Never:

- commit secrets
- hard-code credentials
- print secret values
- include secret values in task reports
- include secret values in logs or debug output
- paste `.env` contents into responses
- expose server-only environment variables to client-side code

When inspecting environment configuration, inspect variable names and usage without revealing their values.
If a command or tool output contains credentials, tokens, API keys, passwords, or other sensitive values, do not reproduce them in the final report.
Use existing environment-variable conventions.
Do not create or modify production secrets as part of an unrelated task.

## 11. AI & External Services
Before modifying AI functionality or external integrations, inspect the actual implementation.
* Do not assume that a provider, model, API, or pipeline exists because it is mentioned in documentation.
Preserve:

- existing API contracts
- authentication
- error handling
- input validation
- server/client boundaries
- credential security

* Do not introduce new external services unless explicitly required.

## 12. URL Fetching & SSRF
Any server-side fetching of user-provided URLs is security-sensitive.
Preserve existing SSRF protections.
* Do not introduce unrestricted requests to arbitrary user-supplied URLs.
Be careful with:

- localhost
- loopback addresses
- private networks
- internal services
- cloud metadata endpoints
- redirects
- unexpected protocols
- DNS-related SSRF risks

* Do not replace an existing hardened implementation with an unrestricted fetch.

## 13. Localization
The application contains localized routes including:
- `/fa`
- `/en`

Preserve the existing localization architecture.
UI changes must consider:

- Persian RTL
- English LTR
- locale routing
- translations
- text expansion
- responsive layouts

* Do not hard-code user-facing strings when the existing localization system should be used.
* Do not break one locale while implementing another.

## 14. UI, Themes & Design System
The application supports light and dark themes.
Preserve both themes when modifying UI.
Prefer existing:

- design tokens
- semantic colors
- typography
- spacing
- component styles
- Tailwind utilities
- animation conventions

* Do not introduce arbitrary visual systems when an existing design system is available.
UI changes should remain:

- responsive
- accessible
- RTL/LTR compatible
- light/dark compatible

Avoid visual redesign when the task only requires functional changes.

## 15. Dependencies
Before adding a dependency, verify that the repository does not already provide the required functionality.
* Do not add packages for trivial functionality without a clear reason.
* Do not upgrade dependencies unless required by the task.
Avoid dependency changes that expand the scope of an unrelated task.

## 16. API Contracts
Before changing an API, inspect:

- implementation
- consumers
- request structure
- response structure
- validation
- authentication
- authorization
- tests

* Do not silently change API contracts.
If a breaking API change is required, clearly identify the affected consumers and implications.

## 17. Testing & Validation
Use the repository's actual validation infrastructure.
Before running validation, inspect `package.json` to discover the exact project scripts (e.g., build, lint, test, typecheck).
* Do not assume standard script names if `package.json` defines custom equivalents.

When relevant, run the project's actual commands for:
- TypeScript checks / type-checking
- ESLint / linters
- Unit tests
- Integration tests
- E2E tests
- Production build

* Do not invent commands when the repository already defines the correct ones.
* Do not claim that a validation step passed unless it was actually executed.
* Do not remove or weaken tests merely to make them pass.
When fixing a bug, add or update a regression test when appropriate.
- If a required validation cannot be executed, state why.
Never include secrets or sensitive environment values in validation output or the final report.

## 18. Change Hygiene
Before completing a task:

- Inspect the final diff.
- Verify every modified file.
- Remove unrelated changes.
- Remove debug code.
- Remove unused imports.
- Remove temporary files.
- Verify no secrets were introduced.
- Verify no accidental architecture changes occurred.

Keep changes focused and reviewable.

## 19. Documentation Governance
Documentation describes the implementation; it does not define it.
* Do not document planned functionality as implemented functionality.
When documentation and implementation disagree:
- inspect the implementation;
- identify the actual behavior;
- report the discrepancy;
- update documentation only when required by the task.

* Do not invent architecture to make documentation appear complete.

## 20. Task Workflow
For every task:

1. **Understand**
   Identify the objective, scope, affected subsystem, and acceptance criteria.
2. **Inspect**
   Read the relevant implementation before editing.
3. **Plan**
   Create a concise plan based on repository evidence.
4. **Implement**
   Make the smallest safe change that satisfies the task.
5. **Validate**
   Run the relevant tests and checks.
6. **Review**
   Inspect the final diff for regressions and unintended changes.
7. **Report**
   Clearly report what changed, why it changed, files modified, validation performed, validation results, and remaining risks or limitations.

## 21. High-Risk Changes
Treat these as high-risk and do not perform them implicitly:

- authentication changes
- authorization changes
- tenant isolation changes
- database migrations
- persistence architecture changes
- API contract changes
- route restructuring
- localization architecture changes
- security-control changes
- dependency migrations
- framework upgrades
- deployment configuration changes
- environment-variable changes
- major architectural refactoring

* These require explicit task scope.

## 22. Definition of Done
A task is complete only when:

- the requested objective is satisfied;
- the existing architecture is respected;
- scope has not unnecessarily expanded;
- relevant validation has been performed;
- no known security boundary was weakened;
- localization remains functional;
- applicable themes remain functional;
- no secrets were introduced;
- the final diff has been reviewed;
- the final report accurately describes the work performed.

---
Final Rules
- When uncertain: **Inspect first.**
- When code and documentation conflict: **Trust the current implementation.**
- When Next.js behavior is involved: **Read the installed Next.js documentation first.**
- When a change is not required: **Do not make it.**
- When a security boundary is involved: **Preserve it.**
- When another task is discovered: **Report it; do not silently expand scope.**
- When validation was not performed: **Say so explicitly.**

The goal is to make the smallest correct, secure, maintainable, repository-consistent change that fully satisfies the assigned task.
<!-- END:nextjs-agent-rules -->
