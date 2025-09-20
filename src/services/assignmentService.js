import api from './api';

export const assignmentService = {
  getAssignments: async (status = '') => {
    const params = status ? { status } : {};
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  getAssignment: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  updateAssignmentStatus: async (id, status) => {
    const response = await api.put(`/assignments/${id}/status`, { status });
    return response.data;
  }
};
