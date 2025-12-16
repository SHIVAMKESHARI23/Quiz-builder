import api from './api';

export const quizService = {
  getQuizzes: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/quizzes?${params}`);
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  getMyQuizzes: async () => {
    const response = await api.get('/quizzes/my-quizzes');
    return response.data;
  },

  getQuizAttempts: async (id) => {
    const response = await api.get(`/quizzes/${id}/attempts`);
    return response.data;
  }
};
