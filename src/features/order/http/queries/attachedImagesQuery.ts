import { OrderAttachedImagesRequests } from "@/services/requests/orders/attached-images";
import { useQuery } from "@tanstack/react-query";

export const useOrderAttachedImagesQuery = (id: number) =>
  useQuery({
    queryKey: ["order-attached-images", id],
    queryFn: () => OrderAttachedImagesRequests.index(id),
    staleTime: 1000 * 60 * 5,
  });
