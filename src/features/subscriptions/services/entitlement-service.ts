import { SubscriptionService } from "./subscription-service";

export class EntitlementService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Evaluates if the tenant has access to a feature, and returns the limit configuration.
   */
  async getFeatureEntitlement(organizationId: string, featureName: string): Promise<{
    hasAccess: boolean;
    limit: number | 'unlimited' | null;
  }> {
    const sub = await this.subscriptionService.getEffectiveSubscription(organizationId);

    // If no active subscription, default to free or reject
    // Here we assume if they have no row, they have no access.
    // If we want a fallback 'free' plan, we could load it here.
    if (!sub || !this.subscriptionService.isSubscriptionActive(sub)) {
      return { hasAccess: false, limit: null };
    }

    const plan = await this.subscriptionService.getPlan(sub.planId);
    if (!plan || !plan.features) {
      return { hasAccess: false, limit: null };
    }

    const featureConfig = plan.features[featureName];

    if (featureConfig === undefined || featureConfig === false) {
      return { hasAccess: false, limit: null };
    }

    if (featureConfig === true) {
      return { hasAccess: true, limit: 'unlimited' };
    }

    if (featureConfig === 'unlimited') {
      return { hasAccess: true, limit: 'unlimited' };
    }

    if (typeof featureConfig === 'number') {
      return { hasAccess: true, limit: featureConfig };
    }

    return { hasAccess: false, limit: null };
  }
}
