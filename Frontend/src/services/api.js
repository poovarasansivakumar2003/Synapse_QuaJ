import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
  getAlumni: (params) => api.get('/users/alumni', { params }),
  getStudents: () => api.get('/users/students'),
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Chat API
export const chatAPI = {
  startChat: (participantId) => api.post('/chat/start', { participantId }),
  getChats: () => api.get('/chat'),
  sendMessage: (chatId, content) => api.post(`/chat/${chatId}/message`, { content }),
};

// Meetings API
export const meetingsAPI = {
  scheduleMeeting: (data) => api.post('/meetings/schedule', data),
  getMeetings: () => api.get('/meetings'),
  updateMeetingStatus: (meetingId, status) => 
    api.put(`/meetings/${meetingId}/status`, { status }),
};

// Videos API
export const videosAPI = {
  getVideosByCourse: (course, category) => 
    api.get(`/videos/course/${course}`, { params: { category } }),
  incrementView: (videoId) => api.post(`/videos/${videoId}/view`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (page = 1) => api.get('/notifications', { params: { page } }),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;
