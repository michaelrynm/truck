import axios from './axios';
import { OperationsReport, EfficiencyReport, DriverReport, ContractReport, ApiResponse } from '@/types';

export const reportsApi = {
  getOperationsReport: async (params: {
    startDate: string;
    endDate: string;
    contractId?: string;
  }): Promise<OperationsReport> => {
    const response = await axios.get<ApiResponse<OperationsReport>>('/reports/operations', { params });
    return response.data.data!;
  },

  getEfficiencyReport: async (): Promise<EfficiencyReport[]> => {
    const response = await axios.get<ApiResponse<EfficiencyReport[]>>('/reports/efficiency');
    return response.data.data!;
  },

  getDriverReport: async (startDate: string, endDate: string): Promise<DriverReport[]> => {
    const response = await axios.get<ApiResponse<DriverReport[]>>('/reports/drivers', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  getContractReport: async (startDate: string, endDate: string): Promise<ContractReport[]> => {
    const response = await axios.get<ApiResponse<ContractReport[]>>('/reports/contracts', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  exportReport: async (params: {
    format: 'pdf' | 'excel';
    startDate: string;
    endDate: string;
  }): Promise<Blob> => {
    const response = await axios.get('/reports/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
