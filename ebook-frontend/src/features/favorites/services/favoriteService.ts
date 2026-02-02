import axiosInstance from '../../../lib/axios';

export interface FavoriteItem {
    id: number;
    bookId: number;
    bookTitle: string;
    bookCoverImage: string;
    authorName: string;
    addedAt: string;
}

export const getFavorites = async (): Promise<FavoriteItem[]> => {
    const response = await axiosInstance.get('/favorites');
    return response.data;
};

export const toggleFavorite = async (bookId: number): Promise<void> => {
    await axiosInstance.post(`/favorites/${bookId}/toggle`);
};

export const checkIfFavorite = async (bookId: number): Promise<boolean> => {
    const response = await axiosInstance.get(`/favorites/${bookId}/check`);
    return response.data;
};
