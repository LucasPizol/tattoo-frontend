import { Accordeon } from "@/components/ui/Accordeon";
import { MenuItem } from "@/components/ui/MenuItem";
import { useNotificationsContext } from "@/context/useNotifications";
import { useEntitlement } from "@/hooks/useEntitlement";
import { cn } from "@/utils/cn";
import {
  MdAssessment,
  MdAttachMoney,
  MdCalendarMonth,
  MdCameraAlt,
  MdCasino,
  MdComment,
  MdDashboard,
  MdGroup,
  MdLink,
  MdLock,
  MdOutlineInventory,
  MdPostAdd,
  MdSettings,
  MdShoppingBag,
} from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

type SidebarProps = {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.sectionLabel}>{children}</span>
);

const LockedTeaser = ({ label }: { label: string }) => (
  <Link to="/configuracoes" className={styles.lockedTeaser}>
    <MdLock size={18} className={styles.lockedIcon} />
    <span className={styles.lockedLabel}>{label}</span>
    <span className={styles.lockedBadge}>Studio</span>
  </Link>
);

export const Sidebar = ({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) => {
  const { data: notifications, read } = useNotificationsContext();

  const hasCommissions = useEntitlement("multi_artist_commissions");
  const hasInstagramRaffles = useEntitlement("instagram_raffles");

  const close = () => isMobile && setIsSidebarOpen(false);

  return (
    <aside
      className={cn(styles.sidebar, {
        [styles.sidebarOpen]: isSidebarOpen,
        [styles.sidebarMobile]: isMobile,
      })}
    >
      <div className={styles.logo}>
        <span className={styles.logoMark}>Rainbow</span>
      </div>

      <nav className={styles.menu}>
        <MenuItem
          icon={<MdDashboard size={20} />}
          label="Início"
          href="/dashboard"
          onClick={close}
        />
        <MenuItem
          icon={<MdCalendarMonth size={20} />}
          label="Agenda"
          href="/agenda"
          notification={notifications?.calendarEventsToday}
          onClick={() => {
            close();
            read("calendar_events_today");
          }}
        />

        <div className={styles.section}>
          <SectionLabel>Vendas</SectionLabel>
          <MenuItem
            icon={<MdShoppingBag size={20} />}
            label="Pedidos"
            href="/vendas/usuarios"
            onClick={close}
          />
          {hasCommissions ? (
            <MenuItem
              icon={<MdAttachMoney size={20} />}
              label="Comissões"
              href="/comissoes"
              onClick={close}
            />
          ) : (
            <LockedTeaser label="Comissões" />
          )}
        </div>

        {hasInstagramRaffles && (
          <div className={styles.section}>
            <SectionLabel>Marketing</SectionLabel>
            <MenuItem
              icon={<MdCasino size={20} />}
              label="Sorteios"
              href="/sorteios"
              onClick={close}
            />
            <Accordeon
              variant="primary"
              headerClassName={styles.instagramHeader}
              title={
                <span className={styles.instagramTitle}>
                  <MdCameraAlt size={20} /> Instagram
                </span>
              }
            >
              <MenuItem
                icon={<MdDashboard size={20} />}
                label="Dashboard"
                href="/instagram/dashboard"
                onClick={close}
              />
              <MenuItem
                icon={<MdPostAdd size={20} />}
                label="Posts"
                href="/instagram/posts"
                onClick={close}
              />
              <MenuItem
                icon={<MdComment size={20} />}
                label="Últimos Comentários"
                href="/instagram/comentarios"
                onClick={close}
              />
            </Accordeon>
          </div>
        )}

        <div className={styles.section}>
          <SectionLabel>Gestão</SectionLabel>
          {hasCommissions && (
            <>
              <MenuItem
                icon={<MdGroup size={20} />}
                label="Equipe"
                href="/equipe"
                onClick={close}
              />
              <MenuItem
                icon={<MdOutlineInventory size={20} />}
                label="Estoque"
                href="/estoque"
                onClick={close}
              />
            </>
          )}
          <MenuItem
            icon={<MdLink size={20} />}
            label="Integrações"
            href="/conexoes"
            onClick={close}
          />
          <MenuItem
            icon={<MdSettings size={20} />}
            label="Configurações"
            href="/configuracoes"
            onClick={close}
          />
          {hasCommissions && (
            <MenuItem
              icon={<MdAssessment size={20} />}
              label="Relatórios"
              href="/relatorios"
              onClick={close}
            />
          )}
        </div>
      </nav>
    </aside>
  );
};
