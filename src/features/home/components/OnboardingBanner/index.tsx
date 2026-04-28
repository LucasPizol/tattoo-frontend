import { Button } from "@/components/ui/Button";
import { useSessionContext } from "@/context/useSession";
import { useEntitlement } from "@/hooks/useEntitlement";
import { MdSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

export const OnboardingBanner = () => {
  const { session } = useSessionContext();
  const hasCommissions = useEntitlement("multi_artist_commissions");
  const navigate = useNavigate();

  if (!session.isAuthenticated) return null;
  if (session.company.onboarding_completed_at !== null) return null;

  const steps = session.company.onboarding_steps;
  const applicableKeys = hasCommissions
    ? (["first_client", "first_product", "first_appointment", "team"] as const)
    : (["first_client", "first_product", "first_appointment"] as const);

  const totalSteps = applicableKeys.length;
  const completedSteps = applicableKeys.filter((k) => steps[k]).length;

  if (completedSteps === totalSteps) return null;

  const percent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className={styles.banner}>
      <div className={styles.iconWrap}>
        <MdSettings size={22} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>Configure seu studio</p>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {completedSteps} de {totalSteps} etapas concluídas
        </span>
      </div>
      <div className={styles.action}>
        <Button size="small" onClick={() => navigate("/onboarding")}>
          Continuar
        </Button>
      </div>
    </div>
  );
};
