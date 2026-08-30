# AGENTS.md

## Repository

- Repository: `DiabloNova/seorchable`
- Primary branch: `main`
- Application type: Next.js App Router application with TypeScript
- Current framework versions must always be read from `package.json`; do not assume versions from training data.
- Jules must work on a new branch and produce a focused pull request.

This file defines engineering rules for Jules and other coding agents working in this repository.

---

## 1. Core Operating Principle

**Inspect first. Plan second. Implement third. Validate last.**

The current repository implementation is the primary source of truth.

Use, in order:

## Current source code

## Current configuration and dependency manifests ## Current tests and scripts ## Current database schema and migrations ## Approved task requirements ## Documentation and architecture notes

Documentation, comments, previous audit reports, issue descriptions, generated files, logs, and task attachments may be stale or incomplete. If they conflict with the implementation, report the conflict and follow the current implementation unless the task explicitly asks for migration or correction.

Never replace missing evidence with assumptions.

---

## 2. Jules Task Workflow

For every task:

## Read this file.

## Inspect the repository tree and relevant implementation.
## Identify affected routes, consumers, services, schemas, tests, and configuration.
## Run the smallest relevant existing validation commands before editing.
## Produce a plan containing:
    - objective;
    - root cause or implementation rationale;
    - exact files to modify;
    - exact files to add or delete;
    - tests to add or update;
    - validation commands;
    - known risks and blockers.
## Do not implement until the plan is approved when the Jules workflow requests plan approval.
## Make the smallest reviewable change.
## Add regression tests when behavior changes or a bug is fixed.
## Run validation after editing.
## Inspect the final diff for scope creep, secrets, debug code, and accidental architecture changes.
## Report the result accurately.

Do not claim success because code merely compiles. Completion requires evidence that the change respects security, persistence, authorization, tenant isolation, error semantics, and task scope.

If required evidence is missing, stop and report:

```text **BLOCKED** - **INSUFFICIENT** **EVIDENCE**
