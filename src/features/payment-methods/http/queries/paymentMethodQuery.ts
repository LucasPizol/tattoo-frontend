import { api } from "@/services/api";
import type { PaymentMethod, PaymentMethodFilters } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const usePaymentMethodListQuery = () => {
  const form = useForm<PaymentMethodFilters>({
    defaultValues: {
      name_cont: "",
    },
  });

  const [settedFilters, setSettedFilters] = useState<PaymentMethodFilters>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["payment-methods", settedFilters],
    queryFn: () => api.get<{ paymentMethods: PaymentMethod[] }>("/api/payment_methods", { q: settedFilters }),
    staleTime: 5 * 60 * 1000,
  });

  const onFinishFilters = (filters: PaymentMethodFilters) => {
    setSettedFilters({
      ...settedFilters,
      name_cont: filters.name_cont ?? undefined,
    });
  };

  return {
    paymentMethods: data?.paymentMethods,
    isLoading,
    refetch,
    form,
    onFinishFilters,
  };
};
