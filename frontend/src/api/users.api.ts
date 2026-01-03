import axios from './axios';
import { User, UserFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const usersApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
    const response = await axios.get<ApiResponse<User[]>>('/users', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  create: async (data: UserFormData): Promise<User> => {
    const response = await axios.post<ApiResponse<User>>('/users', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<UserFormData>): Promise<User> => {
    const response = await axios.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },
};
