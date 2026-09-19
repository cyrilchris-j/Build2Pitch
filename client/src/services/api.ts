import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, AuthResponseData, RegisterPayload, User, Team } from '@/types';



/**
 * Base API client configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token when available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('build2pitch_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform response and error unwrap
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Centralized API error handling
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected network error occurred';

    console.error('[API Error]:', {
      status: error.response?.status,
      url: error.config?.url,
      message: errorMessage,
    });

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

/**
 * API Service Placeholders
 * To be implemented as business features are developed.
 */

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
  },
  register: async (payload: RegisterPayload) => {
    return apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
  },
  memberLogin: async (credentials: { email: string; password: string }) => {
    return apiClient.post<ApiResponse<AuthResponseData>>('/auth/member-login', credentials);
  },
  adminLogin: async (credentials: { email: string; password: string }) => {
    return apiClient.post<ApiResponse<AuthResponseData>>('/auth/admin-login', credentials);
  },
  getProfile: async () => {
    return apiClient.get<ApiResponse<{ user: User; team?: Team | null }>>('/auth/me');
  },
};

export const teamService = {
  getTeamDashboard: async () => {
    return apiClient.get('/teams/me');
  },
  getMembers: async () => {
    return apiClient.get('/teams/me/members');
  },
  addMember: async (member: Record<string, unknown>) => {
    return apiClient.post('/teams/me/members', member);
  },
  getAssignedIdea: async () => {
    return apiClient.get('/teams/me/idea');
  },
};

export const submissionService = {
  getSubmission: async () => {
    return apiClient.get('/submissions/me');
  },
  saveDraft: async (data: Record<string, unknown>) => {
    return apiClient.post('/submissions/draft', data);
  },
  submitFinal: async (data: Record<string, unknown>) => {
    return apiClient.post('/submissions/final', data);
  },
};

export const adminService = {
  getStats: async () => {
    return apiClient.get('/admin/stats');
  },
  getTeams: async () => {
    return apiClient.get('/admin/teams');
  },
  getStudents: async () => {
    return apiClient.get('/admin/students');
  },
  getIdeas: async () => {
    return apiClient.get('/admin/ideas');
  },
  getSubmissions: async () => {
    return apiClient.get('/admin/submissions');
  },
  updateEventSettings: async (settings: Record<string, unknown>) => {
    return apiClient.patch('/admin/settings', settings);
  },
};

export default apiClient;
