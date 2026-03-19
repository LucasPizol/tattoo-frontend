import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDestroyInstagramAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/instagram/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "instagram-accounts",
      });
      toast.success("Conta excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir conta");
    },
  });
};
