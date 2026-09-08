import { TaskContract, GitFileChange, SupervisorVerdict, Violation } from './types';
import { matchPathPattern } from './pattern-matcher';
import { isUnintendedArtifact } from './artifact-detector';

/**
 * Evaluates Git working-tree changes against an explicitly declared task contract.
 *
 * Checks:
 * 1. Unintended Artifact Gate
 * 2. Forbidden-Path Gate (overrides allowed paths)
 * 3. Scope Gate (allowed paths)
 * 4. Change-Budget Gate (maximum line budget)
 */
export function evaluateTaskScope(
  contract: TaskContract,
  changes: GitFileChange[]
): SupervisorVerdict {
  const violations: Violation[] = [];

  let addedFilesCount = 0;
  let deletedFilesCount = 0;
  let renamedFilesCount = 0;
  let totalChangedLines = 0;

  for (const change of changes) {
    if (change.status === 'added' || change.status === 'untracked') {
      addedFilesCount++;
    } else if (change.status === 'deleted') {
      deletedFilesCount++;
    } else if (change.status === 'renamed') {
      renamedFilesCount++;
    }

    totalChangedLines += change.changedLines;

    // Check 1: Unintended Artifact Detection
    if (isUnintendedArtifact(change.path)) {
      violations.push({
        type: 'UNINTENDED_ARTIFACT',
        path: change.path,
        details: `Unintended local/generated artifact detected: "${change.path}".`,
      });
    }

    // Check 2: Forbidden-Path Gate
    const isForbidden = contract.forbiddenPaths.some(
      (pattern) =>
        matchPathPattern(change.path, pattern) ||
        (change.oldPath && matchPathPattern(change.oldPath, pattern))
    );

    if (isForbidden) {
      violations.push({
        type: 'FORBIDDEN_PATH',
        path: change.path,
        details: `Change in path "${change.path}" violates forbidden path rule.`,
      });
    }

    // Check 3: Scope Gate (Allowed Paths)
    const isAllowed = contract.allowedPaths.some(
      (pattern) =>
        matchPathPattern(change.path, pattern) &&
        (!change.oldPath || matchPathPattern(change.oldPath, pattern))
    );

    if (!isAllowed) {
      violations.push({
        type: 'SCOPE_VIOLATION',
        path: change.path,
        details: `Path "${change.path}" is outside declared allowed scope.`,
      });
    }
  }

  // Check 4: Change-Budget Gate
  if (totalChangedLines > contract.maxChangedLines) {
    violations.push({
      type: 'LINE_BUDGET_EXCEEDED',
      details: `Total changed lines (${totalChangedLines}) exceeds declared budget (${contract.maxChangedLines}).`,
    });
  }

  const stats = {
    changedFilesCount: changes.length,
    addedFilesCount,
    deletedFilesCount,
    renamedFilesCount,
    totalChangedLines,
  };

  if (changes.length === 0) {
    return {
      status: 'PASS',
      summary: 'Clean working tree: No changes detected.',
      violations: [],
      stats,
    };
  }

  if (violations.length === 0) {
    return {
      status: 'PASS',
      summary: `Task scope compliance verified: All ${changes.length} changed file(s) comply with scope contract (${totalChangedLines}/${contract.maxChangedLines} lines).`,
      violations: [],
      stats,
    };
  }

  return {
    status: 'FAIL',
    summary: `Task scope evaluation failed with ${violations.length} violation(s).`,
    violations,
    stats,
  };
}
