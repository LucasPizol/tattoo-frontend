import { ConfirmModal } from "@/components/ConfirmModal";
import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import {
  StockMovementMovementType,
  type StockMovement,
} from "@/features/stock/types";
import { MdDelete, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { useStockMovement } from "./hooks/useStockMovement";
import styles from "./styles.module.scss";

const movementTypeLabel = {
  [StockMovementMovementType.IN]: "Entrada",
  [StockMovementMovementType.OUT]: "Saída",
};

export const StockMovements = () => {
  const {
    stockMovements,
    pagination,
    isLoading,
    form,
    onFinishFilters,
    handleDestroyStockMovement,
  } = useStockMovement();

  const columns = [
    {
      key: "product",
      label: "Produto",
      maxWidth: "250px",
      render: (stockMovement: StockMovement) => (
        <span>{stockMovement.product.name}</span>
      ),
    },
    {
      key: "movementType",
      label: "Tipo de Movimentação",
      render: (stockMovement: StockMovement) => (
        <Tag
          color={
            stockMovement.movementType === StockMovementMovementType.IN
              ? "green"
              : "red"
          }
        >
          {movementTypeLabel[stockMovement.movementType]}
        </Tag>
      ),
    },
    {
      key: "quantity",
      label: "Quantidade",
      render: (stockMovement: StockMovement) => (
        <span>{stockMovement.quantity}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Data de Cadastro",
      render: (stockMovement: StockMovement) =>
        new Date(stockMovement.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "order",
      label: "Pedido",
      render: (stockMovement: StockMovement) => {
        const order = stockMovement.order;

        if (!order) return <span>N/D</span>;

        return <Link to={`/pedidos/${order.id}`}># {order.id}</Link>;
      },
    },
    {
      key: "actions",
      label: " ",
      maxWidth: "75px",
      align: "center" as const,
      render: (stockMovement: StockMovement) => (
        <div className={styles.actions}>
          <ConfirmModal
            onSave={async () => {
              await handleDestroyStockMovement(stockMovement);
            }}
            title="Excluir Movimentação de Estoque"
            trigger={<MdDelete size={24} className={styles.actionButton} />}
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Movimentações de Estoque"
      subtitle="Gerencie suas movimentações de estoque"
    >
      <FiltersCard form={form} onFinishFilters={onFinishFilters}>
        <Input
          placeholder="Digite"
          label="Buscar movimentações de estoque..."
          prefixIcon={<MdSearch />}
          field="stock_product_name_cont"
          className={styles.searchInput}
          onDebounceChange={async (value) => {
            onFinishFilters({
              product_name_cont: value,
            });
          }}
        />
        <MultiSelect
          label="Tipo"
          placeholder="Selecione"
          options={Object.entries(movementTypeLabel).map(([key, value]) => ({
            label: value,
            value: key as StockMovementMovementType,
          }))}
          field="movement_type_in"
          onSelect={async (_option, selectedOptions) => {
            onFinishFilters({
              movement_type_in: selectedOptions.map((o) => ({
                label: o.label,
                value: o.value as StockMovementMovementType,
              })),
            });
          }}
          className={styles.searchInput}
        />
      </FiltersCard>
      <Table
        columns={columns}
        data={stockMovements || []}
        loading={isLoading}
        pagination={pagination}
      />
    </PageWrapper>
  );
};
