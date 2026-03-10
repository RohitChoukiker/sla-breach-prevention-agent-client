import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  token: string;
}

export interface LoginResponse {
  message: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface MyTicketResponse {
  id: string;
  title: string;
  description: string;
  priority_final: string | null;
  confidence_score: number | null;
  processing_status: string;
  tenant_id: string | null;
  customer_id: string;
  urgency_requested: string;
  breach_probability: number | null;
  status: string;
  assigned_agent_id: string | null;
}

export interface HealthResponse {
  status: string;
  detail: string;
}

export const authApi = {
  login: (data: LoginPayload) => api.post<LoginResponse>('/auth/login', data),
  signup: (data: SignupPayload) => api.post('/auth/signup', data),
};

// Tickets
export const ticketApi = {
  create: (data: { title: string; description: string; priority: 'low' | 'medium' | 'high' }) => api.post('/tickets/create-ticket', data),
  getMyTickets: () => api.get<MyTicketResponse[]>('/tickets/my-tickets'),
  getTicket: (id: string) => api.get<MyTicketResponse>(`/tickets/${id}`),
};

// Agent
export const agentApi = {
  getTickets: () => api.get<MyTicketResponse[]>('/agent/tickets'),
  getTicket: (id: string) => api.get<MyTicketResponse>(`/agent/tickets/${id}`),
  updateStatus: (ticketId: string, status: string) => api.patch(`/agent/tickets/${ticketId}/status`, { status }),
  resolve: (ticketId: string, note: string) => api.patch(`/agent/tickets/${ticketId}/resolve`, { note }),
};

export const systemApi = {
  getHealth: () => api.get<HealthResponse>('/health'),
  getMetrics: () => api.get<string>('/metrics', { responseType: 'text' as const }),
};

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface AdminCreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'agent' | 'admin';
}

// Admin
export const adminApi = {
  getAllUsers: () => api.get<AdminUserResponse[]>('/admin/all-users'),
  createUser: (data: AdminCreateUserPayload) => api.post('/admin/create-user', data),
  getTickets: () => api.get<MyTicketResponse[]>('/admin/tickets'),
  getTicket: (id: string) => api.get<MyTicketResponse>(`/admin/tickets/${id}`),
  getHighRiskTickets: () => api.get<MyTicketResponse[]>('/admin/tickets/high-risk'),
  assignAgent: (ticketId: string, agentId: string) => api.patch(`/admin/tickets/${ticketId}/assign`, { agent_id: agentId }),
  overridePriority: (ticketId: string, priority: string) => api.patch(`/admin/tickets/${ticketId}/override-priority`, { priority }),
  updateUserRole: (userId: string, role: string) => api.patch(`/admin/${userId}/role`, { role }),
};

export default api;
