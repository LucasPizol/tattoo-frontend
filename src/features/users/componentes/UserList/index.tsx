import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { useRoleList } from "@/features/roles/http/queries/useRoleList";
import { useUpdateUser } from "@/features/users/http/mutations/useUpdateUser";
import { useUserList } from "@/features/users/http/queries/useUserList";
import { UserContractModal } from "@/features/users/componentes/UserContractModal";
import type { User } from "@/services/requests/users/types";
import { useState } from "react";
import { MdEdit, MdArticle } from "react-icons/md";
import { z } from "zod";

const schema = z.object({
  commission_percentage: z.coerce.number().min(0).max(100),
  role_id: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

export const UserList = () => {
  const { users = [], isLoading } = useUserList();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { open, modalProps } = useModal<FormValues, User>({ schema, initialValues: { commission_percentage: 0, role_id: undefined } });
  const { roles = [], isLoading: rolesLoading } = useRoleList({ disabled: !modalProps.isOpen });

  const [contractModalContractId, setContractModalContractId] = useState<number | null>(null);

  const handleSubmit = async (data: FormValues, reference: User | null) => {
    if (!reference) return;
    await updateUser({
      id: reference.id,
      commission_percentage: data.commission_percentage,
      role_id: data.role_id ?? null,
    });
    modalProps.onClose();
  };

  const columns = [
    { key: "name", label: "Nome" },
    {
      key: "role",
      label: "Cargo",
      render: (row: User) => row.role?.name ?? "—",
    },
    {
      key: "commission_percentage",
      label: "Comissão (%)",
      render: (row: User) => `${row.commission_percentage}%`,
    },
    {
      key: "contract",
      label: "Contrato",
      render: (row: User) => {
        if (!row.contract) return <span style={{ color: "#9ca3af", fontSize: "0.8125rem" }}>—</span>;
        const isPending = row.contract.status === "pending";
        return (
          <Tag color={isPending ? "yellow" : "green"} size="small">
            {isPending ? "Pendente" : "Assinado"}
          </Tag>
        );
      },
    },
    {
      key: "actions",
      label: "Ações",
      align: "right" as const,
      width: "fit-content",
      render: (row: User) => (
        <div style={{ display: "flex", gap: 4 }}>
          {row.contract && (
            <IconButton
              title="Ver contrato"
              onClick={() => setContractModalContractId(row.contract!.id)}
            >
              <MdArticle size={18} />
            </IconButton>
          )}
          <IconButton
            title="Editar usuário"
            onClick={() =>
              open({ commission_percentage: Number(row.commission_percentage), role_id: row.role?.id ?? undefined }, row)
            }
          >
            <MdEdit size={18} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={users} loading={isLoading} />

      <Modal {...modalProps} title="Editar Usuário" onSubmit={handleSubmit}>
        <Select
          label="Cargo"
          field="role_id"
          options={roles.map((role) => ({ label: role.name, value: role.id }))}
          loading={rolesLoading}
        />
        <Input
          label="Comissão da empresa (%)"
          field="commission_percentage"
          type="number"
          placeholder="0"
        />
      </Modal>

      <UserContractModal
        contractId={contractModalContractId}
        isOpen={contractModalContractId !== null}
        onClose={() => setContractModalContractId(null)}
      />
    </>
  );
};
