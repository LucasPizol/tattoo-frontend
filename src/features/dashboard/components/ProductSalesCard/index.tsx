import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { ProductSellsResponse } from "@/services/requests/dashboard/types";
import { MdInventory } from "react-icons/md";
import styles from "./styles.module.scss";

interface ProductSalesCardProps {
  data?: ProductSellsResponse;
  isLoading: boolean;
}

export const ProductSalesCard = ({
  data,
  isLoading,
}: ProductSalesCardProps) => {
  const productSales = data?.productSells
    ? Object.entries(data.productSells).sort(([, a], [, b]) => b - a)
    : [];

  if (isLoading) {
    return (
      <Card
        title="Produtos Mais Vendidos"
        icon={<MdInventory />}
        className={styles.card}
      >
        <div className={styles.loading}>
          <Loading size={48} />
        </div>
      </Card>
    );
  }

  if (!productSales.length) {
    return (
      <Card
        title="Produtos Mais Vendidos"
        icon={<MdInventory />}
        className={styles.card}
      >
        <div className={styles.empty}>Nenhuma venda encontrada</div>
      </Card>
    );
  }

  return (
    <Card
      title="Produtos Mais Vendidos"
      icon={<MdInventory />}
      className={styles.card}
    >
      <div className={styles.content}>
        {productSales.map(([product, quantity], index) => (
          <div key={product} className={styles.productItem}>
            <div className={styles.rank}>#{index + 1}</div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{product}</div>
              <div className={styles.quantity}>
                {quantity} {quantity === 1 ? "venda" : "vendas"}
              </div>
            </div>
            <div className={styles.badge}>{quantity}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
