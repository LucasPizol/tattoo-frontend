import { api } from "@/services/api";
import type { Tag } from "./types";

export const TagsService = {
  index: () => api.get<{ tags: Tag[] }>("/api/tags"),
  create: (payload: { name: string; notes?: string; tag_id?: number | null }) =>
    api.post<{ tag: Tag }>("/api/tags", { tag: payload }),
  update: (id: number, payload: { name?: string; notes?: string; tag_id?: number | null }) =>
    api.put<{ tag: Tag }>(`/api/tags/${id}`, { tag: payload }),
  delete: (id: number) => api.delete(`/api/tags/${id}`),
};
