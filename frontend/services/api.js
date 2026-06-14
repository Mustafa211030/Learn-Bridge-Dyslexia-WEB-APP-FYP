// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('auth_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       Cookies.remove('auth_token');
//       // Redirect to login page if not already there
//       if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API endpoints
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   logout: () => api.post('/auth/logout'),
//   getProfile: () => api.get('/auth/me'),
// };

// // User API endpoints
// export const userAPI = {
//   // General user endpoints
//   getDashboard: () => api.get('/user/dashboard'),
//   getAllUsers: (page = 1, limit = 10) => api.get(`/user/all?page=${page}&limit=${limit}`),
//   getUsersByRole: (role) => api.get(`/user/by-role/${role}`),
//   updateProfile: (userData) => api.put('/user/profile', userData),
//   updateUserStatus: (userId, isActive) => api.put(`/user/${userId}/status`, { isActive }),
//   deleteUser: (userId) => api.delete(`/user/${userId}`),
  
//   // Student-specific endpoints
//   getStudentSessions: () => api.get('/student/sessions'),
//   getStudentAppointments: () => api.get('/student/appointments'),
//   getStudentResources: () => api.get('/student/resources'),
//   getStudentProgress: () => api.get('/student/progress'),
//   getStudentNotifications: () => api.get('/student/notifications'),
//   bookAppointment: (appointmentData) => api.post('/student/appointments', appointmentData),
//   cancelAppointment: (appointmentId) => api.delete(`/student/appointments/${appointmentId}`),
//   requestSession: () => api.post('/student/sessions/request'),
//   cancelSession: (sessionId) => api.delete(`/student/sessions/${sessionId}`),
//   submitFeedback: (feedbackData) => api.post('/student/feedback', feedbackData),
  
//   // Psychologist-specific endpoints
//   getPsychologistSessions: () => api.get('/psychologist/sessions'),
//   getPsychologistAppointments: () => api.get('/psychologist/appointments'),
//   getPsychologistClients: () => api.get('/psychologist/clients'),
//   getPsychologistSchedule: () => api.get('/psychologist/schedule'),
//   getPsychologistNotifications: () => api.get('/psychologist/notifications'),
//   getPsychologistBlogs: () => api.get('/psychologist/blogs'),
//   createBlog: (blogData) => api.post('/psychologist/blogs', blogData),
//   updateBlog: (blogId, blogData) => api.put(`/psychologist/blogs/${blogId}`, blogData),
//   deleteBlog: (blogId) => api.delete(`/psychologist/blogs/${blogId}`),
//   updateAppointmentStatus: (appointmentId, status) => api.put(`/psychologist/appointments/${appointmentId}`, { status }),
//   getStudentsList: () => api.get('/psychologist/students'),
//   addSessionNotes: (sessionId, notes) => api.post(`/psychologist/sessions/${sessionId}/notes`, { notes }),
//   createStudentReport: (reportData) => api.post('/psychologist/reports', reportData),
//   getReports: () => api.get('/psychologist/reports'),
//   updateReport: (reportId, reportData) => api.put(`/psychologist/reports/${reportId}`, reportData),
//   deleteReport: (reportId) => api.delete(`/psychologist/reports/${reportId}`),
  
//   // Admin-specific endpoints
//   getAdminStats: () => api.get('/admin/stats'),
//   getAdminDashboard: () => api.get('/admin/dashboard'),
//   getAllAppointments: () => api.get('/admin/appointments'),
//   getUsersReport: () => api.get('/admin/users/report'),
//   getSystemLogs: () => api.get('/admin/logs'),
//   getActivityLogs: () => api.get('/admin/activity'),
//   createUser: (userData) => api.post('/admin/users', userData),
//   updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
//   exportData: (dataType) => api.get(`/admin/export/${dataType}`),
// };

// export default api;

























// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('auth_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       Cookies.remove('auth_token');
//       // Redirect to login page if not already there
//       if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API endpoints
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   logout: () => api.post('/auth/logout'),
//   getProfile: () => api.get('/auth/me'),
// };

// // User API endpoints
// export const userAPI = {
//   // General user endpoints
//   getDashboard: () => api.get('/user/dashboard'),
//   getAllUsers: (page = 1, limit = 10) => api.get(`/user/all?page=${page}&limit=${limit}`),
//   getUsersByRole: (role) => api.get(`/user/by-role/${role}`),
//   updateProfile: (userData) => api.put('/user/profile', userData),
//   updateUserStatus: (userId, isActive) => api.put(`/user/${userId}/status`, { isActive }),
//   deleteUser: (userId) => api.delete(`/user/${userId}`),
  
//   // Student-specific endpoints
//   getStudentSessions: () => api.get('/student/sessions'),
//   getStudentAppointments: () => api.get('/student/appointments'),
//   getStudentResources: () => api.get('/student/resources'),
//   getStudentProgress: () => api.get('/student/progress'),
//   getStudentNotifications: () => api.get('/student/notifications'),
//   bookAppointment: (appointmentData) => api.post('/student/appointments', appointmentData),
//   cancelAppointment: (appointmentId) => api.delete(`/student/appointments/${appointmentId}`),
//   requestSession: () => api.post('/student/sessions/request'),
//   cancelSession: (sessionId) => api.delete(`/student/sessions/${sessionId}`),
//   submitFeedback: (feedbackData) => api.post('/student/feedback', feedbackData),
  
//   // Psychologist-specific endpoints (LEGACY - keeping for backward compatibility)
//   getPsychologistSessions: () => api.get('/psychologist/sessions'),
//   getPsychologistAppointments: () => api.get('/psychologist/appointments'),
//   getPsychologistClients: () => api.get('/psychologist/clients'),
//   getPsychologistSchedule: () => api.get('/psychologist/schedule'),
//   getPsychologistNotifications: () => api.get('/psychologist/notifications'),
//   getPsychologistBlogs: () => api.get('/psychologist/blogs'),
//   createBlog: (blogData) => api.post('/psychologist/blogs', blogData),
//   updateBlog: (blogId, blogData) => api.put(`/psychologist/blogs/${blogId}`, blogData),
//   deleteBlog: (blogId) => api.delete(`/psychologist/blogs/${blogId}`),
//   updateAppointmentStatus: (appointmentId, status) => api.put(`/psychologist/appointments/${appointmentId}`, { status }),
//   getStudentsList: () => api.get('/psychologist/students'),
//   addSessionNotes: (sessionId, notes) => api.post(`/psychologist/sessions/${sessionId}/notes`, { notes }),
//   createStudentReport: (reportData) => api.post('/psychologist/reports', reportData),
//   getReports: () => api.get('/psychologist/reports'),
//   updateReport: (reportId, reportData) => api.put(`/psychologist/reports/${reportId}`, reportData),
//   deleteReport: (reportId) => api.delete(`/psychologist/reports/${reportId}`),
  
