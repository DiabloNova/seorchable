import { IProviderAdapter, IntegrationProvider } from "../domain/types";

export abstract class BaseProviderAdapter implements IProviderAdapter {
  constructor(public readonly provider: IntegrationProvider) {}

  abstract connect(tenantId: string, authData: any): Promise<{ externalResourceId: string | null; credentialReference: string | null }>;
  abstract validateConnection(tenantId: string, credentialReference: string): Promise<boolean>;

  async disconnect(tenantId: string, credentialReference: string): Promise<void> {
    // Override if the provider supports server-side token revocation
    return Promise.resolve();
  }
}
