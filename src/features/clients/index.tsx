import { Action } from "@/components/Action";
import { ConfirmModal } from "@/components/ConfirmModal";
import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { useMobile } from "@/hooks/useMobile";
import type { Client } from "@/features/clients/types";
import { cn } from "@/utils/cn";
import { masks } from "@/utils/masks";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdPeople,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useClient } from "./hooks/useClient";
import styles from "./styles.module.scss";

export const Clients = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();

  const {
    clients,
    pagination,
    onDestroyClient,
    form,
    onFinishFilters,
    isLoading,
  } = useClient();

  const columns = [
    {
      key: "name",
      label: "Nome",
      minWidth: "200px",
    },
    {
      key: "cpf",
      label: "CPF",
      render: (client: Client) => (
        <span>{masks.formatCpf(client.cpf || "")}</span>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      render: (client: Client) => (
        <span>{masks.formatPhone(client.phone || "")}</span>
      ),
      minWidth: "120px",
    },
    {
      key: "birthDate",
      label: "Data de Nascimento",
      render: (client: Client & { age?: number }) => {
        return (
          <span>
            {client.birthDate && client.age
              ? `${client.birthDate} (${client.age} anos)`
              : "-"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: isMobile ? " " : "Ações",
      width: "auto",
      padding: "0px",
      render: (client: Client) => {
        return (
          <Action>
            <div className={styles.actions}>
              <IconButton
                title="Visualizar"
                onClick={() => {
                  navigate(`/clientes/${client.id}/visualizar`);
                }}
              >
                <MdVisibility
                  size={24}
                  className={cn(styles.actionButton, "view")}
                />
              </IconButton>
              <IconButton
                title="Editar"
                onClick={() => {
                  navigate(`/clientes/${client.id}/editar`);
                }}
              >
                <MdEdit size={24} className={cn(styles.actionButton, "edit")} />
              </IconButton>
              <ConfirmModal
                onSave={() => onDestroyClient(client)}
                title="Excluir Cliente"
                trigger={
                  <IconButton title="Excluir">
                    <MdDelete
                      size={24}
                      className={cn(styles.actionButton, "delete")}
                    />
                  </IconButton>
                }
              >
                <p>Tem certeza que deseja excluir o cliente {client.name}?</p>
              </ConfirmModal>
            </div>
          </Action>
        );
      },
      align: "center" as const,
    },
  ];

  return (
    <PageWrapper
      title="Clientes"
      subtitle="Gerencie seus clientes e mantenha as informações atualizadas"
      actions={
        <Button
          prefixIcon={<MdAdd />}
          onClick={() => navigate("/clientes/novo")}
        >
          Novo Cliente
        </Button>
      }
    >
      {!isLoading && clients?.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "48px 24px",
            textAlign: "center",
            borderRadius: "var(--border-radius)",
            background: "var(--parchment-raised)",
            border: "1px solid var(--border)",
          }}
        >
          <MdPeople size={40} style={{ color: "var(--amber)" }} />
          <p
            style={{
              fontSize: "var(--font-size-body2)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Nenhum cliente cadastrado ainda.
          </p>
          <Button
            prefixIcon={<MdAdd />}
            onClick={() => navigate("/clientes/novo")}
          >
            Adicionar primeiro cliente
          </Button>
        </div>
      )}
      <FiltersCard onFinishFilters={onFinishFilters} form={form}>
        <Input
          field="name_or_email_or_phone_cont"
          label="Buscar..."
          placeholder="Nome, cpf, telefone..."
          prefixIcon={<MdSearch />}
          className={styles.searchInput}
          mask={(value: string) =>
            isNaN(Number(value?.[0])) ? value : masks.formatCpf(value)
          }
          onDebounceChange={async (value) => {
            onFinishFilters({
              name_or_email_or_phone_cont: value,
            });
          }}
        />
        <Select
          field="birthday_month_eq"
          label="Aniversariantes"
          options={Array.from({ length: 12 }, (_, index) => {
            const month = new Date(0, index).toLocaleString("pt-BR", {
              month: "long",
            });

            const capitalizedMonth =
              month.charAt(0).toUpperCase() + month.slice(1);

            return {
              label: capitalizedMonth,
              value: String(index + 1),
            };
          })}
          onSelect={async ({ value }) => {
            onFinishFilters({
              birthday_month_eq: value,
            });
          }}
        />
      </FiltersCard>
      <Table
        columns={columns}
        data={clients || []}
        loading={isLoading}
        pagination={pagination}
      />
    </PageWrapper>
  );
};
