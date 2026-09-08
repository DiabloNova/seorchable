import { execSync } from 'child_process';
import { readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { GitFileChange, FileChangeStatus } from './types';

/**
 * Inspects the actual Git working tree to identify changed, added, deleted,
 * renamed, and untracked files along with changed line counts.
 */
export function getWorkingTreeChanges(cwd: string = process.cwd()): GitFileChange[] {
  const changesMap = new Map<string, GitFileChange>();

  // 1. Run git diff --numstat HEAD to get changed line counts for tracked files
  try {
    const numstatOutput = execSync('git diff --numstat HEAD', {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (numstatOutput) {
      const lines = numstatOutput.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split('\t');
        if (parts.length >= 3) {
          const rawAdditions = parts[0];
          const rawDeletions = parts[1];
          let filepath = parts[2];
          let oldPath: string | undefined;

          // Binary files show "-" for additions/deletions
          const additions = rawAdditions === '-' ? 0 : parseInt(rawAdditions, 10) || 0;
          const deletions = rawDeletions === '-' ? 0 : parseInt(rawDeletions, 10) || 0;

          if (parts.length >= 4) {
            oldPath = parts[2];
            filepath = parts[3];
          }

          changesMap.set(filepath, {
            path: filepath,
            oldPath,
            status: oldPath ? 'renamed' : 'modified',
            additions,
            deletions,
            changedLines: additions + deletions,
          });
        }
      }
    }
  } catch {
    // HEAD might not exist or git diff failed
  }

  // 2. Run git status --porcelain -uall to detect untracked, added, deleted, renamed statuses
  try {
    const statusOutput = execSync('git status --porcelain -uall', {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (statusOutput) {
      const lines = statusOutput.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        const indexCode = line[0];
        const workCode = line[1];
        const rest = line.slice(3).trim();

        let filepath = rest;
        let oldPath: string | undefined;

        if (rest.includes(' -> ')) {
          const parts = rest.split(' -> ');
          oldPath = parts[0];
          filepath = parts[1];
        }

        let status: FileChangeStatus = 'modified';
        if (indexCode === '?' && workCode === '?') {
          status = 'untracked';
        } else if (indexCode === 'A' || workCode === 'A') {
          status = 'added';
        } else if (indexCode === 'D' || workCode === 'D') {
          status = 'deleted';
        } else if (indexCode === 'R' || workCode === 'R') {
          status = 'renamed';
        }

        const existing = changesMap.get(filepath);
        if (existing) {
          existing.status = status;
          if (oldPath) existing.oldPath = oldPath;
        } else {
          let additions = 0;
          let deletions = 0;

          if (status === 'untracked' || status === 'added') {
            additions = countFileLines(join(cwd, filepath));
          }

          changesMap.set(filepath, {
            path: filepath,
            oldPath,
            status,
            additions,
            deletions,
            changedLines: additions + deletions,
          });
        }
      }
    }
  } catch {
    // status failed
  }

  return Array.from(changesMap.values());
}

function countFileLines(fullPath: string): number {
  if (!existsSync(fullPath)) return 0;
  try {
    const stat = statSync(fullPath);
    if (!stat.isFile()) return 0;
    const content = readFileSync(fullPath, 'utf-8');
    if (!content) return 0;
    return content.split('\n').length;
  } catch {
    return 0;
  }
}
