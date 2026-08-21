import { BaseProviderAdapter } from "./base-adapter";

export class GoogleAnalyticsAdapter extends BaseProviderAdapter {
  constructor() {
    super('google_analytics');
  }

  async connect(tenantId: string, authData: { propertyId: string, oauthToken: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.oauthToken || !authData.oauthToken.startsWith('ya29.')) {
      throw new Error("Invalid OAuth token");
    }

    return {
      externalResourceId: authData.propertyId,
      credentialReference: `ga_ref_${Date.now()}`
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
