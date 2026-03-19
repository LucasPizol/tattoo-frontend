import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useDeleteAddress = () =>
  useMutation({
    mutationFn: (id: number) => api.delete(`/api/addresses/${id}`),
    onSuccess: () => {
      toast.success("Endereço excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir endereço");
    },
  });
