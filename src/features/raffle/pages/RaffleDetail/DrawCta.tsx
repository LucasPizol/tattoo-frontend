import { Button } from "@/components/ui/Button";
import { MdCasino } from "react-icons/md";
import styles from "./DrawCta.module.scss";

type DrawCtaProps = {
  poolSize: number;
  primaryCount: number;
  secondaryCount: number;
  onDraw: () => void;
  isLoading?: boolean;
};

export const DrawCta = ({
  poolSize,
  primaryCount,
  onDraw,
  isLoading = false,
}: DrawCtaProps) => {
  const plural = primaryCount !== 1;
  const poolPlural = poolSize !== 1;

  const subcopy = `${primaryCount} ganhador${plural ? "es" : ""} principal${plural ? "is" : ""} será${plural ? "ão" : ""} sorteado${plural ? "s" : ""} desta pool de ${poolSize} participante${poolPlural ? "s" : ""}.`;

  return (
    <div className={styles.cta}>
      <div className={styles.iconPuck}>
        <MdCasino size={96} className={styles.icon} aria-hidden />
      </div>
      <p className={styles.title}>Pronto para sortear</p>
      <p className={styles.sub}>{subcopy}</p>
      <div className={styles.buttonWrap}>
        <Button
          variant="secondary"
          size="large"
          disabled={isLoading}
          onClick={onDraw}
          fullWidth
        >
          SORTEAR
        </Button>
      </div>
    </div>
  );
};
