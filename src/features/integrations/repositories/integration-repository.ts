import { PostgresClient } from "../../admin/infrastructure/persistence/postgres";
import { IntegrationConnection, WebhookEvent } from "../domain/types";
import { TenantContextManager } from "../../../core/database/tenant-context";

export class IntegrationRepository {
  private pg: PostgresClient;

  constructor() {
    this.pg = PostgresClient.getInstance();
  }

  async saveConnection(conn: Omit<IntegrationConnection, "id" | "createdAt" | "updatedAt">): Promise<IntegrationConnection> {
    const sql = `
      INSERT INTO integration_connections (tenant_id, provider, status, external_resource_id, metadata, credential_reference)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tenant_id, provider) DO UPDATE SET
        status = EXCLUDED.status,
        external_resource_id = EXCLUDED.external_resource_id,
        metadata = EXCLUDED.metadata,
        credential_reference = EXCLUDED.credential_reference,
        updated_at = NOW()
      RETURNING *;
    `;
    const params = [
      conn.tenantId, conn.provider, conn.status, conn.externalResourceId, conn.metadata, conn.credentialReference
    ];

    // RLS bounds apply to tenantId
    const res = await this.pg.query(sql, params);
    const row = res.rows[0];

    return {
      id: row.id,
      tenantId: row.tenant_id,
      provider: row.provider as any,
      status: row.status as any,
      externalResourceId: row.external_resource_id,
      metadata: row.metadata,
      credentialReference: row.credential_reference,
      lastValidatedAt: row.last_validated_at ? new Date(row.last_validated_at) : null,
      lastError: row.last_error,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async getConnection(tenantId: string, provider: string): Promise<IntegrationConnection | null> {
    const sql = `SELECT * FROM integration_connections WHERE tenant_id = $1 AND provider = $2 LIMIT 1;`;
    const res = await this.pg.query(sql, [tenantId, provider]);
    if (!res.rows || res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      tenantId: row.tenant_id,
      provider: row.provider as any,
      status: row.status as any,
      externalResourceId: row.external_resource_id,
      metadata: row.metadata,
      credentialReference: row.credential_reference,
      lastValidatedAt: row.last_validated_at ? new Date(row.last_validated_at) : null,
      lastError: row.last_error,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async removeConnection(tenantId: string, provider: string): Promise<void> {
    const sql = `DELETE FROM integration_connections WHERE tenant_id = $1 AND provider = $2;`;
    await this.pg.query(sql, [tenantId, provider]);
  }
}
