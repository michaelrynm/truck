import axios from './axios';
import { Contract, ContractFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const contractsApi = {
  getAll: async (status?: string, paginationParams?: PaginationParams): Promise<PaginatedResponse<Contract>> => {
    const params = { ...(status && { status }), ...paginationParams };
    const response = await axios.get<ApiResponse<Contract[]>>('/contracts', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<Contract> => {
    const response = await axios.get<ApiResponse<Contract>>(`/contracts/${id}`);
    return response.data.data!;
  },

  create: async (data: ContractFormData): Promise<Contract> => {
    const response = await axios.post<ApiResponse<Contract>>('/contracts', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<ContractFormData>): Promise<Contract> => {
    const response = await axios.put<ApiResponse<Contract>>(`/contracts/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/contracts/${id}`);
  },
};
