import { api } from "@/services/api";
import type { MercadoPagoTerminal } from "./types";

export const MercadoPagoTerminalsRequests = {
  get: () =>
    api.get<{ terminals: MercadoPagoTerminal[] }>(
      "/api/mercado_pago/terminals",
    ),
  requestOrder: (terminalId: string, orderId: number) =>
    api.post<void>(`/api/mercado_pago/terminals`, {
      terminal_id: terminalId,
      order_id: Number(orderId),
    }),
};
