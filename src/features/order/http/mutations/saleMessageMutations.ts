import { SaleMessageRequests } from "@/services/requests/sale-message";
import type { SaleMessage, SaleMessageCreatePayload } from "@/services/requests/sale-message/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useAddSaleMessage = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaleMessageCreatePayload) =>
      SaleMessageRequests.create(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["sale-message", orderId], (oldData: any) => {
        return {
          saleMessages: [...oldData.saleMessages, data.saleMessage],
        };
      });
      toast.success("Mensagem agendada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao agendar mensagem");
    },
  });
};

export const useDeleteSaleMessage = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleMessageId: number) =>
      SaleMessageRequests.delete(saleMessageId, orderId),
    onSuccess: (_, saleMessageId) => {
      queryClient.setQueryData(["sale-message", orderId], (oldData: any) => {
        return {
          saleMessages: oldData.saleMessages.filter(
            (saleMessage: SaleMessage) => saleMessage.id !== saleMessageId
          ),
        };
      });
      toast.success("Mensagem removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover mensagem");
    },
  });
};
