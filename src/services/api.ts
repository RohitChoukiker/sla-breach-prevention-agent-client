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
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  signup: (data: { email: string; password: string; name: string; role?: string }) => api.post('/auth/signup', data),
  getAuditLogs: () => api.get('/auth/audit-logs'),
  updateUserRole: (userId: string, role: string) => api.patch(`/auth/${userId}/role`, { role }),
};

// Tickets
export const ticketApi = {
  create: (data: { title: string; description: string; urgency: string }) => api.post('/tickets/', data),
  getMyTickets: () => api.get('/tickets/'),
  getTicket: (id: string) => api.get(`/tickets/${id}`),
};

// Agent
export const agentApi = {
  getTickets: () => api.get('/agent/tickets'),
  updateStatus: (ticketId: string, status: string) => api.patch(`/agent/tickets/${ticketId}/status`, { status }),
  resolve: (ticketId: string) => api.patch(`/agent/tickets/${ticketId}/resolve`),
};

// Admin
export const adminApi = {
  getAllUsers: () => api.get('/admin/all-users'),
  getTickets: () => api.get('/admin/tickets'),
  getHighRiskTickets: () => api.get('/admin/tickets/high-risk'),
  assignAgent: (ticketId: string, agentId: string) => api.patch(`/admin/tickets/${ticketId}/assign`, { agent_id: agentId }),
  overridePriority: (ticketId: string, priority: string) => api.patch(`/admin/tickets/${ticketId}/override-priority`, { priority }),
};

export default api;
