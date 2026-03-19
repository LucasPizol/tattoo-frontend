import {
  MdArrowUpward,
  MdArrowDownward,
  MdAccountBalance,
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

  const balanceIsPositive = summary.balance.value >= 0;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} data-variant="negative">
            <MdArrowUpward size={20} />
          </span>
          <span className={styles.cardLabel}>Total a Pagar</span>
        </div>
        <span className={styles.cardValue} data-variant="negative">
          {summary.total_to_pay.formatted}
        </span>
        <span className={styles.cardDescription}>
          Comissões que usuários pagam
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon} data-variant="positive">
            <MdArrowDownward size={20} />
          </span>
          <span className={styles.cardLabel}>Total a Receber</span>
        </div>
        <span className={styles.cardValue} data-variant="positive">
          {summary.total_to_receive.formatted}
        </span>
        <span className={styles.cardDescription}>
          Comissões que a empresa paga
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span
            className={styles.cardIcon}
            data-variant={balanceIsPositive ? "positive" : "negative"}
          >
            <MdAccountBalance size={20} />
          </span>
          <span className={styles.cardLabel}>Saldo</span>
        </div>
        <span
          className={styles.cardValue}
          data-variant={balanceIsPositive ? "positive" : "negative"}
        >
          {summary.balance.formatted}
        </span>
        <span className={styles.cardDescription}>
          Diferença entre recebido e pago
        </span>
      </div>
    </div>
  );
};
