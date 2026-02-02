import type { Author } from "../types";
import axiosInstance from '../../../lib/axios';

export const getAuthors = async (): Promise<Author[]> => {
    const response = await axiosInstance.get('/authors');
    return response.data;
};

export const createAuthor = async (data: { name: string; biography: string }): Promise<Author> => {
    const response = await axiosInstance.post('/authors', data);
    return response.data;
};

export const updateAuthor = async (id: number, data: { name: string; biography: string }): Promise<Author> => {
    const response = await axiosInstance.put(`/authors/${id}`, data);
    return response.data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/authors/${id}`);
};
