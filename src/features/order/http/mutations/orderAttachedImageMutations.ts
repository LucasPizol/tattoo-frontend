import { OrderAttachedImagesRequests } from "@/services/requests/orders/attached-images";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useAttachOrderImages = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: File[]) =>
      OrderAttachedImagesRequests.create(orderId, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-attached-images", orderId] });
      toast.success("Imagens anexadas com sucesso");
    },
    onError: () => {
      toast.error("Erro ao anexar imagens");
    },
  });
};

export const useRemoveOrderAttachedImage = (orderId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) =>
      OrderAttachedImagesRequests.delete(orderId, imageId),
    onSuccess: (_, imageId) => {
      queryClient.setQueryData(
        ["order-attached-images", orderId],
        (oldData: any) => {
          return {
            ...oldData,
            orderImages: oldData.orderImages.filter(
              (image: any) => image.id !== imageId
            ),
          };
        }
      );
      toast.success("Imagem removida com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover imagem");
    },
  });
};
