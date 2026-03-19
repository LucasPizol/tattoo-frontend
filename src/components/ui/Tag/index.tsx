import { cn } from "@/utils/cn";
import { MdClose } from "react-icons/md";
import styles from "./styles.module.scss";

export type TagColor =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "purple"
  | "pink"
  | "brown"
  | "gray";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  color?: TagColor;
  size?: "small" | "medium" | "large";
  onRemove?: () => void;
}

export const Tag = ({
  children,
  color = "blue",
  size = "medium",
  className,
  onRemove,
  ...props
}: TagProps) => {
  return (
    <span
      className={cn(styles.tag, className, {
        [styles.red]: color === "red",
        [styles.green]: color === "green",
        [styles.blue]: color === "blue",
        [styles.yellow]: color === "yellow",
        [styles.orange]: color === "orange",
        [styles.purple]: color === "purple",
        [styles.pink]: color === "pink",
        [styles.brown]: color === "brown",
        [styles.gray]: color === "gray",
        [styles.small]: size === "small",
        [styles.medium]: size === "medium",
        [styles.large]: size === "large",
      })}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          className={styles.remove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          type="button"
        >
          <MdClose size={16} />
        </button>
      )}
    </span>
  );
};
