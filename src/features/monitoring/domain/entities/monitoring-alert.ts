export interface MonitoringAlert {
  id: string;
  tenantId: string;
  monitoringConfigId: string;
  snapshotId: string;
  category: "technical" | "seo" | "content" | "availability";
  severity: "info" | "warning" | "critical";
  type: string;
  fingerprint: string;
  url: string | null;
  message: string;
  previousValue: unknown;
  currentValue: unknown;
  status: "open" | "resolved";
  createdAt: Date;
  resolvedAt: Date | null;
}
