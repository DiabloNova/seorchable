"use server";

import { WebsiteMonitoringConfig } from "../../features/ai-intelligence/domain/types";
import { WebsiteRepository, WebsiteMonitoringSnapshotRepository } from "../../features/ai-intelligence/repositories";
import { requireWorkspaceMembership } from "../../services/auth/authorization";
import { getSession } from "../../services/auth/session";
import { WebsiteMonitoringService } from "../../features/ai-intelligence/services/website-monitoring-service";
import { InMemoryJobRepository } from "../../services/jobs/repository";
import { JobService } from "../../services/jobs/service";
import { PostgresClient } from "../../features/admin/infrastructure/persistence/postgres";

// Helper to init service
function getMonitoringService() {
  const pg = PostgresClient.getInstance();
  const websiteRepo = new WebsiteRepository(pg);
  const jobRepo = new InMemoryJobRepository();
  const jobService = new JobService(jobRepo);
  const snapshotRepo = new WebsiteMonitoringSnapshotRepository(pg);

  return new WebsiteMonitoringService(websiteRepo, jobService, snapshotRepo);
}

export async function getWebsiteMonitoringConfigAction(websiteId: string): Promise<WebsiteMonitoringConfig | null> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user;
  await requireWorkspaceMembership(user.id, user.workspaceId);

  const pg = PostgresClient.getInstance();
  const websiteRepo = new WebsiteRepository(pg);
  const website = await websiteRepo.findById(user.workspaceId, websiteId);

  if (!website) {
    throw new Error("Website not found");
  }

  return website.monitoringConfig || null;
}

export async function updateWebsiteMonitoringConfigAction(
  websiteId: string,
  config: WebsiteMonitoringConfig
): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user;
  await requireWorkspaceMembership(user.id, user.workspaceId);

  const pg = PostgresClient.getInstance();
  const websiteRepo = new WebsiteRepository(pg);
  const website = await websiteRepo.findById(user.workspaceId, websiteId);

  if (!website) {
    throw new Error("Website not found");
  }

  website.monitoringConfig = config;
  await websiteRepo.save(website);

  // If enabled, ensure job is scheduled
  if (config.enabled) {
    const service = getMonitoringService();
    await service.scheduleMonitoringRun(user.workspaceId, websiteId);
  }

  return { success: true };
}

export async function triggerMonitoringRunAction(websiteId: string): Promise<{ success: boolean; jobId: string }> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user;
  await requireWorkspaceMembership(user.id, user.workspaceId);

  const service = getMonitoringService();
  const result = await service.scheduleMonitoringRun(user.workspaceId, websiteId);

  return {
    success: true,
    jobId: result.id
  };
}

export async function getLatestMonitoringSnapshotAction(websiteId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const user = session.user;
  await requireWorkspaceMembership(user.id, user.workspaceId);

  const pg = PostgresClient.getInstance();
  const snapshotRepo = new WebsiteMonitoringSnapshotRepository(pg);

  return await snapshotRepo.getLatestValidSnapshot(user.workspaceId, websiteId);
}
