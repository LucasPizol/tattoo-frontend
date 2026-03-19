import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useAdjustSellers = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => api.put<void>("/api/dashboard/sellers/adjust_sellers"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Vendedores ajustados com sucesso");
    },
    onError: () => {
      toast.error("Erro ao ajustar vendedores");
    },
  });

  return {
    adjustSellers: mutateAsync,
    isLoading: isPending,
    error,
  };
};
