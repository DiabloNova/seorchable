---
name: test-verification
description: Design or review tests, validate bug fixes, prove regression coverage, and verify that passing tests actually detect the intended failure in Seorchable.
---

# Test Verification

A passing test is evidence only if it exercises the intended behavior and would fail for the known defect.

## Procedure

1. State the behavior that must be true and the failure mode that must be prevented.
2. Locate existing tests and the real boundary they exercise. Prefer integration or feature-boundary tests for security and workflow defects.
3. Before implementing a fix, reproduce the defect or construct a failing test that demonstrates it. If neither is possible, explain why and identify the strongest available evidence.
4. Implement the minimum fix.
5. Run the targeted test and the relevant repository checks from `package.json`.
6. Inspect the final test for false positives: hard-coded outcomes, mocks that bypass the defect, assertions that never execute, or tests that only prove the new implementation rather than the requirement.
7. Where practical, perform mutation-style verification: temporarily restore the relevant defect or otherwise invalidate the fix and confirm the regression test fails. Restore the correct implementation before completion.
8. Report exact commands and results. Never infer a passing check that was not run.

## Verification levels

- **Targeted:** directly exercises the changed behavior.
- **Regression:** fails against the original defect and passes after the fix.
- **Boundary:** exercises the actual route/service/database/security boundary when appropriate.
- **Integration/build:** catches contract, import, routing, server/client, or deployment issues.
- **Security:** proves denial cases, tampering, expiry, isolation, or fail-closed behavior as applicable.

## Done when

- The test is linked to an explicit requirement or defect.
- The test would fail for the original defect or an equivalent broken state.
- The targeted and relevant broader checks have run.
- Any unexecuted check and remaining uncertainty are explicitly reported.
