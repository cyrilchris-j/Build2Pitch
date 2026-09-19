import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  AuthResponseData,
  IdeaRollResult,
  IdeaVault,
  LockedIdeaResult,
  MyIdeaState,
  RegisterPayload,
  Team,
  User,
} from '@/types';

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

const TEAM_KEY = 'build2pitch_team_id';
const TEAM_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * Stable client-side team identity used by the idea dice flow.
 * Created once and persisted in localStorage.
 */
export function getTeamId(): string {
  let id = localStorage.getItem(TEAM_KEY);
  if (!id || !TEAM_ID_PATTERN.test(id)) {
    id = (crypto.randomUUID ? crypto.randomUUID() : fallbackUuid())
      .replace(/-/g, '')
      .slice(0, 16);
    localStorage.setItem(TEAM_KEY, id);
  }
  return id;
}

function fallbackUuid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

// Request Interceptor: Attach JWT token + team id when available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('build2pitch_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && !config.headers.Authorization) {
      // Default dev fallback token when no token exists in localStorage
      config.headers.Authorization = 'Bearer mock_leader_token';
    }
    if (config.headers) {
      config.headers['x-team-id'] = getTeamId();
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

export const ideaRollService = {
  getVault: async (): Promise<IdeaVault> => {
    const res = await apiClient.get<ApiResponse<IdeaVault>>('/ideas/available');
    return res.data.data as IdeaVault;
  },
  myIdea: async (): Promise<MyIdeaState> => {
    const res = await apiClient.get<ApiResponse<MyIdeaState>>('/ideas/my-idea');
    return res.data.data as MyIdeaState;
  },
  roll: async (): Promise<IdeaRollResult> => {
    const res = await apiClient.post<ApiResponse<IdeaRollResult>>('/ideas/roll');
    return res.data.data as IdeaRollResult;
  },
  lock: async (): Promise<LockedIdeaResult> => {
    const res = await apiClient.post<ApiResponse<LockedIdeaResult>>('/ideas/lock');
    return res.data.data as LockedIdeaResult;
  },
};

export const submissionService = {
  getSubmission: async () => {
    return apiClient.get('/submissions/me');
  },
  saveDraft: async (data: Record<string, unknown>) => {
    return apiClient.put('/submissions/me', data);
  },
  submitFinal: async (data: Record<string, unknown>) => {
    return apiClient.post('/submissions/final-submit', data);
  },
};

export const adminService = {
  getStats: async () => {
    return apiClient.get('/admin/stats');
  },
  getTeams: async (params?: Record<string, unknown>) => {
    return apiClient.get('/admin/teams', { params });
  },
  getStudents: async (params?: Record<string, unknown>) => {
    return apiClient.get('/admin/students', { params });
  },
  getIdeas: async () => {
    return apiClient.get('/admin/ideas');
  },
  createIdea: async (idea: Record<string, unknown>) => {
    return apiClient.post('/admin/ideas', idea);
  },
  updateIdea: async (id: string, idea: Record<string, unknown>) => {
    return apiClient.put(`/admin/ideas/${id}`, idea);
  },
  deleteIdea: async (id: string) => {
    return apiClient.delete(`/admin/ideas/${id}`);
  },
  getSubmissions: async (params?: Record<string, unknown>) => {
    return apiClient.get('/admin/submissions', { params });
  },
};

export default apiClient;
