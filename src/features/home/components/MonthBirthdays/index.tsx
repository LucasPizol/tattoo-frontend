import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { BirthdayClient } from "../../types";
import { MdArrowForward, MdCake } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

type MonthBirthdaysProps = {
  birthdays: BirthdayClient[] | undefined;
  isLoading: boolean;
};

const monthName = () =>
  new Date().toLocaleDateString("pt-BR", { month: "long" });

export const MonthBirthdays = ({ birthdays, isLoading }: MonthBirthdaysProps) => {
  return (
    <Card
      className={styles.cardRoot}
      contentClassName={styles.cardContent}
      title="Aniversariantes do mês"
      icon={<MdCake />}
      actions={
        <Link to="/clientes" className={styles.headerLink}>
          Ver todos <span className={styles.arrow}><MdArrowForward size={14} /></span>
        </Link>
      }
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading size={24} />
        </div>
      ) : !birthdays?.length ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <MdCake size={20} />
          </span>
          Nenhum aniversariante em {monthName()}.
        </div>
      ) : (
        <div className={styles.list}>
          {birthdays.map((client) => (
            <div key={client.id} className={styles.row}>
              <div className={styles.avatar}>
                <MdCake size={16} />
              </div>
              <span className={styles.name}>{client.name}</span>
              <span className={styles.date}>{client.birthDate}</span>
            </div>
          ))}

          <div className={styles.congratsCard}>
            <MdCake size={20} className={styles.congratsIcon} />
            <p className={styles.congratsText}>
              Parabéns para quem transforma arte em história!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