//   // Admin-specific endpoints
//   getAdminStats: () => api.get('/admin/stats'),
//   getAdminDashboard: () => api.get('/admin/dashboard'),
//   getAllAppointments: () => api.get('/admin/appointments'),
//   getUsersReport: () => api.get('/admin/users/report'),
//   getSystemLogs: () => api.get('/admin/logs'),
//   getActivityLogs: () => api.get('/admin/activity'),
//   createUser: (userData) => api.post('/admin/users', userData),
//   updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
//   exportData: (dataType) => api.get(`/admin/export/${dataType}`),
// };

// // 🔥 NEW PSYCHOLOGIST MODULE API ENDPOINTS
// // These are the dedicated endpoints for the new psychologist module
// export const psychologistAPI = {
//   // Dashboard
//   getDashboard: () => api.get('/psychologist/dashboard'),
  
//   // Students Management
//   getStudents: (params) => api.get('/psychologist/students', { params }),
//   getStudentDetail: (studentId) => api.get(`/psychologist/students/${studentId}`),
//   assignStudent: (studentId) => api.post(`/psychologist/students/${studentId}/assign`),
//   unassignStudent: (studentId) => api.delete(`/psychologist/students/${studentId}/assign`),
  
//   // Profile Management
//   getProfile: () => api.get('/psychologist/profile'),
//   updateProfile: (data) => api.put('/psychologist/profile', data),
//   updateCredentials: (data) => api.put('/psychologist/profile/credentials', data),
//   updateAvailability: (data) => api.put('/psychologist/profile/availability', data),
//   uploadProfilePhoto: (formData) => api.post('/psychologist/profile/photo', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
  
//   // Sessions (if different from legacy endpoints)
//   getSessions: (params) => api.get('/psychologist/sessions', { params }),
//   getSessionDetail: (sessionId) => api.get(`/psychologist/sessions/${sessionId}`),
//   createSession: (data) => api.post('/psychologist/sessions', data),
//   updateSession: (sessionId, data) => api.put(`/psychologist/sessions/${sessionId}`, data),
//   deleteSession: (sessionId) => api.delete(`/psychologist/sessions/${sessionId}`),
  
//   // Appointments (if different from legacy endpoints)
//   getAppointments: (params) => api.get('/psychologist/appointments', { params }),
//   getAppointmentDetail: (appointmentId) => api.get(`/psychologist/appointments/${appointmentId}`),
//   updateAppointment: (appointmentId, data) => api.put(`/psychologist/appointments/${appointmentId}`, data),
// };

// // 🔥 ASSESSMENT API ENDPOINTS
// export const assessmentAPI = {
//   // Generate and manage assessments
//   generateAssessment: (studentId, data) => api.post(`/assessment/generate/${studentId}`, data),
//   getStudentAssessments: (studentId, params) => api.get(`/assessment/${studentId}`, { params }),
//   getAssessmentDetail: (assessmentId) => api.get(`/assessment/detail/${assessmentId}`),
//   updateAssessment: (assessmentId, data) => api.put(`/assessment/${assessmentId}`, data),
//   deleteAssessment: (assessmentId) => api.delete(`/assessment/${assessmentId}`),
  
//   // Assessment analytics
//   getAssessmentTrends: (studentId) => api.get(`/assessment/${studentId}/trends`),
//   getAssessmentComparison: (studentId) => api.get(`/assessment/${studentId}/comparison`),
//   getCognitiveScores: (studentId) => api.get(`/assessment/${studentId}/cognitive-scores`),
  
//   // Bulk operations
//   bulkGenerateAssessments: (data) => api.post('/assessment/bulk-generate', data),
//   exportAssessments: (params) => api.get('/assessment/export', { params }),
// };

// // 🔥 CMS (Content Management System) API ENDPOINTS
// export const cmsAPI = {
//   // Blogs Management
//   getBlogs: (params) => api.get('/cms/blogs', { params }),
//   getBlogById: (id) => api.get(`/cms/blogs/${id}`),
//   getBlogBySlug: (slug) => api.get(`/cms/blogs/slug/${slug}`),
//   createBlog: (data) => api.post('/cms/blogs', data),
//   updateBlog: (id, data) => api.put(`/cms/blogs/${id}`, data),
//   deleteBlog: (id) => api.delete(`/cms/blogs/${id}`),
//   publishBlog: (id) => api.put(`/cms/blogs/${id}/publish`),
//   unpublishBlog: (id) => api.put(`/cms/blogs/${id}/unpublish`),
//   incrementBlogViews: (id) => api.post(`/cms/blogs/${id}/view`),
  
//   // Blog categories and tags
//   getBlogCategories: () => api.get('/cms/blogs/categories'),
//   getBlogTags: () => api.get('/cms/blogs/tags'),
  
//   // Educational Resources Management
//   getResources: (params) => api.get('/cms/resources', { params }),
//   getResourceById: (id) => api.get(`/cms/resources/${id}`),
//   createResource: (formData) => api.post('/cms/resources', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   updateResource: (id, data) => api.put(`/cms/resources/${id}`, data),
//   deleteResource: (id) => api.delete(`/cms/resources/${id}`),
//   downloadResource: (id) => api.get(`/cms/resources/${id}/download`, {
//     responseType: 'blob'
//   }),
//   incrementResourceDownloads: (id) => api.post(`/cms/resources/${id}/download`),
//   incrementResourceViews: (id) => api.post(`/cms/resources/${id}/view`),
  
//   // Resource categories and filters
//   getResourceCategories: () => api.get('/cms/resources/categories'),
//   getResourceTypes: () => api.get('/cms/resources/types'),
  
//   // Bulk operations
//   bulkDeleteBlogs: (ids) => api.post('/cms/blogs/bulk-delete', { ids }),
//   bulkDeleteResources: (ids) => api.post('/cms/resources/bulk-delete', { ids }),
  
//   // Upload media
//   uploadMedia: (formData) => api.post('/cms/media/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
// };

// // 🔥 REPORTS API ENDPOINTS
// export const reportAPI = {
//   // Generate PDF reports
//   generateReport: (assessmentId, options) => api.post(`/reports/generate/${assessmentId}`, options),
//   generateBulkReports: (assessmentIds) => api.post('/reports/bulk-generate', { assessmentIds }),
  
//   // Get reports
//   getStudentReports: (studentId, params) => api.get(`/reports/student/${studentId}`, { params }),
//   getReportDetail: (reportId) => api.get(`/reports/${reportId}`),
//   getAllReports: (params) => api.get('/reports', { params }),
  
//   // Download reports
//   downloadReport: (reportId) => api.get(`/reports/${reportId}/download`, {
//     responseType: 'blob'
//   }),
//   downloadMultipleReports: (reportIds) => api.post('/reports/bulk-download', 
//     { reportIds },
//     { responseType: 'blob' }
//   ),
  
//   // Share reports
//   shareReport: (reportId, data) => api.post(`/reports/${reportId}/share`, data),
//   getSharedReports: (params) => api.get('/reports/shared', { params }),
  
