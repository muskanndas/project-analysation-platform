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

export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard')
};

export const teamAPI = {
  createTeam: (payload) => api.post('/team/create', payload),
  getMyTeam: () => api.get('/team/my-team'),
  addMember: (payload) => api.post('/team/add-member', payload),
  removeMember: (userId) => api.delete(`/team/remove-member/${userId}`)
};

export const projectAPI = {
  createProject: (payload) => api.post('/project/create', payload),
  getMyProject: () => api.get('/project/my-project')
};

export const mentorAPI = {
  getProjects: (status) => api.get('/mentor/projects', { params: status ? { status } : {} }),
  getReviewProject: (projectId) => api.get(`/mentor/project/${projectId}/review`),
  reviewProject: (payload) => api.post('/mentor/project/review', payload),
  getReviews: (projectId) => api.get(`/mentor/project/reviews/${projectId}`),
  getProjectProgress: (projectId) => api.get(`/mentor/project/${projectId}/progress`),
  getProjectTasks: (projectId) => api.get(`/mentor/project/${projectId}/tasks`)
};

export const feedbackAPI = {
  createFeedback: (payload) => api.post('/feedback/create', payload),
  getProjectFeedback: (projectId) => api.get(`/feedback/project/${projectId}`),
  updateStatus: (feedbackId, status) => api.patch(`/feedback/update-status/${feedbackId}`, { status }),
  getStudentFeedback: () => api.get('/feedback/student/my-feedback')
};

export default api;
