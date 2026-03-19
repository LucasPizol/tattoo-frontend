import { api } from "@/services/api";
import type { SaleMessage, SaleMessageCreatePayload } from "./types";

export const SaleMessageRequests = {
  index: (orderId: number) =>
    api.get<{ saleMessages: SaleMessage[] }>(`/api/sale_messages`, {
      order_id: orderId,
    }),
  create: (payload: SaleMessageCreatePayload) =>
    api.post<{ saleMessage: SaleMessage }>(`/api/sale_messages`, {
      order_id: payload.order_id,
      sale_message: {
        scheduled_at: payload.scheduled_at,
      },
    }),
  delete: (saleMessageId: number, orderId: number) =>
    api.delete(`/api/sale_messages/${saleMessageId}?order_id=${orderId}`),
};
