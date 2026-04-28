import { useQueryPagination } from "@/hooks/useQueryPagination";
import { api } from "@/services/api";
import type { ProductFilters, ProductWithMaterial } from "../../types";
import { Time } from "@/utils/time";

type UseProductsQueryProps = {
  perPage?: number;
  disabled?: boolean;
  initialFilters?: Partial<ProductFilters>;
};

export const useProductsQuery = ({
  perPage = 20,
  disabled = false,
  initialFilters,
}: UseProductsQueryProps = {}) => {
  const {
    data,
    isLoading,
    isPending,
    isRefetching,
    refetch,
    pagination,
    onChangeFilters,
    filters,
  } = useQueryPagination<ProductWithMaterial, ProductFilters>({
    queryKey: ["products"],
    queryFn: (pagination) =>
      api.get("/api/products", {
        ...pagination,
        q: {
          ...pagination.q,
          user_id_eq: pagination.q?.user_id_eq,
        },
      }),
    initialFilters: {
      name_cont: "",
      quantity_lteq: undefined,
      ...initialFilters,
    },
    initialPagination: {
      per_page: perPage,
    },
    enabled: !disabled,
    staleTime: Time.minutes(10),
  });

  return {
    products: data,
    isLoading: isLoading || isPending || isRefetching,
    refetch,
    pagination,
    onChangeFilters,
    filters,
  };
};
