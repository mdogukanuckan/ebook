
export interface Author {
    id: number;
    name: string;
    biography: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export type RequiredPlan = 'FREE' | 'PREMIUM' | 'VIP';

export interface Book {
    id: number;
    title: string;
    description: string;
    requiredPlan: RequiredPlan;
    coverImage?: string;
    author: Author;
    categories: Category[];
    createdAt: string;
    filePath?: string;
    pageCount: number;
    isbn: string;
}

export interface CreateBookRequest {
    title: string;
    description: string;
    requiredPlan: RequiredPlan;
    coverImage?: string;
    authorId: number;
    categoryIds: number[];
    isbn: string;
    pageCount: number;
}

export interface BookSearchRequest {
    query?: string;
    categoryIds?: number[];
    authorIds?: number[];
    sort?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}