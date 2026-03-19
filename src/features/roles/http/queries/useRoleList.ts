import { api } from "@/services/api";
import type { Role } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useRoleList = ({
  disabled = false,
}: { disabled?: boolean } = {}) => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await api.get<{ roles: Role[] }>("/api/roles");
      return response.roles;
    },
    enabled: !disabled,
    staleTime: 5 * 60 * 1000,
  });

  return { roles, isLoading };
};
