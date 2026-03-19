import { api } from "@/services/api";
import type { Category, CategoryFilters } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

type UseCategoryListProps = {
  disabled?: boolean;
};

export const useCategoryList = ({
  disabled = false,
}: UseCategoryListProps = {}) => {
  const [settedFilters, setSettedFilters] = useState<CategoryFilters>({});

  const form = useForm<CategoryFilters>({
    defaultValues: {
      name_cont: "",
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories", settedFilters],
    queryFn: () => api.get<{ materials: Category[] }>("/api/materials", { q: settedFilters }),
    enabled: !disabled,
    staleTime: 1000 * 60 * 10,
  });

  const onFinishFilters = (filters: CategoryFilters) => {
    setSettedFilters({
      ...settedFilters,
      name_cont: filters.name_cont ?? undefined,
    });
  };

  return {
    categories: data?.materials,
    isLoading,
    refetch,
    onFinishFilters,
    form,
  };
};
