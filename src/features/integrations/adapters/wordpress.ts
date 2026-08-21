import { BaseProviderAdapter } from "./base-adapter";

export class WordPressAdapter extends BaseProviderAdapter {
  constructor() {
    super('wordpress');
  }

  async connect(tenantId: string, authData: { siteUrl: string, applicationPassword: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.siteUrl || !authData.applicationPassword) {
      throw new Error("Missing required connection parameters");
    }

    // Mock minimal read request e.g. GET /wp-json/
    return {
      externalResourceId: authData.siteUrl,
      credentialReference: `wp_ref_${Date.now()}`
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
