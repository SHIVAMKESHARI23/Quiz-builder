import api from './api';

export const attemptService = {
  submitAttempt: async (attemptData) => {
    const response = await api.post('/attempts', attemptData);
    return response.data;
  },

  getUserAttempts: async () => {
    const response = await api.get('/attempts');
    return response.data;
  },

  getAttemptById: async (id) => {
    const response = await api.get(`/attempts/${id}`);
    return response.data;
  }
};
