import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('build2pitch_token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected network error occurred';
    console.error('[API Error]:', { status: error.response?.status, url: error.config?.url, message: errorMessage });
    return Promise.reject({ status: error.response?.status, message: errorMessage, data: error.response?.data });
  },
);

export const authService = {
  login: async (credentials: Record<string, unknown>) => apiClient.post('/auth/login', credentials),
  register: async (payload: Record<string, unknown>) => apiClient.post('/auth/register', payload),
  memberLogin: async (code: string) => apiClient.post('/auth/member-login', { code }),
  getProfile: async () => apiClient.get('/auth/me'),
};

export const teamService = {
  createTeam: async (team: Record<string, unknown>) => apiClient.post('/teams', team),
  getTeam: async () => apiClient.get('/teams/me'),
  addMember: async (member: Record<string, unknown>) => apiClient.post('/teams/members', member),
  updateMember: async (id: string, member: Record<string, unknown>) => apiClient.put(`/teams/members/${id}`, member),
  removeMember: async (id: string) => apiClient.delete(`/teams/members/${id}`),
  getAssignedIdea: async () => apiClient.get('/teams/me/idea'),
};

export const submissionService = {
  getSubmission: async () => apiClient.get('/submissions/me'),
  saveDraft: async (data: Record<string, unknown>) => apiClient.post('/submissions/draft', data),
  submitFinal: async (data: Record<string, unknown>) => apiClient.post('/submissions/final', data),
};

export const adminService = {
  getStats: async () => apiClient.get('/admin/stats'),
  getTeams: async () => apiClient.get('/admin/teams'),
  getStudents: async () => apiClient.get('/admin/students'),
  getIdeas: async () => apiClient.get('/admin/ideas'),
  getSubmissions: async () => apiClient.get('/admin/submissions'),
  updateEventSettings: async (settings: Record<string, unknown>) => apiClient.patch('/admin/settings', settings),
};

export default apiClient;
