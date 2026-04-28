import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  type BillingState,
  PortalSessionError,
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
  billingState: BillingState | null;
  isLoading: boolean;
  isPolling: boolean;
  pollTimedOut: boolean;
  isPortalPending: boolean;
  startPortal: () => void;
  reload: () => void;
};

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

  useEffect(() => {
    if (!isPolling) return;

    if (query.isFetching) return;

    if (isActivatedStatus(query.data)) {
      setIsPolling(false);
      pollAttemptsRef.current = 0;
      stripCheckoutQueryParam();
      const key = query.data?.plan_lookup_key ?? "";
      const planLabel = key.includes("solo")
        ? "Solo"
        : key.includes("studio")
          ? "Studio"
          : null;
      toast.success(planLabel ? `Plano ${planLabel} ativo. Aproveite!` : "Plano ativo. Aproveite!");
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

  const portalMutation = useMutation({
    mutationFn: billingService.createPortalSession,
    onSuccess: ({ url }) => {
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    },
    onError: (error) => {
      if (error instanceof PortalSessionError) {
        if (error.code === "no_billing_account") {
          queryClient.invalidateQueries({
            queryKey: BILLING_STATUS_QUERY_KEY,
          });
          toast(
            "Você ainda não possui uma assinatura. Inicie um plano para gerenciar a cobrança.",
          );
          return;
        }
        toast.error(
          "Não foi possível abrir o portal. Tente novamente em instantes.",
        );
        return;
      }
      toast.error(
        "Não foi possível abrir o portal. Tente novamente em instantes.",
      );
    },
  });

  const startPortal = useCallback(() => {
    portalMutation.mutate();
  }, [portalMutation]);

  const reload = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return {
    status: query.data,
    billingState: (query.data?.status as BillingState) || null,
    isLoading: query.isLoading,
    isPolling,
    pollTimedOut,
    isPortalPending: portalMutation.isPending,
    startPortal,
    reload,
  };
};
