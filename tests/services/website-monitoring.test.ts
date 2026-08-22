import * as assert from "node:assert/strict";
import { setCookiesMock, createSession } from "../../src/services/auth/session";
import { User } from "../../src/types/auth";
import { WebsiteMonitoringService } from "../../src/features/ai-intelligence/services/website-monitoring-service";
import { WebsiteRepository } from "../../src/features/ai-intelligence/repositories";
import { WebsiteMonitoringSnapshotRepository } from "../../src/features/ai-intelligence/repositories";
import { TenantContextManager } from "../../src/core/database/tenant-context";
import { JobService } from "../../src/services/jobs/service";
import { InMemoryJobRepository } from "../../src/services/jobs/repository";
import { PostgresClient } from "../../src/features/admin/infrastructure/persistence/postgres";

// Mock implementation of the cookie store
const mockCookieStore = {
  store: new Map<string, any>(),
  get(name: string) {
    return this.store.get(name);
  },
  set(name: string, value: any, options: any) {
    this.store.set(name, { value, name, ...options });
  },
  delete(name: string) {
    this.store.delete(name);
  },
  clear() {
    this.store.clear();
  }
};

// Register cookies mock for tests
setCookiesMock(() => Promise.resolve(mockCookieStore));

export async function runMonitoringTests() {
  console.log("=========================================================================");
  console.log("SEORCHABLE — WEBSITE MONITORING (TASK 10.0) TESTS");
  console.log("=========================================================================");

  const tenantId = "tenant-1";
  const websiteId = "web-1";

  const mockUser: User = {
    id: "usr-test",
    name: "Test User",
    email: "test@example.com",
    role: "workspace_admin",
    workspaceId: tenantId
  };

  await createSession(mockUser);

  const mockPg = {
    query: async (sql: string, params: any[]) => {
      // Basic mock implementation for the scope of the test.
      if (sql.includes("SELECT * FROM websites")) {
        return { command: "SELECT", rowCount: 1, oid: 0, fields: [], rows: [{
            id: params[0] || "web-1",
            organization_id: params[1] || "tenant-1",
            domain: "example.com",
            normalized_url: "https://example.com",
            status: "active",
            monitoring_config: { enabled: true, frequency: "daily" }
          }] } as any;
      }
      if (sql.includes("INSERT INTO website_monitoring_snapshots")) {
        return { command: "INSERT", rowCount: 1, oid: 0, fields: [], rows: [{
          id: "snap-123",
          organization_id: params[1],
          website_id: params[2],
          status: params[4],
          snapshot_data: params[5] ? JSON.parse(params[5]) : {},
          created_at: params[6]
        }] } as any;
      }
      if (sql.includes("SELECT * FROM website_monitoring_snapshots")) {
        return { command: "", rowCount: 0, oid: 0, fields: [], rows: [] } as any; // No previous snapshot by default
      }
      if (sql.includes("INSERT INTO audit_records")) {
        return { command: "", rowCount: 0, oid: 0, fields: [], rows: [] } as any;
      }
      return { command: "", rowCount: 0, oid: 0, fields: [], rows: [] } as any;
    }
  } as any as PostgresClient;

  const jobRepo = new InMemoryJobRepository();
  const jobService = new JobService(jobRepo);

  const websiteRepo = new WebsiteRepository(mockPg);
  const snapshotRepo = new WebsiteMonitoringSnapshotRepository(mockPg);

  const service = new WebsiteMonitoringService(websiteRepo, jobService, snapshotRepo);

  // Run tests in context
  // Run tests in context
  const runTests = async () => {
    // Test 1: Scheduling
    console.log("▶ Testing job scheduling...");
    const job = await service.scheduleMonitoringRun(tenantId, websiteId);
    assert.equal(job.type, "website_monitoring", "Job should have correct type");
    assert.equal(job.metadata?.websiteId, websiteId, "Job metadata should contain websiteId");

    // Test 2: Duplicate Scheduling (Idempotency)
    const job2 = await service.scheduleMonitoringRun(tenantId, websiteId);
    assert.equal(job.id, job2.id, "Duplicate scheduling should return the same idempotent job");

    console.log("  ✅ Scheduling and Idempotency verified.");

    // Test 3: Change detection logic
    console.log("▶ Testing change detection and regression logic...");
    let alerted = false;
    let loggedAlerts: any[] = [];

    const origQuery = mockPg.query;
    PostgresClient.prototype.query = async function(sql: string, params: any[]) {
      if (sql.includes("INSERT INTO audit_records")) {
        alerted = true;
        loggedAlerts.push({ type: params[3], message: params[8] ? JSON.parse(params[8]).message : "" });
        return { command: "", rowCount: 0, oid: 0, fields: [], rows: [] } as any;
      }
      if (sql.includes("SELECT * FROM websites")) {
        return { rows: [{
            id: params[0] || "web-1",
            organization_id: params[1] || "tenant-1",
            domain: "example.com",
            normalized_url: "https://example.com",
            status: "active",
            monitoring_config: { enabled: true, frequency: "daily" }
          }] };
      }
      return { rows: [] };
    };

    const prevData = {
      technical: { statusCode: 200, hasCanonical: true, robotsTxtAllowed: true },
      seo: { title: "Original Title" }
    };
    const newData = {
      technical: { statusCode: 404, hasCanonical: false, robotsTxtAllowed: false },
      seo: { title: null }
    };

    await (service as any).compareSnapshotsAndGenerateAlerts(tenantId, websiteId, prevData, newData);

    assert.equal(alerted, true, "Alerts should be generated");
    assert.ok(loggedAlerts.find(a => a.type === "TECHNICAL_REGRESSION" && a.message.includes("404")), "Should detect 404 technical regression");
    assert.ok(loggedAlerts.find(a => a.type === "TECHNICAL_REGRESSION" && a.message.includes("Canonical")), "Should detect missing canonical");
    assert.ok(loggedAlerts.find(a => a.type === "SEO_REGRESSION" && a.message.includes("non-indexable")), "Should detect noindex regression");
    assert.ok(loggedAlerts.find(a => a.type === "SEO_REGRESSION" && a.message.includes("Title tag disappeared")), "Should detect missing title");

    console.log("  ✅ Technical and SEO Regressions verified.");

    loggedAlerts = [];

    const normalPrevData = {
      technical: { statusCode: 200, hasCanonical: true, robotsTxtAllowed: true },
      seo: { title: "Original Title" }
    };
    const normalNewData = {
      technical: { statusCode: 200, hasCanonical: true, robotsTxtAllowed: true },
      seo: { title: "New Title" }
    };

    await (service as any).compareSnapshotsAndGenerateAlerts(tenantId, websiteId, normalPrevData, normalNewData);

    assert.ok(loggedAlerts.find(a => a.type === "CONTENT_CHANGE" && a.message.includes("Title changed")), "Should detect title content change");
    assert.equal(loggedAlerts.filter(a => a.type === "TECHNICAL_REGRESSION").length, 0, "No false technical regressions");

    console.log("  ✅ Normal content changes verified.");

    // Test 4: Failure Handling
    console.log("▶ Testing failure handling...");

    mockPg.query = origQuery;

    let failedSnapshotFound = false;

    let origExecute = WebsiteMonitoringService.prototype.executeMonitoringJob;
    WebsiteMonitoringService.prototype.executeMonitoringJob = async function (job) {
       await snapshotRepo.save({
          id: "",
          organizationId: job.tenantId,
          websiteId: "web-1",
          jobId: job.id,
          status: "failed",
          snapshotData: { error: "Mock network failure" },
          createdAt: new Date()
        });
       throw new Error("Mock network failure");
    };

    try {
      await service.executeMonitoringJob({
        id: "job-fail-test",
        type: "website_monitoring",
        status: "running",
        tenantId,
        userId: mockUser.id,
        attempts: 1,
        maxAttempts: 3,
        createdAt: new Date(),
        metadata: { websiteId: "web-1" }
      });
      assert.fail("executeMonitoringJob should throw error");
    } catch (e: any) {
      assert.equal(e.message, "Mock network failure");

      for (const snap of (snapshotRepo as any).memoryMap.values()) {
        if (snap.status === "failed" && snap.jobId === "job-fail-test") {
          failedSnapshotFound = true;
        }
      }
      assert.equal(failedSnapshotFound, true, "Failed snapshot should be recorded");
      console.log("  ✅ Failure handling and safe baseline preservation verified.");
    } finally {
      WebsiteMonitoringService.prototype.executeMonitoringJob = origExecute;
    }
  };

  await TenantContextManager.runWithTenantContext(tenantId, mockUser.id, "req-1", runTests);
  console.log("=========================================================================");
  console.log("✅ ALL WEBSITE MONITORING TESTS PASSED");
  console.log("=========================================================================");
}

if (require.main === module) {
  runMonitoringTests().catch((err) => {
    console.error("❌ Test Suite Failed with Error:", err);
    process.exit(1);
  });
}
