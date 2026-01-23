/**
 * Authentication API Service
 * 
 * Handles all authentication-related API calls:
 * - User login
 * - User registration
 * - Token refresh
 * - Logout
 */

import axiosInstance from '../../../lib/axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

/**
 * Register a new user
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return response.data;
};

/**
 * Logout user (optional: call backend to invalidate token)
 */
export const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }
};

/**
 * Refresh access token (if your backend supports it)
 */
export const refreshToken = async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh');
    return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
};