import { api } from "@/services/api";

export type ProductType = {
  key: string;
  label: string;
  color: string;
};

export const fetchProductTypes = () =>
  api.get<ProductType[]>("/api/product_types");
