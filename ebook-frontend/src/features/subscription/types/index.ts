export * from './plan';

export type SubscriptionTier = 'FREE' | 'PREMIUM' | 'VIP';

export interface Subscription {
    id: number;
    userId: number;
    username: string;
    plan: SubscriptionTier;
    price: number;
    currency: string;
    startDate: string;
    endDate: string | null;
    autoRenew: boolean;
    active: boolean;
}
