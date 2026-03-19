import { fetchProductTypes, type ProductType } from "@/features/shared/http/queries/productTypesQuery";
import { useQuery } from "@tanstack/react-query";

export const useProductType = ({
  disabled = false,
}: { disabled?: boolean } = {}) => {
  const { data, isLoading, error } = useQuery<ProductType[]>({
    queryKey: ["product-types"],
    queryFn: fetchProductTypes,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !disabled,
  });

  return { productTypes: data, isLoading, error };
};
