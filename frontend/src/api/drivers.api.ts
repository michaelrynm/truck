import axios from './axios';
import { Driver, DriverFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const driversApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Driver>> => {
    const response = await axios.get<ApiResponse<Driver[]>>('/drivers', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<Driver> => {
    const response = await axios.get<ApiResponse<Driver>>(`/drivers/${id}`);
    return response.data.data!;
  },

  create: async (data: DriverFormData): Promise<Driver> => {
    const response = await axios.post<ApiResponse<Driver>>('/drivers', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<DriverFormData>): Promise<Driver> => {
    const response = await axios.put<ApiResponse<Driver>>(`/drivers/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/drivers/${id}`);
  },
};
