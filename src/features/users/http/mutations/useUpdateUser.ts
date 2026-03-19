import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; commission_percentage: number; role_id: number | null }) =>
      api.put(`/api/users/${data.id}`, { user: { commission_percentage: data.commission_percentage, role_id: data.role_id } }),
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });
};
