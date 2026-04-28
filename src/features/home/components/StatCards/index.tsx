import type { HomeStats } from "../../types";
import {
  MdArrowForward,
  MdCalendarToday,
  MdPeople,
  MdAttachMoney,
  MdDescription,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import styles from "./styles.module.scss";

type StatCardsProps = {
  stats: HomeStats | undefined;
  isLoading: boolean;
};

const cards = [
  {
    key: "todayAppointments",
    label: "Agendamentos hoje",
    icon: <MdCalendarToday size={20} />,
    link: { to: "/agenda", label: "Ver agenda" },
    getValue: (s: HomeStats) => s.todayAppointments.toString(),
  },
  {
    key: "activeClients",
    label: "Clientes ativos",
    icon: <MdPeople size={20} />,
    link: { to: "/clientes", label: "Ver clientes" },
    getValue: (s: HomeStats) => s.activeClients.toString(),
  },
  {
    key: "monthlyRevenue",
    label: "Faturamento (mês)",
    icon: <MdAttachMoney size={20} />,
    link: { to: "/relatorios", label: "Ver financeiro" },
    getValue: (s: HomeStats) => s.monthlyRevenue.formatted,
  },
  {
    key: "pendingOrders",
    label: "Orçamentos pendentes",
    icon: <MdDescription size={20} />,
    link: { to: "/vendas/usuarios", label: "Ver orçamentos" },
    getValue: (s: HomeStats) => s.pendingOrders.toString(),
  },
] as const;

export const StatCards = ({ stats, isLoading }: StatCardsProps) => {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <Link key={card.key} to={card.link.to} className={styles.card}>
          <div className={styles.iconWrapper}>{card.icon}</div>
          <span className={styles.label}>{card.label}</span>
          <span className={styles.value}>
            {isLoading ? <Loading size={20} /> : stats ? card.getValue(stats) : "—"}
          </span>
          <span className={styles.link}>
            {card.link.label}
            <span className={styles.arrow}>
              <MdArrowForward size={14} />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
