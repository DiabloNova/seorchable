AGENTS.md

Purpose

This repository is an AI-powered brand intelligence and visibility platform.

This file defines the operating rules for AI coding agents working in this repository, including Jules.

The goal is to ensure that all agent-generated changes are:

- repository-aware
- architecture-safe
- minimal in scope
- testable
- secure
- localization-safe
- compatible with the existing design system
- based on the actual implementation rather than assumptions

---

1. Source of Truth

The current implementation is the primary source of truth.

Before making any change, inspect the relevant code and configuration.

Do not assume that existing documentation, comments, previous audit reports, task descriptions, or architectural diagrams accurately describe the current implementation.

When documentation conflicts with implementation:

«The implementation wins.»

Do not modify the implementation merely to make it conform to outdated documentation unless the current task explicitly requires that change.

If a significant discrepancy is discovered, report it.

---

2. Repository Technology

The repository is currently based on:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- localized application routing
- authentication infrastructure
- AI/brand-intelligence features
- database/repository abstractions

Do not assume that every technology mentioned in historical documentation is currently implemented.

Before using a library, API, database adapter, model, or service, verify that it actually exists in the current repository.

Do not introduce an alternative implementation when an existing repository capability already provides the required functionality.

---

3. Architecture Principles

Preserve the existing architectural boundaries.

Prefer:

- existing abstractions
- existing services
- existing repositories
- existing feature boundaries
- existing components
- existing utilities
- existing design tokens

over creating parallel implementations.

Do not introduce a new architectural pattern simply because it is personally preferred.

Do not migrate the application between frameworks, libraries, database technologies, or architectural patterns unless explicitly requested.

Do not perform unrelated refactoring while implementing a task.

---

4. Task Scope

Every task has a defined scope.

Implement exactly what the task requires.

Do not:

- redesign unrelated areas
- refactor unrelated modules
- rename files unnecessarily
- move directories unnecessarily
- replace working implementations
- upgrade dependencies without a requirement
- change API contracts without explicit justification
- modify unrelated documentation
- introduce speculative features

If an unrelated problem is discovered, report it rather than fixing it automatically.

If completing the requested task genuinely requires an additional change, explain the dependency before making the change whenever practical.

---

5. Inspect Before Editing

Before modifying code:

1. Locate the relevant files.
2. Read the existing implementation.
3. Trace important imports and dependencies.
4. Identify existing abstractions.
5. Inspect related tests.
6. Check configuration that affects the implementation.
7. Determine whether the requested behavior already partially exists.

Never implement from the task description alone when repository inspection can answer the question.

Avoid guessing file names, routes, APIs, data models, or architectural boundaries.

---

6. Localization

The application supports localized routes, including:

- "/fa"
- "/en"

Preserve the existing localization architecture.

All UI changes must consider both locales.

Do not:

- hard-code user-facing strings unnecessarily
- break locale routing
- remove locale-specific layouts
- assume LTR-only behavior
- assume Persian and English have identical layout requirements

Persian UI must remain RTL-aware.

English UI must remain LTR-aware.

When modifying layouts, navigation, tables, forms, or directional components, verify both RTL and LTR behavior.

---

7. Theme and Design System

The application supports both light and dark themes.

Preserve both themes when modifying UI.

Prefer existing:

- design tokens
- CSS variables
- Tailwind utilities
- component styles
- typography system
- spacing system
- existing visual language

Do not introduce arbitrary styling systems.

Do not hard-code colors when an existing theme token or semantic color is available.

UI changes must remain:

- responsive
- accessible
- visually consistent
- compatible with light mode
- compatible with dark mode
- compatible with RTL/LTR

Avoid unnecessary visual redesign when a task only requires functional modification.

---

8. Component Architecture

Reuse existing components whenever possible.

Before creating a new component:

1. Search for an existing component with equivalent responsibility.
2. Determine whether it can be extended safely.
3. Create a new component only when reuse would reduce clarity or violate existing boundaries.

Avoid duplicated components that perform substantially the same function.

