import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export const Label = ({
  children,
  htmlFor,
  required,
  disabled,
  error,
  className,
}: LabelProps) => (
  <label
    className={cn(styles.label, className, {
      [styles.disabled]: disabled,
      [styles.error]: error,
    })}
    htmlFor={htmlFor}
  >
    {children}
    {required && <span className={styles.required}>*</span>}
  </label>
);
