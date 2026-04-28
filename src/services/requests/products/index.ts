import type { Pagination, PaginationResponse } from "@/models/Pagination";
import { api } from "@/services/api";
import type {
  ProductCreatePayload,
  ProductFilters,
  ProductShowResponse,
  ProductWithMaterial,
} from "./types";

export const ProductRequests = {
  create: (payload: ProductCreatePayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((data) =>
          formData.append(`product[${key}][]`, data as any),
        );
        return;
      }
      formData.append(`product[${key}]`, String(value).trim());
    });

    return api.post<ProductShowResponse>("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  index: (data: Pagination & { q?: ProductFilters }) =>
    api.get<PaginationResponse<ProductWithMaterial>>("/api/products", {
      ...data,
      q: {
        ...data.q,
        user_id_eq: data.q?.user_id_eq,
      },
    }),
  show: (id: number) => api.get<ProductShowResponse>(`/api/products/${id}`),
  update: (id: number, payload: Partial<ProductCreatePayload>) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((data) =>
          formData.append(`product[${key}][]`, data as any),
        );
        return;
      }

      formData.append(`product[${key}]`, String(value).trim());
    });

    return api.put<ProductShowResponse>(`/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id: number) => api.delete(`/api/products/${id}`),
};
