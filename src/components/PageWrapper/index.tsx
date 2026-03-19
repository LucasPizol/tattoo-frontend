import { cn } from "@/utils/cn";
import { MdArrowBack } from "react-icons/md";
import { Button } from "../ui/Button";
import styles from "./styles.module.scss";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  onBack?: () => void;
  containerClassName?: string;
  headerClassName?: string;
};

export const PageWrapper = ({
  children,
  className,
  title,
  subtitle,
  actions,
  onBack,
  containerClassName,
  headerClassName,
}: PageWrapperProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <div className={cn(styles.header, headerClassName)}>
        <div className={styles.headerContent}>
          <div className={styles.backButtonContainer}>
            {onBack && (
              <Button
                variant="tertiary"
                onClick={onBack}
                className={styles.backButton}
              >
                <MdArrowBack />
              </Button>
            )}
            <h1 className={styles.title}>{title}</h1>
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className={cn(styles.content, containerClassName)}>{children}</div>
    </div>
  );
};
