import { JobError } from "./types";

export interface RetryPolicy {
  getDelay(attempt: number): number;
  isRetryable(error: JobError): boolean;
}

export class ExponentialBackoffRetryPolicy implements RetryPolicy {
  private baseDelayMs: number;
  private maxDelayMs: number;

  constructor(
    baseDelayMs: number = 1000,
    maxDelayMs: number = 10000
  ) {
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
  }

  getDelay(attempt: number): number {
    return Math.min(
      this.baseDelayMs * Math.pow(2, attempt - 1),
      this.maxDelayMs
    );
  }

  isRetryable(error: JobError): boolean {
    return error.retryable;
  }
}
