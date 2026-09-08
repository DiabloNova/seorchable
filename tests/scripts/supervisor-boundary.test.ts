import * as assert from 'node:assert/strict';
import {
  runSupervisorBoundary,
  isValidSupervisorResult,
  VERDICT_EXIT_CODES,
  SupervisorResult,
  ISupervisorEngine,
} from '../../scripts/supervisor/boundary';

async function testScenario1PassExitCode() {
  console.log('Testing Scenario 1: PASS produces exit code 0');
  const mockEngine: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'PASS',
      violations: [],
      affectedPaths: ['src/app/page.tsx'],
      summary: 'All checks passed cleanly.',
    }),
  };

  const stdoutLogs: string[] = [];
  const stderrLogs: string[] = [];

  const { exitCode, result } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-pass"}' },
    mockEngine,
    {
      stdout: (m) => stdoutLogs.push(m),
      stderr: (m) => stderrLogs.push(m),
    }
  );

  assert.equal(exitCode, 0, 'PASS must return exit code 0');
  assert.equal(exitCode, VERDICT_EXIT_CODES.PASS);
  assert.equal(result.verdict, 'PASS');
  assert.equal(result.affectedPaths.length, 1);

  // Verify stdout contains valid JSON matching result
  const jsonOutput = JSON.parse(stdoutLogs.join(''));
  assert.equal(jsonOutput.verdict, 'PASS');
  assert.equal(isValidSupervisorResult(jsonOutput), true);

  console.log('✅ Scenario 1 Passed');
}

async function testScenario2FailExitCode() {
  console.log('Testing Scenario 2: FAIL produces exit code 1');
  const mockEngine: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'FAIL',
      violations: [{ message: 'Disallowed file modified: package.json', path: 'package.json' }],
      affectedPaths: ['package.json'],
      summary: 'Scope violation detected.',
    }),
  };

  const stdoutLogs: string[] = [];

  const { exitCode, result } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-fail"}' },
    mockEngine,
    { stdout: (m) => stdoutLogs.push(m) }
  );

  assert.equal(exitCode, 1, 'FAIL must return exit code 1');
  assert.equal(exitCode, VERDICT_EXIT_CODES.FAIL);
  assert.equal(result.verdict, 'FAIL');
  assert.equal(result.violations.length, 1);

  const jsonOutput = JSON.parse(stdoutLogs.join(''));
  assert.equal(jsonOutput.verdict, 'FAIL');
  assert.equal(isValidSupervisorResult(jsonOutput), true);

  console.log('✅ Scenario 2 Passed');
}

async function testScenario3BlockedExitCode() {
  console.log('Testing Scenario 3: BLOCKED produces exit code 2');
  const mockEngine: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'BLOCKED',
      violations: [{ message: 'Required database migration system missing.' }],
      affectedPaths: [],
      summary: 'Execution blocked due to missing architectural dependency.',
    }),
  };

  const stdoutLogs: string[] = [];

  const { exitCode, result } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-blocked"}' },
    mockEngine,
    { stdout: (m) => stdoutLogs.push(m) }
  );

  assert.equal(exitCode, 2, 'BLOCKED must return exit code 2');
  assert.equal(exitCode, VERDICT_EXIT_CODES.BLOCKED);
  assert.equal(result.verdict, 'BLOCKED');

  const jsonOutput = JSON.parse(stdoutLogs.join(''));
  assert.equal(jsonOutput.verdict, 'BLOCKED');
  assert.equal(isValidSupervisorResult(jsonOutput), true);

  console.log('✅ Scenario 3 Passed');
}

async function testScenario4InsufficientEvidenceExitCode() {
  console.log('Testing Scenario 4: INSUFFICIENT_EVIDENCE produces exit code 3');
  const mockEngine: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'INSUFFICIENT_EVIDENCE',
      violations: [{ message: 'Reconnaissance output is empty or inconclusive.' }],
      affectedPaths: [],
      summary: 'Cannot verify claims due to missing test evidence.',
    }),
  };

  const stdoutLogs: string[] = [];

  const { exitCode, result } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-insufficient"}' },
    mockEngine,
    { stdout: (m) => stdoutLogs.push(m) }
  );

  assert.equal(exitCode, 3, 'INSUFFICIENT_EVIDENCE must return exit code 3');
  assert.equal(exitCode, VERDICT_EXIT_CODES.INSUFFICIENT_EVIDENCE);
  assert.equal(result.verdict, 'INSUFFICIENT_EVIDENCE');

  const jsonOutput = JSON.parse(stdoutLogs.join(''));
  assert.equal(jsonOutput.verdict, 'INSUFFICIENT_EVIDENCE');
  assert.equal(isValidSupervisorResult(jsonOutput), true);

  console.log('✅ Scenario 4 Passed');
}

