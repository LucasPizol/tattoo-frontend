import { api } from "@/services/api";
import type { ContractDetail } from "@/features/contract/types";
import { useQuery } from "@tanstack/react-query";

export const useContractDetail = (id: number | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ["contract", id],
    queryFn: async () => {
      const response = await api.get<{ contract: ContractDetail }>(`/api/contracts/${id!}`);
      return response.contract;
    },
    enabled: id !== null,
    staleTime: 1000 * 60 * 5,
  });

  return { contract: data ?? null, isLoading };
};
