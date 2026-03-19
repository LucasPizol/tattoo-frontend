import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { Table } from "@/components/ui/Table";
import type { Column } from "@/components/ui/Table";
import { PageWrapper } from "@/components/PageWrapper";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { MdAdd, MdEdit, MdDelete, MdAdminPanelSettings } from "react-icons/md";
import { useRoleList } from "./http/queries/useRoleList";
import { useRoleDetail } from "./http/queries/useRoleDetail";
import { useDeleteRole } from "./http/mutations/useDeleteRole";
import { RolePermissionsEditor } from "./components/RolePermissionsEditor";
import { RoleFormModal, useRoleFormModal } from "./components/RoleFormModal";
import type { Role } from "./types";

export const RolesPage = () => {
  const { roles = [], isLoading } = useRoleList();
  const { deleteRole } = useDeleteRole();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const { role: selectedRole } = useRoleDetail(selectedRoleId);
  const formModal = useRoleFormModal();

  const columns: Column<Role>[] = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "actions",
      label: "Ações",
      width: "fit-content",
      align: "right",
      render: (row) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <IconButton
            title="Gerenciar permissões"
            onClick={() => setSelectedRoleId(selectedRoleId === row.id ? null : row.id)}
          >
            <MdAdminPanelSettings size={18} />
          </IconButton>
          <IconButton
            title="Editar cargo"
            onClick={() => formModal.open({ name: row.name }, row)}
          >
            <MdEdit size={18} />
          </IconButton>
          <ConfirmModal
            title="Excluir cargo"
            onSave={() => deleteRole(row.id)}
            danger
            trigger={
              <IconButton title="Excluir">
                <MdDelete size={18} />
              </IconButton>
            }
          >
            <p>Tem certeza que deseja excluir o cargo <strong>{row.name}</strong>?</p>
          </ConfirmModal>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Permissões"
      subtitle="Gerencie cargos e permissões"
      actions={
        <Button prefixIcon={<MdAdd />} onClick={() => formModal.open()}>
          Novo Cargo
        </Button>
      }
    >
      <Card title="Cargos">
        <Table columns={columns} data={roles} loading={isLoading} />
      </Card>

      {selectedRole && (
        <Card title={`Permissões: ${selectedRole.name}`}>
          <RolePermissionsEditor
            roleId={selectedRole.id}
            currentPermissions={selectedRole.permissions}
          />
        </Card>
      )}

      <RoleFormModal modalProps={formModal.modalProps} />
    </PageWrapper>
  );
};
