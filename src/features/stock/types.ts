import type { Product } from "@/features/products/types";

export type StockMovement = {
  id: number;
  materialId: number;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  value: {
    value: number;
    currency: string;
    formatted: string;
  };
  product: Product;
  movementType: "in" | "out";
  order?: {
    id: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type StockMovementCreatePayload = {
  product_id: number;
  value: number;
};

export type StockMovementIndexResponse = {
  stockMovements: StockMovement[];
};

export type StockMovementShowResponse = {
  stockMovement: StockMovement;
};

export const StockMovementMovementType = {
  IN: "in",
  OUT: "out",
} as const;

export type StockMovementMovementType =
  (typeof StockMovementMovementType)[keyof typeof StockMovementMovementType];

export type StockMovementFilters = {
  product_name_cont?: string;
  created_at_gteq?: string;
  created_at_lteq?: string;
  movement_type_in?: StockMovementMovementType[];
};
