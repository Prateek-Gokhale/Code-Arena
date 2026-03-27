import api from './axios'

export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  removeItem: (bookId) => api.delete(`/cart/items/${bookId}`),
  checkout: () => api.post('/cart/checkout'),
  myPurchases: () => api.get('/cart/purchases'),
}
