import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

interface ProgressProps {
  value: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "success" | "warning" | "danger";
}

export const Progress = ({
  value,
  label,
  className,
  showPercentage = false,
  size = "medium",
  variant = "primary",
}: ProgressProps) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn(styles.progressContainer, className)}>
      {(label || showPercentage) && (
        <div className={styles.labelContainer}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercentage && (
            <span className={styles.percentage}>{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(styles.progressBar, {
          [styles.small]: size === "small",
          [styles.medium]: size === "medium",
          [styles.large]: size === "large",
        })}
      >
        <div
          className={cn(styles.progressFill, {
            [styles.primary]: variant === "primary",
            [styles.success]: variant === "success",
            [styles.warning]: variant === "warning",
            [styles.danger]: variant === "danger",
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
