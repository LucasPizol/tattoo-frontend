import type { ProductFilters } from "@/features/products/types";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useProductsQuery } from "../http/queries/productsQuery";
import { useDeleteProduct } from "../http/mutations/productMutations";

type UseProductProps = {
  perPage?: number;
  disabled?: boolean;
};

const defaultValues: ProductFilters = {
  name_cont: "",
  quantity_lteq: undefined,
  material_id_eq: undefined,
  product_type_eq: undefined,
  user_id_eq: undefined,
  without_stock: undefined,
  stocks_user_id_eq: undefined,
};

export const useProduct = ({
  perPage = 20,
  disabled = false,
}: UseProductProps = {}) => {
  const { mutateAsync: deleteProduct, isPending: isDestroying } =
    useDeleteProduct();

  const form = useForm<ProductFilters>({
    defaultValues,
  });

  const { products, isLoading, pagination, refetch, onChangeFilters, filters } =
    useProductsQuery({ perPage, disabled });

  const onFinishFilters = useCallback(
    (filters: ProductFilters, shouldSetParams = true) => {
      onChangeFilters(filters, shouldSetParams);
    },
    [onChangeFilters],
  );

  const handleDestroyProduct = useCallback(
    async (product: { id: number }) => {
      await deleteProduct(product.id);
    },
    [deleteProduct],
  );

  const clearFilters = useCallback(
    (shouldSetParams = true) => {
      form.reset(defaultValues);
      onFinishFilters(defaultValues, shouldSetParams);
    },
    [form],
  );

  return {
    products,
    isLoading,
    pagination,
    refetch,
    handleDestroyProduct,
    isDestroying,
    onFinishFilters,
    filters,
    filtersForm: form,
    clearFilters,
  };
};
