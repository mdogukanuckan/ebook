export * from './plan';

export interface Subscription {
    id: number;
    user: { id: number; username: string };
    plan: import('./plan').Plan;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
