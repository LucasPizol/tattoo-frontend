/**
 * NOTE: Vitest is not yet configured in this repo. These tests are
 * authored against the vitest API and React Testing Library and will
 * run as soon as `vitest`, `@testing-library/react`, and `jsdom` are
 * installed and wired through a `vitest.config.ts`. They serve as
 * executable spec for the SubscriptionCard state machine described in
 * WI#3 brief §4.
 */
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import toast from "react-hot-toast";

import {
  CheckoutSessionError,
  PortalSessionError,
} from "@/services/requests/billing";

vi.mock("@/services/requests/billing", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/requests/billing")>(
      "@/services/requests/billing",
    );
  return {
    ...actual,
    billingService: {
      createCheckoutSession: vi.fn(),
      createPortalSession: vi.fn(),
      getBillingStatus: vi.fn(),
    },
    createCheckoutSession: vi.fn(),
    createPortalSession: vi.fn(),
    getBillingStatus: vi.fn(),
  };
});

vi.mock("react-hot-toast", () => {
  const fn = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });
  return { default: fn };
});

import { billingService } from "@/services/requests/billing";
import { useSubscription, BILLING_STATUS_QUERY_KEY } from "./useSubscription";

const mockedService = billingService as unknown as {
  createCheckoutSession: ReturnType<typeof vi.fn>;
  createPortalSession: ReturnType<typeof vi.fn>;
  getBillingStatus: ReturnType<typeof vi.fn>;
};

const buildWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

const setSearch = (search: string) => {
  window.history.replaceState({}, "", `/configuracoes${search}`);
};

const noSubscriptionResponse = {
  has_active_subscription: false,
  status: null,
  plan_lookup_key: null,
  current_period_end: null,
  trial_end: null,
  cancel_at_period_end: null,
  billing_state: "no_subscription" as const,
};

const trialingResponse = {
  has_active_subscription: true,
  status: "trialing" as const,
  plan_lookup_key: "rainbow_solo",
  current_period_end: "2026-05-11T00:00:00Z",
  trial_end: "2026-05-11T00:00:00Z",
  cancel_at_period_end: false,
  billing_state: "trialing" as const,
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  setSearch("");
});

afterEach(() => {
  vi.useRealTimers();
  setSearch("");
});

describe("useSubscription — initial fetch", () => {
  it("returns the no_subscription state once the query resolves", async () => {
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status?.has_active_subscription).toBe(false);
    expect(result.current.isPolling).toBe(false);
  });
});

describe("useSubscription — checkout=success polling", () => {
  it("kicks off polling on mount and stops when subscription activates", async () => {
    setSearch("?checkout=success");
    mockedService.getBillingStatus
      .mockResolvedValueOnce(noSubscriptionResponse)
      .mockResolvedValueOnce(noSubscriptionResponse)
      .mockResolvedValueOnce(trialingResponse);

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.isPolling).toBe(true));
    expect(toast.success).toHaveBeenCalledWith(
      "Pagamento confirmado. Estamos ativando sua conta...",
    );

    // tick the 2s interval twice
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    await waitFor(() =>
      expect(result.current.status?.has_active_subscription).toBe(true),
    );
    expect(result.current.isPolling).toBe(false);
    expect(toast.success).toHaveBeenCalledWith("Plano Solo ativo. Aproveite!");
    expect(window.location.search).not.toContain("checkout=success");
  });

  it("times out after 30s and exposes pollTimedOut", async () => {
    setSearch("?checkout=success");
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.isPolling).toBe(true));

    // 15 attempts * 2s = 30s
    for (let i = 0; i < 16; i += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2_000);
      });
    }

    await waitFor(() => expect(result.current.pollTimedOut).toBe(true));
    expect(result.current.isPolling).toBe(false);
  });
});

describe("useSubscription — checkout=cancelled", () => {
  it("toasts an informational message and strips the query param", async () => {
    setSearch("?checkout=cancelled");
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);

    renderHook(() => useSubscription(), { wrapper: buildWrapper() });

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith("Checkout cancelado."),
    );
    expect(window.location.search).not.toContain("checkout=cancelled");
  });
});

describe("useSubscription — startCheckout mutation", () => {
  it("redirects to the Stripe URL on success", async () => {
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);
    mockedService.createCheckoutSession.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_abc",
    });

    const originalLocation = window.location;
    // jsdom location is read-only; replace with mutable stub.
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, href: "" },
      writable: true,
    });

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await act(async () => {
      result.current.startCheckout();
    });

    await waitFor(() =>
      expect(window.location.href).toBe(
        "https://checkout.stripe.com/c/pay/cs_test_abc",
      ),
    );

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("on 409 already_subscribed, refetches status (does not toast error)", async () => {
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);
    mockedService.createCheckoutSession.mockRejectedValueOnce(
      new CheckoutSessionError("already_subscribed", 409),
    );

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.startCheckout();
    });

    await waitFor(() =>
      expect(mockedService.getBillingStatus).toHaveBeenCalledTimes(2),
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("on 422 price_unavailable, toasts the catalog-missing message", async () => {
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);
    mockedService.createCheckoutSession.mockRejectedValueOnce(
      new CheckoutSessionError("price_unavailable", 422),
    );

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await act(async () => {
      result.current.startCheckout();
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Plano indisponível no momento. Contate o suporte.",
      ),
    );
  });

  it("on 502 stripe_unavailable, toasts the retry message", async () => {
    mockedService.getBillingStatus.mockResolvedValue(noSubscriptionResponse);
    mockedService.createCheckoutSession.mockRejectedValueOnce(
      new CheckoutSessionError("stripe_unavailable", 502),
    );

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await act(async () => {
      result.current.startCheckout();
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível iniciar o checkout. Tente novamente.",
      ),
    );
  });
});

describe("useSubscription — startPortal mutation", () => {
  it("redirects to the Stripe Portal URL on success", async () => {
    mockedService.getBillingStatus.mockResolvedValue(trialingResponse);
    mockedService.createPortalSession.mockResolvedValue({
      url: "https://billing.stripe.com/p/session/test_xyz",
    });

    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, href: "" },
      writable: true,
    });

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await act(async () => {
      result.current.startPortal();
    });

    await waitFor(() =>
      expect(window.location.href).toBe(
        "https://billing.stripe.com/p/session/test_xyz",
      ),
    );

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("on 422 no_billing_account, invalidates billing status and toasts the explanatory copy", async () => {
    mockedService.getBillingStatus.mockResolvedValue(trialingResponse);
    mockedService.createPortalSession.mockRejectedValueOnce(
      new PortalSessionError("no_billing_account", 422),
    );

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.startPortal();
    });

    // Re-fetch fired (invalidate triggers a refetch under the hood).
    await waitFor(() =>
      expect(mockedService.getBillingStatus).toHaveBeenCalledTimes(2),
    );
    expect(toast).toHaveBeenCalledWith(
      "Você ainda não possui uma assinatura. Inicie um plano para gerenciar a cobrança.",
    );
    expect(BILLING_STATUS_QUERY_KEY).toEqual(["billing", "status"]);
  });

  it("on 502 stripe_unavailable, toasts the generic retry message", async () => {
    mockedService.getBillingStatus.mockResolvedValue(trialingResponse);
    mockedService.createPortalSession.mockRejectedValueOnce(
      new PortalSessionError("stripe_unavailable", 502),
    );

    const { result } = renderHook(() => useSubscription(), {
      wrapper: buildWrapper(),
    });

    await act(async () => {
      result.current.startPortal();
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível abrir o portal. Tente novamente em instantes.",
      ),
    );
  });
});
