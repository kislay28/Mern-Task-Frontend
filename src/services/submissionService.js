import api from './api';

export const submissionService = {
  createSubmission: async (submissionData) => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submissions/my');
    return response.data;
  },

  getSubmission: async (id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },

  markAsReviewed: async (id) => {
    const response = await api.put(`/submissions/${id}/review`);
    return response.data;
  }
};
