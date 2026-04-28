import { Button } from "@/components/ui/Button";
import { MdAdd, MdCalendarToday } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

export const EmptyHome = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.empty}>
      <div className={styles.iconRing}>
        <MdCalendarToday size={32} />
      </div>
      <h3 className={styles.title}>Tudo pronto para começar</h3>
      <p className={styles.copy}>
        Crie seu primeiro agendamento e a agenda começa a se preencher por aqui.
      </p>
      <div className={styles.action}>
        <Button prefixIcon={<MdAdd />} onClick={() => navigate("/agenda")}>
          Criar primeiro agendamento
        </Button>
      </div>
    </div>
  );
};
