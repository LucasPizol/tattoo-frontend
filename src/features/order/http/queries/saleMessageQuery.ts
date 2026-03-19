import { SaleMessageRequests } from "@/services/requests/sale-message";
import { useQuery } from "@tanstack/react-query";

export const useSaleMessageListQuery = (orderId: number) =>
  useQuery({
    queryKey: ["sale-message", orderId],
    queryFn: () => SaleMessageRequests.index(orderId),
  });
