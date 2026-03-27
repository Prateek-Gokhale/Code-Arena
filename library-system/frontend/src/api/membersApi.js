import api from './axios'
export const membersApi = {
  getAll: (params) => api.get('/members', { params }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  toggleStatus: (id) => api.patch(`/members/${id}/toggle-status`),
}
