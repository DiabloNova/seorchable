import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Task contract provided to the Supervisor.
 */
export interface TaskContract {
  taskId?: string;
  allowedFiles?: string[];
  forbiddenFiles?: string[];
  rules?: string[];
  scopeDescription?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Deterministic verdicts produced by the Supervisor.
 */
export type SupervisorVerdict = 'PASS' | 'FAIL' | 'BLOCKED' | 'INSUFFICIENT_EVIDENCE';

/**
 * Individual rule or scope violation reported by the Supervisor.
 */
export interface SupervisorViolation {
  ruleId?: string;
  message: string;
  severity?: 'error' | 'warning' | 'critical' | string;
  path?: string;
  [key: string]: unknown;
}

/**
 * Machine-readable result contract expected from the Supervisor execution boundary.
 */
export interface SupervisorResult {
  verdict: SupervisorVerdict;
  violations: SupervisorViolation[];
  affectedPaths: string[];
  summary: string;
  details?: Record<string, unknown>;
}

/**
 * Interface that any concrete Supervisor Engine must expose.
 */
export interface ISupervisorEngine {
  evaluate(contract: TaskContract, options?: Record<string, unknown>): Promise<SupervisorResult> | SupervisorResult;
}

/**
 * Exit code mapping as mandated by repository execution contract:
 * PASS                   -> 0
 * FAIL                   -> 1
 * BLOCKED                -> 2
 * INSUFFICIENT_EVIDENCE  -> 3
 */
export const VERDICT_EXIT_CODES: Record<SupervisorVerdict, number> = {
  PASS: 0,
  FAIL: 1,
  BLOCKED: 2,
  INSUFFICIENT_EVIDENCE: 3,
};

export const FAILURE_EXIT_CODE = 1;

/**
 * Validates whether an object adheres to the SupervisorResult schema.
 */
export function isValidSupervisorResult(obj: unknown): obj is SupervisorResult {
  if (!obj || typeof obj !== 'object') return false;
  const res = obj as Record<string, unknown>;

  const validVerdicts: SupervisorVerdict[] = ['PASS', 'FAIL', 'BLOCKED', 'INSUFFICIENT_EVIDENCE'];
  if (typeof res.verdict !== 'string' || !validVerdicts.includes(res.verdict as SupervisorVerdict)) {
    return false;
  }

  if (!Array.isArray(res.violations)) return false;
  for (const v of res.violations) {
    if (!v || typeof v !== 'object') return false;
    if (typeof (v as Record<string, unknown>).message !== 'string') return false;
  }

  if (!Array.isArray(res.affectedPaths) || !res.affectedPaths.every((p) => typeof p === 'string')) {
    return false;
  }

  if (typeof res.summary !== 'string') return false;

  return true;
}

/**
 * Helper to construct a fail-closed error result.
 */
export function createFailureResult(summary: string, violations: SupervisorViolation[] = []): SupervisorResult {
  return {
    verdict: 'FAIL',
    violations,
    affectedPaths: [],
    summary,
  };
}

export interface CLIArgs {
  contractPath?: string;
  contractJson?: string;
  enginePath?: string;
  outputPath?: string;
  quiet?: boolean;
}

export function parseCLIArgs(args: string[]): CLIArgs {
  const result: CLIArgs = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--contract' && i + 1 < args.length) {
      result.contractPath = args[++i];
    } else if (arg === '--contract-json' && i + 1 < args.length) {
      result.contractJson = args[++i];
    } else if (arg === '--engine' && i + 1 < args.length) {
      result.enginePath = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      result.outputPath = args[++i];
    } else if (arg === '--quiet') {
      result.quiet = true;
    }
  }
  return result;
}

export async function loadTaskContract(cliArgs: CLIArgs): Promise<{ contract?: TaskContract; error?: string }> {
  if (cliArgs.contractJson) {
    try {
      const parsed = JSON.parse(cliArgs.contractJson);
      if (parsed && typeof parsed === 'object') {
        return { contract: parsed as TaskContract };
      }
      return { error: 'Provided --contract-json is not a valid JSON object' };
    } catch (e) {
      return { error: `Failed to parse --contract-json: ${(e as Error).message}` };
    }
  }

  if (cliArgs.contractPath) {
    const fullPath = resolve(process.cwd(), cliArgs.contractPath);
    if (!existsSync(fullPath)) {
      return { error: `Task contract file not found at path: ${cliArgs.contractPath}` };
    }
    try {
      const content = readFileSync(fullPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        return { contract: parsed as TaskContract };
      }
      return { error: `Task contract at ${cliArgs.contractPath} is not a valid JSON object` };
    } catch (e) {
      return { error: `Failed to read or parse task contract at ${cliArgs.contractPath}: ${(e as Error).message}` };
    }
  }

  return { error: 'No task contract provided. Specify --contract <path> or --contract-json <json_string>.' };
}

