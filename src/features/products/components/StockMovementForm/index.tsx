import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import type { ProductWithMaterial } from "@/features/products/types";
import type { StockMovementForm as StockMovementFormType } from "@/schemas/stock-movement";
import { Input } from "@/components/ui/Input";

export const StockMovementForm = (
  props: ModalPropsForm<StockMovementFormType, ProductWithMaterial>,
) => {
  return (
    <Modal {...props} title={"Adicionar Quantidade"}>
      <Input
        label="Quantidade"
        placeholder="Quantidade"
        autoFocus
        field="quantity"
        type="number"
      />
    </Modal>
  );
};
