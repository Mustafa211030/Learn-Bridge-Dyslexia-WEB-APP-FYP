// // services/psychologistApi.js
// // API service for psychologist module - Updated with FormData support

// import axios from 'axios';
// import Cookies from 'js-cookie';

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Create axios instance for multipart/form-data (file uploads)
// const formDataApi = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
// });

// // Request interceptor to add auth token
// const addAuthToken = (config) => {
//   const token = Cookies.get('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// };

// api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
// formDataApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// // Response interceptor for error handling
// const handleResponseError = (error) => {
//   // Handle 401 Unauthorized - redirect to login
//   if (error.response?.status === 401) {
//     Cookies.remove('auth_token');
//     if (typeof window !== 'undefined') {
//       window.location.href = '/login?session=expired';
//     }
//   }
  
//   // Handle 403 Forbidden
//   if (error.response?.status === 403) {
//     console.error('Access forbidden:', error.response.data?.message);
//   }
  
//   return Promise.reject(error);
// };

// api.interceptors.response.use((response) => response, handleResponseError);
// formDataApi.interceptors.response.use((response) => response, handleResponseError);

// // ============================================
// // DASHBOARD API
// // ============================================
// export const dashboardAPI = {
//   // Get dashboard data with stats, alerts, and recent activities
//   getDashboard: () => api.get('/psychologist/dashboard'),
// };

// // ============================================
// // STUDENTS API
// // ============================================
// export const studentsAPI = {
//   // Get all assigned students with optional filters
//   getStudents: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.search) queryParams.append('search', params.search);
//     if (params.riskLevel) queryParams.append('riskLevel', params.riskLevel);
//     if (params.sortBy) queryParams.append('sortBy', params.sortBy);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/psychologist/students?${queryParams.toString()}`);
//   },

//   // Get single student detail with game data and assessments
//   getStudentDetail: (studentId) => api.get(`/psychologist/students/${studentId}`),
// };

// // ============================================
// // ASSESSMENTS API
// // ============================================
// export const assessmentsAPI = {
//   // Get all assessments for the psychologist
//   getAllAssessments: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.riskLevel) queryParams.append('riskLevel', params.riskLevel);
//     if (params.status) queryParams.append('status', params.status);
//     if (params.sortBy) queryParams.append('sortBy', params.sortBy);
//     if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/assessments?${queryParams.toString()}`);
//   },

//   // Get assessments for a specific student
//   getStudentAssessments: (studentId, params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/assessments/student/${studentId}?${queryParams.toString()}`);
//   },

//   // Get single assessment detail
//   getAssessmentDetail: (assessmentId) => api.get(`/assessments/${assessmentId}`),

//   // Generate new assessment for a student
//   generateAssessment: (studentId, data = {}) => 
//     api.post(`/assessments/generate/${studentId}`, data),

//   // Update assessment notes/recommendations
//   updateAssessment: (assessmentId, data) => 
//     api.put(`/assessments/${assessmentId}`, data),
// };

// // ============================================
// // BLOGS API
// // ============================================
// export const blogsAPI = {
//   // Get all blogs for the psychologist (with status counts)
//   getMyBlogs: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.status) queryParams.append('status', params.status);
//     if (params.category) queryParams.append('category', params.category);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/blogs/psychologist/my-blogs?${queryParams.toString()}`);
//   },

//   // Get single blog by ID (for editing)
//   getBlogById: (blogId) => api.get(`/blogs/psychologist/${blogId}`),

//   // Create new blog post (supports FormData for image upload)
//   createBlog: (data) => {
//     // Check if data is FormData (has file) or regular object
//     if (data instanceof FormData) {
//       return formDataApi.post('/blogs', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     }
//     return api.post('/blogs', data);
//   },

//   // Update blog post (supports FormData for image upload)
//   updateBlog: (blogId, data) => {
//     if (data instanceof FormData) {
//       return formDataApi.put(`/blogs/${blogId}`, data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     }
//     return api.put(`/blogs/${blogId}`, data);
//   },

//   // Delete blog post
//   deleteBlog: (blogId) => api.delete(`/blogs/${blogId}`),

