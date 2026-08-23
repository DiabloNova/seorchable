import { createHash } from "crypto";
import { CrawlSnapshot, SnapshotChangeResult } from "../domain/types";

export class ChangeDetectionService {
  /**
   * Deterministically hash string content.
   */
  public hashContent(content: string | null): string | null {
    if (content === null) return null;
    return createHash("sha256").update(content, "utf8").digest("hex");
  }

  /**
   * Compares the current snapshot with the previous snapshot to detect any meaningful changes.
   */
  public detectChanges(
    previousSnapshot: CrawlSnapshot | null,
    currentSnapshot: CrawlSnapshot
  ): SnapshotChangeResult {
    const changes = [];
    let hasChanges = false;

    // Normalize properties for current snapshot comparison
    const currentHash = this.hashContent(currentSnapshot.extractedContent ?? null);
    const prevHash = previousSnapshot ? this.hashContent(previousSnapshot.extractedContent ?? null) : null;
    const isInitialSnapshot = previousSnapshot === null;

    if (isInitialSnapshot) {
      return {
        hasChanges: false, // Ensure that an initial snapshot does not trigger regression alerts artificially
        changes: [
          {
            field: "extractedContent",
            previousValue: null,
            newValue: currentSnapshot.extractedContent
          }
        ]
      };
    }

    if (prevHash !== currentHash) {
      hasChanges = true;
      changes.push({
        field: "contentHash",
        previousValue: prevHash,
        newValue: currentHash
      });
      changes.push({
        field: "extractedContent",
        previousValue: previousSnapshot.extractedContent,
        newValue: currentSnapshot.extractedContent
      });
    }

    return {
      hasChanges,
      changes
    };
  }
}
