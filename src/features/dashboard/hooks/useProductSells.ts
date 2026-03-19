import { api } from "@/services/api";
import type { DashboardFilter, ProductSellsResponse } from "@/features/dashboard/types";
import { useQuery } from "@tanstack/react-query";

export const useProductSells = (filter: DashboardFilter) => {
  const { data, isLoading, error } = useQuery<ProductSellsResponse>({
    queryKey: ["product-sells", filter],
    queryFn: () => api.get<ProductSellsResponse>("/api/dashboard/product_sells", { q: filter }),
    staleTime: 5 * 60 * 1000,
  });

  return { productSells: data, isLoading, error };
};
