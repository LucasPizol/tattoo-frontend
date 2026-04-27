import {
  MdArrowUpward,
  MdArrowDownward,
  MdShoppingCart,
} from "react-icons/md";
import type { ComissionSummary as ComissionSummaryType } from "../../types";
import styles from "./styles.module.scss";

type ComissionSummaryProps = {
  summary?: ComissionSummaryType;
  loading?: boolean;
};

export const ComissionSummary = ({
  summary,
  loading,
}: ComissionSummaryProps) => {
  if (loading || !summary) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.cardSkeleton} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} data-variant="negative">
            <MdArrowUpward size={20} />
          </span>
          <span className={styles.cardLabel}>Comissões dos artistas</span>
        </div>
        <span className={styles.cardValue} data-variant="negative">
          {summary.total_artist_commissions.formatted}
        </span>
        <span className={styles.cardDescription}>
          Total repassado aos artistas no período
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} data-variant="positive">
            <MdArrowDownward size={20} />
          </span>
          <span className={styles.cardLabel}>Retenção do studio</span>
        </div>
        <span className={styles.cardValue} data-variant="positive">
          {summary.total_shop_commissions.formatted}
        </span>
        <span className={styles.cardDescription}>
          Parte retida pelo studio no período
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} data-variant="neutral">
            <MdShoppingCart size={20} />
          </span>
          <span className={styles.cardLabel}>Total dos pedidos</span>
        </div>
        <span className={styles.cardValue}>
          {summary.total_orders.formatted}
        </span>
        <span className={styles.cardDescription}>
          Valor bruto dos pedidos pagos no período
        </span>
      </div>
    </div>
  );
};