//   // Report management
//   updateReport: (reportId, data) => api.put(`/reports/${reportId}`, data),
//   deleteReport: (reportId) => api.delete(`/reports/${reportId}`),
//   archiveReport: (reportId) => api.put(`/reports/${reportId}/archive`),
  
//   // Report analytics
//   getReportStats: () => api.get('/reports/stats'),
//   getDownloadHistory: (reportId) => api.get(`/reports/${reportId}/history`),
// };

// // 🔥 THERAPY GAMES API ENDPOINTS (if needed for tracking)
// export const therapyGamesAPI = {
//   // Game sessions
//   saveGameSession: (data) => api.post('/therapy-games/session', data),
//   getGameSessions: (studentId, params) => api.get(`/therapy-games/sessions/${studentId}`, { params }),
//   getGameSessionDetail: (sessionId) => api.get(`/therapy-games/sessions/detail/${sessionId}`),
  
//   // Game statistics
//   getGameStats: (studentId) => api.get(`/therapy-games/stats/${studentId}`),
//   getGamePerformance: (studentId, gameType) => api.get(`/therapy-games/performance/${studentId}/${gameType}`),
  
//   // Game types
//   getAvailableGames: () => api.get('/therapy-games/available'),
//   getGameConfig: (gameType) => api.get(`/therapy-games/config/${gameType}`),
// };

// // 🔥 ANALYTICS API ENDPOINTS
// export const analyticsAPI = {
//   // Student analytics
//   getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
//   getStudentProgress: (studentId, params) => api.get(`/analytics/student/${studentId}/progress`, { params }),
//   getStudentComparison: (studentId) => api.get(`/analytics/student/${studentId}/comparison`),
  
//   // Psychologist analytics
//   getPsychologistAnalytics: () => api.get('/analytics/psychologist'),
//   getSessionAnalytics: (params) => api.get('/analytics/sessions', { params }),
//   getAssessmentAnalytics: (params) => api.get('/analytics/assessments', { params }),
  
//   // Dashboard widgets
//   getDashboardWidgets: () => api.get('/analytics/dashboard/widgets'),
//   getRecentActivities: (limit) => api.get(`/analytics/activities?limit=${limit}`),
  
//   // Export analytics
//   exportAnalytics: (type, params) => api.get(`/analytics/export/${type}`, { 
//     params,
//     responseType: 'blob' 
//   }),
// };

// // 🔥 NOTIFICATIONS API ENDPOINTS
// export const notificationsAPI = {
//   // Get notifications
//   getNotifications: (params) => api.get('/notifications', { params }),
//   getUnreadCount: () => api.get('/notifications/unread/count'),
  
//   // Mark notifications
//   markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
//   markAllAsRead: () => api.put('/notifications/read-all'),
  
//   // Delete notifications
//   deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
//   deleteAllRead: () => api.delete('/notifications/read'),
  
//   // Notification preferences
//   getPreferences: () => api.get('/notifications/preferences'),
//   updatePreferences: (data) => api.put('/notifications/preferences', data),
// };

// // 🔥 GAME-SPECIFIC API ENDPOINTS (existing games)
// export const mathquestAPI = {
//   saveSession: (data) => api.post('/mathquest/session', data),
//   getSessions: (params) => api.get('/mathquest/sessions', { params }),
//   getLeaderboard: () => api.get('/mathquest/leaderboard'),
// };

// export const phonemeGameAPI = {
//   saveSession: (data) => api.post('/phoneme-game/session', data),
//   getSessions: (params) => api.get('/phoneme-game/sessions', { params }),
//   getProgress: () => api.get('/phoneme-game/progress'),
// };

// export const letterTracingAPI = {
//   saveSession: (data) => api.post('/letter-tracing/session', data),
//   getSessions: (params) => api.get('/letter-tracing/sessions', { params }),
//   getProgress: () => api.get('/letter-tracing/progress'),
// };

// export const wordFormationAPI = {
//   saveSession: (data) => api.post('/word-formation/session', data),
//   getSessions: (params) => api.get('/word-formation/sessions', { params }),
//   getProgress: () => api.get('/word-formation/progress'),
// };

// export const ebookAPI = {
//   saveProgress: (data) => api.post('/ebook/progress', data),
//   getProgress: () => api.get('/ebook/progress'),
//   getBooks: () => api.get('/ebook/books'),
//   getBookDetail: (bookId) => api.get(`/ebook/books/${bookId}`),
// };

// export default api;
























// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     // Try to get token from cookies first, then localStorage
//     const token = Cookies.get('auth_token') || 
//       (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       Cookies.remove('auth_token');
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         if (window.location.pathname !== '/login') {
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     // Handle network errors
//     if (!error.response) {
//       console.error('Network Error:', error.message);
//     }
    
//     return Promise.reject(error);
//   }
// );

// // ═══════════════════════════════════════════════════════════
// // AUTH API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   logout: () => api.post('/auth/logout'),
//   getProfile: () => api.get('/auth/me'),
// };

// // ═══════════════════════════════════════════════════════════
// // USER API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const userAPI = {
//   // General user endpoints
//   getDashboard: () => api.get('/user/dashboard'),
//   getAllUsers: (page = 1, limit = 10) => api.get(`/user/all?page=${page}&limit=${limit}`),
//   getUsersByRole: (role) => api.get(`/user/by-role/${role}`),
//   updateProfile: (userData) => api.put('/user/profile', userData),
//   updateUserStatus: (userId, isActive) => api.put(`/user/${userId}/status`, { isActive }),
//   deleteUser: (userId) => api.delete(`/user/${userId}`),
  
//   // Student-specific endpoints
//   getStudentSessions: () => api.get('/student/sessions'),
//   getStudentAppointments: () => api.get('/student/appointments'),
//   getStudentResources: () => api.get('/student/resources'),
//   getStudentProgress: () => api.get('/student/progress'),
//   getStudentNotifications: () => api.get('/student/notifications'),
//   bookAppointment: (appointmentData) => api.post('/student/appointments', appointmentData),
//   cancelAppointment: (appointmentId) => api.delete(`/student/appointments/${appointmentId}`),
//   requestSession: () => api.post('/student/sessions/request'),
//   cancelSession: (sessionId) => api.delete(`/student/sessions/${sessionId}`),
//   submitFeedback: (feedbackData) => api.post('/student/feedback', feedbackData),
  
//   // Admin-specific endpoints
//   getAdminStats: () => api.get('/admin/stats'),
//   getAdminDashboard: () => api.get('/admin/dashboard'),
//   getAllAppointments: () => api.get('/admin/appointments'),
//   getUsersReport: () => api.get('/admin/users/report'),
//   getSystemLogs: () => api.get('/admin/logs'),
//   getActivityLogs: () => api.get('/admin/activity'),
//   createUser: (userData) => api.post('/admin/users', userData),
//   updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
//   exportData: (dataType) => api.get(`/admin/export/${dataType}`),
// };

// // ═══════════════════════════════════════════════════════════
// // PSYCHOLOGIST API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const psychologistAPI = {
//   // Dashboard
//   getDashboard: () => api.get('/psychologist/dashboard'),
  
//   // Students Management
//   getStudents: (params) => api.get('/psychologist/students', { params }),
//   getStudentDetail: (studentId) => api.get(`/psychologist/students/${studentId}`),
//   assignStudent: (studentId) => api.post(`/psychologist/students/${studentId}/assign`),
//   unassignStudent: (studentId) => api.delete(`/psychologist/students/${studentId}/assign`),
//   getStudentsList: () => api.get('/psychologist/students'),
  
//   // Profile Management
//   getProfile: () => api.get('/psychologist/profile'),
//   updateProfile: (data) => api.put('/psychologist/profile', data),
//   updateCredentials: (data) => api.put('/psychologist/profile/credentials', data),
//   updateAvailability: (data) => api.put('/psychologist/profile/availability', data),
//   uploadProfilePhoto: (formData) => api.post('/psychologist/profile/photo', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
  
//   // Sessions Management
//   getSessions: (params) => api.get('/psychologist/sessions', { params }),
//   getSessionDetail: (sessionId) => api.get(`/psychologist/sessions/${sessionId}`),
//   createSession: (data) => api.post('/psychologist/sessions', data),
//   updateSession: (sessionId, data) => api.put(`/psychologist/sessions/${sessionId}`, data),
//   deleteSession: (sessionId) => api.delete(`/psychologist/sessions/${sessionId}`),
//   addSessionNotes: (sessionId, notes) => api.post(`/psychologist/sessions/${sessionId}/notes`, { notes }),
  
//   // Appointments Management
//   getAppointments: (params) => api.get('/psychologist/appointments', { params }),
//   getAppointmentDetail: (appointmentId) => api.get(`/psychologist/appointments/${appointmentId}`),
//   updateAppointment: (appointmentId, data) => api.put(`/psychologist/appointments/${appointmentId}`, data),
//   updateAppointmentStatus: (appointmentId, status) => api.put(`/psychologist/appointments/${appointmentId}`, { status }),
  
//   // Schedule Management
//   getSchedule: () => api.get('/psychologist/schedule'),
  
//   // Clients Management
//   getClients: () => api.get('/psychologist/clients'),
  
//   // Reports Management (Legacy)
//   createStudentReport: (reportData) => api.post('/psychologist/reports', reportData),
//   getReports: () => api.get('/psychologist/reports'),
//   updateReport: (reportId, reportData) => api.put(`/psychologist/reports/${reportId}`, reportData),
//   deleteReport: (reportId) => api.delete(`/psychologist/reports/${reportId}`),
  
//   // Blogs (Legacy - now handled by blogAPI)
//   getBlogs: () => api.get('/psychologist/blogs'),
//   createBlog: (blogData) => api.post('/psychologist/blogs', blogData),
//   updateBlog: (blogId, blogData) => api.put(`/psychologist/blogs/${blogId}`, blogData),
//   deleteBlog: (blogId) => api.delete(`/psychologist/blogs/${blogId}`),
  
//   // Notifications
//   getNotifications: () => api.get('/psychologist/notifications'),
// };

// // ═══════════════════════════════════════════════════════════
// // ASSESSMENT API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const assessmentAPI = {
//   // Generate and manage assessments
//   generate: (studentId, data = {}) => api.post(`/assessment/generate/${studentId}`, data),
//   generateAssessment: (studentId, data) => api.post(`/assessment/generate/${studentId}`, data),
  
//   // Get assessments
//   getAll: (params) => api.get('/assessment', { params }),
//   getByStudent: (studentId, params) => api.get(`/assessment/student/${studentId}`, { params }),
//   getStudentAssessments: (studentId, params) => api.get(`/assessment/${studentId}`, { params }),
//   getById: (assessmentId) => api.get(`/assessment/${assessmentId}`),
//   getAssessmentDetail: (assessmentId) => api.get(`/assessment/detail/${assessmentId}`),
  
//   // Update and delete
//   update: (assessmentId, data) => api.put(`/assessment/${assessmentId}`, data),
//   updateAssessment: (assessmentId, data) => api.put(`/assessment/${assessmentId}`, data),
//   deleteAssessment: (assessmentId) => api.delete(`/assessment/${assessmentId}`),
  
//   // Assessment analytics
//   getAssessmentTrends: (studentId) => api.get(`/assessment/${studentId}/trends`),
//   getAssessmentComparison: (studentId) => api.get(`/assessment/${studentId}/comparison`),
//   getCognitiveScores: (studentId) => api.get(`/assessment/${studentId}/cognitive-scores`),
  
//   // Bulk operations
//   bulkGenerateAssessments: (data) => api.post('/assessment/bulk-generate', data),
//   exportAssessments: (params) => api.get('/assessment/export', { params }),
// };

// // ═══════════════════════════════════════════════════════════
// // BLOG API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const blogAPI = {
//   // Psychologist routes
//   getMyBlogs: (params) => api.get('/blogs/psychologist/my-blogs', { params }),
//   getBlogById: (id) => api.get(`/blogs/psychologist/${id}`),
//   create: (data) => api.post('/blogs', data),
//   update: (id, data) => api.put(`/blogs/${id}`, data),
//   delete: (id) => api.delete(`/blogs/${id}`),
  
//   // Public routes
//   getPublished: (params) => api.get('/blogs/published', { params }),
//   getFeatured: (limit) => api.get('/blogs/featured', { params: { limit } }),
//   getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
//   getCategories: () => api.get('/blogs/categories'),
  
//   // Interactions
//   toggleLike: (id) => api.post(`/blogs/${id}/like`),
//   addComment: (id, content) => api.post(`/blogs/${id}/comment`, { content }),
  
//   // Additional CMS operations
//   publishBlog: (id) => api.put(`/blogs/${id}/publish`),
//   unpublishBlog: (id) => api.put(`/blogs/${id}/unpublish`),
//   incrementBlogViews: (id) => api.post(`/blogs/${id}/view`),
//   getBlogTags: () => api.get('/blogs/tags'),
//   bulkDeleteBlogs: (ids) => api.post('/blogs/bulk-delete', { ids }),
// };

// // ═══════════════════════════════════════════════════════════
// // RESOURCE API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const resourceAPI = {
//   // Psychologist routes
//   getMyResources: (params) => api.get('/resources/psychologist/my-resources', { params }),
//   create: (data) => api.post('/resources', data),
//   update: (id, data) => api.put(`/resources/${id}`, data),
//   delete: (id) => api.delete(`/resources/${id}`),
  
//   // Public routes
//   getPublished: (params) => api.get('/resources/published', { params }),
//   getPopular: (limit) => api.get('/resources/popular', { params: { limit } }),
//   getById: (id) => api.get(`/resources/${id}`),
//   getCategories: () => api.get('/resources/categories'),
  
//   // Interactions
//   recordDownload: (id) => api.post(`/resources/${id}/download`),
//   toggleLike: (id) => api.post(`/resources/${id}/like`),
//   rate: (id, rating, review) => api.post(`/resources/${id}/rate`, { rating, review }),
  
//   // Additional operations
//   downloadResource: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
//   incrementResourceDownloads: (id) => api.post(`/resources/${id}/download`),
//   incrementResourceViews: (id) => api.post(`/resources/${id}/view`),
//   getResourceTypes: () => api.get('/resources/types'),
//   bulkDeleteResources: (ids) => api.post('/resources/bulk-delete', { ids }),
// };

// // ═══════════════════════════════════════════════════════════
// // CMS (Content Management System) API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const cmsAPI = {
//   // Blogs Management (redirects to blogAPI for consistency)
//   getBlogs: (params) => blogAPI.getPublished(params),
//   getBlogById: (id) => blogAPI.getBlogById(id),
//   getBlogBySlug: (slug) => blogAPI.getBySlug(slug),
//   createBlog: (data) => blogAPI.create(data),
//   updateBlog: (id, data) => blogAPI.update(id, data),
//   deleteBlog: (id) => blogAPI.delete(id),
  
//   // Resources Management (redirects to resourceAPI for consistency)
//   getResources: (params) => resourceAPI.getPublished(params),
//   getResourceById: (id) => resourceAPI.getById(id),
//   createResource: (formData) => resourceAPI.create(formData),
//   updateResource: (id, data) => resourceAPI.update(id, data),
//   deleteResource: (id) => resourceAPI.delete(id),
  
//   // Upload media
//   uploadMedia: (formData) => api.post('/cms/media/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
// };

// // ═══════════════════════════════════════════════════════════
// // REPORTS API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const reportAPI = {
//   // Generate PDF reports
//   generateReport: (assessmentId, options) => api.post(`/reports/generate/${assessmentId}`, options),
//   generateBulkReports: (assessmentIds) => api.post('/reports/bulk-generate', { assessmentIds }),
  
//   // Get reports
//   getStudentReports: (studentId, params) => api.get(`/reports/student/${studentId}`, { params }),
//   getReportDetail: (reportId) => api.get(`/reports/${reportId}`),
//   getAllReports: (params) => api.get('/reports', { params }),
  
//   // Download reports
//   downloadReport: (reportId) => api.get(`/reports/${reportId}/download`, {
//     responseType: 'blob'
//   }),
//   downloadMultipleReports: (reportIds) => api.post('/reports/bulk-download', 
//     { reportIds },
//     { responseType: 'blob' }
//   ),
  
//   // Share reports
//   shareReport: (reportId, data) => api.post(`/reports/${reportId}/share`, data),
//   getSharedReports: (params) => api.get('/reports/shared', { params }),
  
//   // Report management
//   updateReport: (reportId, data) => api.put(`/reports/${reportId}`, data),
//   deleteReport: (reportId) => api.delete(`/reports/${reportId}`),
//   archiveReport: (reportId) => api.put(`/reports/${reportId}/archive`),
  
//   // Report analytics
//   getReportStats: () => api.get('/reports/stats'),
//   getDownloadHistory: (reportId) => api.get(`/reports/${reportId}/history`),
// };

// // ═══════════════════════════════════════════════════════════
// // THERAPY GAMES API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const therapyGamesAPI = {
//   // Game sessions
//   saveGameSession: (data) => api.post('/therapy-games/session', data),
//   getGameSessions: (studentId, params) => api.get(`/therapy-games/sessions/${studentId}`, { params }),
//   getGameSessionDetail: (sessionId) => api.get(`/therapy-games/sessions/detail/${sessionId}`),
  
//   // Game statistics
//   getGameStats: (studentId) => api.get(`/therapy-games/stats/${studentId}`),
//   getGamePerformance: (studentId, gameType) => api.get(`/therapy-games/performance/${studentId}/${gameType}`),
  
//   // Game types
//   getAvailableGames: () => api.get('/therapy-games/available'),
//   getGameConfig: (gameType) => api.get(`/therapy-games/config/${gameType}`),
// };

// // ═══════════════════════════════════════════════════════════
// // ANALYTICS API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const analyticsAPI = {
//   // Student analytics
//   getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
//   getStudentProgress: (studentId, params) => api.get(`/analytics/student/${studentId}/progress`, { params }),
//   getStudentComparison: (studentId) => api.get(`/analytics/student/${studentId}/comparison`),
  
//   // Psychologist analytics
//   getPsychologistAnalytics: () => api.get('/analytics/psychologist'),
//   getSessionAnalytics: (params) => api.get('/analytics/sessions', { params }),
//   getAssessmentAnalytics: (params) => api.get('/analytics/assessments', { params }),
  
//   // Dashboard widgets
//   getDashboardWidgets: () => api.get('/analytics/dashboard/widgets'),
//   getRecentActivities: (limit) => api.get(`/analytics/activities?limit=${limit}`),
  
//   // Export analytics
//   exportAnalytics: (type, params) => api.get(`/analytics/export/${type}`, { 
//     params,
//     responseType: 'blob' 
//   }),
// };

// // ═══════════════════════════════════════════════════════════
// // NOTIFICATIONS API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const notificationsAPI = {
//   // Get notifications
//   getNotifications: (params) => api.get('/notifications', { params }),
//   getUnreadCount: () => api.get('/notifications/unread/count'),
  
//   // Mark notifications
//   markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
//   markAllAsRead: () => api.put('/notifications/read-all'),
  
//   // Delete notifications
//   deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
//   deleteAllRead: () => api.delete('/notifications/read'),
  
//   // Notification preferences
//   getPreferences: () => api.get('/notifications/preferences'),
//   updatePreferences: (data) => api.put('/notifications/preferences', data),
// };

// // ═══════════════════════════════════════════════════════════
// // GAME-SPECIFIC API ENDPOINTS
// // ═══════════════════════════════════════════════════════════
// export const mathquestAPI = {
//   saveSession: (data) => api.post('/mathquest/session', data),
//   getSessions: (params) => api.get('/mathquest/sessions', { params }),
//   getLeaderboard: () => api.get('/mathquest/leaderboard'),
// };

// export const phonemeGameAPI = {
//   saveSession: (data) => api.post('/phoneme-game/session', data),
//   getSessions: (params) => api.get('/phoneme-game/sessions', { params }),
//   getProgress: () => api.get('/phoneme-game/progress'),
// };

// export const letterTracingAPI = {
//   saveSession: (data) => api.post('/letter-tracing/session', data),
//   getSessions: (params) => api.get('/letter-tracing/sessions', { params }),
//   getProgress: () => api.get('/letter-tracing/progress'),
// };

// export const wordFormationAPI = {
//   saveSession: (data) => api.post('/word-formation/session', data),
//   getSessions: (params) => api.get('/word-formation/sessions', { params }),
//   getProgress: () => api.get('/word-formation/progress'),
// };

// export const ebookAPI = {
//   saveProgress: (data) => api.post('/ebook/progress', data),
//   getProgress: () => api.get('/ebook/progress'),
//   getBooks: () => api.get('/ebook/books'),
//   getBookDetail: (bookId) => api.get(`/ebook/books/${bookId}`),
// };

// // ═══════════════════════════════════════════════════════════
// // FILE UPLOAD HELPER
// // ═══════════════════════════════════════════════════════════
// export const uploadFile = async (file, type = 'general') => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('type', type);
  
//   const response = await api.post('/upload', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });
  
//   return response.data;
// };

// // ═══════════════════════════════════════════════════════════
// // ERROR HANDLING HELPER
// // ═══════════════════════════════════════════════════════════
// export const handleAPIError = (error) => {
//   if (error.response) {
//     // Server responded with error
//     return {
//       message: error.response.data?.message || 'Server error occurred',
//       status: error.response.status,
//       errors: error.response.data?.errors || []
//     };
//   } else if (error.request) {
//     // No response received
//     return {
//       message: 'Unable to connect to server. Please check your internet connection.',
//       status: 0,
//       errors: []
//     };
//   } else {
//     // Error setting up request
//     return {
//       message: error.message || 'An unexpected error occurred',
//       status: -1,
//       errors: []
//     };
//   }
// };

// export default api;










































import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first, then localStorage
    const token = Cookies.get('auth_token') || 
      (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth_token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════
// AUTH API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

// ═══════════════════════════════════════════════════════════
// USER API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const userAPI = {
  // General user endpoints
  getDashboard: () => api.get('/user/dashboard'),
  getAllUsers: (page = 1, limit = 10) => api.get(`/user/all?page=${page}&limit=${limit}`),
  getUsersByRole: (role) => api.get(`/user/by-role/${role}`),
  updateProfile: (userData) => api.put('/user/profile', userData),
  updateUserStatus: (userId, isActive) => api.put(`/user/${userId}/status`, { isActive }),
  deleteUser: (userId) => api.delete(`/user/${userId}`),
  
  // Student-specific endpoints (legacy - use studentAPI for new features)
  getStudentSessions: () => api.get('/student/sessions'),
  getStudentAppointments: () => api.get('/student/appointments'),
  getStudentResources: () => api.get('/student/resources'),
  getStudentProgress: () => api.get('/student/progress'),
  getStudentNotifications: () => api.get('/student/notifications'),
  bookAppointment: (appointmentData) => api.post('/student/appointments', appointmentData),
  cancelAppointment: (appointmentId) => api.delete(`/student/appointments/${appointmentId}`),
  requestSession: () => api.post('/student/sessions/request'),
  cancelSession: (sessionId) => api.delete(`/student/sessions/${sessionId}`),
  submitFeedback: (feedbackData) => api.post('/student/feedback', feedbackData),
  
  // Admin-specific endpoints
  getAdminStats: () => api.get('/admin/stats'),
  getAdminDashboard: () => api.get('/admin/dashboard'),
  getAllAppointments: () => api.get('/admin/appointments'),
  getUsersReport: () => api.get('/admin/users/report'),
  getSystemLogs: () => api.get('/admin/logs'),
  getActivityLogs: () => api.get('/admin/activity'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  exportData: (dataType) => api.get(`/admin/export/${dataType}`),
};

// ═══════════════════════════════════════════════════════════
// STUDENT MODULE API ENDPOINTS (NEW)
// ═══════════════════════════════════════════════════════════
export const studentAPI = {
  // Dashboard
  getDashboard: () => api.get('/student/dashboard'),

  // Profile
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),

  // Games Hub
  getGames: (params = {}) => api.get('/student/games', { params }),
  getGameById: (gameId) => api.get(`/student/games/${gameId}`),
  recordGameSession: (gameId, sessionData) => 
    api.post(`/student/games/${gameId}/session`, sessionData),

  // Progress & Analytics
  getProgress: (params = {}) => api.get('/student/progress', { params }),

  // Blogs
  getBlogs: (params = {}) => api.get('/student/blogs', { params }),
  getBlogById: (id) => api.get(`/student/blogs/${id}`),
  toggleBlogLike: (id) => api.post(`/student/blogs/${id}/like`),

  // E-books
  getEbooks: (params = {}) => api.get('/student/ebooks', { params }),

  // Notifications
  getNotifications: (params = {}) => api.get('/student/notifications', { params }),
  markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/student/notifications/read-all'),

  // Preferences & Settings
  getPreferences: () => api.get('/student/preferences'),
  updatePreferences: (data) => api.put('/student/preferences', data),
  resetPreferences: () => api.post('/student/preferences/reset'),

  // Parent View
  getParentView: () => api.get('/student/parent-view'),

  // Achievements & Badges
  getAchievements: () => api.get('/student/achievements'),
  getBadges: () => api.get('/student/badges')
};

// ═══════════════════════════════════════════════════════════
// PSYCHOLOGIST API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const psychologistAPI = {
  // Dashboard
  getDashboard: () => api.get('/psychologist/dashboard'),
  
  // Students Management
  getStudents: (params) => api.get('/psychologist/students', { params }),
  getStudentDetail: (studentId) => api.get(`/psychologist/students/${studentId}`),
  assignStudent: (studentId) => api.post(`/psychologist/students/${studentId}/assign`),
  unassignStudent: (studentId) => api.delete(`/psychologist/students/${studentId}/assign`),
  getStudentsList: () => api.get('/psychologist/students'),
  
  // Profile Management
  getProfile: () => api.get('/psychologist/profile'),
  updateProfile: (data) => api.put('/psychologist/profile', data),
  updateCredentials: (data) => api.put('/psychologist/profile/credentials', data),
  updateAvailability: (data) => api.put('/psychologist/profile/availability', data),
  uploadProfilePhoto: (formData) => api.post('/psychologist/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Sessions Management
  getSessions: (params) => api.get('/psychologist/sessions', { params }),
  getSessionDetail: (sessionId) => api.get(`/psychologist/sessions/${sessionId}`),
  createSession: (data) => api.post('/psychologist/sessions', data),
  updateSession: (sessionId, data) => api.put(`/psychologist/sessions/${sessionId}`, data),
  deleteSession: (sessionId) => api.delete(`/psychologist/sessions/${sessionId}`),
  addSessionNotes: (sessionId, notes) => api.post(`/psychologist/sessions/${sessionId}/notes`, { notes }),
  
  // Appointments Management
  getAppointments: (params) => api.get('/psychologist/appointments', { params }),
  getAppointmentDetail: (appointmentId) => api.get(`/psychologist/appointments/${appointmentId}`),
  updateAppointment: (appointmentId, data) => api.put(`/psychologist/appointments/${appointmentId}`, data),
  updateAppointmentStatus: (appointmentId, status) => api.put(`/psychologist/appointments/${appointmentId}`, { status }),
  
  // Schedule Management
  getSchedule: () => api.get('/psychologist/schedule'),
  
  // Clients Management
  getClients: () => api.get('/psychologist/clients'),
  
  // Reports Management (Legacy)
  createStudentReport: (reportData) => api.post('/psychologist/reports', reportData),
  getReports: () => api.get('/psychologist/reports'),
  updateReport: (reportId, reportData) => api.put(`/psychologist/reports/${reportId}`, reportData),
  deleteReport: (reportId) => api.delete(`/psychologist/reports/${reportId}`),
  
  // Blogs (Legacy - now handled by blogAPI)
  getBlogs: () => api.get('/psychologist/blogs'),
  createBlog: (blogData) => api.post('/psychologist/blogs', blogData),
  updateBlog: (blogId, blogData) => api.put(`/psychologist/blogs/${blogId}`, blogData),
  deleteBlog: (blogId) => api.delete(`/psychologist/blogs/${blogId}`),
  
  // Notifications
  getNotifications: () => api.get('/psychologist/notifications'),
};

// ═══════════════════════════════════════════════════════════
// ASSESSMENT API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const assessmentAPI = {
  // Generate and manage assessments
  generate: (studentId, data = {}) => api.post(`/assessment/generate/${studentId}`, data),
  generateAssessment: (studentId, data) => api.post(`/assessment/generate/${studentId}`, data),
  
  // Get assessments
  getAll: (params) => api.get('/assessment', { params }),
  getByStudent: (studentId, params) => api.get(`/assessment/student/${studentId}`, { params }),
  getStudentAssessments: (studentId, params) => api.get(`/assessment/${studentId}`, { params }),
  getById: (assessmentId) => api.get(`/assessment/${assessmentId}`),
  getAssessmentDetail: (assessmentId) => api.get(`/assessment/detail/${assessmentId}`),
  
  // Update and delete
  update: (assessmentId, data) => api.put(`/assessment/${assessmentId}`, data),
  updateAssessment: (assessmentId, data) => api.put(`/assessment/${assessmentId}`, data),
  deleteAssessment: (assessmentId) => api.delete(`/assessment/${assessmentId}`),
  
  // Assessment analytics
  getAssessmentTrends: (studentId) => api.get(`/assessment/${studentId}/trends`),
  getAssessmentComparison: (studentId) => api.get(`/assessment/${studentId}/comparison`),
  getCognitiveScores: (studentId) => api.get(`/assessment/${studentId}/cognitive-scores`),
  
  // Bulk operations
  bulkGenerateAssessments: (data) => api.post('/assessment/bulk-generate', data),
  exportAssessments: (params) => api.get('/assessment/export', { params }),
};

