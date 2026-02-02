import type { Category } from "../types";
import axiosInstance from '../../../lib/axios';

export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
};

export const createCategory = async (data: { name: string; description: string }): Promise<Category> => {
    const response = await axiosInstance.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: { name: string; description: string }): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
};
