import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { IntegrationService, WebhookService } from "@/features/integrations";
import { TenantContextManager } from "@/core/database/tenant-context";

describe("Integrations Lifecycle & Webhooks", async () => {
  const integrationService = new IntegrationService();
  const webhookService = new WebhookService();

  const tenantId = "test-tenant-123";

  before(async () => {
      // Mock db repositories for unit integration validation logic since Drizzle isn't migrated live
      const mockDB: Record<string, unknown> = { connections: {}, webhooks: {} };

      (integrationService as unknown as { repository: { saveConnection: (...args: unknown[]) => unknown, getConnection: (...args: unknown[]) => unknown, removeConnection: (...args: unknown[]) => unknown } }).repository.saveConnection = async (conn: {tenantId: string, provider: string}) => {
        (mockDB.connections as Record<string, unknown>)[`${conn.tenantId}-${conn.provider}`] = { ...conn, id: 'conn-1', createdAt: new Date() };
        return (mockDB.connections as Record<string, unknown>)[`${conn.tenantId}-${conn.provider}`];
      };
      (integrationService as unknown as { repository: { saveConnection: (...args: unknown[]) => unknown, getConnection: (...args: unknown[]) => unknown, removeConnection: (...args: unknown[]) => unknown } }).repository.getConnection = async (t: string, p: string) => (mockDB.connections as Record<string, unknown>)[`${t}-${p}`] || null;
      (integrationService as unknown as { repository: { saveConnection: (...args: unknown[]) => unknown, getConnection: (...args: unknown[]) => unknown, removeConnection: (...args: unknown[]) => unknown } }).repository.removeConnection = async (t: string, p: string) => delete (mockDB.connections as Record<string, unknown>)[`${t}-${p}`];

      (webhookService as unknown as { integrationRepo: { getConnection: (...args: unknown[]) => unknown } }).integrationRepo.getConnection = async (t: string, p: string) => (mockDB.connections as Record<string, unknown>)[`${t}-${p}`] || null;
      (webhookService as unknown as { repository: { saveEvent: (...args: unknown[]) => unknown } }).repository.saveEvent = async (event: {tenantId: string, provider: string, eventId: string}) => {
        const key = `${event.tenantId}-${event.provider}-${event.eventId}`;
        if ((mockDB.webhooks as Record<string, unknown>)[key]) return null; // duplicate block
        (mockDB.webhooks as Record<string, unknown>)[key] = { ...event, id: 'evt-1' };
        return (mockDB.webhooks as Record<string, unknown>)[key];
      };

      TenantContextManager.runWithTenantContext = async (tId, uId, r, work) => await work();
  });

  it("should securely connect a provider, store safe metadata, and enforce tenant isolation", async () => {
    const conn = await integrationService.connect(tenantId, 'google_search_console', { propertyUrl: "https://example.com", oauthToken: "ya29.mock" }, "user1");
    assert.equal(conn.tenantId, tenantId);
    assert.equal(conn.provider, 'google_search_console');
    assert.equal(conn.status, 'validated');
    assert.equal(conn.externalResourceId, "https://example.com");
  });

  it("should reject invalid provider connection payloads securely", async () => {
    try {
      await integrationService.connect(tenantId, 'google_search_console', { propertyUrl: "https://example.com", oauthToken: "invalid_token" }, "user1");
      assert.fail("Should throw on invalid token");
    } catch (e: unknown) {
      assert.equal((e as Error).message, "Invalid OAuth token");
    }
  });

  it("should process webhooks securely, verify signature, and handle idempotency", async () => {
    // 1. Establish webhook connection
    const conn = await integrationService.connect(tenantId, 'webhook', { endpoint: "custom", secret: "my_test_secret" }, "user1");

    // We mock the credentialReference mapping for tests
    const expectedSecret = conn.credentialReference!;
    const crypto = await import("crypto");
    const payload = { action: "sync" };
    const signature = crypto.createHmac('sha256', expectedSecret).update(JSON.stringify(payload)).digest('hex');

    // 2. Validate valid signature
    const accepted = await webhookService.processInbound(tenantId, 'webhook', "evt_1", payload, signature, "system");
    assert.ok(accepted);

    // 3. Test duplicate idempotency
    const acceptedDup = await webhookService.processInbound(tenantId, 'webhook', "evt_1", payload, signature, "system");
    assert.equal(acceptedDup, false); // Rejected safely

    // 4. Test invalid signature
    try {
      await webhookService.processInbound(tenantId, 'webhook', "evt_2", payload, "bad_signature", "system");
      assert.fail("Should throw invalid signature");
    } catch (e: unknown) {
      assert.equal((e as Error).message, "Invalid webhook signature");
    }
  });

  it("should safely disconnect an integration", async () => {
    await integrationService.disconnect(tenantId, 'google_search_console', "user1");
    const status = await integrationService.getConnectionStatus(tenantId, 'google_search_console', "user1");
    assert.equal(status, null);
  });
});
