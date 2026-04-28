import type { User } from "@/services/requests/users/types";
import type { Tag } from "../tags/types";
import type { Category } from "../categories/types";
import type { ProductType } from "../product-types/types";

export type Stock = {
  id: number;
  quantity: number;
  user: User;
};

export type Product = {
  id: number;
  name: string;
  materialId: number;
  createdAt: string;
  updatedAt: string;
  stock: Stock[];
  productType: ProductType;
  costValue: {
    value: number;
    currency: string;
    formatted: string;
  };
  value: {
    value: number;
    currency: string;
    formatted: string;
  };
  tags: Tag[];
  requireResponsible: boolean;
  images: {
    url: string;
    thumbnailUrl: string;
    id: number;
  }[];
  user: User | null;
};

export type ProductCreatePayload = {
  name: string;
  material_id: number;
  value: number;
  tag_ids: number[];
  require_responsible: boolean;
  images: File[];
  quantity?: number;
};

export type ProductWithMaterial = Product & {
  material: Category;
  stock: Stock[];
};

export type ProductIndexResponse = {
  products: ProductWithMaterial[];
};

export type ProductShowResponse = {
  product: Product;
};

export type ProductFilters = {
  name_cont?: string;
  quantity_lteq?: number;
  material_id_eq?: number;
  product_type_eq?: string;
  user_id_eq?: number | null;
  without_stock?: boolean;
  stocks_user_id_eq?: number | null;
};
