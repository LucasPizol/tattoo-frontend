import { PageWrapper } from "@/components/PageWrapper";
import { Tabs } from "@/components/ui/Tabs";
import { UserList } from "./componentes/UserList";
import { UserInviteList } from "./componentes/UserInviteList";
import { Button } from "@/components/ui/Button";
import { MdAdd } from "react-icons/md";
import { Modal } from "@/components/ui/Modal";
import { useInviteForm } from "./componentes/UserInviteList/hooks/useInviteForm";
import { Input } from "@/components/ui/Input";
import { masks } from "@/utils/masks";
import { Select } from "@/components/ui/Select";
import { useRoleList } from "../roles/http/queries/useRoleList";

export const UsersPage = () => {
  const { open, modalProps, onSubmit } = useInviteForm();
  const { roles = [], isLoading } = useRoleList({
    disabled: modalProps.isOpen,
  });

  return (
    <PageWrapper
      title="Usuários"
      subtitle="Gerencie seus usuários"
      actions={
        <Button prefixIcon={<MdAdd />} onClick={() => open()}>
          Novo Usuário
        </Button>
      }
    >
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
    </PageWrapper>
  );
};
