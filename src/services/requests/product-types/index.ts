import { api } from "@/services/api";
import type { ProductType } from "./types";

const index = () => {
  return api.get<ProductType[]>("/api/product_types");
};

export const ProductTypeRequests = {
  index,
};
