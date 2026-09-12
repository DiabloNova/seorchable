# Crawl Policy Limits Defect Reintroduction Report

## 1. Initial State
- **Claimed Fixes Analyzed:** Commit `fff187d` and `5831f1c`.
- **Tests Examined:** `tests/features/acquisition/crawl-limits.test.ts`.
- **Suite Baseline:** Clean. Running `npx tsx tests/features/acquisition/crawl-limits.test.ts` outputs `✅ Crawl policy limits test passed.` indicating the test suite is green out of the box.

## 2. Identified Defects & Tests

1. **Defect 1**: The application allows clients to provide policy parameters that exceed allowed limits (ceilings).
   - **Test**: The block under `// 1. Attempt to exceed ceilings with client-provided values` asserting `maxPages`, `maxDepth`, etc against `CRAWL_POLICY_CEILINGS`.

2. **Defect 2**: The application accepts and crashes/misbehaves on malformed, negative, non-integer, or null values for policy settings.
   - **Test**: The blocks under `// 2. Malformed, negative, non-integer, or null values...` and `// 3. Null, undefined...`

3. **Defect 3**: The server boundary (`CrawlOrchestrator.submit`) accepts oversized/malformed parameters directly without calling the resolver.
   - **Test**: The blocks under `// 5. Verify server boundary (CrawlOrchestrator.submit) enforces policy resolution` and `// 6. Verify direct CrawlOrchestrator.submit()...`

## 3. Reintroduction Results

### Defect 1 (Exceeding Ceilings)
- **Edit to Reintroduce**: Modified `sanitizeInt` in `src/features/acquisition/domain/policy.ts` to skip checking if `val > ceiling` and returning `ceiling`. Removed the ceiling validation block from `validateCrawlPolicy` so that the policy could return instead of throwing a generic error early.
- **Did the test go red?**: Yes.
- **First line of failure**: `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:`
- **Failure reason**: The assertion on line 25 (`assert.equal(escalated.maxPages, CRAWL_POLICY_CEILINGS.maxPages)`) evaluated to `999999 !== 1000`. The test failed for the stated reason (it caught the absence of ceiling enforcement).

### Defect 2 (Malformed, Negative, Non-Integer values)
- **Edit to Reintroduce**: Modified `sanitizeInt` in `src/features/acquisition/domain/policy.ts` to remove the bounds check for negatives `if (val < min)` and removed type/NaN checks. Removed validation early exit so assertions could evaluate.
- **Did the test go red?**: Yes.
- **First line of failure**: `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:`
- **Failure reason**: The assertion on line 51 (`assert.equal(malformed.maxPages, 1)`) evaluated to `-10 !== 1`. The test failed for the stated reason (it caught the lack of negative value clamping).

### Defect 3 (Orchestrator Boundary Failure)
- **Edit to Reintroduce**: Modified `src/features/acquisition/application/orchestrator.ts` in `submit` to remove `const policy = resolveCrawlPolicy(partialPolicy);`, bypassing the policy resolution and directly returning the `partialPolicy` values as `policy`.
- **Did the test go red?**: Yes.
- **First line of failure**: `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:`
- **Failure reason**: The assertion on line 122 (`assert.equal(submission.job.policy.maxPages, CRAWL_POLICY_CEILINGS.maxPages);`) evaluated to `999999 !== 1000`. The test failed for the stated reason (it correctly verified the orchestrator enforces limits on the submitted config).

## 4. Conclusion
- **Evidence vs Decoration**:
  - `testCrawlPolicyLimits` (Defect 1 section): **Evidence.** It explicitly caught when ceiling limits were removed.
  - `testCrawlPolicyLimits` (Defect 2 section): **Evidence.** It correctly caught when bounds clamping (negatives/invalid inputs) was removed.
  - `testCrawlPolicyLimits` (Defect 3 section): **Evidence.** It correctly caught when the application boundary stopped invoking the policy resolver.
- **Tree State**: The working tree was precisely returned to its initial, clean state after each mutation and at the end of the exercise.
