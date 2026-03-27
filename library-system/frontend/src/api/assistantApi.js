import api from './axios'

export const assistantApi = {
  askBookInfo: (question) => api.post('/assistant/book-info', { question }),
}
