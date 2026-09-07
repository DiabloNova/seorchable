import * as orchestratorMock from "../../src/services/crawler/crawler-orchestrator";
import { describe, test, mock } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../../src/app/api/v1/crawler/start/route";
import { NextRequest } from "next/server";
import { TenantContextManager } from "../../src/core/database/tenant-context";

// We mock the DB client to simulate actual DB queries during authorization without a real DB
describe("POST /api/v1/crawler/start", () => {
  const createRequest = (body: unknown, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost:3000/api/v1/crawler/start", {
      method: "POST",
      headers: new Headers(headers),
      body: JSON.stringify(body)
    });
  };

  test("rejects unauthenticated requests", async (t) => {
    const req = createRequest({ seedUrls: ["https://example.com"] });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 401);
    assert.equal(data.error, "Unauthorized");
  });

  test("rejects forged tenant headers via AuthorizeApiRequest", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      // Simulate DB query returning 0 rows (user doesn't belong to forged tenant)
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({
        query: async () => ({ rows: [] })
      }));
      return await cb();
    });

    const req = createRequest({ seedUrls: ["https://example.com"] }, { "x-tenant-id": "forged", "x-user-id": "forged" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 403);
    assert.equal(data.error, "Unauthorized");
    assert.equal(data.message, "Forbidden: User is not a member of the requested workspace.");
  });

  test("rejects cross-tenant reads/writes (enforced by AuthorizeApiRequest)", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      // Simulate DB query returning 0 rows (user-a doesn't belong to tenant-b)
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({
        query: async () => ({ rows: [] })
      }));
      return await cb();
    });

    const req = createRequest({ seedUrls: ["https://example.com"] }, { "x-tenant-id": "tenant-b", "x-user-id": "user-a" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 403);
    assert.match(data.message, /Forbidden/);
  });

  test("valid authenticated request succeeds", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      // Simulate DB query returning 1 row (user belongs to tenant)
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({
        query: async () => ({ rows: [{}] })
      }));
      return await cb();
    });

    // We also need to mock TenantContextManager.runWithTenantContext which orchestrator uses downstream
    (t as unknown).mock.method(TenantContextManager, "runWithTenantContext", async (tenantId, userId, reqId, cb) => {
      return await cb();
    });

    // And orchestrator dependencies

    (t as unknown).mock.method(orchestratorMock.CrawlerOrchestrator.prototype, "runCrawlerCampaign", async () => {
      return { totalUrlsFound: 1, totalTextsExtracted: 1, totalDocumentsIngested: 1, details: [] };
    });

    const req = createRequest({ seedUrls: ["https://example.com"] }, { "x-tenant-id": "valid-tenant", "x-user-id": "valid-user" });
    const res = await POST(req);
    assert.equal(res.status, 200);
  });

  test("rejects forged user id without session", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({
        query: async () => ({ rows: [] }) // not authorized for the requested tenant
      }));
      return await cb();
    });

    const req = createRequest({ seedUrls: ["https://example.com"] }, { "x-tenant-id": "valid-tenant", "x-user-id": "forged-user" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 403);
  });
});

// Add back the SSRF URL rejection tests ensuring 400 is raised after auth completes
describe("POST /api/v1/crawler/start - SSRF checks after Auth", () => {
  const createRequest = (body: unknown, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost:3000/api/v1/crawler/start", {
      method: "POST",
      headers: new Headers(headers),
      body: JSON.stringify(body)
    });
  };

  test("rejects invalid JSON body", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({ query: async () => ({ rows: [{}] }) }));
      return await cb();
    });
    const req = new NextRequest("http://localhost:3000/api/v1/crawler/start", {
      method: "POST",
      headers: new Headers({ "x-tenant-id": "valid", "x-user-id": "valid" }),
      body: "invalid-json"
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
  });

  test("rejects SSRF targets (localhost)", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({ query: async () => ({ rows: [{}] }) }));
      return await cb();
    });

    // Also mock DNS to ensure we don't accidentally leak
    import * as urlValidator from "../../src/services/crawler/url-validator";
    const original = urlValidator.isSafeUrlAsync;
    urlValidator.isSafeUrlAsync = async () => false;

    const req = createRequest({ seedUrls: ["http://localhost/admin"] }, { "x-tenant-id": "valid", "x-user-id": "valid" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.match(data.message, /Unsafe SSRF targets are blocked/);
    if (typeof original !== "undefined") urlValidator.isSafeUrlAsync = original;
  });

  test("rejects SSRF targets (private IPs like 127.0.0.1)", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({ query: async () => ({ rows: [{}] }) }));
      return await cb();
    });
    import * as urlValidator from "../../src/services/crawler/url-validator";
    const original = urlValidator.isSafeUrlAsync;
    urlValidator.isSafeUrlAsync = async () => false;

    const req = createRequest({ seedUrls: ["http://127.0.0.1:8080/"] }, { "x-tenant-id": "valid", "x-user-id": "valid" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.match(data.message, /Unsafe SSRF targets are blocked/);
    if (typeof original !== "undefined") urlValidator.isSafeUrlAsync = original;
  });

  test("rejects SSRF hostname to private IP mappings", async (t) => {
    (t as unknown).mock.method(TenantContextManager, "runWithSystemContext", async (userId, context, cb) => {
      (t as unknown).mock.method(TenantContextManager, "getDbClient", () => ({ query: async () => ({ rows: [{}] }) }));
      return await cb();
    });
    import * as urlValidator from "../../src/services/crawler/url-validator";
    urlValidator.isSafeUrlAsync = async () => false;

    const req = createRequest({ seedUrls: ["http://internal-corp-tool.local/"] }, { "x-tenant-id": "valid", "x-user-id": "valid" });
    const res = await POST(req);
    const data = await res.json();
    assert.equal(res.status, 400);
    assert.match(data.message, /Unsafe SSRF targets are blocked/);
    if (typeof original !== "undefined") urlValidator.isSafeUrlAsync = original;
  });
});
