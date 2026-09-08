export type VerdictStatus = 'PASS' | 'FAIL' | 'BLOCKED' | 'INSUFFICIENT_EVIDENCE';

export type ViolationType =
  | 'SCOPE_VIOLATION'
  | 'FORBIDDEN_PATH'
  | 'LINE_BUDGET_EXCEEDED'
  | 'UNINTENDED_ARTIFACT'
  | 'GIT_ERROR';

export interface Violation {
  type: ViolationType;
  path?: string;
  details: string;
}

export interface TaskContract {
  allowedPaths: string[];
  forbiddenPaths: string[];
  maxChangedLines: number;
  taskType?: string;
  boundaryInfo?: Record<string, unknown>;
}

export type FileChangeStatus = 'added' | 'modified' | 'deleted' | 'renamed' | 'untracked';

export interface GitFileChange {
  path: string;
  oldPath?: string;
  status: FileChangeStatus;
  additions: number;
  deletions: number;
  changedLines: number;
}

export interface SupervisorStats {
  changedFilesCount: number;
  addedFilesCount: number;
  deletedFilesCount: number;
  renamedFilesCount: number;
  totalChangedLines: number;
}

export interface SupervisorVerdict {
  status: VerdictStatus;
  summary: string;
  violations: Violation[];
  stats: SupervisorStats;
}
