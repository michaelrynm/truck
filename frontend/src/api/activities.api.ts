import axios from './axios';
import { ActivityLog, ActivityLogFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const activitiesApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await axios.get<ApiResponse<ActivityLog[]>>('/activities', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getMyActivities: async (params?: PaginationParams): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await axios.get<ApiResponse<ActivityLog[]>>('/activities/my-activities', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<ActivityLog> => {
    const response = await axios.get<ApiResponse<ActivityLog>>(`/activities/${id}`);
    return response.data.data!;
  },

  create: async (data: ActivityLogFormData): Promise<ActivityLog> => {
    const response = await axios.post<ApiResponse<ActivityLog>>('/activities', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<ActivityLogFormData>): Promise<ActivityLog> => {
    const response = await axios.put<ApiResponse<ActivityLog>>(`/activities/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/activities/${id}`);
  },
};
