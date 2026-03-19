import { api } from "@/services/api";
import type { CreateCategoryPayload, Category, CategoryFilters } from "./types";

export const CategoriesService = {
  index: (data: { q: CategoryFilters }) =>
    api.get<{ materials: Category[] }>("/api/materials", data),
  create: (payload: CreateCategoryPayload) =>
    api.post<{ material: Category }>("/api/materials", {
      material: payload,
    }),
  update: (id: number, payload: Partial<CreateCategoryPayload>) =>
    api.put<{ material: Category }>(`/api/materials/${id}`, {
      material: payload,
    }),
  delete: (id: number) => api.delete(`/api/materials/${id}`),
};
