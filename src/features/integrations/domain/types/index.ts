export type IntegrationProvider = 'google_search_console' | 'google_analytics' | 'wordpress' | 'shopify' | 'webflow' | 'slack' | 'webhook';

export type IntegrationStatus = 'disconnected' | 'connecting' | 'connected' | 'validated' | 'error';

export interface IntegrationConnection {
  id: string;
  tenantId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  externalResourceId: string | null;
  metadata: Record<string, any>;
  credentialReference: string | null; // e.g. encrypted vault key, oauth state id, or secure hash. NEVER plaintext token.
  lastValidatedAt: Date | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProviderAdapter {
  provider: IntegrationProvider;
  connect(tenantId: string, authData: any): Promise<{ externalResourceId: string | null; credentialReference: string | null }>;
  validateConnection(tenantId: string, credentialReference: string): Promise<boolean>;
  disconnect(tenantId: string, credentialReference: string): Promise<void>;
}

export interface WebhookEvent {
  id: string;
  tenantId: string;
  provider: IntegrationProvider;
  eventId: string;
  payload: Record<string, any>;
  receivedAt: Date;
  processedAt: Date | null;
  status: 'pending' | 'processed' | 'failed' | 'rejected_duplicate';
}
