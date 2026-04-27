import { PageWrapper } from "@/components/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Table } from "@/components/ui/Table";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useEntitlement } from "@/hooks/useEntitlement";
import { UserList } from "@/features/users/componentes/UserList";
import { UserInviteList } from "@/features/users/componentes/UserInviteList";
import { useInviteForm } from "@/features/users/componentes/UserInviteList/hooks/useInviteForm";
import { useRoleList } from "@/features/roles/http/queries/useRoleList";
import { useDeleteRole } from "@/features/roles/http/mutations/useDeleteRole";
import { useRoleDetail } from "@/features/roles/http/queries/useRoleDetail";
import { RolePermissionsEditor } from "@/features/roles/components/RolePermissionsEditor";
import { RoleFormModal, useRoleFormModal } from "@/features/roles/components/RoleFormModal";
import { masks } from "@/utils/masks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Role } from "@/features/roles/types";
import type { Column } from "@/components/ui/Table";
import {
  MdAdd,
  MdAdminPanelSettings,
  MdDelete,
  MdEdit,
  MdUpgrade,
} from "react-icons/md";

const UpgradeCta = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper title="Equipe" subtitle="Gerencie sua equipe">
      <Card title="Upgrade necessário">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <MdUpgrade size={48} style={{ color: "var(--amber)" }} />
          <h2
            style={{
              fontSize: "var(--font-size-h3)",
              fontWeight: "var(--font-weight-h3)" as React.CSSProperties["fontWeight"],
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Disponível no plano Studio
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-body2)",
              color: "var(--text-secondary)",
              maxWidth: 400,
              margin: 0,
            }}
          >
            Gerencie múltiplos artistas, defina cargos e permissões personalizadas
            com o plano Studio.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/configuracoes")}
            prefixIcon={<MdUpgrade />}
          >
            Fazer upgrade para Studio
          </Button>
        </div>
      </Card>
    </PageWrapper>
  );
};

const UsuariosTab = () => {
  const { open, modalProps, onSubmit } = useInviteForm();
  const { roles = [], isLoading } = useRoleList({
    disabled: modalProps.isOpen,
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button prefixIcon={<MdAdd />} onClick={() => open()}>
          Novo Usuário
        </Button>
      </div>
      <Tabs>
        <Tabs.Tab label="Usuários">
          <UserList />
        </Tabs.Tab>
        <Tabs.Tab label="Convites">
          <UserInviteList />
        </Tabs.Tab>
      </Tabs>
      <Modal {...modalProps} title="Novo Usuário" onSubmit={onSubmit}>
        <Input
          mask={masks.formatPhone}
          label="Telefone"
          field="phone"
          placeholder="Digite o telefone do usuário"
        />
        <Select
          label="Cargo"
          field="role"
          options={roles.map((role) => ({
            label: role.name,
            value: role.id,
          }))}
          loading={isLoading}
        />
        <Input
          label="Comissão da empresa (%)"
          field="commission_percentage"
          type="number"
          placeholder="0"
        />
      </Modal>
    </>
  );
};

const CargosTab = () => {
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
            <p>
              Tem certeza que deseja excluir o cargo{" "}
              <strong>{row.name}</strong>?
            </p>
          </ConfirmModal>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button prefixIcon={<MdAdd />} onClick={() => formModal.open()}>
          Novo Cargo
        </Button>
      </div>
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
    </>
  );
};

export const EquipePage = () => {
  const hasCommissions = useEntitlement("multi_artist_commissions");

  if (!hasCommissions) {
    return <UpgradeCta />;
  }

  return (
    <PageWrapper title="Equipe" subtitle="Gerencie usuários e cargos">
      <Tabs>
        <Tabs.Tab label="Usuários">
          <UsuariosTab />
        </Tabs.Tab>
        <Tabs.Tab label="Cargos">
          <CargosTab />
        </Tabs.Tab>
      </Tabs>
    </PageWrapper>
  );
};
