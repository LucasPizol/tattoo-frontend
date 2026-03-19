import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

type LoadingProps = {
  size?: number;
  color?: string;
  outlineColor?: string;
  className?: string;
};

export const Loading = ({
  size = 14,
  color = "var(--color-primary)",
  outlineColor = "#fff",
  className,
}: LoadingProps) => {
  return (
    <span
      className={cn(styles.loading, className)}
      style={{
        width: size,
        height: size,
        borderTopColor: color,
        borderBottomColor: outlineColor,
        borderLeftColor: outlineColor,
        borderRightColor: outlineColor,
        borderWidth: size / 5,
        borderStyle: "solid",
      }}
    />
  );
};
