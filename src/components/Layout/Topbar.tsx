import { useSessionContext } from "@/context/useSession";
import { useRef, useState } from "react";
import { MdLogout, MdPerson } from "react-icons/md";
import styles from "./styles.module.scss";

export const Topbar = () => {
  const { session, logout } = useSessionContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const userName = session.isAuthenticated ? session.user?.name ?? "" : "";

  const handleToggle = () => setOpen((prev) => !prev);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div className={styles.topbar}>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          className={styles.topbarUserChip}
          onClick={handleToggle}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <MdPerson size={18} />
          <span>{userName}</span>
        </button>

        {open && (
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99,
              }}
              onClick={() => setOpen(false)}
            />
            <div className={styles.topbarDropdown}>
              <button
                className={`${styles.topbarDropdownItem} ${styles.danger}`}
                onClick={handleLogout}
              >
                <MdLogout size={16} />
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
