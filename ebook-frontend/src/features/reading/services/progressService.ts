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
        status: (data.completed ?? data.isCompleted) ? 'COMPLETED' : 'IN_PROGRESS'
    };
};

export const updateReadingProgress = async (bookId: number, currentPage: number): Promise<ReadingProgress> => {
    const response = await axiosInstance.post('/reading-progress/update', { bookId, currentPage });
    return response.data;
};

interface ReadingProgressDto {
    id: number;
    bookId: number;
    bookTitle?: string;
    currentPage: number;
    totalPage: number;
    progressPercentage: number;
    lastReadAt: string;
    completed: boolean;
}

export const getUserProgressList = async (): Promise<ReadingProgress[]> => {
    const response = await axiosInstance.get<ReadingProgressDto[]>('/reading-progress/my-library');
    return response.data.map(data => ({
        id: data.id,
        bookId: data.bookId,
        userId: 0,
        currentPage: data.currentPage,
        totalPages: data.totalPage,
        percentage: data.progressPercentage,
        status: data.completed ? 'COMPLETED' : 'IN_PROGRESS',
        lastReadAt: data.lastReadAt,
        isCompleted: data.completed || data.currentPage >= data.totalPage,
        bookTitle: data.bookTitle || 'Unknown Book'
    }));
};
