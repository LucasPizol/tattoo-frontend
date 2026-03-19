import { api } from "@/services/api";
import type { ClientShowResponse } from "@/features/clients/types";
import { useQuery } from "@tanstack/react-query";

export const useClientView = (clientId: number | null) => {
  const {
    data: client,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => api.get<ClientShowResponse>(`/api/clients/${clientId ?? 0}`),
    enabled: !!clientId,
  });

  return {
    client: client?.client,
    isLoading,
    error,
    refetch,
  };
};
