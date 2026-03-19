import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { ClientSellsResponse } from "@/services/requests/dashboard/types";
import { MdInventory } from "react-icons/md";
import styles from "./styles.module.scss";

interface ClientSalesCardProps {
  data?: ClientSellsResponse;
  isLoading: boolean;
}

export const ClientSalesCard = ({ data, isLoading }: ClientSalesCardProps) => {
  const clientSales = data?.clientSells
    ? Object.entries(data.clientSells).sort(([, a], [, b]) => b - a)
    : [];

  if (isLoading) {
    return (
      <Card
        title="Clientes com maior faturamento"
        icon={<MdInventory />}
        className={styles.card}
      >
        <div className={styles.loading}>
          <Loading size={48} />
        </div>
      </Card>
    );
  }

  if (!clientSales.length) {
    return (
      <Card
        title="Clientes com maior faturamento"
        icon={<MdInventory />}
        className={styles.card}
      >
        <div className={styles.empty}>Nenhuma venda encontrada</div>
      </Card>
    );
  }

  return (
    <Card
      title="Clientes com maior faturamento"
      icon={<MdInventory />}
      className={styles.card}
    >
      <div className={styles.content}>
        {clientSales.map(([product, value], index) => (
          <div key={product} className={styles.productItem}>
            <div className={styles.rank}>#{index + 1}</div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{product}</div>
            </div>
            <div className={styles.badge}>
              {(value / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
