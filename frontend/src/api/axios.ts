import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Get error message from backend response
    const backendMessage = error.response?.data?.message;

    if (status === 403) {
      toast.error(backendMessage || 'Access denied. You do not have permission.');
    } else if (status === 404) {
      toast.error(backendMessage || 'Resource not found');
    } else if (status === 500) {
      toast.error(backendMessage || 'Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
