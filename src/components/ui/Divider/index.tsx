import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

interface DividerProps {
  variant?: "horizontal" | "vertical";
  orientation?: "horizontal" | "vertical";
  size?: "thin" | "medium" | "thick";
  color?: "default" | "primary" | "secondary" | "muted";
  textColor?: string;
  text?: string;
  textAlign?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export const Divider = ({
  variant = "horizontal",
  orientation = "horizontal",
  size = "thin",
  color = "default",
  text,
  textColor,
  textAlign = "center",
  className,
  style,
}: DividerProps) => {
  const isHorizontal = orientation === "horizontal" || variant === "horizontal";

  if (text && isHorizontal) {
    return (
      <div
        className={cn(styles.dividerWithText, className, styles[textAlign])}
        style={style}
      >
        <div
          className={cn(
            styles.line,
            styles[color],
            styles[size],
            styles.lineLeft
          )}
        ></div>
        <span className={cn(styles.text)} style={{ color: textColor }}>
          {text}
        </span>
        <div
          className={cn(
            styles.line,
            styles[color],
            styles[size],
            styles.lineRight
          )}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        styles.divider,
        styles[orientation],
        styles[color],
        styles[size],
        className
      )}
      style={style}
      role="separator"
      aria-orientation={orientation}
    />
  );
};
