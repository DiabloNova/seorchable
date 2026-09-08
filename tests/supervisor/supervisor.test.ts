import assert from 'node:assert/strict';
import { matchPathPattern } from '../../scripts/supervisor/pattern-matcher';
import { isUnintendedArtifact } from '../../scripts/supervisor/artifact-detector';
import { evaluateTaskScope } from '../../scripts/supervisor/evaluator';
import { TaskContract, GitFileChange } from '../../scripts/supervisor/types';

export function runSupervisorTests() {
  console.log('=========================================================================');
  console.log('SEORCHABLE — SUPERVISOR FOUNDATION TEST SUITE');
  console.log('=========================================================================');

  // -------------------------------------------------------------------------
  // 1. PATTERN MATCHER TESTS
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Pattern Matcher (exact, segment wildcard, recursive, directory prefix)...');

  // Exact match
  assert.equal(matchPathPattern('package.json', 'package.json'), true);
  assert.equal(matchPathPattern('src/index.ts', 'src/index.ts'), true);
  assert.equal(matchPathPattern('src/index.ts', 'src/other.ts'), false);

  // Directory prefix match
  assert.equal(matchPathPattern('scripts/supervisor/evaluator.ts', 'scripts/supervisor/'), true);
  assert.equal(matchPathPattern('scripts/supervisor', 'scripts/supervisor/'), true);
  assert.equal(matchPathPattern('scripts/security/secret-hygiene.ts', 'scripts/supervisor/'), false);

  // Single segment wildcard (*)
  assert.equal(matchPathPattern('dev_server.log', 'dev_server*.log'), true);
  assert.equal(matchPathPattern('dev_server_2.log', 'dev_server*.log'), true);
  assert.equal(matchPathPattern('fix.patch', '*.patch'), true);
  assert.equal(matchPathPattern('src/foo/index.ts', 'src/*/index.ts'), true);
  assert.equal(matchPathPattern('src/foo/bar/index.ts', 'src/*/index.ts'), false);

  // Recursive wildcard (**)
  assert.equal(matchPathPattern('src/a/b/c/d.ts', 'src/**'), true);
  assert.equal(matchPathPattern('src/a/b/c/d.ts', '**/*.ts'), true);
  assert.equal(matchPathPattern('d.ts', '**/*.ts'), true);
  assert.equal(matchPathPattern('src/a/b/c/d.js', '**/*.ts'), false);

  console.log('  ✅ Pattern matcher tests passed.');

  // -------------------------------------------------------------------------
  // 2. ARTIFACT DETECTOR TESTS
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Artifact Detector...');
  assert.equal(isUnintendedArtifact('dev_server_verify.log'), true);
  assert.equal(isUnintendedArtifact('fix-actions.patch'), true);
  assert.equal(isUnintendedArtifact('eval_results.json'), true);
  assert.equal(isUnintendedArtifact('.next/static/chunks/main.js'), true);
  assert.equal(isUnintendedArtifact('.env.local'), true);
  assert.equal(isUnintendedArtifact('src/services/auth.ts'), false);
  console.log('  ✅ Artifact detector tests passed.');

  const sampleContract: TaskContract = {
    allowedPaths: ['scripts/supervisor/**', 'tests/supervisor/**'],
    forbiddenPaths: ['src/core/auth/**', '.env*'],
    maxChangedLines: 100,
    taskType: 'supervisor-foundation',
  };

  // -------------------------------------------------------------------------
  // 3. GATE TEST 1: All changes inside allowed scope -> PASS
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Scope Gate - All changes inside allowed scope -> PASS...');
  const validChanges: GitFileChange[] = [
    {
      path: 'scripts/supervisor/evaluator.ts',
      status: 'added',
      additions: 30,
      deletions: 0,
      changedLines: 30,
    },
    {
      path: 'tests/supervisor/supervisor.test.ts',
      status: 'added',
      additions: 20,
      deletions: 0,
      changedLines: 20,
    },
  ];

  const verdictPass = evaluateTaskScope(sampleContract, validChanges);
  assert.equal(verdictPass.status, 'PASS');
  assert.equal(verdictPass.violations.length, 0);
  assert.equal(verdictPass.stats.changedFilesCount, 2);
  assert.equal(verdictPass.stats.totalChangedLines, 50);
  console.log('  ✅ Allowed scope check passed.');

  // -------------------------------------------------------------------------
  // 4. GATE TEST 2: One file outside allowed scope -> FAIL
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Scope Gate - One file outside allowed scope -> FAIL...');
  const unallowedChanges: GitFileChange[] = [
    ...validChanges,
    {
      path: 'src/services/dashboard.ts',
      status: 'modified',
      additions: 5,
      deletions: 0,
      changedLines: 5,
    },
  ];

  const verdictUnallowed = evaluateTaskScope(sampleContract, unallowedChanges);
  assert.equal(verdictUnallowed.status, 'FAIL');
  assert.equal(verdictUnallowed.violations.length, 1);
  assert.equal(verdictUnallowed.violations[0].type, 'SCOPE_VIOLATION');
  assert.equal(verdictUnallowed.violations[0].path, 'src/services/dashboard.ts');
  console.log('  ✅ Unallowed scope check produced FAIL as expected.');

  // -------------------------------------------------------------------------
  // 5. GATE TEST 3: Forbidden path changed -> FAIL
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Forbidden-Path Gate - Forbidden path changed -> FAIL...');
  const forbiddenContract: TaskContract = {
    allowedPaths: ['scripts/**', 'tests/**'],
    forbiddenPaths: ['scripts/security/secret-hygiene.ts'],
    maxChangedLines: 100,
  };

  const forbiddenChanges: GitFileChange[] = [
    {
      path: 'scripts/security/secret-hygiene.ts',
      status: 'modified',
      additions: 2,
      deletions: 0,
      changedLines: 2,
    },
  ];

  const verdictForbidden = evaluateTaskScope(forbiddenContract, forbiddenChanges);
  assert.equal(verdictForbidden.status, 'FAIL');
  assert.ok(verdictForbidden.violations.some((v) => v.type === 'FORBIDDEN_PATH'));
  console.log('  ✅ Forbidden path check produced FAIL as expected.');

  // -------------------------------------------------------------------------
  // 6. GATE TEST 4: Changed-line budget exceeded -> FAIL
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Change-Budget Gate - Changed-line budget exceeded -> FAIL...');
  const overBudgetChanges: GitFileChange[] = [
    {
      path: 'scripts/supervisor/evaluator.ts',
      status: 'modified',
      additions: 80,
      deletions: 30,
      changedLines: 110,
    },
  ];

  const verdictBudget = evaluateTaskScope(sampleContract, overBudgetChanges);
  assert.equal(verdictBudget.status, 'FAIL');
  assert.ok(verdictBudget.violations.some((v) => v.type === 'LINE_BUDGET_EXCEEDED'));
  console.log('  ✅ Change budget check produced FAIL as expected.');

  // -------------------------------------------------------------------------
  // 7. GATE TEST 5: Generated/local artifact detected -> FAIL
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Artifact Gate - Local/generated artifact detected -> FAIL...');
  const artifactChanges: GitFileChange[] = [
    {
      path: 'dev_server_99.log',
      status: 'untracked',
      additions: 10,
      deletions: 0,
      changedLines: 10,
    },
  ];

  const verdictArtifact = evaluateTaskScope(sampleContract, artifactChanges);
  assert.equal(verdictArtifact.status, 'FAIL');
  assert.ok(verdictArtifact.violations.some((v) => v.type === 'UNINTENDED_ARTIFACT'));
  console.log('  ✅ Artifact detection produced FAIL as expected.');

  // -------------------------------------------------------------------------
  // 8. GATE TEST 6: Clean working tree -> PASS
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Clean Working Tree -> PASS (deterministic)...');
  const verdictClean = evaluateTaskScope(sampleContract, []);
  assert.equal(verdictClean.status, 'PASS');
  assert.equal(verdictClean.summary, 'Clean working tree: No changes detected.');
  assert.equal(verdictClean.violations.length, 0);
  assert.equal(verdictClean.stats.changedFilesCount, 0);
  assert.equal(verdictClean.stats.totalChangedLines, 0);
  console.log('  ✅ Clean working tree deterministically produced PASS.');

  // -------------------------------------------------------------------------
  // 9. GATE TEST 7: Multiple simultaneous violations -> ALL reported
  // -------------------------------------------------------------------------
  console.log('▶ TEST: Multiple simultaneous violations -> All reported...');
  const multiViolationChanges: GitFileChange[] = [
    {
      path: 'src/core/auth/session.ts', // Forbidden & Scope violation
      status: 'modified',
      additions: 120,
      deletions: 0,
      changedLines: 120, // Exceeds budget of 100
    },
    {
      path: 'dev_server.log', // Artifact & Scope violation
      status: 'untracked',
      additions: 10,
      deletions: 0,
      changedLines: 10,
    },
  ];

  const verdictMulti = evaluateTaskScope(sampleContract, multiViolationChanges);
  assert.equal(verdictMulti.status, 'FAIL');

  const violationTypes = verdictMulti.violations.map((v) => v.type);
  assert.ok(violationTypes.includes('FORBIDDEN_PATH'), 'Missing FORBIDDEN_PATH violation');
  assert.ok(violationTypes.includes('SCOPE_VIOLATION'), 'Missing SCOPE_VIOLATION violation');
  assert.ok(violationTypes.includes('UNINTENDED_ARTIFACT'), 'Missing UNINTENDED_ARTIFACT violation');
  assert.ok(violationTypes.includes('LINE_BUDGET_EXCEEDED'), 'Missing LINE_BUDGET_EXCEEDED violation');
  console.log('  ✅ Multiple simultaneous violations correctly captured and reported.');

  console.log('=========================================================================');
  console.log('✅ ALL SUPERVISOR FOUNDATION TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================================================');
}

if (require.main === module) {
  runSupervisorTests();
}