export async function runSupervisorBoundary(
  cliArgs: CLIArgs,
  customEngine?: ISupervisorEngine,
  writers: {
    stdout?: (msg: string) => void;
    stderr?: (msg: string) => void;
  } = {}
): Promise<{ exitCode: number; result: SupervisorResult }> {
  const writeStdout = writers.stdout || ((msg: string) => process.stdout.write(msg + '\n'));
  const writeStderr = writers.stderr || ((msg: string) => process.stderr.write(msg + '\n'));

  const logDiag = (msg: string) => {
    if (!cliArgs.quiet) {
      writeStderr(`[SUPERVISOR BOUNDARY] ${msg}`);
    }
  };

  logDiag('Initializing Supervisor Execution Boundary...');

  // 1. Load Task Contract
  const { contract, error: contractError } = await loadTaskContract(cliArgs);
  if (contractError || !contract) {
    logDiag(`Task Contract Load Error: ${contractError}`);
    const failResult = createFailureResult(`Task contract error: ${contractError}`, [
      { message: contractError || 'Invalid task contract' },
    ]);
    writeStdout(JSON.stringify(failResult, null, 2));
    return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
  }

  logDiag(`Task Contract loaded successfully. TaskID: ${contract.taskId || 'unspecified'}`);

  // 2. Resolve Engine
  let engine: ISupervisorEngine | undefined = customEngine;

  if (!engine) {
    const engineModulePath = cliArgs.enginePath || 'scripts/supervisor/index.ts';
    const resolvedPath = resolve(process.cwd(), engineModulePath);

    logDiag(`Attempting to load Supervisor Engine from: ${engineModulePath}`);

    if (!existsSync(resolvedPath)) {
      const msg = `Supervisor engine module not found at: ${engineModulePath}`;
      logDiag(msg);
      const failResult = createFailureResult(`Engine resolution error: ${msg}`, [{ message: msg }]);
      writeStdout(JSON.stringify(failResult, null, 2));
      return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
    }

    try {
      const importedModule = await import(resolvedPath);
      // Validate expected callable interface
      const candidateEngine = importedModule.default || importedModule.supervisorEngine || importedModule;
      if (candidateEngine && typeof candidateEngine.evaluate === 'function') {
        engine = candidateEngine as ISupervisorEngine;
      } else if (typeof importedModule.evaluate === 'function') {
        engine = { evaluate: importedModule.evaluate };
      } else {
        const msg = `Engine at ${engineModulePath} does not implement ISupervisorEngine interface (missing 'evaluate' function)`;
        logDiag(msg);
        const failResult = createFailureResult(`Engine interface error: ${msg}`, [{ message: msg }]);
        writeStdout(JSON.stringify(failResult, null, 2));
        return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
      }
    } catch (err) {
      const msg = `Failed to import Supervisor Engine from ${engineModulePath}: ${(err as Error).message}`;
      logDiag(msg);
      const failResult = createFailureResult(`Engine import failure: ${msg}`, [{ message: msg }]);
      writeStdout(JSON.stringify(failResult, null, 2));
      return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
    }
  }

  // 3. Execute Engine Evaluation
  logDiag('Invoking Supervisor Engine evaluation...');
  let rawResult: unknown;
  try {
    rawResult = await engine.evaluate(contract);
  } catch (err) {
    const msg = `Supervisor Engine evaluation threw an unhandled error: ${(err as Error).message}`;
    logDiag(msg);
    const failResult = createFailureResult(`Engine execution error: ${msg}`, [{ message: msg }]);
    writeStdout(JSON.stringify(failResult, null, 2));
    return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
  }

  // 4. Validate Machine-Readable Result Contract
  if (!isValidSupervisorResult(rawResult)) {
    const msg = 'Supervisor Engine returned malformed or invalid result structure';
    logDiag(msg);
    logDiag(`Raw output received: ${JSON.stringify(rawResult)}`);
    const failResult = createFailureResult(`Engine result validation error: ${msg}`, [
      { message: msg },
    ]);
    writeStdout(JSON.stringify(failResult, null, 2));
    return { exitCode: VERDICT_EXIT_CODES.FAIL, result: failResult };
  }

  const result: SupervisorResult = rawResult;
  logDiag(`Supervisor Evaluation complete. Verdict: ${result.verdict}`);

  // Output deterministic JSON to stdout
  writeStdout(JSON.stringify(result, null, 2));

  const exitCode = VERDICT_EXIT_CODES[result.verdict] ?? VERDICT_EXIT_CODES.FAIL;

  return { exitCode, result };
}

// CLI entry point if run directly
if (require.main === module) {
  const cliArgs = parseCLIArgs(process.argv.slice(2));
  runSupervisorBoundary(cliArgs)
    .then(({ exitCode }) => {
      process.exit(exitCode);
    })
    .catch((err) => {
      process.stderr.write(`[SUPERVISOR BOUNDARY CRITICAL ERROR] ${err?.message || err}\n`);
      const failResult = createFailureResult(`Critical execution failure: ${err?.message || err}`);
      process.stdout.write(JSON.stringify(failResult, null, 2) + '\n');
      process.exit(1);
    });
}
