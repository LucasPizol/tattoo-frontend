import { cn } from "@/utils/cn";
import { useState } from "react";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  danger?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  titleExpanded?: boolean;
  outline?: boolean;
}

export const Button = ({
  children,
  loading,
  variant = "primary",
  disabled,
  prefixIcon,
  suffixIcon,
  className,
  danger,
  size = "medium",
  fullWidth = false,
  titleExpanded = false,
  outline = false,
  ...props
}: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={cn(styles.button, className, {
        [styles.primary]: variant === "primary",
        [styles.secondary]: variant === "secondary",
        [styles.tertiary]: variant === "tertiary",
        [styles.danger]: danger,
        [styles.small]: size === "small",
        [styles.medium]: size === "medium",
        [styles.large]: size === "large",
        [styles.fullWidth]: fullWidth,
        [styles.outline]: outline,
      })}
      data-loading={loading || isLoading}
      disabled={disabled || loading}
      {...props}
      onClick={async (e) => {
        try {
          setIsLoading(true);
          await props.onClick?.(e);
        } catch (error) {
          throw error;
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {prefixIcon && (
        <div
          className={styles.icon}
          style={{
            marginRight: 4,
          }}
        >
          {prefixIcon}
        </div>
      )}
      <Loading
        size={isLoading || loading ? 14 : 0}
        color={
          variant === "primary"
            ? "var(--color-primary)"
            : "var(--color-secondary)"
        }
      />
      <span
        style={{
          flex: titleExpanded ? 1 : undefined,
          textAlign: titleExpanded ? "left" : "center",
        }}
      >
        {children}
      </span>
      {suffixIcon && (
        <div
          className={styles.icon}
          style={{
            marginLeft: 4,
          }}
        >
          {suffixIcon}
        </div>
      )}
    </button>
  );
};
