import axios from './axios';
import { Schedule, ScheduleFormData, ApiResponse, PaginatedResponse, PaginationParams } from '@/types';

export const schedulesApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Schedule>> => {
    const response = await axios.get<ApiResponse<Schedule[]>>('/schedules', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  getById: async (id: string): Promise<Schedule> => {
    const response = await axios.get<ApiResponse<Schedule>>(`/schedules/${id}`);
    return response.data.data!;
  },

  create: async (data: ScheduleFormData): Promise<Schedule> => {
    const response = await axios.post<ApiResponse<Schedule>>('/schedules', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<ScheduleFormData>): Promise<Schedule> => {
    const response = await axios.put<ApiResponse<Schedule>>(`/schedules/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/schedules/${id}`);
  },

  getMySchedules: async (params?: PaginationParams): Promise<PaginatedResponse<Schedule>> => {
    const response = await axios.get<ApiResponse<Schedule[]>>('/schedules', { params });
    return {
      data: response.data.data!,
      pagination: response.data.pagination!,
    };
  },

  checkAvailability: async (params: {
    dumpTruckId: string;
    driverId: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<{ available: boolean; message?: string }> => {
    const response = await axios.get<ApiResponse<{ available: boolean; message?: string }>>(
      '/schedules/availability/check',
      { params }
    );
    return response.data.data!;
  },
};
