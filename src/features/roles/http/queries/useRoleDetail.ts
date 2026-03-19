import { api } from "@/services/api";
import type { RoleWithPermissions } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useRoleDetail = (id: number | null) => {
  const { data: role, isLoading } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await api.get<{ role: RoleWithPermissions }>(`/api/roles/${id!}`);
      return response.role;
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });

  return { role, isLoading };
};
