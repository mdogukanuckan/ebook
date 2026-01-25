import type { Subscription, Plan } from "../types";
import axiosInstance from '../../../lib/axios';

export const getPlans = async (): Promise<Plan[]> => {
    const response = await axiosInstance.get('/plans');
    return response.data;
};

export const subscribeToPlan = async (planId: number): Promise<Subscription> => {
    const response = await axiosInstance.post('/subscriptions', { planId });
    return response.data;
};

export const cancelSubscription = async (): Promise<void> => {
    await axiosInstance.post('/subscriptions/cancel');
};

export const getCurrentSubscription = async (): Promise<Subscription> => {
    const response = await axiosInstance.get('/subscriptions/me');
    return response.data;
};
