import type { User } from "@/features/users/types";
import type { Tag } from "@/features/tags/types";
import type { Category } from "@/features/categories/types";
import type { ProductType } from "@/features/shared/http/queries/productTypesQuery";

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
  featured: boolean;
  new: boolean;
  carousel: boolean;
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
  featured: boolean;
  new: boolean;
  carousel: boolean;
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
  featured_eq?: boolean;
  new_eq?: boolean;
  carousel_eq?: boolean;
  user_id_eq?: number | null;
  without_stock?: boolean;
  stocks_user_id_eq?: number | null;
  not_featured_eq?: boolean;
};
