import { matchPathPattern } from './pattern-matcher';

/**
 * Deterministic detection for unintended local/generated artifacts.
 * Focused on logs, temporary scripts/patches, scratch evaluation outputs,
 * build artifacts, and local environment files.
 */
export const DEFAULT_ARTIFACT_PATTERNS: string[] = [
  // Log files
  '*.log',
  'dev_server*.log',
  'next*.log',
  'brand-test-output.txt',

  // Local patch / script artifacts
  '*.patch',
  'replace_*.sh',

  // Temporary / scratch eval or debug output files
  'eval_results.json',
  'assertions.json',
  'final_report.md',
  'part1_report.md',
  'test_db.ts',
  'verify_aeo_content.py',

  // Generated build & cache outputs
  '.next/**',
  'dist/**',
  'build/**',
  'out/**',
  'coverage/**',
  '.turbo/**',

  // Local environment files
  '.env.local',
  '.env.*.local',
];

export function isUnintendedArtifact(filepath: string, customPatterns?: string[]): boolean {
  const patterns = customPatterns || DEFAULT_ARTIFACT_PATTERNS;
  return patterns.some((pattern) => matchPathPattern(filepath, pattern));
}
