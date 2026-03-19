import { Accordeon } from "@/components/ui/Accordeon";
import { MenuItem } from "@/components/ui/MenuItem";
import { useNotificationsContext } from "@/context/useNotifications";
import { useSessionContext } from "@/context/useSession";
import { cn } from "@/utils/cn";
import {
  MdAdminPanelSettings,
  MdAllInbox,
  MdAssessment,
  MdAttachMoney,
  MdCalendarMonth,
  MdCampaign,
  MdCameraAlt,
  MdCasino,
  MdCategory,
  MdComment,
  MdDashboard,
  MdLink,
  MdLogout,
  MdNote,
  MdOutlineInventory,
  MdPayment,
  MdPerson,
  MdPostAdd,
  MdSettings,
  MdShoppingBag,
} from "react-icons/md";
import styles from "./styles.module.scss";

type SidebarProps = {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.sectionLabel}>{children}</span>
);

export const Sidebar = ({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) => {
  const { session, logout, can } = useSessionContext();
  const { data: notifications, read } = useNotificationsContext();

  const close = () => isMobile && setIsSidebarOpen(false);

  return (
    <aside
      className={cn(styles.sidebar, {
        [styles.sidebarOpen]: isSidebarOpen,
        [styles.sidebarMobile]: isMobile,
      })}
    >
      <div className={styles.logo}>
        <h1>{session.user?.name}</h1>
      </div>

      <nav className={styles.menu}>
        {can("dashboard.read") && (
          <MenuItem
            icon={<MdAssessment size={20} />}
            label="Dashboard"
            href="/dashboard"
            onClick={close}
          />
        )}
        {can("calendar_events.read") && (
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
        )}

        {can("orders.read") && (
          <div className={styles.section}>
            <SectionLabel>Vendas</SectionLabel>
            <MenuItem
              icon={<MdShoppingBag size={20} />}
              label="Pedidos"
              href="/vendas/usuarios"
              onClick={close}
            />
            <MenuItem
              icon={<MdAttachMoney size={20} />}
              label="Comissões"
              href="/comissoes"
              onClick={close}
            />
            <MenuItem
              icon={<MdPayment size={20} />}
              label="Métodos de Pagamento"
              href="/metodos-de-pagamento"
              onClick={close}
            />
          </div>
        )}

        {(can("clients.read") || can("products.read")) && (
          <div className={styles.section}>
            <SectionLabel>Cadastros</SectionLabel>
            {can("clients.read") && (
              <MenuItem
                icon={<MdPerson size={20} />}
                label="Clientes"
                href="/clientes"
                onClick={close}
              />
            )}
            {can("products.read") && (
              <MenuItem
                icon={<MdAllInbox size={20} />}
                label="Produtos"
                href="/produtos"
                onClick={close}
              />
            )}
            <MenuItem
              icon={<MdCategory size={20} />}
              label="Tags"
              href="/tags"
              onClick={close}
            />
            <MenuItem
              icon={<MdCategory size={20} />}
              label="Categorias"
              href="/categorias"
              onClick={close}
            />
          </div>
        )}

        {(can("indications.read") ||
          can("raffles.read") ||
          can("instagram.read")) && (
          <div className={styles.section}>
            <SectionLabel>Marketing</SectionLabel>
            {can("indications.read") && (
              <MenuItem
                icon={<MdCampaign size={20} />}
                label="Indicações"
                href="/indicacoes"
                onClick={close}
              />
            )}
            {can("raffles.read") && (
              <MenuItem
                icon={<MdCasino size={20} />}
                label="Sorteios"
                href="/sorteios"
                onClick={close}
              />
            )}
            {can("instagram.read") && (
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
            )}
          </div>
        )}

        <div className={styles.section}>
          <SectionLabel>Gestão</SectionLabel>
          {can("users.read") && (
            <MenuItem
              icon={<MdPerson size={20} />}
              label="Usuários"
              href="/usuarios"
              onClick={close}
            />
          )}
          {can("roles.read") && (
            <MenuItem
              icon={<MdAdminPanelSettings size={20} />}
              label="Permissões"
              href="/permissoes"
              onClick={close}
            />
          )}
          {can("notes.read") && (
            <MenuItem
              icon={<MdNote size={20} />}
              label="Notas"
              href="/notas"
              notification={notifications?.notesToday}
              onClick={() => {
                close();
                read("notes_today");
              }}
            />
          )}
          {can("stock_movements.read") && (
            <MenuItem
              icon={<MdOutlineInventory size={20} />}
              label="Estoque"
              href="/estoque"
              onClick={close}
            />
          )}
          <MenuItem
            icon={<MdLink size={20} />}
            label="Conexões"
            href="/conexoes"
            onClick={close}
          />
          <MenuItem
            icon={<MdSettings size={20} />}
            label="Configurações"
            href="/configuracoes"
            onClick={close}
          />
        </div>
      </nav>

      <div className={styles.footer}>
        <MenuItem
          icon={<MdLogout size={20} />}
          label="Sair"
          onClick={() => {
            logout();
            close();
          }}
          variant="danger"
        />
      </div>
    </aside>
  );
};
