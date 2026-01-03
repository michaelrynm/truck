import axios from './axios';
import { LoginCredentials, AuthResponse, User, ApiResponse } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await axios.post('/auth/logout');
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await axios.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return response.data.data!;
  },

  me: async (): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};
