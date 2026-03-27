import api from './axios'
export const borrowsApi = {
  getAll: (params) => api.get('/borrows', { params }),
  getOverdue: (params) => api.get('/borrows/overdue', { params }),
  getUserBorrows: (userId, params) => api.get(`/borrows/user/${userId}`, { params }),
  issue: (data) => api.post('/borrows/issue', data),
  returnBook: (id) => api.post(`/borrows/${id}/return`),
  updateOverdue: () => api.post('/borrows/update-overdue'),
}
