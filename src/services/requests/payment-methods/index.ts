import { api } from "@/services/api";
import type {
  CreatePaymentMethodPayload,
  PaymentMethod,
  PaymentMethodFilters,
} from "./types";

export const PaymentMethodsService = {
  index: (data: { q: PaymentMethodFilters }) =>
    api.get<{ paymentMethods: PaymentMethod[] }>("/api/payment_methods", data),
  create: (payload: CreatePaymentMethodPayload) =>
    api.post<{ paymentMethod: PaymentMethod }>("/api/payment_methods", {
      payment_method: payload,
    }),
  update: (id: number, payload: Partial<CreatePaymentMethodPayload>) =>
    api.put<{ paymentMethod: PaymentMethod }>(`/api/payment_methods/${id}`, {
      payment_method: payload,
    }),
  delete: (id: number) => api.delete(`/api/payment_methods/${id}`),
};
