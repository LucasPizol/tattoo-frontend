import { useQueryPagination } from "@/hooks/useQueryPagination";
import {
  OrdersFiltersSchema,
  type OrdersFilters,
} from "@/schemas/orders/filters";
import { OrderRequests } from "@/services/requests/orders";
import type {
  OrderFilters,
  OrderStatus,
  OrderWithProduct,
} from "@/services/requests/orders/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const useOrderList = () => {
  const [searchParams] = useSearchParams();

  const form = useForm<OrdersFilters>({
    resolver: zodResolver(OrdersFiltersSchema.schema),
    defaultValues: OrdersFiltersSchema.defaultValues,
  });

  const { data, isLoading, refetch, onChangeFilters, filters, pagination } =
    useQueryPagination<OrderWithProduct, OrderFilters>({
      queryKey: ["orders"],
      queryFn: (pagination) => OrderRequests.index(pagination),
      initialFilters: {
        client_id_eq: searchParams.get("client_id_eq")
          ? Number(searchParams.get("client_id_eq"))
          : undefined,
        paid_at_gteq: searchParams.get("paid_at_gteq") ?? undefined,
      },
    });

  const onFinishFilters = (filters: OrdersFilters) => {
    onChangeFilters({
      ...filters,
      client_name_or_client_email_or_client_phone_or_client_cpf_cont:
        filters.search ?? undefined,
      paid_at_gteq: filters.paid_at_gteq ?? undefined,
      paid_at_lteq: filters.paid_at_lteq ?? undefined,
      status_in:
        filters.status_in?.map((status) => status.value as OrderStatus) ??
        undefined,
    });
  };

  return {
    orders: data,
    isLoading,
    pagination,
    refetch,
    onFinishFilters,
    isFiltered: form.formState.isDirty,
    form,
    filters,
  };
};
