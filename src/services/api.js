import axios from 'axios';

// Get API base URL based on environment
const getApiUrl = () => {
  const isDev = import.meta.env.VITE_NODE_ENV === 'development';
  return isDev 
    ? import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
    : import.meta.env.VITE_API_URL_PROD || 'https://your-app-name.onrender.com/api';
};

// Create axios instance
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rx_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('rx_admin_token');
      localStorage.removeItem('rx_admin_user');
      localStorage.removeItem('rx_admin_logged_in');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  },
  
  // Admin functions for user management
  createByAdmin: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  
  updateSubscriptionByAdmin: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/subscription`, data);
    return response.data;
  }
};

// Subscriptions API
export const subscriptionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/subscriptions/admin/all', { params });
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/subscriptions/admin/${id}`, data);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/subscriptions/admin/stats');
    return response.data;
  }
};

// Content API
export const contentAPI = {
  getAllAccess: async (params = {}) => {
    const response = await api.get('/content/admin/all-access', { params });
    return response.data;
  },
  
  grantAccess: async (data) => {
    const response = await api.post('/content/admin/grant-access', data);
    return response.data;
  },
  
  revokeAccess: async (data) => {
    const response = await api.post('/content/admin/revoke-access', data);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/content/admin/stats');
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin', { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/admin', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/admin/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  },
  
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
  
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },
  
  // User management by admin
  createUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  
  updateUserSubscription: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/subscription`, data);
    return response.data;
  },
  
  // Subscription confirmation endpoints
  getPendingRegistrations: async (params = {}) => {
    const response = await api.get('/admin/pending-registrations', { params });
    return response.data;
  },
  
  updateRegistrationStatus: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/registration-status`, data);
    return response.data;
  }
};

export default api;
