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
  featured_eq: undefined,
  new_eq: undefined,
  carousel_eq: undefined,
  user_id_eq: undefined,
  without_stock: undefined,
  stocks_user_id_eq: undefined,
  not_featured_eq: undefined,
};

export const useProduct = ({
  perPage = 20,
  disabled = false,
}: UseProductProps = {}) => {
  const { mutateAsync: deleteProduct, isPending: isDestroying } = useDeleteProduct();

  const form = useForm<ProductFilters>({
    defaultValues,
  });

  const {
    products,
    isLoading,
    pagination,
    refetch,
    onChangeFilters,
    filters,
  } = useProductsQuery({ perPage, disabled });

  const onFinishFilters = useCallback(
    (filters: ProductFilters) => {
      onChangeFilters({
        ...filters,
        not_featured_eq: filters.featured_eq
          ? false
          : filters.not_featured_eq
            ? true
            : undefined,
        featured_eq: filters.featured_eq
          ? true
          : filters.not_featured_eq
            ? false
            : undefined,
      });
    },
    [onChangeFilters],
  );

  const handleDestroyProduct = useCallback(
    async (product: { id: number }) => {
      await deleteProduct(product.id);
    },
    [deleteProduct],
  );

  const clearFilters = useCallback(() => {
    form.reset(defaultValues);
    onFinishFilters(defaultValues);
  }, [form]);

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