Keep components focused on their existing responsibilities.

Do not move business logic into presentation components merely for convenience.

Do not move server-only logic into client components.

---

9. Client / Server Boundaries

Respect Next.js client/server boundaries.

Do not expose:

- secrets
- API keys
- database credentials
- server-only configuration
- privileged operations

to client-side code.

Use server-side execution for operations that require:

- database access
- private credentials
- privileged APIs
- protected business logic

Do not add ""use client"" to a component unless it is actually required.

Adding client boundaries can affect:

- bundle size
- server rendering
- data fetching
- security
- performance

Treat such changes carefully.

---

10. Authentication and Authorization

Authentication and authorization are security boundaries.

Do not weaken or bypass them for convenience.

Never assume that a user is authenticated merely because a UI component renders.

Authentication state must come from the actual authentication/session implementation.

Protected operations must enforce authorization server-side.

Do not rely solely on client-side route guards for security.

When modifying authentication:

- inspect the existing provider/session architecture first
- preserve existing flows
- preserve unauthenticated states
- avoid defaulting users to authenticated states
- validate credentials and input appropriately
- avoid exposing sensitive authentication information

---

11. Multi-Tenancy and Data Isolation

If a feature operates within a tenant context, tenant isolation must be preserved.

Never trust a client-provided tenant identifier as sufficient authorization.

Tenant access must be validated through the appropriate server-side/data-access boundary.

Where the repository uses repository abstractions, preserve those boundaries.

Where database-level isolation mechanisms exist, do not bypass them.

Never introduce a query that can unintentionally return data belonging to another tenant.

Any modification involving tenant-aware data must be reviewed specifically for isolation implications.

---

12. Database and Persistence

Do not assume the database architecture from documentation.

Inspect the current implementation before changing persistence.

If PostgreSQL, repositories, transactions, optimistic locking, Row Level Security, or migrations are present, preserve their existing boundaries and guarantees.

Do not replace database-backed persistence with:

- in-memory Maps
- mock repositories
- local state
- hard-coded data

in production paths.

Mock or in-memory persistence is acceptable only where the repository explicitly uses it for testing or development purposes.

Never silently change persistence behavior while implementing an unrelated task.

---

13. AI and External Services

The platform contains AI/visibility intelligence functionality and integrations with external services.

Before modifying AI functionality, inspect the actual implementation.

Do not assume that a model, provider, API, or pipeline exists because it is mentioned in documentation.

Current external integrations must be verified in code before use.

For any external service:

- preserve existing API contracts
- validate external input
- handle failures explicitly
- avoid leaking credentials
- avoid logging sensitive data
- respect server/client boundaries

Do not introduce a new AI provider or external service unless the task explicitly requires it.

---

14. URL Fetching and SSRF Safety

Any functionality that accepts or fetches user-provided URLs must be treated as security-sensitive.

Do not weaken existing SSRF protections.

Validate URLs before server-side fetching.

Be particularly careful with:

- localhost
- loopback addresses
- private IP ranges
- internal network addresses
- cloud metadata endpoints
- unexpected protocols
- redirects
- DNS rebinding risks

Do not replace an existing hardened URL-fetching implementation with a simpler unrestricted HTTP request.

---

15. API Contracts

Before modifying an API:

1. Find the implementation.
2. Find its consumers.
3. Inspect request and response structures.
4. Inspect validation.
5. Inspect authentication/authorization.
6. Inspect tests.

Do not silently change:

- field names
- response structures
- status codes
- authentication requirements
- error formats

unless the task explicitly requires an API change.

If a breaking change is necessary, clearly report it.

---

16. Dependencies

Prefer existing dependencies.

Before installing a package, verify whether the repository already provides the required capability.

Do not add dependencies for trivial functionality that can safely be implemented using existing tools.

Do not upgrade package versions merely to resolve unrelated issues.

Dependency changes must have a clear reason.

---

17. Testing

Use the repository's actual testing infrastructure.

Before modifying a feature, inspect relevant tests.

After modifying code, run the appropriate available validation:

- TypeScript type checking
- ESLint
- unit tests
- integration tests
- end-to-end tests
- production build

Do not claim a test passed unless it was actually executed.

If a validation command cannot be executed, explicitly state why.

Do not remove or weaken tests simply to make them pass.

When fixing a bug, prefer adding or updating a regression test where appropriate.

---

18. Build and Deployment Safety

Production builds are an important validation boundary.

When a task affects:

- routing
- configuration
- dependencies
- server/client boundaries
- environment variables
- build configuration
- API routes
- authentication
- database code

run the production build when practical.

Do not modify deployment configuration unless required by the task.

Do not assume local development behavior guarantees production behavior.

---

19. Environment Variables and Secrets

Never commit secrets.

Never hard-code:

- API keys
- passwords
- tokens
- private credentials
- database credentials

Use the repository's existing environment-variable conventions.

Do not expose server-only environment variables to browser code.

If an environment variable is required, verify the existing naming and usage patterns before introducing a new one.

---

20. Documentation Governance

Documentation must describe the actual implementation.

Do not treat documentation as proof that a feature exists.

When implementation and documentation disagree:

1. inspect the implementation;
2. identify the actual behavior;
3. report the discrepancy;
4. update documentation only when the task requires it.

Avoid writing speculative architecture into documentation.

Do not document planned functionality as implemented functionality.

---

21. Git and Change Hygiene

Keep changes focused.

Before finishing a task:

- inspect the diff
- identify every modified file
- remove accidental changes
- remove debug statements
- remove temporary code
- remove unused imports
- remove unused dependencies
- verify formatting

Do not modify generated files unless required by the repository workflow.

Do not rewrite large portions of a file when a small targeted change is sufficient.

---

22. Jules Task Workflow

For every task, follow this sequence:

Understand

Determine:

- objective
- scope
- acceptance criteria
- affected subsystem
- potential risks

Inspect

Inspect the real repository implementation.

Plan

Create a concise plan based on repository evidence.

Implement

Make the smallest safe change that satisfies the task.

Validate

Run relevant tests and checks.

Review

Inspect the final diff and check for unintended changes.

Report

The final response must clearly state:

- what changed
- why it changed
- files modified
- validation performed
- validation results
- known limitations
- remaining risks
- important assumptions

---

23. Do Not Expand the Task

Do not automatically continue into the next architectural phase.

If a task reveals that another task is necessary, report it separately.

Example:

If a documentation audit discovers an architectural discrepancy, do not automatically refactor the architecture.

If a UI task discovers a backend issue, do not automatically redesign the backend.

If a database task discovers an unrelated frontend issue, do not fix the frontend issue.

Finish the assigned task first.

---

24. High-Risk Changes

Treat the following as high-risk and do not perform them implicitly:

- database migrations
- authentication changes
- authorization changes
- tenant isolation changes
- API contract changes
- route restructuring
- localization architecture changes
- dependency migrations
- framework upgrades
- deployment configuration changes
- environment-variable changes
- security-control changes
- major architectural refactoring

These require explicit task scope.

---

25. Definition of Done

A task is complete only when:

- the requested objective is satisfied;
- the implementation follows existing architecture;
- the scope has not unnecessarily expanded;
- relevant tests pass;
- type checking passes where available;
- linting passes where available;
- production build passes when relevant;
- localization is preserved;
- light and dark themes are preserved where applicable;
- security boundaries are preserved;
- tenant isolation is preserved where applicable;
- no secrets were introduced;
- the final diff has been reviewed;
- the final report accurately describes the work performed.

---

Final Rule

When uncertain:

Inspect first.

When documentation conflicts with code:

Trust the implementation.

When a change is not required:

Do not make it.

When a security boundary is involved:

Preserve it unless the task explicitly requires changing it.

When another task is discovered:

Report it; do not silently expand scope.

When validation was not performed:

Say so explicitly.

The objective is not to produce the largest possible change.

The objective is to produce the smallest correct, secure, maintainable, repository-consistent change that fully satisfies the assigned task.
