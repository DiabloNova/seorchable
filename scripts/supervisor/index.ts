import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { TaskContract } from './types';
import { getWorkingTreeChanges } from './git-inspector';
import { evaluateTaskScope } from './evaluator';

export * from './types';
export * from './pattern-matcher';
export * from './artifact-detector';
export * from './git-inspector';
export * from './evaluator';

export function runSupervisorCLI(): void {
  const args = process.argv.slice(2);
  let contractPath = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--contract' && args[i + 1]) {
      contractPath = args[i + 1];
      i++;
    }
  }

  let contract: TaskContract;

  if (contractPath && existsSync(join(process.cwd(), contractPath))) {
    try {
      const raw = readFileSync(join(process.cwd(), contractPath), 'utf-8');
      contract = JSON.parse(raw);
    } catch (err) {
      console.error(`Supervisor CLI Error: Failed to parse task contract at ${contractPath}:`, err);
      process.exit(1);
    }
  } else {
    // Fallback default contract for local inspection when no contract argument supplied
    contract = {
      allowedPaths: ['scripts/supervisor/**', 'tests/supervisor/**'],
      forbiddenPaths: ['src/**', '.env*'],
      maxChangedLines: 500,
      taskType: 'supervisor-foundation',
    };
  }

  const changes = getWorkingTreeChanges();
  const verdict = evaluateTaskScope(contract, changes);

  console.log(JSON.stringify(verdict, null, 2));

  if (verdict.status !== 'PASS') {
    process.exit(1);
  }
}

if (require.main === module) {
  runSupervisorCLI();
}
