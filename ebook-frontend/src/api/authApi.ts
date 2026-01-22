import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/types';
import axiosInstance from './axiosInstance';



export const authApi = {

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {

    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },


  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await axiosInstance.post<User>('/auth/register', userData);
    return response.data;
  },


  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};