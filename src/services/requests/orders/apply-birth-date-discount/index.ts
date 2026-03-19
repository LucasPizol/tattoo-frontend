import { api } from "@/services/api";

export const ApplyBirthDateDiscountRequests = {
  apply: (id: number) =>
    api.put<void>(`/api/orders/${id}/apply_birth_date_discount`),
};
