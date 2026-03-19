import { OrderRequests } from "@/services/requests/orders";
import { useQuery } from "@tanstack/react-query";

export const useOrderDetailQuery = (id: number) =>
  useQuery({
    queryKey: ["order", String(id)],
    queryFn: () => OrderRequests.show(id),
  });
