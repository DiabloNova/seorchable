---
name: repository-audit
description: Audit the Seorchable repository before implementation. Use when asked to inspect, review, map, analyze, harden, or plan changes across an unfamiliar or high-risk area, or when repository facts are uncertain.
---

# Repository Audit

Establish facts before proposing or editing code. The repository implementation is the source of truth.

## Procedure

1. Read `AGENTS.md` and identify the task objective, non-objectives, scope, and required verification.
2. Inspect `package.json`, the relevant configuration, directory structure, entry points, routes, persistence layer, tests, and deployment files.
3. Trace the requested behavior end-to-end. For a boundary, inspect both producer and consumer sides.
4. Search for all references to the relevant symbols, routes, tables, environment variables, and tests. Do not infer unused code from filenames alone.
5. Record verified facts, assumptions that remain unverified, dependencies, trust boundaries, and likely failure modes.
6. Produce an Alignment Record before the first edit.

## Constraints

- Do not modify code during the audit unless the task explicitly requests implementation in the same run and the prerequisites are verified.
- Do not use README text, comments, old audits, or agent claims as proof when code can answer the question.
- Do not turn discovered unrelated issues into scope.
- Do not guess framework APIs; inspect the installed version and existing usage.

## Required output

- Objective
- Non-objectives
- Scope
- Verified preconditions
- Relevant files and dependency path
- Security/architecture boundaries
- Verification plan
- Discovered-but-unaddressed issues
- Residual uncertainty

## Done when

- The relevant implementation and consumers are identified.
- The persistence/configuration/test/deployment surfaces relevant to the task are inspected.
- No material prerequisite remains based only on a guess.
- The verification plan is executable using repository-provided scripts.
