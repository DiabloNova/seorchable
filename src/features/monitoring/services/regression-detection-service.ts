import { SnapshotChangeResult, RegressionResult } from "../domain/types";

export class RegressionDetectionService {
  private readonly REDUCTION_THRESHOLD_PERCENT = 40; // Example threshold rule provided for the test conditions

  /**
   * Evaluates the differences from change detection to detect if those differences represent a regression.
   */
  public detectRegression(
    changes: SnapshotChangeResult
  ): RegressionResult {
    if (!changes.hasChanges) {
      return { isRegression: false };
    }

    const contentChange = changes.changes.find(c => c.field === "extractedContent");

    if (contentChange) {
      const prevContent = typeof contentChange.previousValue === 'string' ? contentChange.previousValue : '';
      const newContent = typeof contentChange.newValue === 'string' ? contentChange.newValue : '';

      const prevLength = prevContent.length;
      const newLength = newContent.length;

      // Rule: Full content wipe / severe loss
      if (prevLength > 0 && newLength === 0) {
          return {
              isRegression: true,
              severity: "critical",
              reason: "Content was completely removed",
              eventMetadata: {
                  previousLength: prevLength,
                  newLength: newLength
              }
          };
      }

      // Rule: Threshold-based loss (exactly equivalent to or greater than reduction threshold)
      if (prevLength > 0) {
          const reductionPercent = ((prevLength - newLength) / prevLength) * 100;
          if (reductionPercent >= this.REDUCTION_THRESHOLD_PERCENT) {
              return {
                  isRegression: true,
                  severity: "high",
                  reason: `Content size was reduced by ${reductionPercent.toFixed(2)}%`,
                  eventMetadata: {
                      previousLength: prevLength,
                      newLength: newLength,
                      reductionPercent
                  }
              };
          }
      }
    }

    return {
      isRegression: false
    };
  }
}
