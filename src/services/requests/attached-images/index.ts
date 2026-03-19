import { api } from "@/services/api";

export const AttachedImagesRequests = {
  destroy: (id: number) => api.delete<void>(`/api/attached_images/${id}`),
};
