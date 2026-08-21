"use server";

import { requireSession } from "@/services/auth/session";
import { requireWorkspaceMembership, requireRole } from "@/services/auth/authorization";
import { TenantContextManager } from "@/core/database/tenant-context";
import { billingService } from "@/features/billing/services/billing-service";

export async function createCheckoutSessionAction(planId: string) {
  const session = await requireSession();
  if (!session.user) throw new Error("Unauthorized");
  await requireRole("workspace_admin", session.user.workspaceId);

  return await TenantContextManager.runWithTenantContext(session.user.workspaceId, session.user.id, "ctx-checkout", async () => {
      return await billingService.createCheckoutSession(planId);
  });
}

export async function downgradeSubscriptionAction(targetPlanId: string) {
  const session = await requireSession();
  if (!session.user) throw new Error("Unauthorized");
  await requireRole("workspace_admin", session.user.workspaceId);

  return await TenantContextManager.runWithTenantContext(session.user.workspaceId, session.user.id, "ctx-downgrade", async () => {
      await billingService.downgradeSubscription(targetPlanId);
      return { success: true };
  });
}

export async function cancelSubscriptionAction() {
  const session = await requireSession();
  if (!session.user) throw new Error("Unauthorized");
  await requireRole("workspace_admin", session.user.workspaceId);

  return await TenantContextManager.runWithTenantContext(session.user.workspaceId, session.user.id, "ctx-cancel-sub", async () => {
      await billingService.cancelSubscription();
      return { success: true };
  });
}

export async function getInvoicesAction() {
  const session = await requireSession();
  if (!session.user) throw new Error("Unauthorized");
  await requireWorkspaceMembership(session.user.id, session.user.workspaceId);

  return await TenantContextManager.runWithTenantContext(session.user.workspaceId, session.user.id, "ctx-get-invoices", async () => {
      return await billingService.getInvoices();
  });
}

export async function getPaymentHistoryAction() {
  const session = await requireSession();
  if (!session.user) throw new Error("Unauthorized");
  await requireWorkspaceMembership(session.user.id, session.user.workspaceId);

  return await TenantContextManager.runWithTenantContext(session.user.workspaceId, session.user.id, "ctx-get-payments", async () => {
      return await billingService.getPaymentHistory();
  });
}
