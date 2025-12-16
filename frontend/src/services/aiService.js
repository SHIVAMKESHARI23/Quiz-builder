import api from './api';

export const aiService = {
  getExplanation: async (questionData) => {
    const response = await api.post('/ai/explain', questionData);
    return response.data;
  },

  getAnalysis: async () => {
    const response = await api.get('/ai/analysis');
    return response.data;
  }
};
