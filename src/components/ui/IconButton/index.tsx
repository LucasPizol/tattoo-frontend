import { cn } from "@/utils/cn";
import { useCallback, useState } from "react";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  loading?: boolean;
  title?: string;
  removeMobileAttributes?: boolean;
};

export const IconButton = ({
  children,
  loading,
  title,
  removeMobileAttributes = false,
  className,
  ...props
}: IconButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        setIsLoading(true);
        await props.onClick?.(e);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [props.onClick],
  );

  return (
    <button
      className={cn(styles.iconButton, className, {
        [styles.removeMobileAttributes]: removeMobileAttributes,
      })}
      data-loading={isLoading || loading}
      {...props}
      disabled={isLoading || loading}
      onClick={handleClick}
    >
      {isLoading || loading ? <Loading size={16} /> : children}
      {title && !removeMobileAttributes && (
        <span className={styles.title}>{title}</span>
      )}
    </button>
  );
};
