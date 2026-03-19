import { api } from "@/services/api";
import type { RoleUpdatePayload, RoleWithPermissions } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useUpdateRole = (id: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: RoleUpdatePayload) => {
      const response = await api.put<{ role: RoleWithPermissions }>(`/api/roles/${id}`, { role: payload });
      return response.role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", id] });
      toast.success("Cargo atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar cargo");
    },
  });

  return { updateRole: mutateAsync, isLoading: isPending };
};
