import { BaseProviderAdapter } from "./base-adapter";

export class ShopifyAdapter extends BaseProviderAdapter {
  constructor() {
    super('shopify');
  }

  async connect(tenantId: string, authData: { shopName: string, accessToken: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.shopName || !authData.accessToken) {
      throw new Error("Missing shop parameters");
    }

    // Mock GET /admin/api/2024-01/shop.json
    return {
      externalResourceId: authData.shopName,
      credentialReference: `shopify_ref_${Date.now()}`
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
