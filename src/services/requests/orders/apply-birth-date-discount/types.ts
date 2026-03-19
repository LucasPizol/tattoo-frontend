import type { Address } from "../../address/types";
import type { ClientShowResponse } from "../../client/types";
import type { OrderProduct } from "../../order-products/types";
import type { PaymentMethod } from "../../payment-methods/types";
import type { Product } from "../../products/types";

export type MoneyValue = {
  value: number;
  currency: string;
  formatted: string;
};

export type Order = {
  id: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  productValue: MoneyValue;
  profitValue: MoneyValue;
  taxesValue: MoneyValue;
  totalValue: MoneyValue;
  costValue: MoneyValue;
  irisPart: MoneyValue;
  jennipherPart: MoneyValue;
  address?: Address;
  paymentMethod?: PaymentMethod;
  client?: ClientShowResponse["client"];
};

export const OrderStatus = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "canceled",
  WAITING_FOR_PAYMENT: "waiting_for_payment",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type OrderCreatePayload = {
  status: OrderStatus;
  payment_method_id: number;
  client_id: number;
  address_id: number;
  iris_part: number;
  jennipher_part: number;
};

export type OrderWithProduct = Order & { product: Product };

export type OrderIndexResponse = {
  orders: OrderWithProduct[];
};

export type OrderShowResponse = {
  order: Order & {
    orderProducts: OrderProduct[];
  };
};

export type OrderFilters = {
  client_name_or_client_email_or_client_phone_or_client_cpf_cont?: string;
  paid_at_gteq?: string;
  paid_at_lteq?: string;
  status_in?: OrderStatus[];
};