async function testScenario5MalformedOrMissingOutputFailsClosed() {
  console.log('Testing Scenario 5: Malformed or missing Supervisor output fails closed');

  // Case A: Engine returns malformed output (missing verdict)
  const malformedEngine1: ISupervisorEngine = {
    evaluate: async () => ({
      violations: [],
      affectedPaths: [],
      summary: 'Missing verdict property',
    } as unknown as SupervisorResult),
  };

  const stdoutLogsA: string[] = [];
  const { exitCode: exitCodeA, result: resultA } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-malformed-1"}' },
    malformedEngine1,
    { stdout: (m) => stdoutLogsA.push(m) }
  );

  assert.notEqual(exitCodeA, 0, 'Malformed output must NOT produce exit code 0');
  assert.equal(resultA.verdict, 'FAIL');
  assert.match(resultA.summary, /malformed or invalid result structure/i);

  // Case B: Engine returns invalid verdict string
  const malformedEngine2: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'APPROVED_BY_AGENT' as unknown as SupervisorResult['verdict'],
      violations: [],
      affectedPaths: [],
      summary: 'Invalid verdict value',
    }),
  };

  const stdoutLogsB: string[] = [];
  const { exitCode: exitCodeB, result: resultB } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-malformed-2"}' },
    malformedEngine2,
    { stdout: (m) => stdoutLogsB.push(m) }
  );

  assert.notEqual(exitCodeB, 0, 'Invalid verdict must NOT produce exit code 0');
  assert.equal(resultB.verdict, 'FAIL');

  console.log('✅ Scenario 5 Passed');
}

async function testScenario6EngineExecutionFailureFailsClosed() {
  console.log('Testing Scenario 6: Engine execution failure fails closed');

  // Case A: Engine throws exception during evaluate()
  const throwingEngine: ISupervisorEngine = {
    evaluate: async () => {
      throw new Error('Internal engine crash during AST parsing');
    },
  };

  const stdoutLogsA: string[] = [];
  const { exitCode: exitCodeA, result: resultA } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-crash"}' },
    throwingEngine,
    { stdout: (m) => stdoutLogsA.push(m) }
  );

  assert.notEqual(exitCodeA, 0, 'Engine throw must NOT produce exit code 0');
  assert.equal(exitCodeA, VERDICT_EXIT_CODES.FAIL);
  assert.equal(resultA.verdict, 'FAIL');
  assert.match(resultA.summary, /Internal engine crash/);

  // Case B: Task Contract is missing or invalid JSON
  const stdoutLogsB: string[] = [];
  const { exitCode: exitCodeB, result: resultB } = await runSupervisorBoundary(
    { contractJson: '{ invalid json }' },
    throwingEngine,
    { stdout: (m) => stdoutLogsB.push(m) }
  );

  assert.notEqual(exitCodeB, 0, 'Invalid task contract JSON must NOT produce exit code 0');
  assert.equal(resultB.verdict, 'FAIL');
  assert.match(resultB.summary, /Task contract error/);

  // Case C: Engine module file does not exist
  const stdoutLogsC: string[] = [];
  const { exitCode: exitCodeC, result: resultC } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-no-engine"}', enginePath: 'nonexistent/path/engine.ts' },
    undefined,
    { stdout: (m) => stdoutLogsC.push(m) }
  );

  assert.notEqual(exitCodeC, 0, 'Missing engine module must NOT produce exit code 0');
  assert.equal(resultC.verdict, 'FAIL');
  assert.match(resultC.summary, /Supervisor engine module not found/);

  console.log('✅ Scenario 6 Passed');
}

async function testScenario7DeterministicMachineReadableSchema() {
  console.log('Testing Scenario 7: Machine-readable output schema determinism & separation');

  const mockEngine: ISupervisorEngine = {
    evaluate: async () => ({
      verdict: 'FAIL',
      violations: [
        {
          ruleId: 'SCOPE_001',
          message: 'Modified file outside declared scope: lib/auth.ts',
          path: 'lib/auth.ts',
          severity: 'error',
        },
      ],
      affectedPaths: ['lib/auth.ts'],
      summary: 'Task scope violation in lib/auth.ts',
    }),
  };

  const stdoutLogs: string[] = [];
  const stderrLogs: string[] = [];

  const { exitCode } = await runSupervisorBoundary(
    { contractJson: '{"taskId":"test-schema"}' },
    mockEngine,
    {
      stdout: (m) => stdoutLogs.push(m),
      stderr: (m) => stderrLogs.push(m),
    }
  );

  assert.equal(exitCode, 1);

  // Verify stdout contains ONLY valid JSON
  const rawStdout = stdoutLogs.join('').trim();
  assert.doesNotThrow(() => JSON.parse(rawStdout), 'stdout must be strictly parseable JSON');

  const parsed = JSON.parse(rawStdout);

  // Verify required top-level schema properties
  assert.equal(typeof parsed.verdict, 'string');
  assert.equal(Array.isArray(parsed.violations), true);
  assert.equal(Array.isArray(parsed.affectedPaths), true);
  assert.equal(typeof parsed.summary, 'string');

  // Verify stderr contains human-readable diagnostics separated from stdout
  assert.ok(stderrLogs.length > 0, 'Diagnostic messages must go to stderr');
  assert.match(stderrLogs.join(''), /\[SUPERVISOR BOUNDARY\]/);

  console.log('✅ Scenario 7 Passed');
}

async function runAllTests() {
  console.log('====================================================');
  console.log('RUNNING SUPERVISOR BOUNDARY FOCUSED TEST SUITE');
  console.log('====================================================\n');

  try {
    await testScenario1PassExitCode();
    await testScenario2FailExitCode();
    await testScenario3BlockedExitCode();
    await testScenario4InsufficientEvidenceExitCode();
    await testScenario5MalformedOrMissingOutputFailsClosed();
    await testScenario6EngineExecutionFailureFailsClosed();
    await testScenario7DeterministicMachineReadableSchema();

    console.log('\n====================================================');
    console.log('ALL 7 SUPERVISOR BOUNDARY TEST SCENARIOS PASSED ✅');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ SUPERVISOR BOUNDARY TEST FAILED:', err);
    process.exit(1);
  }
}

runAllTests();