// ═══════════════════════════════════════════════════════════
// BLOG API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const blogAPI = {
  // Psychologist routes
  getMyBlogs: (params) => api.get('/blogs/psychologist/my-blogs', { params }),
  getBlogById: (id) => api.get(`/blogs/psychologist/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  
  // Public routes
  getPublished: (params) => api.get('/blogs/published', { params }),
  getFeatured: (limit) => api.get('/blogs/featured', { params: { limit } }),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getCategories: () => api.get('/blogs/categories'),
  
  // Interactions
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  addComment: (id, content) => api.post(`/blogs/${id}/comment`, { content }),
  
  // Additional CMS operations
  publishBlog: (id) => api.put(`/blogs/${id}/publish`),
  unpublishBlog: (id) => api.put(`/blogs/${id}/unpublish`),
  incrementBlogViews: (id) => api.post(`/blogs/${id}/view`),
  getBlogTags: () => api.get('/blogs/tags'),
  bulkDeleteBlogs: (ids) => api.post('/blogs/bulk-delete', { ids }),
};

// ═══════════════════════════════════════════════════════════
// RESOURCE API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const resourceAPI = {
  // Psychologist routes
  getMyResources: (params) => api.get('/resources/psychologist/my-resources', { params }),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
  
  // Public routes
  getPublished: (params) => api.get('/resources/published', { params }),
  getPopular: (limit) => api.get('/resources/popular', { params: { limit } }),
  getById: (id) => api.get(`/resources/${id}`),
  getCategories: () => api.get('/resources/categories'),
  
  // Interactions
  recordDownload: (id) => api.post(`/resources/${id}/download`),
  toggleLike: (id) => api.post(`/resources/${id}/like`),
  rate: (id, rating, review) => api.post(`/resources/${id}/rate`, { rating, review }),
  
  // Additional operations
  downloadResource: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  incrementResourceDownloads: (id) => api.post(`/resources/${id}/download`),
  incrementResourceViews: (id) => api.post(`/resources/${id}/view`),
  getResourceTypes: () => api.get('/resources/types'),
  bulkDeleteResources: (ids) => api.post('/resources/bulk-delete', { ids }),
};

// ═══════════════════════════════════════════════════════════
// CMS (Content Management System) API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const cmsAPI = {
  // Blogs Management (redirects to blogAPI for consistency)
  getBlogs: (params) => blogAPI.getPublished(params),
  getBlogById: (id) => blogAPI.getBlogById(id),
  getBlogBySlug: (slug) => blogAPI.getBySlug(slug),
  createBlog: (data) => blogAPI.create(data),
  updateBlog: (id, data) => blogAPI.update(id, data),
  deleteBlog: (id) => blogAPI.delete(id),
  
  // Resources Management (redirects to resourceAPI for consistency)
  getResources: (params) => resourceAPI.getPublished(params),
  getResourceById: (id) => resourceAPI.getById(id),
  createResource: (formData) => resourceAPI.create(formData),
  updateResource: (id, data) => resourceAPI.update(id, data),
  deleteResource: (id) => resourceAPI.delete(id),
  
  // Upload media
  uploadMedia: (formData) => api.post('/cms/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ═══════════════════════════════════════════════════════════
// REPORTS API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const reportAPI = {
  // Generate PDF reports
  generateReport: (assessmentId, options) => api.post(`/reports/generate/${assessmentId}`, options),
  generateBulkReports: (assessmentIds) => api.post('/reports/bulk-generate', { assessmentIds }),
  
  // Get reports
  getStudentReports: (studentId, params) => api.get(`/reports/student/${studentId}`, { params }),
  getReportDetail: (reportId) => api.get(`/reports/${reportId}`),
  getAllReports: (params) => api.get('/reports', { params }),
  
  // Download reports
  downloadReport: (reportId) => api.get(`/reports/${reportId}/download`, {
    responseType: 'blob'
  }),
  downloadMultipleReports: (reportIds) => api.post('/reports/bulk-download', 
    { reportIds },
    { responseType: 'blob' }
  ),
  
  // Share reports
  shareReport: (reportId, data) => api.post(`/reports/${reportId}/share`, data),
  getSharedReports: (params) => api.get('/reports/shared', { params }),
  
  // Report management
  updateReport: (reportId, data) => api.put(`/reports/${reportId}`, data),
  deleteReport: (reportId) => api.delete(`/reports/${reportId}`),
  archiveReport: (reportId) => api.put(`/reports/${reportId}/archive`),
  
  // Report analytics
  getReportStats: () => api.get('/reports/stats'),
  getDownloadHistory: (reportId) => api.get(`/reports/${reportId}/history`),
};

// ═══════════════════════════════════════════════════════════
// THERAPY GAMES API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const therapyGamesAPI = {
  // Game sessions
  saveGameSession: (data) => api.post('/therapy-games/session', data),
  getGameSessions: (studentId, params) => api.get(`/therapy-games/sessions/${studentId}`, { params }),
  getGameSessionDetail: (sessionId) => api.get(`/therapy-games/sessions/detail/${sessionId}`),
  
  // Game statistics
  getGameStats: (studentId) => api.get(`/therapy-games/stats/${studentId}`),
  getGamePerformance: (studentId, gameType) => api.get(`/therapy-games/performance/${studentId}/${gameType}`),
  
  // Game types
  getAvailableGames: () => api.get('/therapy-games/available'),
  getGameConfig: (gameType) => api.get(`/therapy-games/config/${gameType}`),
};

// ═══════════════════════════════════════════════════════════
// ANALYTICS API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const analyticsAPI = {
  // Student analytics
  getStudentAnalytics: (studentId) => api.get(`/analytics/student/${studentId}`),
  getStudentProgress: (studentId, params) => api.get(`/analytics/student/${studentId}/progress`, { params }),
  getStudentComparison: (studentId) => api.get(`/analytics/student/${studentId}/comparison`),
  
  // Psychologist analytics
  getPsychologistAnalytics: () => api.get('/analytics/psychologist'),
  getSessionAnalytics: (params) => api.get('/analytics/sessions', { params }),
  getAssessmentAnalytics: (params) => api.get('/analytics/assessments', { params }),
  
  // Dashboard widgets
  getDashboardWidgets: () => api.get('/analytics/dashboard/widgets'),
  getRecentActivities: (limit) => api.get(`/analytics/activities?limit=${limit}`),
  
  // Export analytics
  exportAnalytics: (type, params) => api.get(`/analytics/export/${type}`, { 
    params,
    responseType: 'blob' 
  }),
};

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS API ENDPOINTS
// ═══════════════════════════════════════════════════════════
export const notificationsAPI = {
  // Get notifications
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  
  // Mark notifications
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  // Delete notifications
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
  deleteAllRead: () => api.delete('/notifications/read'),
  
  // Notification preferences
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (data) => api.put('/notifications/preferences', data),
};

// ═══════════════════════════════════════════════════════════
// GAME-SPECIFIC API ENDPOINTS (Unified Game API)
// ═══════════════════════════════════════════════════════════
export const gameAPI = {
  // MathQuest
  mathquest: {
    saveSession: (data) => api.post('/mathquest/session', data),
    getSessions: (params) => api.get('/mathquest/sessions', { params }),
    getStats: (userId) => api.get(`/mathquest/stats/${userId}`),
    getAnalytics: (userId, days = 30) => api.get(`/mathquest/analytics/${userId}`, { params: { days } }),
    getHistory: (userId, params = {}) => api.get(`/mathquest/history/${userId}`, { params }),
    getLeaderboard: (params = {}) => api.get('/mathquest/leaderboard', { params })
  },

  // Phoneme Game
  phoneme: {
    startSession: (userId) => api.post('/phoneme-game/start-session', { userId }),
    saveSession: (data) => api.post('/phoneme-game/session', data),
    saveAnswer: (data) => api.post('/phoneme-game/save-answer', data),
    endSession: (data) => api.post('/phoneme-game/end-session', data),
    getSessions: (params) => api.get('/phoneme-game/sessions', { params }),
    getProgress: () => api.get('/phoneme-game/progress'),
    getPerformance: (userId, timeRange = 'all') => 
      api.get('/phoneme-game/performance', { params: { userId, timeRange } })
  },

  // Word Formation
  wordFormation: {
    startSession: (userId) => api.post('/word-formation/start-session', { userId }),
    saveSession: (data) => api.post('/word-formation/session', data),
    saveAttempt: (data) => api.post('/word-formation/save-attempt', data),
    endSession: (data) => api.post('/word-formation/end-session', data),
    getSessions: (params) => api.get('/word-formation/sessions', { params }),
    getProgress: () => api.get('/word-formation/progress'),
    getPerformance: (userId, timeRange = 'all') => 
      api.get('/word-formation/performance', { params: { userId, timeRange } })
  },

  // Letter Tracing
  letterTracing: {
    startSession: (userId) => api.post('/letter-tracing/start-session', { userId }),
    saveSession: (data) => api.post('/letter-tracing/session', data),
    saveAttempt: (data) => api.post('/letter-tracing/save-attempt', data),
    endSession: (data) => api.post('/letter-tracing/end-session', data),
    getSessions: (params) => api.get('/letter-tracing/sessions', { params }),
    getProgress: () => api.get('/letter-tracing/progress'),
    getPerformance: (userId, timeRange = 'all') => 
      api.get('/letter-tracing/performance', { params: { userId, timeRange } })
  },

  // E-book Reading
  ebook: {
    startSession: (data) => api.post('/ebook/start-session', data),
    savePage: (data) => api.post('/ebook/save-page', data),
    saveProgress: (data) => api.post('/ebook/progress', data),
    endSession: (data) => api.post('/ebook/end-session', data),
    getProgress: (userId) => api.get('/ebook/progress', { params: { userId } }),
    getBooks: () => api.get('/ebook/books'),
    getBookDetail: (bookId) => api.get(`/ebook/books/${bookId}`),
    getAnalytics: (userId, timeRange = 'all') => 
      api.get('/ebook/analytics', { params: { userId, timeRange } })
  }
};

// Legacy game API exports for backwards compatibility
export const mathquestAPI = gameAPI.mathquest;
export const phonemeGameAPI = gameAPI.phoneme;
export const letterTracingAPI = gameAPI.letterTracing;
export const wordFormationAPI = gameAPI.wordFormation;
export const ebookAPI = gameAPI.ebook;

// ═══════════════════════════════════════════════════════════
// FILE UPLOAD HELPER
// ═══════════════════════════════════════════════════════════
export const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING HELPER
// ═══════════════════════════════════════════════════════════
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      errors: error.response.data?.errors || []
    };
  } else if (error.request) {
    // No response received
    return {
      message: 'Unable to connect to server. Please check your internet connection.',
      status: 0,
      errors: []
    };
  } else {
    // Error setting up request
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      errors: []
    };
  }
};

export default api;