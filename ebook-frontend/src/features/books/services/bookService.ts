import type { Book, CreateBookRequest, BookSearchRequest, PageResponse } from "../types";
import axiosInstance from '../../../lib/axios';

export const getBooks = async (): Promise<Book[]> => {
    const response = await axiosInstance.get('/books');
    return response.data;
};

export const searchBooks = async (request: BookSearchRequest, page: number = 0, size: number = 20): Promise<PageResponse<Book>> => {
    const response = await axiosInstance.post<PageResponse<Book>>(`/books/search?page=${page}&size=${size}`, request);
    return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (book: CreateBookRequest): Promise<Book> => {
    const response = await axiosInstance.post('/books', book);
    return response.data;
};

export const updateBook = async (id: number, book: Partial<CreateBookRequest>): Promise<Book> => {
    const response = await axiosInstance.put(`/books/${id}`, book);
    return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/books/${id}`);
};