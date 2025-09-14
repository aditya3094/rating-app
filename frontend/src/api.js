import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getStores: (params) => api.get('/admin/stores', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  addUser: (userData) => api.post('/admin/users', userData),
  addStore: (storeData) => api.post('/admin/stores', storeData),
};

// User APIs
export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  submitRating: (ratingData) => api.post('/user/ratings', ratingData),
  updateRating: (ratingId, ratingData) => api.put(`/user/ratings/${ratingId}`, ratingData),
  getUserRatings: () => api.get('/user/ratings'),
};

// Store Owner APIs
export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
  getStoreRatings: () => api.get('/owner/ratings'),
};

export default api;