// services/adminApi.js
// Admin Module API Service
// Handles all admin-related API calls

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for admin API
const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token') || 
      (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login?session=expired';
      }
    }
    
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getSummary: () => adminApi.get('/dashboard-summary'),
};

// ============================================
// USER MANAGEMENT API
// ============================================
export const usersAPI = {
  // Get all users with filters
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return adminApi.get(`/users?${queryParams.toString()}`);
  },

  // Get single user
  getById: (userId) => adminApi.get(`/users/${userId}`),

  // Update user
  update: (userId, data) => adminApi.put(`/users/${userId}`, data),

  // Update user status (activate/deactivate)
  updateStatus: (userId, isActive) => 
    adminApi.patch(`/users/${userId}/status`, { isActive }),

  // Change user role
  changeRole: (userId, role) => 
    adminApi.patch(`/users/${userId}/role`, { role }),

  // Reset user password
  resetPassword: (userId, newPassword) => 
    adminApi.post(`/users/${userId}/reset-password`, { newPassword }),

  // Delete user
  delete: (userId) => adminApi.delete(`/users/${userId}`),
};

// ============================================
// PSYCHOLOGIST MANAGEMENT API
// ============================================
export const psychologistsAPI = {
  // Get all psychologists
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.verified) queryParams.append('verified', params.verified);
    
    return adminApi.get(`/psychologists?${queryParams.toString()}`);
  },

  // Verify/Unverify psychologist
  verify: (psychologistId, isVerified) => 
    adminApi.patch(`/psychologists/${psychologistId}/verify`, { isVerified }),
};

// ============================================
// GAME MANAGEMENT API
// ============================================
export const gamesAPI = {
  // Get all games
  getAll: () => adminApi.get('/games'),

  // Get single game
  getById: (gameId) => adminApi.get(`/games/${gameId}`),

  // Create new game
  create: (gameData) => adminApi.post('/games', gameData),

  // Update game
  update: (gameId, data) => adminApi.put(`/games/${gameId}`, data),

  // Toggle game status (enable/disable)
  toggle: (gameId) => adminApi.patch(`/games/${gameId}/toggle`),

  // Delete game
  delete: (gameId) => adminApi.delete(`/games/${gameId}`),
};

// ============================================
// CONTENT MODERATION API
// ============================================
export const contentAPI = {
  // Get all blogs for moderation
  getBlogs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    
    return adminApi.get(`/content/blogs?${queryParams.toString()}`);
  },

  // Approve blog
  approveBlog: (blogId) => adminApi.post('/content/approve', { blogId }),

  // Reject blog
  rejectBlog: (blogId, reason) => adminApi.post('/content/reject', { blogId, reason }),

  // Hide/Archive blog
  hideBlog: (blogId) => adminApi.patch(`/content/blogs/${blogId}/hide`),

  // Toggle comments on blog
  toggleComments: (blogId, allowComments) => 
    adminApi.patch(`/content/blogs/${blogId}/comments`, { allowComments }),

  // Delete comment
  deleteComment: (blogId, commentId) => 
    adminApi.delete(`/content/blogs/${blogId}/comments/${commentId}`),
};

// ============================================
// ANALYTICS API
// ============================================
export const analyticsAPI = {
  // Get analytics overview
  getOverview: (period = 'month') => 
    adminApi.get(`/analytics?period=${period}`),
};

// ============================================
// SYSTEM SETTINGS API
// ============================================
export const settingsAPI = {
  // Get system settings
  get: () => adminApi.get('/settings'),

  // Update system settings
  update: (settings) => adminApi.put('/settings', settings),
};

// ============================================
// AUDIT LOGS API
// ============================================
export const auditLogsAPI = {
  // Get audit logs
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.action) queryParams.append('action', params.action);
    if (params.performedBy) queryParams.append('performedBy', params.performedBy);
    if (params.targetType) queryParams.append('targetType', params.targetType);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.search) queryParams.append('search', params.search);
    
    return adminApi.get(`/audit-logs?${queryParams.toString()}`);
  },

  // Get activity summary
  getSummary: (days = 7) => 
    adminApi.get(`/audit-logs/summary?days=${days}`),
};

// ============================================
// REPORTS API
// ============================================
export const reportsAPI = {
  // Get report data
  get: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append('type', params.type);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.format) queryParams.append('format', params.format);
    
    return adminApi.get(`/reports?${queryParams.toString()}`);
  },

  // Export data
  export: (type, format = 'csv') => 
    adminApi.get(`/reports/export?type=${type}&format=${format}`, {
      responseType: format === 'json' ? 'json' : 'blob'
    }),
};

// ============================================
// COMBINED ADMIN API EXPORT
// ============================================
export const adminAPI = {
  dashboard: dashboardAPI,
  users: usersAPI,
  psychologists: psychologistsAPI,
  games: gamesAPI,
  content: contentAPI,
  analytics: analyticsAPI,
  settings: settingsAPI,
  auditLogs: auditLogsAPI,
  reports: reportsAPI,
};

export default adminAPI;
