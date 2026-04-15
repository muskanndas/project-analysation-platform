import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword }),
};

export const adminAPI = {
  createMentor: (mentorData) => api.post('/admin/create-mentor', mentorData),
  getDepartmentOverview: () => api.get('/admin/department-overview'),
};

export default api;
