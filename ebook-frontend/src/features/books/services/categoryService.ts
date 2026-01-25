import type { Category } from "../types";
import axiosInstance from '../../../lib/axios';

export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
};

export const createCategory = async (name: string, description: string): Promise<Category> => {
    const response = await axiosInstance.post('/categories', { name, description });
    return response.data;
};
