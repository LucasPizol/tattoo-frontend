import { Loading } from "@/components/ui/Loading";
import { Table } from "@/components/ui/Table";
import type { ClientIndication } from "@/features/clients/types";
import { Link } from "react-router-dom";
import { useClientIndications } from "../../hooks/useClientIndications";

export const Indications = ({
  setActiveTab,
}: {
  setActiveTab: (tab: number) => void;
}) => {
  const { indications, isLoading } = useClientIndications();

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (indication: ClientIndication) => (
        <Link
          to={`/clientes/${indication.id}/visualizar`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab(0);
          }}
        >
          {indication.name}
        </Link>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
    },
    {
      key: "totalOrders",
      label: "Total de pedidos",
      render: (indication: ClientIndication) => (
        <Link
          to={`/pedidos/usuarios?client_id_eq=${indication.id}&paid_at_gteq=${indication.indicatedAt}`}
        >
          {indication.totalOrders}
        </Link>
      ),
    },
    {
      key: "totalValue",
      label: "Total de valor",
      render: (indication: ClientIndication) => (
        <span>{indication.totalValue.formatted}</span>
      ),
    },
  ];

  if (isLoading) {
    return <Loading size={40} />;
  }

  return (
    <div>
      <Table columns={columns} data={indications} />
    </div>
  );
};
