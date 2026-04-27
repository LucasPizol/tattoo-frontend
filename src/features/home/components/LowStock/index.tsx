import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { LowStockProduct } from "../../types";
import { MdOutlineInventory } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

type LowStockProps = {
  products: LowStockProduct[] | undefined;
  isLoading: boolean;
};

export const LowStock = ({ products, isLoading }: LowStockProps) => {
  return (
    <Card
      className={styles.cardRoot}
      contentClassName={styles.cardContent}
      title="Estoque — Itens com estoque baixo"
      icon={<MdOutlineInventory />}
      actions={
        <Link to="/estoque" className={styles.headerLink}>
          Ver estoque →
        </Link>
      }
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading size={24} />
        </div>
      ) : !products?.length ? (
        <p className={styles.empty}>Nenhum produto com estoque baixo.</p>
      ) : (
        <div className={styles.list}>
          {products.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.productIcon}>
                <MdOutlineInventory size={16} />
              </div>
              <div className={styles.info}>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.sku}>SKU: {product.sku}</span>
              </div>
              <span className={styles.quantity}>
                {product.quantity} {product.quantity === 1 ? "unidade" : "unidades"}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
