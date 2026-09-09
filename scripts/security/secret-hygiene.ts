import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

// Define high-confidence secret patterns to avoid false positives.
// These look for standard key formats or populated credentials.
const PATTERNS: Array<{ name: string; regex: RegExp }> = [
  {
    name: 'private-key',
    regex: /-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/,
  },
  {
    name: 'bearer-token',
    // Matches Bearer followed by a typical long token structure.
    // Excludes generic test values like "Bearer test-token" or just "Bearer "
    regex: /Bearer\s+([a-zA-Z0-9-_\.]{32,})/,
  },
  {
    name: 'populated-database-url',
    // Matches postgres:// or mysql:// with a username and password
    // Ignoring dummy values in tests or dummy local URLs like postgres:postgres@localhost
    regex: /(postgres|mysql|postgresql):\/\/(?!.*(localhost|127\.0\.0\.1|dummy|test|example|secretPass|superSecret)).*:[^@]+@[^:]+:[0-9]+\/[^?\s]+/,
  },
  {
    name: 'api-key-pattern',
    // Matches common API key patterns: e.g. a 32+ character hex or base64 looking string assigned to a variable ending in API_KEY or TOKEN.
    // E.g. API_KEY="a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
    regex: /(API_KEY|TOKEN|SECRET|PASSWORD)\s*(:|=)\s*(['"])(?!test_)[a-zA-Z0-9\-_]{32,}\3/,
  },
  {
    name: 'aws-access-key-id',
    regex: /(AKIA|ASIA)[0-9A-Z]{16}/,
  }
];

function runCheck() {
  try {
    // Get all files tracked by git
    const gitFilesOutput = execSync('git ls-files', { encoding: 'utf-8' });
    const files = gitFilesOutput.split('\n').filter(Boolean);

    let hasSecrets = false;
    let filesScanned = 0;

    for (const file of files) {
      // Check for tracked runtime .env variants
      if (file.match(/(^|\/)\.env($|\.(local|development|test|production))/)) {
        console.error(`Secret hygiene check: FAIL\n\nPotential secret detected:\n  file: ${file}\n  type: populated-runtime-env`);
        hasSecrets = true;
        filesScanned++;
        continue;
      }

      // Ignore known non-secret files or the checker itself to prevent false positives from pattern definitions
      if (
        file === 'scripts/security/secret-hygiene.ts' ||
        file === 'pnpm-lock.yaml' ||
        // Ignore test files that use placeholder connection strings or test values
        file.includes('tests/scripts/database/') ||
        // Ignore docs that only have examples
        file.includes('docs/project/tasks/') ||
        file === 'drizzle.config.ts'
      ) {
          continue;
      }

      let content: string;
      try {
        content = readFileSync(join(process.cwd(), file), 'utf-8');
        filesScanned++;
      } catch (err) {
        // File might have been deleted but still in git index, skip
        continue;
      }

      for (const pattern of PATTERNS) {
        if (pattern.regex.test(content)) {
          console.error(`Secret hygiene check: FAIL\n\nPotential secret detected:\n  file: ${file}\n  type: ${pattern.name}`);
          hasSecrets = true;
          break; // Stop at first match per file
        }
      }
    }

    if (filesScanned === 0) {
      console.error("Secret hygiene check: FAIL (0 files scanned, empty run detected)");
      process.exit(1);
    }

    if (hasSecrets) {
      console.log(`Secret hygiene check: FAIL (scanned ${filesScanned} files)`);
      process.exit(1);
    } else {
      console.log(`Secret hygiene check: PASS (scanned ${filesScanned} files)`);
      process.exit(0);
    }
  } catch (error) {
    console.error('Failed to run secret hygiene check:', error);
    process.exit(1);
  }
}

runCheck();
