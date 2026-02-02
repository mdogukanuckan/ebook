
import axiosInstance from '../../../lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }
};

export const refreshToken = async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh');
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};