
export interface ReadingProgress {
    id: number;
    bookId: number;
    userId: number;
    currentPage: number;
    totalPages: number;
    percentage: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    lastReadAt: string;
    isCompleted: boolean;
    bookTitle: string;
}
