import { Table, type Column } from "@/components/ui/Table";
import type { Indication } from "@/services/requests/indications/types";
import { Link } from "react-router-dom";
import { useIndicationList } from "./http/queries/useIndicationList";

export const IndicationsContent = () => {
  const { indications, onSort } = useIndicationList();

  const columns: Column<Indication>[] = [
    {
      key: "name",
      label: "Nome",
      render: (indication: Indication) => (
        <Link to={`/clientes/${indication.id}/visualizar`}>
          {indication.name}
        </Link>
      ),
    },
    {
      key: "totalOrders",
      label: "Total de pedidos das indicações",
      onSort: (_key, order) => {
        onSort({ key: "total_orders", order });
      },
    },
    {
      key: "totalIndications",
      label: "Total de indicações",
      onSort: (_key, order) => {
        onSort({ key: "total_indications", order });
      },
    },
    {
      key: "totalIndicationsWhoBought",
      label: "Indicações que compraram",
      onSort: (_key, order) => {
        onSort({ key: "total_indications_who_bought", order });
      },
    },
    {
      key: "totalValue",
      label: "Valor Revertido",
      onSort: (_key, order) => {
        onSort({ key: "total_value", order });
      },
      render: (indication: Indication) => (
        <span>{indication.totalValue.formatted}</span>
      ),
    },
  ];

  return <Table columns={columns} data={indications} />;
};
