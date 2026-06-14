// services/studentAPI.js
// API service for student module - handles all student-related API calls

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const createAuthClient = () => {
  const token = Cookies.get('auth_token');
  return axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
};

// Helper to handle API responses
const handleResponse = (response) => {
  return response;
};

// Helper to handle errors
const handleError = (error) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error;
};

export const studentAPI = {
  // ============================================
  // DASHBOARD
  // ============================================
  
  getDashboard: async () => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/dashboard');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // PROFILE
  // ============================================
  
  getProfile: async () => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/profile');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateProfile: async (data) => {
    try {
      const client = createAuthClient();
      const response = await client.put('/student/profile', data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // GAMES
  // ============================================
  
  getGames: async (params = {}) => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/games', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getGameById: async (gameId) => {
    try {
      const client = createAuthClient();
      const response = await client.get(`/student/games/${gameId}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  recordGameSession: async (gameId, sessionData) => {
    try {
      const client = createAuthClient();
      const response = await client.post(`/student/games/${gameId}/session`, sessionData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // PROGRESS
  // ============================================
  
  getProgress: async (timeRange = 'month') => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/progress', { params: { timeRange } });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // BLOGS
  // ============================================
  
  getBlogs: async (params = {}) => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/blogs', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getBlogById: async (id) => {
    try {
      const client = createAuthClient();
      const response = await client.get(`/student/blogs/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  toggleBlogLike: async (id) => {
    try {
      const client = createAuthClient();
      const response = await client.post(`/student/blogs/${id}/like`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // E-BOOKS
  // ============================================
  
  getEbooks: async (params = {}) => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/ebooks', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  
  getNotifications: async (params = {}) => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/notifications', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  markNotificationRead: async (id) => {
    try {
      const client = createAuthClient();
      const response = await client.put(`/student/notifications/${id}/read`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const client = createAuthClient();
      const response = await client.put('/student/notifications/read-all');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // PREFERENCES
  // ============================================
  
  getPreferences: async () => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/preferences');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updatePreferences: async (data) => {
    try {
      const client = createAuthClient();
      const response = await client.put('/student/preferences', data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  resetPreferences: async () => {
    try {
      const client = createAuthClient();
      const response = await client.post('/student/preferences/reset');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ============================================
  // PARENT VIEW
  // ============================================
  
  getParentView: async () => {
    try {
      const client = createAuthClient();
      const response = await client.get('/student/parent-view');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export default studentAPI;