//   // Get published blogs (public)
//   getPublishedBlogs: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.category) queryParams.append('category', params.category);
//     if (params.tag) queryParams.append('tag', params.tag);
//     if (params.author) queryParams.append('author', params.author);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/blogs/published?${queryParams.toString()}`);
//   },

//   // Get blog by slug (public)
//   getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),

//   // Get featured blogs
//   getFeaturedBlogs: (limit = 5) => api.get(`/blogs/featured?limit=${limit}`),

//   // Get blog categories
//   getCategories: () => api.get('/blogs/categories'),

//   // Toggle like on a blog
//   toggleLike: (blogId) => api.post(`/blogs/${blogId}/like`),

//   // Add comment to a blog
//   addComment: (blogId, content) => api.post(`/blogs/${blogId}/comment`, { content }),
// };

// // ============================================
// // RESOURCES API
// // ============================================
// export const resourcesAPI = {
//   // Get all resources for the psychologist
//   getMyResources: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.status) queryParams.append('status', params.status);
//     if (params.category) queryParams.append('category', params.category);
//     if (params.resourceType) queryParams.append('resourceType', params.resourceType);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/resources/psychologist/my-resources?${queryParams.toString()}`);
//   },

//   // Get single resource by ID
//   getResourceById: (resourceId) => api.get(`/resources/${resourceId}`),

//   // Create/upload new resource (supports FormData for file upload)
//   createResource: (data) => {
//     if (data instanceof FormData) {
//       return formDataApi.post('/resources', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     }
//     return api.post('/resources', data);
//   },

//   // Update resource (supports FormData for file upload)
//   updateResource: (resourceId, data) => {
//     if (data instanceof FormData) {
//       return formDataApi.put(`/resources/${resourceId}`, data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     }
//     return api.put(`/resources/${resourceId}`, data);
//   },

//   // Delete resource
//   deleteResource: (resourceId) => api.delete(`/resources/${resourceId}`),

//   // Get published resources (public)
//   getPublishedResources: (params = {}) => {
//     const queryParams = new URLSearchParams();
//     if (params.category) queryParams.append('category', params.category);
//     if (params.resourceType) queryParams.append('resourceType', params.resourceType);
//     if (params.targetAudience) queryParams.append('targetAudience', params.targetAudience);
//     if (params.search) queryParams.append('search', params.search);
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
    
//     return api.get(`/resources/published?${queryParams.toString()}`);
//   },

//   // Get popular resources
//   getPopularResources: (limit = 10) => api.get(`/resources/popular?limit=${limit}`),

//   // Get resource categories
//   getCategories: () => api.get('/resources/categories'),

//   // Record download
//   recordDownload: (resourceId) => api.post(`/resources/${resourceId}/download`),

//   // Toggle like
//   toggleLike: (resourceId) => api.post(`/resources/${resourceId}/like`),

//   // Rate resource
//   rateResource: (resourceId, rating, review = '') => 
//     api.post(`/resources/${resourceId}/rate`, { rating, review }),
// };

// // ============================================
// // PROFILE API
// // ============================================
// export const profileAPI = {
//   // Get psychologist profile
//   getProfile: () => api.get('/psychologist/profile'),

//   // Update psychologist profile (supports FormData for photo upload)
//   updateProfile: (data) => {
//     if (data instanceof FormData) {
//       return formDataApi.put('/psychologist/profile', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//     }
//     return api.put('/psychologist/profile', data);
//   },
// };

// // ============================================
// // COMBINED API EXPORT (for backward compatibility)
// // ============================================
// export const psychologistAPI = {
//   // Dashboard
//   getDashboard: dashboardAPI.getDashboard,
  
//   // Students
//   getStudents: studentsAPI.getStudents,
//   getStudentDetail: studentsAPI.getStudentDetail,
  
//   // Assessments
//   getAllAssessments: assessmentsAPI.getAllAssessments,
//   getStudentAssessments: assessmentsAPI.getStudentAssessments,
//   getAssessmentDetail: assessmentsAPI.getAssessmentDetail,
//   generateAssessment: assessmentsAPI.generateAssessment,
//   updateAssessment: assessmentsAPI.updateAssessment,
  
