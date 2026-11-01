
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

// The backend uses stateless JWTs and has no logout or refresh endpoint,
// so signing out only clears the stored credentials.
export const logout = async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};