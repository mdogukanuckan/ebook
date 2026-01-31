import axiosInstance from '../../../lib/axios';
import type { UserUpdateData, PasswordChangeData } from '../../auth/types/auth'; // Keeping cross-feature dependency for now or should move these types too?
// Actually UserUpdateData and PasswordChangeData seem like User feature concerns, but they are defined in auth/types.
// For now import them from auth.
import type { User } from '../types';

const userService = {
    getCurrentUser: async () => {
        const response = await axiosInstance.get<User>('/users/me');
        return response.data;
    },

    updateProfile: async (userId: number, data: UserUpdateData) => {
        const response = await axiosInstance.put<User>(`/users/${userId}`, data);
        return response.data;
    },

    changePassword: async (userId: number, data: PasswordChangeData) => {
        const response = await axiosInstance.put(`/users/${userId}/password`, data);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await axiosInstance.get<User[]>('/users');
        return response.data;
    },

    updateUserByAdmin: async (userId: number, data: { roles?: string[]; enabled?: boolean }) => {
        const response = await axiosInstance.put<User>(`/users/${userId}/admin`, data);
        return response.data;
    }
};

export default userService;
