import { cn } from "@/utils/cn";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MdExpandMore } from "react-icons/md";
import { Button } from "../Button";
import styles from "./styles.module.scss";

type AccordeonProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  headerClassName?: string;
};

export const Accordeon = ({
  title,
  children,
  className,
  defaultOpen = false,
  variant = "primary",
  headerClassName,
}: AccordeonProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0,
  );

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(styles.accordeon, className, {
        [styles.open]: isOpen,
      })}
    >
      <Button
        variant={variant}
        type="button"
        className={cn(styles.header, headerClassName)}
        onClick={handleToggle}
        aria-expanded={isOpen}
        suffixIcon={<MdExpandMore />}
        titleExpanded
      >
        {title}
      </Button>
      <div className={styles.contentWrapper} style={{ height: contentHeight }}>
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};
