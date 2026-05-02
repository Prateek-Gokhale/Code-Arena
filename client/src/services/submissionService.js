import { api } from "./api";

export const submissionService = {
  run: (payload) => api.post("/submissions/run", payload).then((res) => res.data),
  submit: (payload) => api.post("/submissions", payload).then((res) => res.data),
  list: (params) => api.get("/submissions", { params }).then((res) => res.data),
  get: (id) => api.get(`/submissions/${id}`).then((res) => res.data),
  stats: () => api.get("/submissions/stats").then((res) => res.data)
};
