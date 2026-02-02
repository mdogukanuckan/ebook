import type { Book, CreateBookRequest, BookSearchRequest, PageResponse } from "../types";
import axiosInstance from '../../../lib/axios';

export const getBooks = async (): Promise<Book[]> => {
    const response = await axiosInstance.get('/books');
    return response.data;
};

export const searchBooks = async (request: BookSearchRequest, page: number = 0, size: number = 20): Promise<PageResponse<Book>> => {
    let url = `/books/search?page=${page}&size=${size}`;
    if (request.sort) {
        url += `&sort=${request.sort}`;
    }
    const response = await axiosInstance.post<PageResponse<Book>>(url, request);
    return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (formData: FormData): Promise<Book> => {
    const response = await axiosInstance.post('/books', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateBook = async (id: number, formData: FormData): Promise<Book> => {
    const response = await axiosInstance.put(`/books/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/books/${id}`);
};