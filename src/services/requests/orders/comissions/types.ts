import type { MoneyValue } from "../types";

export type ComissionsCreatePayload = {
  name: string;
  percentage?: number;
  value?: number;
};

export type Comission = {
  id: number;
  name: string;
  percentage: number;
  value: MoneyValue;
  orderId: number;
};
