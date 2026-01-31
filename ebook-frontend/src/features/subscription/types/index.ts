export * from './plan';
// Plan interface is now exported from ./plan.ts

export interface Subscription {
    id: number;
    user: { id: number; username: string };
    plan: import('./plan').Plan;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
