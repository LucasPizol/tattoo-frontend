import { ConfirmModal } from "@/components/ConfirmModal";
import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Column } from "@/components/ui/Column";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Table } from "@/components/ui/Table";
import { Tag, type TagColor } from "@/components/ui/Tag";
import { OrderStatus, type Order } from "@/services/requests/orders/types";
import {
  MdAdd,
  MdArrowBack,
  MdDelete,
  MdSearch,
  MdShoppingBag,
} from "react-icons/md";
import {
  useCreateOrder,
  useDeleteOrder,
} from "../order/http/mutations/orderMutations";
import { useNavigate } from "react-router-dom";
import { useOrderList } from "./hooks/useOrderList";
import styles from "./styles.module.scss";
import { DateRangePicker } from "@/components/ui/DateRangePicker";

const statusLabel = {
  [OrderStatus.PAID]: "Pago",
  [OrderStatus.PENDING]: "Pendente",
  [OrderStatus.CANCELLED]: "Cancelado",
  [OrderStatus.REOPENED]: "Reaberto",
  [OrderStatus.WAITING_FOR_PAYMENT]: "Aguardando pagamento",
  [OrderStatus.PROCESSING]: "Em processamento",
  [OrderStatus.FAILED]: "Falha",
  [OrderStatus.REFUNDED]: "Reembolsado",
};

const statusColor = {
  [OrderStatus.PAID]: "green",
  [OrderStatus.PENDING]: "blue",
  [OrderStatus.CANCELLED]: "red",
  [OrderStatus.REOPENED]: "blue",
  [OrderStatus.WAITING_FOR_PAYMENT]: "yellow",
  [OrderStatus.PROCESSING]: "blue",
  [OrderStatus.FAILED]: "red",
  [OrderStatus.REFUNDED]: "green",
};

export const OrdersList = () => {
  const navigate = useNavigate();
  const {
    orders,
    pagination,
    form,
    onFinishFilters,
    isLoading: isLoadingOrders,
    filters,
  } = useOrderList();

  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const onCreateOrder = async () => {
    await createOrder();
  };

  const onDestroyOrder = async (order: Order) => {
    await deleteOrder(order.id);
  };

  const columns = [
    {
      key: "ID",
      label: "ID",
      render: (order: Order) => <span>{order.id}</span>,
      width: "40px",
    },
    {
      key: "client",
      label: "Cliente",
      minWidth: "200px",
      render: (order: Order) => (
        <span>{order.client?.name ?? "Não informado"}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Método de Pagamento",
      render: (order: Order) => (
        <span>
          {order.paymentMethods && order.paymentMethods.length > 0
            ? order.paymentMethods
            : "Não informado"}
        </span>
      ),
    },
    {
      key: "productValue",
      label: "Valor do pedido",
      render: (order: Order) => <span>{order.totalValue.formatted}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (order: Order) => (
        <Tag color={statusColor[order.status as OrderStatus] as TagColor}>
          {statusLabel[order.status]}
        </Tag>
      ),
    },
    {
      key: "createdAt",
      label: "Criado em",
      render: (order: Order) => (
        <span>
          {new Date(order.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: " ",
      width: "auto",
      padding: "0px",
      align: "center" as const,
      render: (order: Order) => {
        const isPaid = order.status === OrderStatus.PAID;

        if (isPaid) return null;

        return (
          <div className={styles.actions}>
            <ConfirmModal
              onSave={async () => {
                await onDestroyOrder(order);
              }}
              title="Excluir Pedido"
              trigger={
                <IconButton>
                  <MdDelete
                    size={24}
                    className={styles.actionButton}
                    color={isPaid ? "gray" : "red"}
                  />
                </IconButton>
              }
            >
              <p>Tem certeza que deseja excluir este pedido?</p>
            </ConfirmModal>
          </div>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Pedidos"
      subtitle="Gerencie seus pedidos e mantenha as informações atualizadas"
      actions={
        <div className={styles.actions}>
          <Button prefixIcon={<MdAdd />} onClick={onCreateOrder}>
            Novo Pedido
          </Button>
          {filters.client_id_eq && (
            <Button
              prefixIcon={<MdArrowBack />}
              onClick={() => {
                navigate(-1);
              }}
              danger
            >
              Voltar
            </Button>
          )}
        </div>
      }
    >
      {!isLoadingOrders && orders?.length === 0 && (
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
          <MdShoppingBag size={40} style={{ color: "var(--amber)" }} />
          <p
            style={{
              fontSize: "var(--font-size-body2)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Nenhum pedido ainda.
          </p>
          <Button prefixIcon={<MdAdd />} onClick={onCreateOrder}>
            Criar primeiro pedido
          </Button>
        </div>
      )}
      <FiltersCard
        onFinishFilters={onFinishFilters}
        form={form}
        popupContent={
          <MultiSelect
            label="Status"
            field="status_in"
            options={Object.values(OrderStatus).map((status) => ({
              label: statusLabel[status],
              value: status,
            }))}
          />
        }
      >
        <Column flex="1">
          <div className={styles.filters}>
            <Column flex="1">
              <Input
                placeholder="Buscar por cliente, email ou telefone..."
                label="Buscar por cliente"
                field="search"
                prefixIcon={<MdSearch />}
                className={styles.searchInput}
                onDebounceChange={async (value) => {
                  await onFinishFilters({
                    ...filters,
                    search: value,
                    status_in:
                      filters.status_in?.map((status) => ({
                        label: statusLabel[status],
                        value: status,
                      })) ?? [],
                  });
                }}
              />
            </Column>
            <Column flex="1">
              <DateRangePicker
                label="Data de pagamento"
                placeholder="Selecione a data de pagamento"
                onChange={(range) => {
                  onFinishFilters({
                    search:
                      filters.client_name_or_client_email_or_client_phone_or_client_cpf_cont,
                    status_in:
                      filters.status_in?.map((status) => ({
                        label: statusLabel[status],
                        value: status,
                      })) ?? [],
                    created_at_gteq: range.startDate
                      ? range.startDate.toISOString()
                      : undefined,
                    created_at_lteq: range.endDate
                      ? range.endDate.toISOString()
                      : undefined,
                    client_id_eq: filters.client_id_eq,
                  });
                }}
              />
            </Column>
          </div>
        </Column>
      </FiltersCard>
      <Table
        columns={columns}
        data={orders || []}
        loading={isLoadingOrders}
        onRowClick={(order) => {
          navigate(`/pedidos/${order.id}`);
        }}
        pagination={pagination}
      />
    </PageWrapper>
  );
};
