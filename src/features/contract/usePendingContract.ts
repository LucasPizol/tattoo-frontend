import { api } from "@/services/api";
import type { Contract } from "./types";
import { useSessionContext } from "@/context/useSession";
import { useQuery } from "@tanstack/react-query";

export const usePendingContract = () => {
  const { session } = useSessionContext();

  const hasPending = session.isAuthenticated && session.user.has_pending_contract;

  const { data: contract, isLoading } = useQuery({
    queryKey: ["contract-pending"],
    queryFn: async () => {
      const response = await api.get<{ contract: Contract | null }>("/api/contracts/pending");
      return response.contract;
    },
    enabled: hasPending,
  });

  return {
    contract: contract ?? null,
    isLoading,
    hasPending: hasPending && !!contract,
  };
};
