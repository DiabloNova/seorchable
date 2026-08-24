import { MonitoringConfigRepository } from "../repositories/monitoring-config-repository";
import { CrawlSnapshotRepository } from "../repositories/crawl-snapshot-repository";
import { MonitoringAlertRepository } from "../repositories/monitoring-alert-repository";
import { ChangeDetectionService } from "../services/change-detection-service";
import { RegressionDetectionService } from "../services/regression-detection-service";
import { ContentChangeDetectionService } from "../services/content-change-detection-service";
import { AlertGenerationService } from "../services/alert-generation-service";
import { CrawlSnapshot, SnapshotPage } from "../domain/entities/crawl-snapshot";
import { randomUUID } from "crypto";

export class RunMonitoring {
  constructor(
    private configRepo: MonitoringConfigRepository,
    private snapshotRepo: CrawlSnapshotRepository,
    private alertRepo: MonitoringAlertRepository,
    private changeDetection: ChangeDetectionService,
    private regressionDetection: RegressionDetectionService,
    private contentDetection: ContentChangeDetectionService,
    private alertGeneration: AlertGenerationService,
    private crawlProvider: any // Inject the real firecrawl provider here
  ) {}

  public async execute(input: { monitoringConfigId: string }): Promise<void> {
    const config = await this.configRepo.findById(input.monitoringConfigId);
    if (!config || !config.enabled) {
      return;
    }

    // Load previous BEFORE creating new snapshot
    const previousSnapshot = await this.snapshotRepo.findLatestSuccessful(config.id);

    // 1. Execute Firecrawl
    let crawlResult;
    try {
      // Execute the real provider
      crawlResult = await this.crawlProvider.crawl(config.crawlUrl);
    } catch (error) {
      console.error("Crawl failed", error);
      throw error;
    }

    // Adapt the crawlResult to SnapshotPage. Since we use the real FirecrawlCrawlProvider,
    // it returns CrawlResult { items: CrawlItem[] }
    const pages: SnapshotPage[] = crawlResult.items.map((item: any) => ({
      url: item.url,
      statusCode: item.statusCode || 200, // Make a best guess if missing
      indexable: true, // simplified mapping
      canonicalUrl: item.canonicalUrl || null,
      title: item.title || null,
      metaDescription: item.metaDescription || null,
      h1: item.h1 || null,
      robotsDirective: null,
      contentHash: this.changeDetection.hashContent(item.content || ""),
      wordCount: (item.content || "").split(/\s+/).length,
      crawlable: true,
      brokenLinksCount: 0
    }));

    const newSnapshot: CrawlSnapshot = {
      id: randomUUID(),
      tenantId: config.tenantId,
      monitoringConfigId: config.id,
      websiteId: config.websiteId,
      capturedAt: new Date(),
      pages,
      totalPages: pages.length,
      indexablePages: pages.length,
      nonIndexablePages: 0,
      error4xxCount: pages.filter(p => p.statusCode && p.statusCode >= 400 && p.statusCode < 500).length,
      error5xxCount: pages.filter(p => p.statusCode && p.statusCode >= 500).length,
      robotsTxtAvailable: true,
      sitemapAvailable: true
    };

    await this.snapshotRepo.create(newSnapshot);

    if (!previousSnapshot) {
       // First snapshot, baseline only.
       return;
    }

    // 4. Run change detection
    const changes = this.changeDetection.detectChanges(previousSnapshot, newSnapshot);

    // 5. Run regression detection
    const regressions = this.regressionDetection.detectRegressions(changes, previousSnapshot, newSnapshot);

    // 6. Run content detection
    const contentRegressions = this.contentDetection.detectContentChanges(changes);
    const allRegressions = [...regressions, ...contentRegressions];

    // 7. Alert Generation & Deduplication
    const alertsToCreate = this.alertGeneration.generateAlerts(
      config.tenantId,
      config.id,
      newSnapshot.id,
      allRegressions
    );

    const openAlertsCurrentRun = new Set<string>();

    for (const alertData of alertsToCreate) {
      const openAlert = await this.alertRepo.findOpenByFingerprint(alertData.fingerprint);
      openAlertsCurrentRun.add(alertData.fingerprint);

      if (!openAlert) {
         await this.alertRepo.create({
           ...alertData,
           id: randomUUID(),
           createdAt: new Date(),
           resolvedAt: null
         });
      }
    }

    // Alert Recovery - If it's not in openAlertsCurrentRun but is currently open, resolve it.
    // Fetch all currently open alerts for this config
    const openAlerts = await this.alertRepo.findOpenAlertsByConfig(config.id);
    const now = new Date();

    for (const alert of openAlerts) {
       if (!openAlertsCurrentRun.has(alert.fingerprint)) {
          await this.alertRepo.resolve(alert.id, now);
       }
    }
  }
}
