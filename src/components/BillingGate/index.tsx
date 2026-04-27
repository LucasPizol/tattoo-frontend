import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { BillingBanner } from "@/components/BillingBanner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useBillingGate } from "@/hooks/useBillingGate";

interface BillingGateProps {
  children: ReactNode;
}

const CONFIG_PATH = "/configuracoes";

/**
 * Frontend half of the billing gate (WI#5 brief §2.6). Wraps the
 * authenticated route tree only — unauthenticated routes
 * (`/login`, `/cadastro`, `/aceitar-convite/:token`) MUST stay
 * outside this gate.
 *
 * Critical invariant (brief §2.7): when the tenant is in the
 * hard-block bucket and is ALREADY on `/configuracoes`, we must NOT
 * redirect. That single guard prevents the post-checkout
 * `?checkout=success` polling loop from trapping the user.
 *
 * Defensive note: we only render `<LoadingScreen>` while the very
 * first status fetch is in flight; subsequent refetches do not flip
 * `isLoading` (TanStack Query exposes `isFetching` for that). The
 * banner is rendered for soft-block (`past_due`) and the
 * informational `incomplete` state, both of which keep full app
 * access per the brief.
 */
export const BillingGate = ({ children }: BillingGateProps) => {
  const { billingState, isLoading, accessBucket } = useBillingGate();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (
    accessBucket === "hard_block" &&
    location.pathname !== CONFIG_PATH
  ) {
    return <Navigate to={CONFIG_PATH} replace />;
  }

  return (
    <>
      {accessBucket === "soft_block" && billingState && (
        <BillingBanner state={billingState} />
      )}
      {billingState === "incomplete" && <BillingBanner state="incomplete" />}
      {children}
    </>
  );
};
