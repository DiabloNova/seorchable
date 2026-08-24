import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { TenantContextManager } from "../../../core/database/tenant-context";
import { monitoringAlerts } from "../../../../database/schema";
import { MonitoringAlert } from "../domain/entities/monitoring-alert";

export class MonitoringAlertRepository {
  public async findOpenByFingerprint(
    fingerprint: string
  ): Promise<MonitoringAlert | null> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const ctx = TenantContextManager.getContext();
    const db = drizzle(ctx?.dbClient || (global as any).pgClient);

    const rows = await db
      .select()
      .from(monitoringAlerts)
      .where(and(
        eq(monitoringAlerts.fingerprint, fingerprint),
        eq(monitoringAlerts.status, "open"),
        eq(monitoringAlerts.organizationId, tenantId)
      ))
      .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      id: row.id,
      tenantId: row.organizationId,
      monitoringConfigId: row.monitoringConfigId,
      snapshotId: row.snapshotId,
      category: row.category as any,
      severity: row.severity as any,
      type: row.type,
      fingerprint: row.fingerprint,
      url: row.url,
      message: row.message,
      previousValue: row.previousValue,
      currentValue: row.currentValue,
      status: row.status as any,
      createdAt: row.createdAt,
      resolvedAt: row.resolvedAt
    };
  }

  public async create(alert: MonitoringAlert): Promise<MonitoringAlert> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const ctx = TenantContextManager.getContext();
    const db = drizzle(ctx?.dbClient || (global as any).pgClient);

    const rows = await db
      .insert(monitoringAlerts)
      .values({
        id: alert.id,
        organizationId: tenantId,
        monitoringConfigId: alert.monitoringConfigId,
        snapshotId: alert.snapshotId,
        category: alert.category,
        severity: alert.severity,
        type: alert.type,
        fingerprint: alert.fingerprint,
        url: alert.url,
        message: alert.message,
        previousValue: alert.previousValue,
        currentValue: alert.currentValue,
        status: alert.status,
        createdAt: alert.createdAt,
        resolvedAt: alert.resolvedAt
      })
      .returning();

    const row = rows[0];
    return {
      id: row.id,
      tenantId: row.organizationId,
      monitoringConfigId: row.monitoringConfigId,
      snapshotId: row.snapshotId,
      category: row.category as any,
      severity: row.severity as any,
      type: row.type,
      fingerprint: row.fingerprint,
      url: row.url,
      message: row.message,
      previousValue: row.previousValue,
      currentValue: row.currentValue,
      status: row.status as any,
      createdAt: row.createdAt,
      resolvedAt: row.resolvedAt
    };
  }

  public async resolve(
    id: string,
    resolvedAt: Date
  ): Promise<void> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const ctx = TenantContextManager.getContext();
    const db = drizzle(ctx?.dbClient || (global as any).pgClient);

    await db
      .update(monitoringAlerts)
      .set({
        status: "resolved",
        resolvedAt
      })
      .where(and(
        eq(monitoringAlerts.id, id),
        eq(monitoringAlerts.organizationId, tenantId)
      ));
  }
}

  public async findOpenAlertsByConfig(monitoringConfigId: string): Promise<MonitoringAlert[]> {
    const tenantId = TenantContextManager.getRequiredTenantId();
    const ctx = TenantContextManager.getContext();
    const db = drizzle(ctx?.dbClient || (global as any).pgClient);

    const rows = await db
      .select()
      .from(monitoringAlerts)
      .where(and(
        eq(monitoringAlerts.monitoringConfigId, monitoringConfigId),
        eq(monitoringAlerts.status, "open"),
        eq(monitoringAlerts.organizationId, tenantId)
      ));

    return rows.map(row => ({
      id: row.id,
      tenantId: row.organizationId,
      monitoringConfigId: row.monitoringConfigId,
      snapshotId: row.snapshotId,
      category: row.category as any,
      severity: row.severity as any,
      type: row.type,
      fingerprint: row.fingerprint,
      url: row.url,
      message: row.message,
      previousValue: row.previousValue,
      currentValue: row.currentValue,
      status: row.status as any,
      createdAt: row.createdAt,
      resolvedAt: row.resolvedAt
    }));
  }
