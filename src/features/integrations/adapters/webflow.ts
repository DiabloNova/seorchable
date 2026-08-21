import { BaseProviderAdapter } from "./base-adapter";

export class WebflowAdapter extends BaseProviderAdapter {
  constructor() {
    super('webflow');
  }

  async connect(tenantId: string, authData: { siteId: string, accessToken: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.siteId || !authData.accessToken) {
      throw new Error("Missing webflow parameters");
    }

    // Mock GET /v2/sites/{site_id}
    return {
      externalResourceId: authData.siteId,
      credentialReference: `webflow_ref_${Date.now()}`
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
