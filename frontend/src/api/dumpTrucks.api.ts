import axios from './axios';
import { DumpTruck, DumpTruckFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const dumpTrucksApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<DumpTruck>> => {
    const response = await axios.get<ApiResponse<DumpTruck[]>>('/dump-trucks', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<DumpTruck> => {
    const response = await axios.get<ApiResponse<DumpTruck>>(`/dump-trucks/${id}`);
    return response.data.data!;
  },

  create: async (data: DumpTruckFormData): Promise<DumpTruck> => {
    const response = await axios.post<ApiResponse<DumpTruck>>('/dump-trucks', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<DumpTruckFormData>): Promise<DumpTruck> => {
    const response = await axios.put<ApiResponse<DumpTruck>>(`/dump-trucks/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/dump-trucks/${id}`);
  },
};
