import { cn } from "@/utils/cn";
import { useState } from "react";
import { MdCheck, MdClose, MdError, MdInfo, MdWarning } from "react-icons/md";
import styles from "./styles.module.scss";

interface AlertProps {
  type: "error" | "info" | "warning" | "success";
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const icons = {
  error: MdError,
  info: MdInfo,
  warning: MdWarning,
  success: MdCheck,
};

export const Alert = ({
  type,
  children,
  className,
  dismissible = false,
  onDismiss,
  actions,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const Icon = icons[type];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(styles.alert, styles[type], className)}>
      <div className={styles.alertContent}>
        <Icon className={styles.icon} />
        <div className={styles.content}>{children}</div>
        {dismissible && (
          <button
            type="button"
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Fechar alerta"
          >
            <MdClose />
          </button>
        )}
      </div>
      {actions}
    </div>
  );
};
