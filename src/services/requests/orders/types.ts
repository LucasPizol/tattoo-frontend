import type { PaymentMethod } from "@/features/payment-methods/types";
import type { Address } from "../address/types";
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
  shipmentReceivedValue: MoneyValue;
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
  createdBy: "client" | "user";
  createdAt: string;
  updatedAt: string;
  productValue: MoneyValue;
  profitValue: MoneyValue;
  taxesValue: MoneyValue;
  totalValue: MoneyValue;
  costValue: MoneyValue;
  shippingValue: MoneyValue;
  address?: Address;
  paymentMethods?: string;
  client?: ClientShowResponse["client"];
  isPartsSynchronized: boolean;
  comissionsValue: MoneyValue;
  valueDivided: boolean;
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
  address_id: number;
  iris_part: number;
  jennipher_part: number;
  taxes_value: number;
  values_divided: boolean;
};

export type OrderWithProduct = Order & { product: Product };

export type OrderIndexResponse = {
  orders: OrderWithProduct[];
};

export type OrderShowResponse = {
  order: Order & {
    orderProducts: OrderProduct[];
    appliedBirthDateDiscountPercentage: number;
    canApplyBirthDateDiscount: boolean;
    birthDateDiscountValue?: MoneyValue;
    comissions: Comission[];
    orderPaymentMethods: OrderPaymentMethod[];
  };
};

export type OrderFilters = {
  client_name_or_client_email_or_client_phone_or_client_cpf_cont?: string;
  paid_at_gteq?: string;
  paid_at_lteq?: string;
  status_in?: OrderStatus[];
  client_id_eq?: number;
  created_by_eq?: "client" | "user";
};
