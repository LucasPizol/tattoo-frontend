import { api } from "@/services/api";
import type { PaginationResponse } from "@/models/Pagination";
import type { ClientIndication } from "@/features/clients/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useClientIndications = () => {
  const { id: clientIdParam } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["clientIndications", clientIdParam],
    queryFn: () =>
      api.get<PaginationResponse<ClientIndication>>(
        `/api/clients/${Number(clientIdParam ?? 0)}/indications`,
        {
          page: 1,
          per_page: 10,
        }
      ),
  });

  return {
    indications: data?.data ?? [],
    isLoading,
    error,
  };
};
