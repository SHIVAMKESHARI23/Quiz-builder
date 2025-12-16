import api from './api';

export const progressService = {
  getUserProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getScoreHistory: async () => {
    const response = await api.get('/progress/history');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/progress/stats');
    return response.data;
  }
};