//   // Blogs
//   getMyBlogs: blogsAPI.getMyBlogs,
//   getBlogById: blogsAPI.getBlogById,
//   createBlog: blogsAPI.createBlog,
//   updateBlog: blogsAPI.updateBlog,
//   deleteBlog: blogsAPI.deleteBlog,
//   getPublishedBlogs: blogsAPI.getPublishedBlogs,
//   getBlogBySlug: blogsAPI.getBlogBySlug,
//   getFeaturedBlogs: blogsAPI.getFeaturedBlogs,
//   getBlogCategories: blogsAPI.getCategories,
//   toggleBlogLike: blogsAPI.toggleLike,
//   addBlogComment: blogsAPI.addComment,
  
//   // Resources
//   getMyResources: resourcesAPI.getMyResources,
//   getResourceById: resourcesAPI.getResourceById,
//   createResource: resourcesAPI.createResource,
//   updateResource: resourcesAPI.updateResource,
//   deleteResource: resourcesAPI.deleteResource,
//   getPublishedResources: resourcesAPI.getPublishedResources,
//   getPopularResources: resourcesAPI.getPopularResources,
//   getResourceCategories: resourcesAPI.getCategories,
//   recordResourceDownload: resourcesAPI.recordDownload,
//   toggleResourceLike: resourcesAPI.toggleLike,
//   rateResource: resourcesAPI.rateResource,
  
//   // Profile
//   getProfile: profileAPI.getProfile,
//   updateProfile: profileAPI.updateProfile,
// };

// export default psychologistAPI;
























// services/psychologistApi.js
// API service for psychologist module - Complete CRUD with FormData support
// Merged and optimized version

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token and handle FormData
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login?session=expired';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data?.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTION FOR QUERY PARAMS
// ============================================
const buildQueryString = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
};

// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  // Get dashboard data with stats, alerts, and recent activities
  getDashboard: () => api.get('/psychologist/dashboard'),
};

// ============================================
// STUDENTS API
// ============================================
export const studentsAPI = {
  // Get all assigned students with optional filters
  getStudents: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/psychologist/students${query ? `?${query}` : ''}`);
  },

  // Get single student detail with game data and assessments
  getStudentDetail: (studentId) => api.get(`/psychologist/students/${studentId}`),
};

// ============================================
// ASSESSMENTS API
// ============================================
export const assessmentsAPI = {
  // Get all assessments for the psychologist
  getAllAssessments: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/assessments${query ? `?${query}` : ''}`);
  },

  // Get assessments for a specific student
  getStudentAssessments: (studentId, params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/assessments/student/${studentId}${query ? `?${query}` : ''}`);
  },

  // Get single assessment detail
  getAssessmentDetail: (assessmentId) => api.get(`/assessments/${assessmentId}`),

  // Generate new assessment for a student
  generateAssessment: (studentId, data = {}) => 
    api.post(`/assessments/generate/${studentId}`, data),

  // Update assessment notes/recommendations
  updateAssessment: (assessmentId, data) => 
    api.put(`/assessments/${assessmentId}`, data),
};

// ============================================
// BLOGS API - Full CRUD with FormData Support
// ============================================
export const blogsAPI = {
  // Get all blogs for the psychologist (with status counts)
  getMyBlogs: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/blogs/psychologist/my-blogs${query ? `?${query}` : ''}`);
  },

  // Get single blog by ID (for editing)
  getBlogById: (blogId) => api.get(`/blogs/psychologist/${blogId}`),

  // Create new blog post (supports FormData for image upload)
  createBlog: (data) => api.post('/blogs', data),

  // Update blog post (supports FormData for image upload)
  updateBlog: (blogId, data) => api.put(`/blogs/${blogId}`, data),

  // Delete blog post
  deleteBlog: (blogId) => api.delete(`/blogs/${blogId}`),

  // Get published blogs (public)
  getPublishedBlogs: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/blogs/published${query ? `?${query}` : ''}`);
  },

  // Get blog by slug (public)
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),

  // Get featured blogs
  getFeaturedBlogs: (limit = 5) => api.get(`/blogs/featured?limit=${limit}`),

  // Get blog categories
  getCategories: () => api.get('/blogs/categories'),

  // Toggle like on a blog
  toggleLike: (blogId) => api.post(`/blogs/${blogId}/like`),

  // Add comment to a blog
  addComment: (blogId, content) => api.post(`/blogs/${blogId}/comment`, { content }),
};

// ============================================
// RESOURCES API - Full CRUD with FormData Support
// ============================================
export const resourcesAPI = {
  // Get all resources for the psychologist
  getMyResources: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/resources/psychologist/my-resources${query ? `?${query}` : ''}`);
  },

  // Get single resource by ID
  getResourceById: (resourceId) => api.get(`/resources/${resourceId}`),

  // Create/upload new resource (supports FormData for file upload)
  createResource: (data) => api.post('/resources', data),

  // Update resource (supports FormData for file upload)
  updateResource: (resourceId, data) => api.put(`/resources/${resourceId}`, data),

  // Delete resource
  deleteResource: (resourceId) => api.delete(`/resources/${resourceId}`),

  // Get published resources (public)
  getPublishedResources: (params = {}) => {
    const query = buildQueryString(params);
    return api.get(`/resources/published${query ? `?${query}` : ''}`);
  },

  // Get popular resources
  getPopularResources: (limit = 10) => api.get(`/resources/popular?limit=${limit}`),

  // Get resource categories
  getCategories: () => api.get('/resources/categories'),

  // Record download
  recordDownload: (resourceId) => api.post(`/resources/${resourceId}/download`),

  // Toggle like
  toggleLike: (resourceId) => api.post(`/resources/${resourceId}/like`),

  // Rate resource
  rateResource: (resourceId, rating, review = '') => 
    api.post(`/resources/${resourceId}/rate`, { rating, review }),
};

