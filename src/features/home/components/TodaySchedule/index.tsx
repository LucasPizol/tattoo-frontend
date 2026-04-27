import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { ScheduleItem } from "../../types";
import { MdCalendarToday } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

type TodayScheduleProps = {
  items: ScheduleItem[] | undefined;
  isLoading: boolean;
};

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  completed: { label: "Confirmado", className: styles.confirmed },
  pending: { label: "A confirmar", className: styles.pending },
  canceled: { label: "Cancelado", className: styles.canceled },
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

export const TodaySchedule = ({ items, isLoading }: TodayScheduleProps) => {
  return (
    <Card
      className={styles.cardRoot}
      contentClassName={styles.cardContent}
      title="Agenda de hoje"
      icon={<MdCalendarToday />}
      actions={
        <Link to="/agenda" className={styles.headerLink}>
          Ver agenda completa →
        </Link>
      }
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading size={24} />
        </div>
      ) : !items?.length ? (
        <p className={styles.empty}>Nenhum agendamento para hoje.</p>
      ) : (
        <div className={styles.list}>
          {items.map((item) => {
            const statusInfo = STATUS_MAP[item.status] ?? STATUS_MAP.pending;
            return (
              <div key={item.id} className={styles.row}>
                <span className={styles.time}>{formatTime(item.startAt)}</span>
                <div className={styles.info}>
                  <span className={styles.clientName}>{item.clientName || "—"}</span>
                  <span className={styles.description}>{item.title}</span>
                </div>
                <span className={styles.artist}>{item.artistName || "—"}</span>
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
