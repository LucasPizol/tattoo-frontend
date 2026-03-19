import { useModal } from "@/components/ui/Modal/useModal";
import {
  StockMovementSchema,
  type StockMovementForm,
} from "@/schemas/stock-movement";
import type { ProductWithMaterial } from "@/features/products/types";
import { useCreateStockMovement } from "../http/mutations/stockMovementMutations";

export const useStockMovementForm = () => {
  const { mutateAsync: createStockMovement } = useCreateStockMovement();

  const handleSaveStockMovement = async (
    data: StockMovementForm,
    product: ProductWithMaterial,
  ) => {
    await createStockMovement({
      product_id: product.id,
      value: 0.01,
      quantity: data.quantity,
    });
  };

  const { open, close, modalProps, form } = useModal<
    StockMovementForm,
    ProductWithMaterial
  >({
    onSubmit: async (data, product) => {
      if (!product) return;
      await handleSaveStockMovement(data, product);
    },
    onOpen: (product) => {
      if (!product) return;
    },
    initialValues: StockMovementSchema.defaultValues,
    schema: StockMovementSchema.schema,
  });

  return {
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    modalProps,
    open,
    close,
    form,
  };
};
