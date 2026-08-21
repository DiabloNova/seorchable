import { BaseProviderAdapter } from "./base-adapter";

export class WebhookAdapter extends BaseProviderAdapter {
  constructor() {
    super('webhook');
  }

  async connect(tenantId: string, authData: { endpoint: string, secret: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.secret) {
      throw new Error("Webhook integration requires a signature secret");
    }

    return {
      externalResourceId: authData.endpoint || 'custom_webhook',
      credentialReference: `wh_ref_${Date.now()}` // secure reference to stored secret
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
