import { api } from "@/services/api";

export const ImagesRequest = {
  delete: (id: number) => api.delete(`/api/images/${id}`),
};
