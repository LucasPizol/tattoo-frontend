import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useDeleteImage = () =>
  useMutation({
    mutationFn: (id: number) => api.delete(`/api/images/${id}`),
    onSuccess: () => {
      toast.success("Imagem excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir imagem");
    },
  });
