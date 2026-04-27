import type { ClientShowResponse } from "../client/types";
import type { OrderProduct } from "../order-products/types";
import type { Product } from "../products/types";
import type { Comission } from "./comissions/types";

export type MoneyValue = {
  value: number;
  currency: string;
  formatted: string;
};

export type Payment = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  valueExpected: MoneyValue;
  valueReceived: MoneyValue;
  paymentMethod: {
    id: number;
    name: string;
  };
};

export type OrderPaymentMethod = {
  id: number;
  paymentMethodId: number;
  paymentMethodName: string;
  value: MoneyValue;
  createdAt: string;
  updatedAt: string;
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
  paymentMethods?: string;
  client?: ClientShowResponse["client"];
  isPartsSynchronized: boolean;
  comissionsValue: MoneyValue;
};

export const OrderStatus = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "canceled",
  REOPENED: "reopened",
  WAITING_FOR_PAYMENT: "waiting_for_payment",
  PROCESSING: "processing",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type OrderCreatePayload = {
  status: OrderStatus;
  client_id: number | null;
  taxes_value: number;
};

export type OrderWithProduct = Order & { product: Product };

export type OrderIndexResponse = {
  orders: OrderWithProduct[];
};

export type OrderShowResponse = {
  order: Order & {
    orderProducts: OrderProduct[];
    comissions: Comission[];
    orderPaymentMethods: OrderPaymentMethod[];
    payments: Payment[];
  };
};

export type OrderFilters = {
  client_name_or_client_email_or_client_phone_or_client_cpf_cont?: string;
  paid_at_gteq?: string;
  paid_at_lteq?: string;
  status_in?: OrderStatus[];
  client_id_eq?: number;
};
