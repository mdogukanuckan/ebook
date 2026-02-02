
export interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    durationDays: number;
    subscriptionPlan: 'FREE' | 'PREMIUM' | 'VIP';
    active: boolean;
}

export interface CreatePlanRequest {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    subscriptionPlan: 'FREE' | 'PREMIUM' | 'VIP';
}
