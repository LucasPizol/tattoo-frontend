import { OrderProductsService } from "@/services/requests/order-products";
import { OrderRequests } from "@/services/requests/orders";
import { UserComissionsRequests } from "@/services/requests/orders/user-comissions";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import type { Part } from "..";

export const useOrder = () => {
  const { id } = useParams();

  const {
    data,
    isLoading: isLoadingOrder,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderRequests.show(Number(id)),
  });

  const removeProduct = useCallback(async (orderProductId: number) => {
    await OrderProductsService.delete(orderProductId);

    refetch();
  }, []);

  const updateProductQuantity = useCallback(
    async (orderProductId: number, quantity: number) => {
      await OrderProductsService.update(orderProductId, {
        quantity,
        order_id: Number(id),
      });

      refetch();
    },
    [id]
  );

  const updateProductValue = useCallback(
    async (orderProductId: number, value: number) => {
      await OrderProductsService.update(orderProductId, {
        value,
      });

      refetch();
    },
    [data?.order.id]
  );

  const updateParts = useCallback(async (parts: Part[]) => {
    await UserComissionsRequests.upsert(
      parts.map((part) => ({
        user_id: Number(part.userId),
        order_id: Number(id),
        comission_value: part.valueExpected / 100,
        received_value: part.valueReceived / 100,
        payment_method_id: part.paymentMethodId ?? null,
      }))
    );

    refetch();
  }, []);

  return {
    removeProduct,
    updateProductQuantity,
    updateProductValue,
    isLoading: isLoadingOrder,
    order: data?.order,
    refetch,
    updateParts,
  };
};
