import { OrderFormSchema, type OrderFormData } from "@/schemas/order";
import { OrderPaymentMethodsService } from "@/services/requests/order-payment-methods";
import { OrderRequests } from "@/services/requests/orders";
import { UserComissionsRequests } from "@/services/requests/orders/user-comissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

type UseOrderFormProps = {
  orderId: number;
  onSuccess?: () => void;
};

type UseOrderFormReturn = {
  form: UseFormReturn<OrderFormData>;
  updateClient: (clientId: number | null) => Promise<void>;
  addPaymentMethod: (paymentMethodId: number, value: number) => Promise<void>;
  updateOrderPaymentMethod: (
    orderPaymentMethodId: number,
    value: number,
  ) => Promise<void>;
  removeOrderPaymentMethod: (orderPaymentMethodId: number) => Promise<void>;
  updatePayments: (
    payments: Array<{
      userId: number;
      valueExpected: number;
      valueReceived: number;
      paymentMethodId: number | null;
    }>,
  ) => Promise<void>;
  isDirty: boolean;
};

export const useOrderForm = ({
  orderId,
  onSuccess,
}: UseOrderFormProps): UseOrderFormReturn => {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderFormSchema.schema),
    defaultValues: OrderFormSchema.defaultValues,
  });

  const updateClient = useCallback(
    async (clientId: number | null) => {
      await OrderRequests.update(orderId, {
        client_id: clientId,
      });
      form.setValue("clientId", clientId);
      onSuccess?.();
    },
    [orderId, form, onSuccess],
  );

  const addPaymentMethod = useCallback(
    async (paymentMethodId: number, value: number) => {
      await OrderPaymentMethodsService.create(orderId, {
        payment_method_id: paymentMethodId,
        value,
      });
      onSuccess?.();
    },
    [orderId, onSuccess],
  );

  const updateOrderPaymentMethod = useCallback(
    async (orderPaymentMethodId: number, value: number) => {
      await OrderPaymentMethodsService.update(orderId, orderPaymentMethodId, {
        value,
      });
      onSuccess?.();
    },
    [orderId, onSuccess],
  );

  const removeOrderPaymentMethod = useCallback(
    async (orderPaymentMethodId: number) => {
      await OrderPaymentMethodsService.delete(orderId, orderPaymentMethodId);
      onSuccess?.();
    },
    [orderId, onSuccess],
  );

  const updatePayments = useCallback(
    async (
      payments: Array<{
        userId: number;
        valueExpected: number;
        valueReceived: number;
        paymentMethodId: number | null;
      }>,
    ) => {
      await UserComissionsRequests.upsert(
        payments.map((payment) => ({
          user_id: payment.userId,
          order_id: orderId,
          comission_value: payment.valueExpected / 100,
          received_value: payment.valueReceived / 100,
          payment_method_id: payment.paymentMethodId,
        })),
      );

      onSuccess?.();
    },
    [orderId, onSuccess],
  );

  return {
    form,
    updateClient,
    addPaymentMethod,
    updateOrderPaymentMethod,
    removeOrderPaymentMethod,
    updatePayments,
    isDirty: form.formState.isDirty,
  };
};
