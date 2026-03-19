import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { useCreateRole } from "../../http/mutations/useCreateRole";
import { useUpdateRole } from "../../http/mutations/useUpdateRole";
import type { Role } from "@/services/requests/roles/types";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1, "Nome é obrigatório") });
type FormValues = z.infer<typeof schema>;

export const useRoleFormModal = () => {
  return useModal<FormValues, Role>({
    schema,
    initialValues: { name: "" },
  });
};

type RoleFormModalProps = {
  modalProps: ReturnType<typeof useRoleFormModal>["modalProps"];
  onSuccess?: () => void;
};

export const RoleFormModal = ({ modalProps, onSuccess }: RoleFormModalProps) => {
  const roleId = modalProps.currentReference?.id ?? 0;
  const { createRole } = useCreateRole();
  const { updateRole } = useUpdateRole(roleId);

  const handleSubmit = async (data: FormValues, reference: Role | null) => {
    if (reference) {
      await updateRole(data);
    } else {
      await createRole(data);
    }
    onSuccess?.();
    modalProps.onClose();
  };

  return (
    <Modal
      {...modalProps}
      title={modalProps.currentReference ? "Editar cargo" : "Novo cargo"}
      onSubmit={handleSubmit}
    >
      <Input label="Nome do cargo" field="name" placeholder="Ex: Atendente" />
    </Modal>
  );
};
