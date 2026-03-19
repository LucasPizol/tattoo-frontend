import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useDestroyAttachedImage = () =>
  useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/attached_images/${id}`),
    onSuccess: () => {
      toast.success("Imagem removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover imagem");
    },
  });
