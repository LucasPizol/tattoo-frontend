import { api } from "@/services/api";
import type { AvailablePermission } from "../../types";
import { useQuery } from "@tanstack/react-query";

export const useAvailablePermissions = () => {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ["available-permissions"],
    queryFn: async () => {
      const response = await api.get<{ permissions: AvailablePermission[] }>("/api/roles/available_permissions");
      return response.permissions;
    },
    staleTime: Infinity,
  });

  return { permissions, isLoading };
};
