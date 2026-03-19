import { Loading } from "@/components/ui/Loading";
import styles from "./styles.module.scss";

interface TotalizerCardProps {
  label: string;
  isLoading: boolean;
  data?: string;
  info?: React.ReactNode;
}

export const TotalizerCard = ({
  data,
  label,
  isLoading,
  info,
}: TotalizerCardProps) => {
  return (
    <div title={label} className={styles.card}>
      {isLoading ? (
        <div className={styles.loading}>
          <Loading size={32} />
        </div>
      ) : (
        <div className={styles.value}>{data}</div>
      )}

      <div className={styles.label}>{label}</div>
      {info}
    </div>
  );
};
