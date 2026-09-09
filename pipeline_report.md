## Pipeline Verification Report

### 1. Checks Table

| Step / Check | Claims to Check | Defect Used to Verify | Caught Before? | Catches Now? | Enforced by CircleCI? |
|--------------|-----------------|------------------------|----------------|--------------|-----------------------|
| `npm run lint` | ESLint violations across codebase | Syntax error / undefined variable in test files | Yes (but lacked coverage metrics) | Yes (now reports exactly 477 files scanned; fails empty run) | **No** (Local only) |
| `npm run test:acquisition` | Acquisition suite logic | Break URL parsing logic in `normalizeUrl` | Yes (but lacked coverage metrics) | Yes (now reports dynamic suite execution count) | **No** (Local only) |
| `npm run security:secrets` | Secret hygiene in Git tree | Inserted hardcoded access token pattern | Yes (but lacked coverage metrics) | Yes (now reports actual scanned count; fails empty run) | **No** (Local only) |
| `npm run build` | Next.js build & docs generator | N/A (build passes naturally) | N/A | N/A (reports docs files scanned) | **Yes** (in `build-node`) |

### 2. Swallowed Exit Codes & Skipped Jobs

*   **.circleci/config.yml Artifact Copy**: The step `cp -R build dist public .output .next .docusaurus ~/artifacts 2>/dev/null || true` previously used a broad swallowed exit code, hiding actual copy failures.
    *   *Resolution*: Replaced with a bash loop that safely checks `[ -d "$dir" ]` before executing `cp`. This correctly distinguishes "optional artifact absent" (success) from "artifact exists but copy fails" (failure).
*   **Other `.test.ts` files**: A significant portion of the repository's tests are *not* run anywhere. The only test runner configured in `package.json` is `test:acquisition`. The rest (e.g. `tests/services/auth/session.test.ts`, `tests/features/admin/domain.test.ts`) are completely unmapped to the standard CI commands.

### 3. Coverage Reconciliation

*   `npm run lint` now explicitly reports that it scans files (`filesRead === 0` throws an error).
*   `npm run test:acquisition` now explicitly executes and aggregates the test suites together and reports the dynamic executed count.
*   `npm run security:secrets` now explicitly reports files scanned and fails closed if `filesScanned === 0`.
*   `scripts/generate-docs-data.ts` now explicitly reports files scanned.

### 4. Missing CI Integration & Known Gaps

*   **Global Test Runner**: There is no general test runner (like `npm test`) configured to discover and execute all `tests/**/*.test.ts` files. The CI pipeline only runs the `evals` command and the `build` command. It completely skips unit tests.
*   **Locally Available Checks are not in CI**: The commands `npm run lint`, `npm run test:acquisition`, and `npm run security:secrets` are not mapped into the `.circleci/config.yml` pipeline. They are exclusively local checks. They are correctly verified locally, but do not provide CI coverage.
*   **Deployment Placeholder**: The deployment step in `.circleci/config.yml` executes `#e.g. ./deploy.sh`. This is a non-operative placeholder command. It is not evidence of a functioning deployment pipeline, and is acknowledged as intentionally out-of-scope for this fix.
