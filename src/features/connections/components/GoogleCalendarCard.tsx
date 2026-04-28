import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { FaCalendarAlt } from "react-icons/fa";
import { useGoogleCalendarStatus } from "../http/queries/useGoogleCalendarStatus";
import {
  useConnectGoogleCalendar,
  useDisconnectGoogleCalendar,
} from "../http/mutations/googleCalendarMutations";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "../styles.module.scss";

export const GoogleCalendarCard = () => {
  const { data: status, isLoading } = useGoogleCalendarStatus();
  const { mutate: connect, isPending: isConnecting } =
    useConnectGoogleCalendar();
  const { mutate: disconnect } = useDisconnectGoogleCalendar();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const result = searchParams.get("google_calendar");
    if (!result) return;

    if (result === "success") {
      toast.success("Google Calendar conectado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["google-calendar-status"] });
    } else {
      toast.error("Erro ao conectar o Google Calendar. Tente novamente.");
    }

    const next = new URLSearchParams(searchParams);
    next.delete("google_calendar");
    next.delete("reason");
    setSearchParams(next, { replace: true });
  }, [ searchParams, queryClient, setSearchParams ]);

  if (isLoading) return null;

  const isDisconnected = status?.status === "disconnected";

  return (
    <div className={styles.connectionCard}>
      <div
        className={styles.connectionIcon}
        style={{
          background:
            "linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc04 75%, #ea4335 100%)",
        }}
      >
        <FaCalendarAlt size={28} />
      </div>

      <div className={styles.connectionInfo}>
        <span className={styles.connectionName}>Google Calendar</span>
        <span className={styles.connectionDescription}>
          {status?.connected
            ? `Conectado: ${status.email}`
            : "Sincronize seus agendamentos automaticamente"}
        </span>
      </div>

      <div className={styles.connectionAction}>
        {isDisconnected && (
          <p className={styles.disconnectedAlert}>
            Sua conexão com o Google Calendar foi interrompida. Reconecte para
            continuar sincronizando.
          </p>
        )}

        {status?.connected ? (
          <ConfirmModal
            trigger={
              <Button variant="secondary" size="small" danger>
                Desconectar
              </Button>
            }
            onSave={() => Promise.resolve(disconnect())}
          >
            <p>Deseja desconectar o Google Calendar?</p>
            <p>
              Os eventos já sincronizados no Google Calendar não serão
              removidos. Novos agendamentos deixarão de ser sincronizados.
            </p>
          </ConfirmModal>
        ) : (
          <Button
            variant="primary"
            size="small"
            loading={isConnecting}
            onClick={() => connect()}
          >
            {isDisconnected ? "Reconectar" : "Conectar Google Calendar"}
          </Button>
        )}
      </div>
    </div>
  );
};
