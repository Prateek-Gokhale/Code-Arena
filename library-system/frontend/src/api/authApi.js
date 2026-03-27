// FILE: src/api/authApi.js
import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
}

// FILE: src/api/booksApi.js - (separate file below)
