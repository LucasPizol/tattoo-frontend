import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import type { MercadoPagoTerminal } from "../../types/mercado-pago";

export const useMercadoPagoTerminalList = () =>
  useQuery({
    queryKey: ["mercado-pago-terminals"],
    queryFn: () => api.get<{ terminals: MercadoPagoTerminal[] }>("/api/mercado_pago/terminals"),
  });
