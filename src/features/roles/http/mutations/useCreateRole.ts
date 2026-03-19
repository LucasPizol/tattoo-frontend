import { api } from "@/services/api";
import type { RoleCreatePayload, RoleWithPermissions } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: RoleCreatePayload) => {
      const response = await api.post<{ role: RoleWithPermissions }>("/api/roles", { role: payload });
      return response.role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Cargo criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar cargo");
    },
  });

  return { createRole: mutateAsync, isLoading: isPending };
};
