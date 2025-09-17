import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Use relative path with Vite proxy
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints for study groups
export const studyGroupsAPI = {
  // Get all study groups with pagination and filtering
  getAll: (params = {}) => api.get('/study-groups', { params }),
  
  // Get single study group
  getById: (id) => api.get(`/study-groups/${id}`),
  
  // Create new study group
  create: (data) => api.post('/study-groups', data),
  
  // Update study group
  update: (id, data) => api.put(`/study-groups/${id}`, data),
  
  // Delete study group
  delete: (id) => api.delete(`/study-groups/${id}`),
  
  // Join study group
  join: (id) => api.post(`/study-groups/${id}/join`),
  
  // Leave study group
  leave: (id) => api.post(`/study-groups/${id}/leave`),
  
  // Add resource to study group
  addResource: (id, data) => api.post(`/study-groups/${id}/resources`, data),
  
  // Get user's study groups
  getUserGroups: () => api.get('/study-groups/user/me'),

  // Join study group
  join: (id) => api.post(`/study-groups/${id}/join`),

  // Leave study group
  leave: (id) => api.post(`/study-groups/${id}/leave`),

  // Delete study group
  delete: (id) => api.delete(`/study-groups/${id}`),
};

// API endpoints for channels
export const channelsAPI = {
  // Get all channels with pagination and filtering
  getAll: (params = {}) => api.get('/channels', { params }),

  // Get single channel
  getById: (id) => api.get(`/channels/${id}`),

  // Create new channel
  create: (data) => api.post('/channels', data),

  // Join channel
  join: (id) => api.post(`/channels/${id}/join`),

  // Leave channel
  leave: (id) => api.post(`/channels/${id}/leave`),

  // Delete channel
  delete: (id) => api.delete(`/channels/${id}`),
};

// Cache utility
const cache = {
  get: (key) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (item) {
        const { data, timestamp } = JSON.parse(item);
        // Cache valid for 1 minute
        if (Date.now() - timestamp < 60000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  },
  
  set: (key, data) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },
  
  clear: (key) => {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};

export { api, cache };
