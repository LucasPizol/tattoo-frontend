import { InstagramButton } from "@/components/SocialMediaButtons/InstagramButton";
import { MdDelete, MdLink } from "react-icons/md";
import styles from "./styles.module.scss";
import { useInstagramAccountList } from "../instagram-posts/http/queries/useInstagramAccountList";
import { useDestroyInstagramAccount } from "./http/mutations/connectionMutations";
import { FaInstagram, FaWhatsapp, FaGoogle } from "react-icons/fa";
import { ConfirmModal } from "@/components/ConfirmModal";
import { PageWrapper } from "@/components/PageWrapper";
import { WhatsappButton } from "@/components/SocialMediaButtons/WhastappButton";
import { GoogleCalendarCard } from "./components/GoogleCalendarCard";
import { useEntitlement } from "@/hooks/useEntitlement";

type ConnectionCardConfig = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  connectButton: React.ReactNode;
  comingSoon?: boolean;
};

const CONNECTION_CARDS: ConnectionCardConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Publique posts e gerencie seu perfil diretamente",
    icon: <FaInstagram size={28} />,
    gradient:
      "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    connectButton: <InstagramButton />,
    comingSoon: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Envie mensagens e notificações para seus clientes",
    icon: <FaWhatsapp size={28} />,
    gradient: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
    connectButton: <WhatsappButton />,
    comingSoon: true,
  },
  {
    id: "google-reviews",
    name: "Google Avaliações",
    description: "Acompanhe e responda avaliações do seu negócio",
    icon: <FaGoogle size={28} />,
    gradient: "linear-gradient(135deg, #4285f4 0%, #0d47a1 100%)",
    connectButton: null,
    comingSoon: true,
  },
];

export const Connections = () => {
  const { accounts } = useInstagramAccountList();
  const { mutateAsync: destroyAccount } = useDestroyInstagramAccount();
  const hasGoogleCalendarSync = useEntitlement("google_calendar_sync");

  return (
    <PageWrapper title="Conexões" subtitle="Gerencie suas integrações">
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Conexões disponíveis</h2>
        <div className={styles.connectionsGrid}>
          {hasGoogleCalendarSync && <GoogleCalendarCard />}
          {[...CONNECTION_CARDS]
            .sort((a, b) => Number(!!a.comingSoon) - Number(!!b.comingSoon))
            .map((card) => (
              <div
                key={card.id}
                className={`${styles.connectionCard} ${card.comingSoon ? styles.comingSoon : ""}`}
              >
                <div
                  className={styles.connectionIcon}
                  style={{ background: card.gradient }}
                >
                  {card.icon}
                </div>
                <div className={styles.connectionInfo}>
                  <span className={styles.connectionName}>{card.name}</span>
                  <span className={styles.connectionDescription}>
                    {card.description}
                  </span>
                </div>
                <div className={styles.connectionAction}>
                  {card.comingSoon ? (
                    <span className={styles.comingSoonBadge}>Em breve</span>
                  ) : (
                    card.connectButton
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {accounts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contas conectadas</h2>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.accountCard}>
                <div className={styles.accountInfo}>
                  <div className={styles.avatarWrapper}>
                    {account.profilePictureUrl ? (
                      <img
                        src={account.profilePictureUrl}
                        alt={account.username}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <FaInstagram size={20} />
                      </div>
                    )}
                    <div className={styles.platformBadge}>
                      <FaInstagram size={12} />
                    </div>
                  </div>
                  <div className={styles.accountDetails}>
                    <span className={styles.username}>@{account.username}</span>
                    <span className={styles.platform}>Instagram</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <div className={styles.accountStatus}>
                    <MdLink size={16} />
                    <span>Conectado</span>
                  </div>
                  <ConfirmModal
                    trigger={
                      <MdDelete size={24} color="red" cursor="pointer" />
                    }
                    onSave={async () => await destroyAccount(account.id)}
                  >
                    <p>Tem certeza que deseja excluir esta conta?</p>
                  </ConfirmModal>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  );
};
