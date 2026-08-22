import { Website, WebsiteMonitoringConfig } from "../domain/types";
import { IWebsiteRepository } from "../repositories/interfaces";
import { JobService } from "../../../services/jobs/service";
import { Job } from "../../../services/jobs/types";

import { IWebsiteMonitoringSnapshotRepository } from "../repositories/interfaces";
import { secureCrawl } from "../../../lib/audit-engine/crawler";
import { extractSignals } from "../../../lib/audit-engine/extractor";
import { AuditLogger } from "../../../lib/audit-engine/logger";

export class WebsiteMonitoringService {
  constructor(
    private readonly websiteRepo: IWebsiteRepository,
    private readonly jobService: JobService,
    private readonly snapshotRepo: IWebsiteMonitoringSnapshotRepository
  ) {}

  public async executeMonitoringJob(job: Job): Promise<void> {
    if (!job.metadata || !job.metadata.websiteId) {
      throw new Error("Invalid job metadata: missing websiteId");
    }
    const websiteId = job.metadata.websiteId as string;
    const organizationId = job.tenantId;

    const website = await this.websiteRepo.findById(organizationId, websiteId);
    if (!website) {
      throw new Error(`Website ${websiteId} not found`);
    }

    if (!website.monitoringConfig?.enabled) {
      return; // disabled gracefully
    }

    const logger = new AuditLogger(job.id);
    let crawlResult;
    try {
      crawlResult = await secureCrawl(website.normalizedUrl, logger);
    } catch (error) {
      await this.snapshotRepo.save({
        id: "",
        organizationId,
        websiteId,
        jobId: job.id,
        status: "failed",
        snapshotData: { error: String(error) },
        createdAt: new Date()
      });
      throw error;
    }

    const signals = await extractSignals(crawlResult, 100, logger);

    const previousSnapshot = await this.snapshotRepo.getLatestValidSnapshot(organizationId, websiteId);

    const newSnapshotData = {
      technical: signals.technical,
      content: signals.content,
      seo: {
        title: signals.metadata.title,
        description: signals.metadata.description
      }
    };

    const newSnapshot = await this.snapshotRepo.save({
      id: "",
      organizationId,
      websiteId,
      jobId: job.id,
      status: "valid",
      snapshotData: newSnapshotData,
      createdAt: new Date()
    });

    if (previousSnapshot && previousSnapshot.snapshotData) {
      await this.compareSnapshotsAndGenerateAlerts(organizationId, websiteId, previousSnapshot.snapshotData, newSnapshotData);
    }
  }

  private async compareSnapshotsAndGenerateAlerts(organizationId: string, websiteId: string, prevData: any, newData: any) {
    // Basic change detection logic as per Task 10.0 requirements
    const alerts = [];

    // 1. Technical Regressions
    if (prevData.technical?.statusCode === 200 && newData.technical?.statusCode !== 200) {
      alerts.push({ type: "TECHNICAL_REGRESSION", message: `Status changed from 200 to ${newData.technical.statusCode}`, previous: 200, current: newData.technical.statusCode });
    }
    if (prevData.technical?.hasCanonical && !newData.technical?.hasCanonical) {
      alerts.push({ type: "TECHNICAL_REGRESSION", message: "Canonical tag went missing", previous: true, current: false });
    }

    // 2. SEO Regressions
    if (prevData.technical?.robotsTxtAllowed && !newData.technical?.robotsTxtAllowed) {
      alerts.push({ type: "SEO_REGRESSION", message: "Page became non-indexable (robots blocked)", previous: true, current: false });
    }
    if (prevData.seo?.title && !newData.seo?.title) {
      alerts.push({ type: "SEO_REGRESSION", message: "Title tag disappeared", previous: prevData.seo?.title, current: null });
    }

    // 3. Content Changes
    if (prevData.seo?.title !== newData.seo?.title) {
      alerts.push({ type: "CONTENT_CHANGE", message: `Title changed from "${prevData.seo?.title}" to "${newData.seo?.title}"`, previous: prevData.seo?.title, current: newData.seo?.title });
    }

    // We use the established audit_records table for domain alerts
    const PostgresClient = require("@/features/admin/infrastructure/persistence/postgres").PostgresClient;
    const pg = PostgresClient.getInstance();

    for (const alert of alerts) {
      const sql = `
        INSERT INTO audit_records (
          actor_id, actor_email, actor_role, action, resource_type, resource_id, ip_address, user_agent, payload_after, status, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      await pg.query(sql, [
        "system-monitoring",
        "system@seorchable.ir",
        "system",
        alert.type,
        "website",
        websiteId,
        "127.0.0.1",
        "CoreIntelligenceAuditEngine/1.0",
        JSON.stringify({ message: alert.message, previous: alert.previous, current: alert.current }),
        "SUCCESS",
        new Date().toISOString()
      ]);

      console.log(`[${organizationId}] Alert for website ${websiteId} generated in audit_records: ${alert.type} - ${alert.message}`);
    }
  }

  public async scheduleMonitoringRun(organizationId: string, websiteId: string): Promise<Job> {
    const website = await this.websiteRepo.findById(organizationId, websiteId);
    if (!website) {
      throw new Error(`Website ${websiteId} not found`);
    }

    if (!website.monitoringConfig?.enabled) {
      throw new Error("Monitoring is not enabled for this website");
    }

    const idempotencyKey = `website_monitoring:${websiteId}:${new Date().toISOString().split('T')[0]}`;

    return await this.jobService.createJob({
      type: "website_monitoring",
      idempotencyKey,
      metadata: { websiteId, domain: website.domain }
    });
  }
}
