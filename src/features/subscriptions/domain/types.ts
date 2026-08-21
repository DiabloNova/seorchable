export type SubscriptionPlanId = 'free' | 'professional' | 'business' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';

export interface Plan {
  id: SubscriptionPlanId;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  features: Record<string, boolean | number | 'unlimited'>;
}

export interface TenantSubscription {
  id: string;
  organizationId: string;
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface TenantCredit {
  id: string;
  organizationId: string;
  balance: number;
}

export interface TenantUsage {
  id: string;
  organizationId: string;
  featureName: string;
  usedCount: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface TenantQuota {
  id: string;
  organizationId: string;
  resourceName: string;
  usedCount: number;
  limitCount: number;
  resetAt: Date | null;
}
