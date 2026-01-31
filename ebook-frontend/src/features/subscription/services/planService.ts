import { axiosInstance } from '../../../lib/axios';
import type { Plan, CreatePlanRequest } from '../types/plan';

export const getAllPlans = async (): Promise<Plan[]> => {
    const response = await axiosInstance.get<Plan[]>('/plans');
    return response.data;
};

export const createPlan = async (data: CreatePlanRequest): Promise<Plan> => {
    const response = await axiosInstance.post<Plan>('/plans', data);
    return response.data;
};

export const updatePlan = async (id: number, data: CreatePlanRequest): Promise<Plan> => {
    const response = await axiosInstance.put<Plan>(`/plans/${id}`, data);
    return response.data;
};

export const deletePlan = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/plans/${id}`);
};
