import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { runAudit } from "@/lib/inngest/functions/run-audit";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runAudit],
});
