import { useMobile } from "@/hooks/useMobile";
import { MdMenu } from "react-icons/md";
import { IconButton } from "../ui/IconButton";
import { Popover } from "../ui/Popover";
import styles from "./styles.module.scss";

type ActionProps = {
  children: React.ReactNode;
};

export const Action = ({ children }: ActionProps) => {
  const isMobile = useMobile();

  return (
    <div className={styles.action}>
      <div className={styles.actionContent}>{!isMobile && children}</div>
      {isMobile && (
        <Popover
          content={children}
          className={styles.popover}
          trigger="click"
          contentClassName={styles.popoverContent}
          interactive
        >
          <IconButton>
            <MdMenu />
          </IconButton>
        </Popover>
      )}
    </div>
  );
};
