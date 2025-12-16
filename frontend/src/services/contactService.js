import api from './api';

export const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact messages (Owner only)
  getContactMessages: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Mark message as read (Owner only)
  markAsRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },

  // Delete contact message (Owner only)
  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  // Get unread count (Owner only)
  getUnreadCount: async () => {
    const response = await api.get('/contact/unread-count');
    return response.data;
  }
};