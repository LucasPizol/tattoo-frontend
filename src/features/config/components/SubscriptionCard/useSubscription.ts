import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  CheckoutSessionError,
  billingService,
} from "@/services/requests/billing";
import type { BillingStatus } from "@/schemas/billing";

export const BILLING_STATUS_QUERY_KEY = ["billing", "status"] as const;

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_ATTEMPTS = 15; // 15 * 2s = 30s cap

const isActivatedStatus = (data: BillingStatus | undefined) =>
  !!data?.has_active_subscription &&
  (data?.status === "active" || data?.status === "trialing");

const stripCheckoutQueryParam = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has("checkout")) {
    url.searchParams.delete("checkout");
    url.searchParams.delete("session_id");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }
};

const readCheckoutParam = (): "success" | "cancelled" | null => {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("checkout");
  if (value === "success" || value === "cancelled") return value;
  return null;
};

type UseSubscriptionResult = {
  status: BillingStatus | undefined;
  isLoading: boolean;
  isPolling: boolean;
  pollTimedOut: boolean;
  isCheckoutPending: boolean;
  startCheckout: () => void;
  reload: () => void;
};

/**
 * Drives the SubscriptionCard state machine described in WI#3 brief §4.
 *
 * Responsibilities:
 *  - Fetch the current billing snapshot from GET /api/billing/status.
 *  - Run the post-redirect poll loop (2s interval, 30s cap) when the
 *    user lands with `?checkout=success`.
 *  - Show informational toast on `?checkout=cancelled`.
 *  - Trigger POST /api/billing/checkout_session and redirect to the
 *    returned Stripe URL. Branch error handling per the brief:
 *      409 -> silent refetch (race with webhook).
 *      422 -> toast `Plano indisponível no momento. Contate o suporte.`
 *      502 -> toast `Não foi possível iniciar o checkout. Tente novamente.`
 */
export const useSubscription = (): UseSubscriptionResult => {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const pollAttemptsRef = useRef(0);
  const handledCheckoutParamRef = useRef(false);

  const query = useQuery({
    queryKey: BILLING_STATUS_QUERY_KEY,
    queryFn: billingService.getBillingStatus,
    refetchInterval: isPolling ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  // Track poll attempts and stop conditions whenever the query resolves
  // while polling.
  useEffect(() => {
    if (!isPolling) return;

    if (query.isFetching) return;

    if (isActivatedStatus(query.data)) {
      setIsPolling(false);
      pollAttemptsRef.current = 0;
      stripCheckoutQueryParam();
      toast.success("Plano Solo ativo. Aproveite!");
      return;
    }

    pollAttemptsRef.current += 1;

    if (pollAttemptsRef.current >= POLL_MAX_ATTEMPTS) {
      setIsPolling(false);
      setPollTimedOut(true);
      console.warn(
        "[billing] checkout poll exceeded 30s cap without activation",
      );
    }
  }, [query.data, query.isFetching, isPolling]);

  // Handle the redirect query params on mount exactly once.
  useEffect(() => {
    if (handledCheckoutParamRef.current) return;
    handledCheckoutParamRef.current = true;

    const param = readCheckoutParam();
    if (param === "success") {
      toast.success("Pagamento confirmado. Estamos ativando sua conta...");
      pollAttemptsRef.current = 0;
      setIsPolling(true);
    } else if (param === "cancelled") {
      toast("Checkout cancelado.");
      stripCheckoutQueryParam();
    }
  }, []);

  const checkoutMutation = useMutation({
    mutationFn: billingService.createCheckoutSession,
    onSuccess: ({ url }) => {
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    },
    onError: (error) => {
      if (error instanceof CheckoutSessionError) {
        switch (error.code) {
          case "already_subscribed":
            // Race condition: webhook just landed. Refetch and let the
            // card re-render in the active/trialing state.
            queryClient.invalidateQueries({
              queryKey: BILLING_STATUS_QUERY_KEY,
            });
            return;
          case "price_unavailable":
            toast.error("Plano indisponível no momento. Contate o suporte.");
            return;
          case "stripe_unavailable":
            toast.error(
              "Não foi possível iniciar o checkout. Tente novamente.",
            );
            return;
          default:
            toast.error(
              "Não foi possível iniciar o checkout. Tente novamente.",
            );
            return;
        }
      }
      toast.error("Não foi possível iniciar o checkout. Tente novamente.");
    },
  });

  const startCheckout = useCallback(() => {
    checkoutMutation.mutate();
  }, [checkoutMutation]);

  const reload = useCallback(() => {
    if (typeof window !== "undefined") window.location.reload();
  }, []);

  return {
    status: query.data,
    isLoading: query.isLoading,
    isPolling,
    pollTimedOut,
    isCheckoutPending: checkoutMutation.isPending,
    startCheckout,
    reload,
  };
};
