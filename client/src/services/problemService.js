import { api } from "./api";

export const problemService = {
  list: (params) => api.get("/problems", { params }).then((res) => res.data),
  get: (slug) => api.get(`/problems/${slug}`).then((res) => res.data),
  adminList: () => api.get("/admin/problems").then((res) => res.data),
  adminGet: (id) => api.get(`/admin/problems/${id}`).then((res) => res.data),
  create: (payload) => api.post("/admin/problems", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/admin/problems/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/admin/problems/${id}`).then((res) => res.data)
};
