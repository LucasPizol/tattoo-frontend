import { api } from "@/services/api";
import type { ComissionsCreatePayload } from "./types";

export const ComissionsRequests = {
  create: (orderId: number, payload: ComissionsCreatePayload) =>
    api.post<void>(`/api/orders/${orderId}/comissions`, {
      comission: payload,
    }),
  update: (
    orderId: number,
    comissionId: number,
    payload: Partial<ComissionsCreatePayload>
  ) =>
    api.put<void>(`/api/orders/${orderId}/comissions/${comissionId}`, {
      comission: payload,
    }),
  delete: (orderId: number, comissionId: number) =>
    api.delete<void>(`/api/orders/${orderId}/comissions/${comissionId}`),
};
