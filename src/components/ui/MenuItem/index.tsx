import { cn } from "@/utils/cn";
import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

type MenuItemProps = {
  icon: ReactNode;
  label: string;
  notification?: number;
  variant?: "default" | "danger";
} & (
  | {
      href: string;
    }
  | {
      onClick: () => void;
    }
);

export const MenuItem = ({
  icon,
  label,
  notification,
  variant = "default",
  ...props
}: MenuItemProps) => {
  const pathname = useLocation().pathname;
  const isActive = "href" in props ? pathname === props.href : false;

  return (
    <Link
      to={"href" in props ? props.href : "#"}
      onClick={() => {
        if ("onClick" in props) {
          props.onClick();
        }
      }}
      className={cn(
        styles.menuItem,
        styles[variant],
        isActive && styles.active
      )}
    >
      <span className={styles.icon}>{icon}</span>

      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {Boolean(notification) && (
          <span className={styles.notification}>{notification}</span>
        )}
      </div>
    </Link>
  );
};
