import { IntegrationProvider, IntegrationConnection } from "../domain/types";
import { IntegrationRepository } from "../repositories/integration-repository";
import { ProviderAdapterFactory } from "../adapters";
import { TenantContextManager } from "../../../core/database/tenant-context";

export class IntegrationService {
  private repository: IntegrationRepository;

  constructor() {
    this.repository = new IntegrationRepository();
  }

  async connect(tenantId: string, provider: IntegrationProvider, authData: any, userId: string): Promise<IntegrationConnection> {
    return await TenantContextManager.runWithTenantContext(tenantId, userId, "integration-connect", async () => {
      const adapter = ProviderAdapterFactory.getAdapter(provider);

      const { externalResourceId, credentialReference } = await adapter.connect(tenantId, authData);

      const isConfigValid = await adapter.validateConnection(tenantId, credentialReference || "");
      if (!isConfigValid) {
        throw new Error("Provider validation failed");
      }

      return await this.repository.saveConnection({
        tenantId,
        provider,
        status: 'validated',
        externalResourceId,
        metadata: {},
        credentialReference,
        lastValidatedAt: new Date(),
        lastError: null
      });
    });
  }

  async disconnect(tenantId: string, provider: IntegrationProvider, userId: string): Promise<void> {
    return await TenantContextManager.runWithTenantContext(tenantId, userId, "integration-disconnect", async () => {
      const connection = await this.repository.getConnection(tenantId, provider);
      if (connection) {
        const adapter = ProviderAdapterFactory.getAdapter(provider);
        if (connection.credentialReference) {
           await adapter.disconnect(tenantId, connection.credentialReference);
        }
        await this.repository.removeConnection(tenantId, provider);
      }
    });
  }

  async getConnectionStatus(tenantId: string, provider: IntegrationProvider, userId: string): Promise<IntegrationConnection | null> {
    return await TenantContextManager.runWithTenantContext(tenantId, userId, "integration-status", async () => {
      return await this.repository.getConnection(tenantId, provider);
    });
  }
}
