import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

type TypographyBaseProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

type TitleProps = TypographyBaseProps & {
  level?: 1 | 2 | 3;
};

const Title = ({ level = 1, children, className, as }: TitleProps) => {
  const Tag = as ?? (`h${level}` as React.ElementType);
  const variant = `title${level}` as const;

  return (
    <Tag className={cn(styles[variant], className)}>
      {children}
    </Tag>
  );
};

const Body1 = ({ children, className, as: Tag = "p" }: TypographyBaseProps) => (
  <Tag className={cn(styles.body1, className)}>{children}</Tag>
);

const Body2 = ({ children, className, as: Tag = "p" }: TypographyBaseProps) => (
  <Tag className={cn(styles.body2, className)}>{children}</Tag>
);

const Caption = ({
  children,
  className,
  as: Tag = "span",
}: TypographyBaseProps) => (
  <Tag className={cn(styles.caption, className)}>{children}</Tag>
);

export const Typography = {
  Title,
  Body1,
  Body2,
  Caption,
};
