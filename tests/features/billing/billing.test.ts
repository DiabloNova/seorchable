import assert from "node:assert/strict";
import { billingService } from "../../../src/features/billing/services/billing-service";
import { TenantContextManager } from "../../../src/core/database/tenant-context";

// B. Executed without PostgreSQL:
export async function testBillingSimulations() {
    try {
        await TenantContextManager.runWithSystemContext('sys', 'sys', async () => {
            // Context violation because billingService requires tenant context
            await billingService.createCheckoutSession("invalid_plan");
        });
        assert.fail("Should throw on invalid tenant");
    } catch(e: any) {
        assert.match(e.message, /Tenant Context Violation/);
    }
    console.log("✅ Billing validation logic verified.");
}

testBillingSimulations().catch(console.error);
