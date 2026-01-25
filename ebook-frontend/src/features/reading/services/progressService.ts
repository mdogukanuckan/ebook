import type { ReadingProgress } from "../types";
import axiosInstance from '../../../lib/axios';

export const getReadingProgress = async (bookId: number): Promise<ReadingProgress> => {
    const response = await axiosInstance.get(`/reading-progress/${bookId}`);
    return response.data;
};

export const updateReadingProgress = async (bookId: number, currentPage: number): Promise<ReadingProgress> => {
    const response = await axiosInstance.post('/reading-progress', { bookId, currentPage });
    return response.data;
};
