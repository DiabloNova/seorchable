---
name: bug-fix
description: Reproduce, isolate, repair, and regression-test a concrete bug in Seorchable. Use when asked to fix a failing behavior, broken flow, regression, or defect.
---

# Bug Fix

Fix the defect demonstrated by evidence, not the symptom guessed from a task description.

## Procedure

1. Write the Alignment Record: objective, non-objectives, scope, verified preconditions, boundaries, and verification plan.
2. Reproduce the defect using the real entry point or a minimal faithful reproduction.
3. Trace the failure through callers, dependencies, state transitions, persistence, configuration, and consumers until the root cause is identified.
4. Add or identify a regression test that fails for the defect. Avoid tests that only encode the current broken implementation.
5. Implement the smallest coherent fix that preserves existing architecture and security guarantees.
6. Run the targeted regression test, then relevant lint/type/build/feature/security checks from `package.json`.
7. Review the diff for unrelated changes and accidental behavior changes.
8. Report root cause, fix, evidence, checks run, checks not run, discovered issues, and residual risk.

## Constraints

- Do not patch around the symptom with a mock, hard-coded value, silent fallback, or bypass.
- Do not change unrelated architecture or dependencies.
- Do not weaken validation, authorization, tenant isolation, or error handling to make the defect disappear.
- If the stated bug cannot be reproduced, do not invent a cause. Inspect the implementation and report the strongest evidence.

## Done when

- The defect is reproduced or its root cause is proven from code and evidence.
- A regression test covers the failure mode.
- The fix passes the regression test and relevant broader checks.
- The final diff contains only task-related changes.
