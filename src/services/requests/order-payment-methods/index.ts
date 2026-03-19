import { api } from "@/services/api";
import type { OrderShowResponse } from "../orders/types";

export type CreateOrderPaymentMethodPayload = {
  payment_method_id: number;
  value: number;
};

export const OrderPaymentMethodsService = {
  create: (orderId: number, payload: CreateOrderPaymentMethodPayload) =>
    api.post<OrderShowResponse>(
      `/api/orders/${orderId}/order_payment_methods`,
      { order_payment_method: payload },
    ),
  update: (
    orderId: number,
    id: number,
    payload: Partial<CreateOrderPaymentMethodPayload>,
  ) =>
    api.put<OrderShowResponse>(
      `/api/orders/${orderId}/order_payment_methods/${id}`,
      { order_payment_method: payload },
    ),
  delete: (orderId: number, id: number) =>
    api.delete(`/api/orders/${orderId}/order_payment_methods/${id}`),
};
