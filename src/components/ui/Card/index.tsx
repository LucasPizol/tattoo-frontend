import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

type CardProps = {
  title: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
  contentClassName?: string;
};

export const Card = ({
  title,
  icon,
  children,
  className,
  actions,
  contentClassName,
}: CardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      {!!title && (
        <div className={styles.header}>
            <div className={styles.headerContent}>
              {icon && <span className={styles.icon}>{icon}</span>}
              <h3 className={styles.title}>{title}</h3>
            </div>
          {actions && <div className={styles.headerActions}>{actions}</div>}
        </div>
      )}
      {children && <div className={cn(styles.content, contentClassName)}>{children}</div>}
    </div>
  );
};
