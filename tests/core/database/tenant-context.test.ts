import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TenantContextManager } from "../../../src/core/database/tenant-context/index";
import { PostgresClient } from "../../../src/features/admin/infrastructure/persistence/postgres";

describe("TenantContextManager Lifecycle", () => {
  it("should provide a real DB client in runWithSystemContext", async () => {
    let capturedClient = null;
    let released = false;

    // Stub out the PostgresClient
    const pgClient = PostgresClient.getInstance();
    const originalConnect = pgClient.connectClient;

    pgClient.connectClient = async () => {
      const client = {
        query: async () => {},
        release: () => {
          released = true;
        }
      };
      return client as any;
    };

    try {
      await TenantContextManager.runWithSystemContext("test-user", "req-1", async () => {
        capturedClient = TenantContextManager.getDbClient();
        assert.ok(capturedClient !== null);
      });

      assert.ok(released, "Client should be released after successful execution");
    } finally {
      pgClient.connectClient = originalConnect;
    }
  });

  it("should release DB client in runWithSystemContext on error", async () => {
    let released = false;

    // Stub out the PostgresClient
    const pgClient = PostgresClient.getInstance();
    const originalConnect = pgClient.connectClient;

    pgClient.connectClient = async () => {
      const client = {
        query: async () => {},
        release: () => {
          released = true;
        }
      };
      return client as any;
    };

    try {
      try {
        await TenantContextManager.runWithSystemContext("test-user", "req-1", async () => {
          throw new Error("Test error");
        });
      } catch (e) {
        // Expected error
      }

      assert.ok(released, "Client should be released after failed execution");
    } finally {
      pgClient.connectClient = originalConnect;
    }
  });
});
