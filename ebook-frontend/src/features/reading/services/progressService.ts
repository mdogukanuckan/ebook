import type { ReadingProgress } from "../types";
import axiosInstance from '../../../lib/axios';

export const getReadingProgress = async (bookId: number): Promise<ReadingProgress> => {
    const response = await axiosInstance.get(`/reading-progress/${bookId}`);
    
    const data = response.data;
    return {
        ...data,
        totalPages: data.totalPage || data.totalPages, 
        percentage: data.progressPercentage || data.percentage,
        userId: 0, 
        status: data.isCompleted ? 'COMPLETED' : 'IN_PROGRESS'
    };
};

export const updateReadingProgress = async (bookId: number, currentPage: number): Promise<ReadingProgress> => {
    const response = await axiosInstance.post('/reading-progress', { bookId, currentPage });
    return response.data;
};

export const getUserProgressList = async (): Promise<ReadingProgress[]> => {
    const response = await axiosInstance.get<any[]>('/reading-progress/my');
    return response.data.map(data => ({
        ...data,
        totalPages: data.totalPage || data.totalPages,
        percentage: data.progressPercentage || data.percentage,
        isCompleted: data.completed || data.isCompleted || (data.currentPage >= (data.totalPage || data.totalPages)),
        bookTitle: data.bookTitle || 'Unknown Book'
    }));
};
