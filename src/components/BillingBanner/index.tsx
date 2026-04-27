import { useLocation } from "react-router-dom";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useSubscription } from "@/features/config/components/SubscriptionCard/useSubscription";
import type { BillingState } from "@/services/requests/billing";

import styles from "./styles.module.scss";

const CONFIG_PATH = "/configuracoes";

type BannerCopy = {
  type: "warning" | "info";
  headline: string;
  body: string;
  cta?: { label: string };
};

/**
 * Copy table per WI#5 brief §2.6. Other states intentionally omit a
 * banner — the SubscriptionCard handles their UX on `/configuracoes`.
 */
const COPY: Partial<Record<BillingState, BannerCopy>> = {
  past_due: {
    type: "warning",
    headline: "Pagamento pendente",
    body: "Atualize seu meio de pagamento para evitar suspensão.",
    cta: { label: "Gerenciar cobrança" },
  },
  incomplete: {
    type: "info",
    headline: "Confirmando seu pagamento",
    body: "Acesso completo durante a confirmação. Pode levar até 3 dias úteis.",
  },
};

interface BillingBannerProps {
  state: BillingState;
}

/**
 * Global, non-dismissible banner rendered by `<BillingGate>` when
 * the tenant is in a soft-block or `incomplete` state. Reuses the
 * shared `<Alert>` component so it inherits theme/dark-mode tokens.
 */
export const BillingBanner = ({ state }: BillingBannerProps) => {
  const location = useLocation();
  const copy = COPY[state];
  const { startPortal, isPortalPending } = useSubscription();

  // PM sign-off: suppress the banner on /configuracoes — the
  // SubscriptionCard owns the billing UX there and a banner above it
  // would be a redundant CTA.
  if (location.pathname.startsWith(CONFIG_PATH)) return null;
  if (!copy) return null;

  const actions = copy.cta ? (
    <div className={styles.actions}>
      <Button
        type="button"
        variant="primary"
        size="small"
        loading={isPortalPending}
        onClick={() => startPortal()}
      >
        {copy.cta.label}
      </Button>
    </div>
  ) : undefined;

  return (
    <div
      className={styles.wrapper}
      role="status"
      data-billing-state={state}
    >
      <Alert type={copy.type} actions={actions}>
        <strong className={styles.headline}>{copy.headline}</strong>
        <span className={styles.body}>{copy.body}</span>
      </Alert>
    </div>
  );
};
