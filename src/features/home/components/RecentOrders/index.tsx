import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { RecentOrder } from "../../types";
import { MdArrowForward, MdDescription, MdReceiptLong } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

type RecentOrdersProps = {
  orders: RecentOrder[] | undefined;
  isLoading: boolean;
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: styles.pending },
  paid: { label: "Aprovado", className: styles.approved },
  canceled: { label: "Cancelado", className: styles.canceled },
  reopened: { label: "Reaberto", className: styles.pending },
  waiting_for_payment: { label: "Aguardando", className: styles.pending },
  processing: { label: "Processando", className: styles.pending },
};

export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
  return (
    <Card
      className={styles.cardRoot}
      contentClassName={styles.cardContent}
      title="Orçamentos recentes"
      icon={<MdDescription />}
      actions={
        <Link to="/vendas/usuarios" className={styles.headerLink}>
          Ver todos <span className={styles.arrow}><MdArrowForward size={14} /></span>
        </Link>
      }
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading size={24} />
        </div>
      ) : !orders?.length ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <MdReceiptLong size={20} />
          </span>
          Nenhum orçamento recente.
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
            return (
              <div key={order.id} className={styles.row}>
                <span className={styles.orderId}>#{order.id}</span>
                <div className={styles.info}>
                  <span className={styles.clientName}>{order.clientName || "—"}</span>
                </div>
                <span className={styles.value}>{order.totalValue.formatted}</span>
                <span className={`${styles.badge} ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
