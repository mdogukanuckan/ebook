import type { User } from '../../../types/auth';

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    userId: number;
    username: string;
    roles: string[];
    email: string;
    firstName?: string;
    lastName?: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserUpdateData {
    firstName: string;
    lastName: string;
    email: string;
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}