/**
 * Axios Instance Configuration
 * 
 * Centralized Axios configuration with interceptors for:
 * - Authentication (JWT token injection)
 * - Request/Response logging
 * - Error handling
 * - Token refresh logic
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/environment';

/**
 * Create the main Axios instance with base configuration
 */
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * Automatically adds JWT token to requests if available
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');

        // Add token to Authorization header if it exists
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development mode
        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            });
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Handles common response scenarios and errors
 */
axiosInstance.interceptors.response.use(
    (response) => {
        // Log response in development mode
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            });
        }

        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Log error in development mode
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
                data: error.response?.data,
            });
        }

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear auth data and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');

            // Redirect to login page
            window.location.href = '/login';

            return Promise.reject(error);
        }

        // Handle 403 Forbidden - Insufficient permissions
        if (error.response?.status === 403) {
            console.error('🚫 Access Denied: Insufficient permissions');
            // You can redirect to an unauthorized page or show a notification
        }

        // Handle 404 Not Found
        if (error.response?.status === 404) {
            console.error('🔍 Resource not found');
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('🔥 Server Error: Please try again later');
        }

        // Handle Network Errors
        if (!error.response) {
            console.error('🌐 Network Error: Please check your internet connection');
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        // Check if error response has a message
        const message = error.response?.data?.message || error.response?.data?.error;
        if (message) return message;

        // Fallback to status text
        if (error.response?.statusText) return error.response.statusText;

        // Network error
        if (error.message) return error.message;
    }

    // Generic error
    return 'An unexpected error occurred';
};

export default axiosInstance;
