import type { OrderShowResponse } from "@/services/requests/orders/types";
import styles from "../styles.module.scss";

type ConfirmOrderContentProps = {
  order: OrderShowResponse["order"];
};

export const ConfirmOrderContent = ({ order }: ConfirmOrderContentProps) => {
  return (
    <div className={styles.confirmContent}>
      <p>Tem certeza que deseja criar este pedido?</p>
      <div className={styles.confirmSummary}>
        <div className={styles.confirmRow}>
          <span>Cliente:</span>
          <strong>{order?.client?.name}</strong>
        </div>
        {order?.orderPaymentMethods?.map((opm) => (
          <div key={opm.id} className={styles.confirmRow}>
            <span>{opm.paymentMethodName}:</span>
            <strong>{opm.value.formatted}</strong>
          </div>
        ))}
        <div className={styles.confirmRow}>
          <span>Total:</span>
          <strong>{order?.totalValue.formatted}</strong>
        </div>
      </div>
    </div>
  );
};
