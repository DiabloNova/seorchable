## Pipeline Verification Report

### 1. Checks Table

| Step / Check | Claims to Check | Defect Used to Verify | Caught Before? | Catches Now? |
|--------------|-----------------|------------------------|----------------|--------------|
| `npm run lint` | ESLint violations across codebase | Syntax error / undefined variable in test files | Yes (but lacked coverage metrics) | Yes (now reports 477 files scanned) |
| `npm run test:acquisition` | Acquisition suite logic | Break URL parsing logic in `normalizeUrl` | Yes (but lacked coverage metrics) | Yes (now reports 8 suites collected) |
| `npm run security:secrets` | Secret hygiene in Git tree | Inserted hardcoded access token pattern | Yes (but lacked coverage metrics) | Yes (now reports 714 files scanned) |
| `npm run build` | Next.js build & docs generator | N/A (build passes naturally) | N/A | N/A (reports 40 files scanned for docs) |

### 2. Swallowed Exit Codes & Skipped Jobs

*   **.circleci/config.yml**: The step `cp -R build dist public .output .next .docusaurus ~/artifacts 2>/dev/null || true` uses a swallowed exit code.
    *   *Resolution*: Left in place but justified with a comment. Not all frameworks/build steps produce every single directory in that list, so `cp` may legitimately fail to find some of them. Allowing failure prevents the pipeline from failing on successful builds lacking optional artifact directories.
*   **Other `.test.ts` files**: A significant portion of the repository's tests are *not* run in the CI pipeline. The only test runner configured in `package.json` is `test:acquisition`. The rest (e.g. `tests/services/auth/session.test.ts`, `tests/features/admin/domain.test.ts`) are completely unmapped to the standard CI commands.

### 3. Coverage Reconciliation

*   `npm run lint` now explicitly reports that it scans `477` files.
*   `npm run test:acquisition` now explicitly reports `8` suites run.
*   `npm run security:secrets` now explicitly reports `714` files scanned.
*   `scripts/generate-docs-data.ts` now explicitly reports `40` files scanned.

### 4. Missing Checks

*   **Global Test Runner**: There is no general test runner (like `npm test`) configured to discover and execute all `tests/**/*.test.ts` files. The CI pipeline only runs the acquisition suite via `test:acquisition`. This means hundreds of tests are currently inert because they are never invoked by CI.
