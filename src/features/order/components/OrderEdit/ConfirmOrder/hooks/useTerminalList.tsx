import { MercadoPagoTerminalsRequests } from "@/services/requests/mercado-pago/terminals";
import { useQuery } from "@tanstack/react-query";

export const useTerminalList = () => {
  const { data: terminals } = useQuery({
    queryKey: ["mercado-pago-terminals"],
    queryFn: MercadoPagoTerminalsRequests.get,
  });

  return { terminals: terminals?.terminals ?? [] };
};
