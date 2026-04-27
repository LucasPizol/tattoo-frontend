import { useMemo } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { BillingStatus } from "@/schemas/billing";

import { useSubscription } from "./useSubscription";
import styles from "./styles.module.scss";

const formatBrazilianDate = (iso: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

type DerivedState =
  | "loading"
  | "no_subscription"
  | "trialing"
  | "active"
  | "past_due_or_unpaid"
  | "canceled_or_incomplete";

const deriveState = (
  status: BillingStatus | undefined,
  isLoading: boolean,
): DerivedState => {
  if (isLoading || !status) return "loading";
  if (!status.has_active_subscription) {
    if (status.status === "past_due" || status.status === "unpaid")
      return "past_due_or_unpaid";
    if (status.status === "canceled" || status.status === "incomplete")
      return "canceled_or_incomplete";
    return "no_subscription";
  }
  if (status.status === "trialing") return "trialing";
  if (status.status === "active") return "active";
  if (status.status === "past_due" || status.status === "unpaid")
    return "past_due_or_unpaid";
  return "no_subscription";
};

const Skeleton = () => (
  <div className={styles.skeleton} aria-busy="true" aria-label="Carregando">
    <div className={styles.skeletonHeadline} />
    <div className={styles.skeletonLine} />
    <div className={styles.skeletonLineShort} />
    <div className={styles.skeletonButton} />
  </div>
);

export const SubscriptionCard = () => {
  const {
    status,
    isLoading,
    pollTimedOut,
    isCheckoutPending,
    startCheckout,
    reload,
  } = useSubscription();

  const derivedState = useMemo(
    () => deriveState(status, isLoading),
    [status, isLoading],
  );

  const renderBody = () => {
    if (derivedState === "loading") return <Skeleton />;

    if (derivedState === "trialing") {
      const trialEnd = formatBrazilianDate(status?.trial_end ?? null);
      return (
        <div className={styles.body}>
          <h4 className={styles.headline}>Período de teste ativo</h4>
          <p className={styles.copy}>Seu teste termina em {trialEnd}.</p>
          <Button variant="secondary" disabled>
            Gerenciar assinatura (em breve)
          </Button>
        </div>
      );
    }

    if (derivedState === "active") {
      const periodEnd = formatBrazilianDate(status?.current_period_end ?? null);
      return (
        <div className={styles.body}>
          <h4 className={styles.headline}>Plano Solo ativo</h4>
          <p className={styles.copy}>Próxima cobrança em {periodEnd}.</p>
          <Button variant="secondary" disabled>
            Gerenciar assinatura (em breve)
          </Button>
        </div>
      );
    }

    if (derivedState === "past_due_or_unpaid") {
      return (
        <div className={styles.body}>
          <h4 className={styles.headline}>Pagamento pendente</h4>
          <p className={styles.copy}>
            Atualize seu meio de pagamento para evitar suspensão.
          </p>
          <Button
            variant="primary"
            onClick={startCheckout}
            loading={isCheckoutPending}
            disabled={isCheckoutPending}
          >
            Atualizar pagamento
          </Button>
        </div>
      );
    }

    // canceled_or_incomplete and no_subscription share the activation CTA.
    return (
      <div className={styles.body}>
        <h4 className={styles.headline}>Ative seu plano Solo</h4>
        <p className={styles.copy}>
          14 dias grátis. Cancele quando quiser. Pagamento via cartão ou boleto.
        </p>
        <Button
          variant="primary"
          onClick={startCheckout}
          loading={isCheckoutPending}
          disabled={isCheckoutPending}
        >
          Assinar Solo (R$ 79/mês)
        </Button>
      </div>
    );
  };

  return (
    <Card title="Assinatura" className={styles.card}>
      {pollTimedOut && (
        <Alert
          type="info"
          className={styles.banner}
          actions={
            <Button variant="secondary" size="small" onClick={reload}>
              Recarregar
            </Button>
          }
        >
          Sua assinatura está sendo ativada. Recarregue a página em alguns
          instantes.
        </Alert>
      )}
      {renderBody()}
    </Card>
  );
};
