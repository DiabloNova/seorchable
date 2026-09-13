# Seorchable Repository Agent Instructions

## 1. Source of Truth
The current repository implementation is the primary source of truth. Inspect actual code, configuration, dependencies, routes, migrations, tests, and deployment files before acting. Documentation, comments, README claims, old audits, task descriptions, and prior agent reports are not proof of implementation.

**When documentation conflicts with implementation, trust the implementation and report the discrepancy. Do not change working code merely to match documentation unless the current task explicitly requires it.**

## 2. Inspect Before Editing
Before modifying code, locate the relevant files, read the implementation, trace dependencies and consumers, inspect related tests, and check configuration. Do not guess file locations, APIs, routes, data models, or architecture when the repository can answer the question.

## 3. Task Scope
Implement only the current task. Do not refactor unrelated code, redesign unrelated features, migrate architecture, rename unrelated components, upgrade dependencies without a requirement, introduce speculative features, or silently fix unrelated debt. Discoveries must be reported instead of absorbed into the task.

## 4. Preserve Existing Architecture
Prefer existing components, utilities, services, repositories, feature modules, abstractions, design tokens, validation mechanisms, and persistence boundaries. Do not introduce a parallel implementation when an existing one can be extended safely.

## 5. Next.js and Server Boundaries
Inspect the installed Next.js version and follow the repository-supported APIs. Keep server-only functionality on the server. Never expose database credentials, API keys, private tokens, secrets, or privileged operations to client code. Do not add client boundaries unless required and reviewed.

## 6. Authentication and Authorization
Authentication and authorization are security boundaries. Protected operations must enforce access server-side. Never bypass authorization for convenience. Client redirects are not authorization.

## 7. Multi-Tenancy and Data Isolation
Never trust a client-provided tenant identifier as sufficient authorization. Tenant access must be resolved and validated server-side. Do not introduce queries or repository operations that can return another tenant's data. Preserve database-level isolation, transactions, and tenant context requirements.

## 8. Database and Persistence
Inspect the current persistence architecture before changing it. Preserve tenant isolation, transactions, validation, repository boundaries, migration safety, and database-level security. Never replace production persistence with in-memory or mock storage.

## 9. Environment Variables and Secrets
Never commit, hard-code, print, log, or return credentials, tokens, API keys, passwords, or secret values. Inspect names and usage only. Required production settings must fail closed when missing. Never add a silent security fallback.

## 10. External Services and AI
Inspect the actual provider integration before changing it. Preserve authentication, API contracts, validation, error handling, cost controls, and server/client boundaries. Provider failure must not become fabricated product data.

## 11. URL Fetching and SSRF
All server-side fetching of user-provided URLs must use the approved SSRF protection. Reject private networks, loopback, link-local, metadata endpoints, unexpected protocols, unsafe redirects, and DNS-based bypasses. Never introduce unrestricted outbound fetching.

## 12. Localization and UI
The application supports Persian RTL and English LTR, plus light and dark themes. Preserve locale routing, translations, responsive behavior, accessibility, RTL/LTR correctness, design tokens, and both themes.

## 13. Dependencies
Before adding a dependency, verify the repository does not already provide the capability. Do not upgrade dependencies without explicit task scope. Keep the manifest, lockfile, and imports consistent.

## 14. API and Data Contracts
Before changing an API or persisted shape, inspect implementation, consumers, request and response structures, validation, authorization, migrations, and tests. Do not silently break contracts.

## 15. Testing and Validation
Use the repository's actual scripts. Do not invent commands when package.json provides the correct one. Run relevant typecheck, lint, test, integration, security, and production-build checks. Never claim a validation step passed unless it actually ran. Never weaken or delete tests to make a change pass.

## 16. Change Hygiene
Review the final diff. Verify every changed file, remove unrelated changes, debug code, temporary files, logs, patch rejects, backup copies, unused imports, and accidental architectural changes. Never introduce secrets.

## 17. Documentation Governance
Documentation describes implementation; it does not define it. Do not document planned functionality as implemented. When code and documentation disagree, report the mismatch and update documentation only when explicitly required.

## 18. High-Risk Changes
Authentication, authorization, tenant isolation, migrations, persistence, API contracts, route restructuring, localization architecture, security controls, dependencies, framework upgrades, deployment, and environment variables require explicit task scope and focused review.

## 19. Definition of Done
A task is complete only when the requested objective is satisfied, existing architecture is respected, scope has not expanded, relevant validation has run, security boundaries are not weakened, localization remains functional, no secrets are introduced, the final diff is reviewed, and the report accurately describes the work.

## 20. Bilingual Documentation and RTL Safety
All explanations, analyses, requirements, risks, dependencies, acceptance criteria, and instructions for human readers in Persian documents must be written in Persian. Do not mix English prose into a Persian sentence.

Copy-paste prompts, executable agent instructions, shell commands, identifiers, file paths, URLs, and code must remain in English and must be isolated inside a visually distinct left-to-right block or isolated code span. Do not place English prose inline inside a Persian paragraph.

Technical terms may remain in English only when they are identifiers, commands, file paths, product names, protocol names, or exact API terms. Do not translate technical concepts into inaccurate or non-native equivalents. Do not use English words as decorative substitutes for Persian explanations.

Before delivery of a Persian document, inspect bidirectional rendering. Verify that punctuation, code, paths, URLs, numbered lists, tables, and every copy-paste block render in the intended order.

## 21. Execution Alignment and Self-Monitoring
Before the first edit of every task, create an Alignment Record containing: the single task objective, non-objectives, expected files, verified preconditions, security boundaries touched, and the exact verification plan.

Continuously verify compatibility with: the overall production objective, the current task objective, explicit scope, repository architecture, security and production-readiness requirements, and prerequisite order.

Stop immediately if an action conflicts with the project objective, task objective, task scope, architecture, security, tenant isolation, approved design, or dependency order. Stop also for unrelated changes, speculative refactoring, silent fallbacks, client-authoritative tenant data, or downstream work before prerequisites.

When divergence occurs: stop the action, identify the exact trigger and invariant breached, re-evaluate against the task and project objective, revert to the nearest valid execution point, continue only within approved scope, and report any material deviation.

Before completion, verify: the requested objective was addressed; no unrelated objective was introduced; no out-of-scope files or architecture were added; no security guarantee weakened; no technical debt, mock, fallback, or fabricated data was added to bypass the real problem; tests correspond to the change; the final diff matches the task; and the result is closer to production readiness.

Every task report must include: Alignment Record, objective and outcome, changed files, boundary impact, verification and unexecuted checks, divergences, final scope-alignment check, discovered-but-unaddressed issues, and residual risk.

## 22. Final Rules
When uncertain: inspect first. When code and documentation conflict: trust the code. When a security boundary is involved: preserve it and fail closed. When another task is discovered: report it. When validation was not performed: say so explicitly.
