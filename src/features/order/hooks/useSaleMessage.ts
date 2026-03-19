import { useSaleMessageListQuery } from "../http/queries/saleMessageQuery";
import { useAddSaleMessage, useDeleteSaleMessage } from "../http/mutations/saleMessageMutations";

export const useSaleMessage = (orderId: number) => {
  const { data, isLoading, error, refetch } = useSaleMessageListQuery(orderId);
  const handleAddSaleMessage = useAddSaleMessage(orderId);
  const handleDeleteSaleMessage = useDeleteSaleMessage(orderId);

  return {
    data,
    isLoading,
    error,
    refetch,
    handleAddSaleMessage,
    handleDeleteSaleMessage,
  };
};
