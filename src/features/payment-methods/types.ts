export type PaymentMethod = {
  id: number;
  name: string;
  taxes: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentMethodPayload = {
  name: string;
  taxes: number;
};

export type PaymentMethodFilters = {
  name_cont?: string;
};
