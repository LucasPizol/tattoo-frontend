import { Alert } from "@/components/ui/Alert";
import { Select } from "@/components/ui/Select";
import type { OrderShowResponse } from "@/services/requests/orders/types";
import styles from "../styles.module.scss";
import { useTerminalList } from "./hooks/useTerminalList";

type ConfirmOrderContentProps = {
  order: OrderShowResponse["order"];
  terminalId?: string | null;
  setTerminalId: (terminalId: string | null) => void;
};

export const ConfirmOrderContent = ({
  order,
  terminalId,
  setTerminalId,
}: ConfirmOrderContentProps) => {
  const { terminals } = useTerminalList();

  return (
    <div className={styles.confirmContent}>
      <p>Tem certeza que deseja criar este pedido?</p>
      <div className={styles.confirmSummary}>
        <div className={styles.confirmRow}>
          <span>Cliente:</span>
          <strong>{order?.client?.name}</strong>
        </div>
        {order?.orderPaymentMethods?.map((opm) => (
          <div key={opm.id} className={styles.confirmRow}>
            <span>{opm.paymentMethodName}:</span>
            <strong>{opm.value.formatted}</strong>
          </div>
        ))}
        <div className={styles.confirmRow}>
          <span>Total:</span>
          <strong>{order?.totalValue.formatted}</strong>
        </div>
        {terminals.length > 0 && (
          <Select
            noForm
            label="Terminal"
            options={terminals.map((terminal) => ({
              label: terminal.posId.toString(),
              value: terminal.id,
            }))}
            renderOption={(option) => (
              <div>
                <span>{`${option.value} - Terminal ${option.label}`}</span>
              </div>
            )}
            onSelect={(option) => setTerminalId(option?.value as string)}
            value={terminalId ?? undefined}
            onClear={() => setTerminalId(null)}
          />
        )}
        {terminalId && (
          <Alert type="info">
            <span>
              O pedido será enviado para o terminal {terminalId} e marcado como
              "Aguardando Pagamento"
            </span>
          </Alert>
        )}
      </div>
    </div>
  );
};
