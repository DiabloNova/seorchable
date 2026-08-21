import { PostgresClient } from "../../admin/infrastructure/persistence/postgres";
import { WebhookEvent, IntegrationProvider } from "../domain/types";

export class WebhookRepository {
  private pg: PostgresClient;

  constructor() {
    this.pg = PostgresClient.getInstance();
  }

  async saveEvent(event: Omit<WebhookEvent, "id" | "receivedAt">): Promise<WebhookEvent | null> {
    const sql = `
      INSERT INTO webhook_events (tenant_id, provider, event_id, payload, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (tenant_id, provider, event_id) DO NOTHING
      RETURNING *;
    `;
    const params = [
      event.tenantId, event.provider, event.eventId, event.payload, event.status
    ];

    // Idempotency: Will return null if duplicate event_id per provider/tenant exists
    const res = await this.pg.query(sql, params);
    if (!res.rows || res.rows.length === 0) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      tenantId: row.tenant_id,
      provider: row.provider as IntegrationProvider,
      eventId: row.event_id,
      payload: row.payload,
      receivedAt: new Date(row.received_at),
      processedAt: row.processed_at ? new Date(row.processed_at) : null,
      status: row.status as any,
    };
  }
}
