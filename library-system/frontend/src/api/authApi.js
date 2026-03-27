// FILE: src/api/authApi.js
import api from './axios'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// FILE: src/api/booksApi.js - (separate file below)
