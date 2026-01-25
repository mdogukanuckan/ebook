
export interface Plan {
    id: number;
    name: string;
    price: number;
    durationInDays: number;
    description: string;
}

export interface Subscription {
    id: number;
    user: { id: number; username: string };
    plan: Plan;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
