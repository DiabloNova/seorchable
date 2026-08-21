import { NextResponse, NextRequest } from "next/server";
import { WebhookService, IntegrationProvider } from "@/features/integrations";

// Generic webhook intake
// Resolves the provider via route parameter
export async function POST(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: providerRaw } = await params;
  const provider = providerRaw as IntegrationProvider;

  // Basic sanity validation
  if (!['google_search_console', 'google_analytics', 'wordpress', 'shopify', 'webflow', 'slack', 'webhook'].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  // Tenant resolution generally via header/params for webhooks (or path like /api/v1/integrations/webhook/tenantId/provider)
  // For simulation we pull tenant ID safely from an identifying param, relying on signature verification
  // to ensure authenticity before executing.
  const tenantId = req.headers.get("x-tenant-id") || req.nextUrl.searchParams.get("tenantId");
  if (!tenantId) {
    return NextResponse.json({ error: "Missing tenant identification" }, { status: 400 });
  }

  const signature = req.headers.get("x-signature") || "";
  const eventId = req.headers.get("x-event-id") || `evt_${Date.now()}`;

  try {
    const payload = await req.json();

    const webhookService = new WebhookService();
    const accepted = await webhookService.processInbound(tenantId, provider, eventId, payload, signature, "system");

    if (!accepted) {
      return NextResponse.json({ status: "ignored_duplicate" }, { status: 200 });
    }

    return NextResponse.json({ status: "accepted" }, { status: 202 });
  } catch (error: unknown) {
    const message = (error as Error).message;
    if (message === "Invalid webhook signature" || message.includes("No active integration")) {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
