import { BaseProviderAdapter } from "./base-adapter";

export class SlackAdapter extends BaseProviderAdapter {
  constructor() {
    super('slack');
  }

  async connect(tenantId: string, authData: { workspaceId: string, botToken: string }): Promise<{ externalResourceId: string | null; credentialReference: string | null }> {
    if (!authData.botToken || !authData.botToken.startsWith('xoxb-')) {
      throw new Error("Invalid Slack bot token");
    }

    // Mock GET /api/auth.test
    return {
      externalResourceId: authData.workspaceId || 'slack_workspace',
      credentialReference: `slack_ref_${Date.now()}`
    };
  }

  async validateConnection(tenantId: string, credentialReference: string): Promise<boolean> {
    if (!credentialReference) return false;
    return true;
  }
}
