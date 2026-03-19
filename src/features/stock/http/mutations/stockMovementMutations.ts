import { api } from "@/services/api";
import type { StockMovementShowResponse } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

type CreateStockMovementPayload = {
  product_id: number;
  value: number;
  quantity: number;
  user_id?: number;
};

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStockMovementPayload) =>
      api.post<StockMovementShowResponse>("/api/stock_movements", {
        stock_movement: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products" || query.queryKey[0] === "stock_movements",
      });
      toast.success("Movimentação de estoque salva com sucesso");
    },
    onError: () => {
      toast.error("Erro ao salvar movimentação de estoque");
    },
  });
};

export const useDeleteStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/stock_movements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products" || query.queryKey[0] === "stock_movements",
      });
      toast.success("Movimentação de estoque excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir movimentação de estoque");
    },
  });
};
