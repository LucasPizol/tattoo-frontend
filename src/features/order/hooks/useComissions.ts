import { useModal } from "@/components/ui/Modal/useModal";
import type { ComissionForm } from "@/schemas/comission";
import { ComissionSchema } from "@/schemas/comission";
import type { Comission } from "@/services/requests/orders/comissions/types";
import { masks } from "@/utils/masks";
import { useParams } from "react-router-dom";
import {
  useCreateComission,
  useUpdateComission,
  useDeleteComission,
} from "../http/mutations/comissionMutations";

export const useComissions = () => {
  const { id: orderId } = useParams();
  const createComission = useCreateComission(Number(orderId));
  const updateComission = useUpdateComission(Number(orderId));
  const deleteComission = useDeleteComission(Number(orderId));

  const { modalProps, open, close } = useModal<ComissionForm, Comission>({
    onSubmit: async (data, reference) => {
      const value = data.value
        ? masks.unformatCurrency(data.value) / 100
        : undefined;

      if (reference) {
        await updateComission.mutateAsync({
          name: data.name,
          percentage: data.value ? undefined : data.percentage,
          value: value,
          comissionId: reference.id,
        });
      } else {
        await createComission.mutateAsync({
          name: data.name,
          percentage: data.value ? undefined : data.percentage,
          value: value,
        });
      }
    },
    initialValues: ComissionSchema.defaultValues,
    schema: ComissionSchema.schema,
  });

  return {
    modalProps,
    open,
    close,
    handleDeleteComission: deleteComission,
  };
};
