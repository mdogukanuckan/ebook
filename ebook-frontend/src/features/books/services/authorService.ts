import type { Author } from "../types";
import axiosInstance from '../../../lib/axios';

export const getAuthors = async (): Promise<Author[]> => {
    const response = await axiosInstance.get('/authors');
    return response.data;
};

export const createAuthor = async (name: string, biography: string): Promise<Author> => {
    const response = await axiosInstance.post('/authors', { name, biography });
    return response.data;
};
