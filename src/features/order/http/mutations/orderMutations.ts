import { OrderRequests } from "@/services/requests/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => OrderRequests.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar pedido");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => OrderRequests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir pedido");
    },
  });
};
