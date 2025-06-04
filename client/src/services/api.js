import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const user = {
  login: (data) => api.post('/users/login', data),
  signup: (data) => api.post('/users/signup', data),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/updateMe', data),
  updatePassword: (data) => api.patch('/users/updateMyPassword', data),
  logout: () => api.get('/users/logout'),
};

// Link endpoints
export const links = {
  create: (data) => api.post('/links/c', data),
  update: (shortCode, data) => api.patch(`/links/u/${shortCode}`, data),
  delete: (shortCode) => api.delete(`/links/d/${shortCode}`),
  get: (shortCode) => api.get(`/links/i/${shortCode}`),
  goTo: (shortCode) => api.get(`/links/g/${shortCode}`),
};

export default api;
