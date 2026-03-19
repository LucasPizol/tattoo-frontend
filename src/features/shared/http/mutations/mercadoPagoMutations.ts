import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useRequestTerminalOrder = () =>
  useMutation({
    mutationFn: ({ terminalId, orderId }: { terminalId: string; orderId: number }) =>
      api.post<void>(`/api/mercado_pago/terminals`, {
        terminal_id: terminalId,
        order_id: Number(orderId),
      }),
    onSuccess: () => {
      toast.success("Pedido enviado para o terminal com sucesso");
    },
    onError: () => {
      toast.error("Erro ao enviar pedido para o terminal");
    },
  });