// ============================================
// PROFILE API
// ============================================
export const profileAPI = {
  // Get psychologist profile
  getProfile: () => api.get('/psychologist/profile'),

  // Update psychologist profile (supports FormData for photo upload)
  updateProfile: (data) => api.put('/psychologist/profile', data),
};

// ============================================
// COMBINED API EXPORT (for backward compatibility)
// ============================================
export const psychologistAPI = {
  // Dashboard
  getDashboard: dashboardAPI.getDashboard,
  
  // Students
  getStudents: studentsAPI.getStudents,
  getStudentDetail: studentsAPI.getStudentDetail,
  
  // Assessments
  getAllAssessments: assessmentsAPI.getAllAssessments,
  getStudentAssessments: assessmentsAPI.getStudentAssessments,
  getAssessmentDetail: assessmentsAPI.getAssessmentDetail,
  generateAssessment: assessmentsAPI.generateAssessment,
  updateAssessment: assessmentsAPI.updateAssessment,
  
  // Blogs - Full CRUD
  getMyBlogs: blogsAPI.getMyBlogs,
  getBlogById: blogsAPI.getBlogById,
  createBlog: blogsAPI.createBlog,
  updateBlog: blogsAPI.updateBlog,
  deleteBlog: blogsAPI.deleteBlog,
  getPublishedBlogs: blogsAPI.getPublishedBlogs,
  getBlogBySlug: blogsAPI.getBlogBySlug,
  getFeaturedBlogs: blogsAPI.getFeaturedBlogs,
  getBlogCategories: blogsAPI.getCategories,
  toggleBlogLike: blogsAPI.toggleLike,
  addBlogComment: blogsAPI.addComment,
  
  // Resources - Full CRUD
  getMyResources: resourcesAPI.getMyResources,
  getResourceById: resourcesAPI.getResourceById,
  createResource: resourcesAPI.createResource,
  updateResource: resourcesAPI.updateResource,
  deleteResource: resourcesAPI.deleteResource,
  getPublishedResources: resourcesAPI.getPublishedResources,
  getPopularResources: resourcesAPI.getPopularResources,
  getResourceCategories: resourcesAPI.getCategories,
  recordResourceDownload: resourcesAPI.recordDownload,
  toggleResourceLike: resourcesAPI.toggleLike,
  rateResource: resourcesAPI.rateResource,
  
  // Profile
  getProfile: profileAPI.getProfile,
  updateProfile: profileAPI.updateProfile,
};

export default psychologistAPI;