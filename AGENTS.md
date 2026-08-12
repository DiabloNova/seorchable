<!-- BEGIN:nextjs-agent-rules -->
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
