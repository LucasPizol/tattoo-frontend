import { useModal } from "@/components/ui/Modal/useModal";
import {
    PaymentMethodSchema,
    type PaymentMethodForm,
} from "@/schemas/payment-method";
import type { PaymentMethod } from "../types";
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "../http/mutations/paymentMethodMutations";

export const usePaymentMethodForm = () => {
  const { mutateAsync: createPaymentMethod } = useCreatePaymentMethod();
  const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethod();
  const { mutateAsync: deletePaymentMethod } = useDeletePaymentMethod();

  const { open, close, isOpen, form, modalProps } = useModal<
    PaymentMethodForm,
    PaymentMethod | null
  >({
    initialValues: PaymentMethodSchema.defaultValues,
    schema: PaymentMethodSchema.schema,
    onSubmit: async (data, reference) => {
      const payload = {
        name: data.name,
        taxes: Number(data.taxes.replace(",", ".").replace("%", "")),
      };

      if (reference) {
        await updatePaymentMethod({ id: reference.id, payload });
      } else {
        await createPaymentMethod(payload);
      }
    },
  });

  const handleDestroyPaymentMethod = async (paymentMethod: PaymentMethod) => {
    await deletePaymentMethod(paymentMethod.id);
  };

  return {
    handleDestroyPaymentMethod,
    open,
    close,
    isOpen,
    form,
    modalProps,
  };
};
