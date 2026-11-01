import type { SubscriptionTier } from './types';

export const TIER_LABELS: Record<SubscriptionTier, string> = {
    FREE: 'Ücretsiz',
    PREMIUM: 'Premium',
    VIP: 'VIP',
};

export const formatPrice = (price: number, currency: string): string =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(price);
