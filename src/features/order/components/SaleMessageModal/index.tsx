import { ConfirmModal } from "@/components/ConfirmModal";
import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import type { SaleMessage } from "@/services/requests/sale-message/types";
import { masks } from "@/utils/masks";
import { useSaleMessage } from "../../hooks/useSaleMessage";

const thirdDays = new Date();
thirdDays.setDate(thirdDays.getDate() + 30);

export const SaleMessageModal = ({
  orderId,
  data,
}: {
  orderId: number;
  data: SaleMessage | undefined;
}) => {
  const { modalProps, open } = useModal({
    onSubmit: async (data) => {
      await handleSave(data.scheduledAt);
    },
    initialValues: {
      scheduledAt: masks.formatDate(thirdDays.toLocaleDateString("pt-BR")),
    },
  });

  const { handleAddSaleMessage, handleDeleteSaleMessage } =
    useSaleMessage(orderId);

  const handleDelete = async (saleMessageId: number) => {
    await handleDeleteSaleMessage.mutateAsync(saleMessageId);
  };

  const handleSave = async (scheduledAt: string) => {
    await handleAddSaleMessage.mutateAsync({
      scheduled_at: scheduledAt,
      order_id: orderId,
    });
  };

  if (data) {
    return (
      <ConfirmModal
        onSave={async () => {
          await handleDelete(data.id);
        }}
        title="Deseja realmente deletar o retorno?"
      >
        <span>{data.scheduledAt}</span>
      </ConfirmModal>
    );
  }

  return (
    <>
      <Button onClick={() => open()}>Adicionar Retorno</Button>
      <Modal {...modalProps} title="Retorno">
        <Input field="scheduledAt" label="Data" isDate type="text" />
      </Modal>
    </>
  );
};
