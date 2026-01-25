
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


export interface Book {
    id: number;
    title: string;
    description: string;
    price: number;
    coverImage?: string;
    author: Author;
    categories: Category[];
    createdAt: string;
    filePath?: string;
}

export interface CreateBookRequest {
    title: string;
    description: string;
    price: number;
    coverImage?: string;
    authorId: number;
    categoryIds: number[];
}