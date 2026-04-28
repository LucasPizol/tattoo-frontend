/**
 * NOTE: Vitest is not yet configured in this repo (filed as WI#3.2 in
 * the billing roadmap). This file is authored against the vitest API
 * + React Testing Library and will run as soon as the harness lands.
 * It serves as executable spec for the WI#5 frontend gate brief §4.
 */
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/requests/billing", async () => {
  const actual =
    await vi.importActual<typeof import("@/services/requests/billing")>(
      "@/services/requests/billing",
    );
  return {
    ...actual,
    billingService: {
      createPortalSession: vi.fn(),
      getBillingStatus: vi.fn(),
    },
  };
});

import { billingService } from "@/services/requests/billing";
import { useBillingGate } from "./useBillingGate";

const mockedService = billingService as unknown as {
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

const buildResponse = (billing_state: string) => ({
  has_active_subscription: billing_state === "trialing" || billing_state === "active",
  status: billing_state === "no_subscription" ? null : billing_state,
  billing_state,
  plan_lookup_key: "rainbow_solo",
  current_period_end: null,
  trial_end: null,
  cancel_at_period_end: null,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBillingGate — bucket mapping", () => {
  it("maps trialing to allow", async () => {
    mockedService.getBillingStatus.mockResolvedValue(buildResponse("trialing"));

    const { result } = renderHook(() => useBillingGate(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => {
      expect(result.current.billingState).toBe("trialing");
    });
    expect(result.current.accessBucket).toBe("allow");
  });

  it("maps past_due to soft_block", async () => {
    mockedService.getBillingStatus.mockResolvedValue(buildResponse("past_due"));

    const { result } = renderHook(() => useBillingGate(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => {
      expect(result.current.billingState).toBe("past_due");
    });
    expect(result.current.accessBucket).toBe("soft_block");
  });

  it("maps no_subscription to hard_block", async () => {
    mockedService.getBillingStatus.mockResolvedValue(
      buildResponse("no_subscription"),
    );

    const { result } = renderHook(() => useBillingGate(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => {
      expect(result.current.billingState).toBe("no_subscription");
    });
    expect(result.current.accessBucket).toBe("hard_block");
  });

  it("maps canceled to hard_block", async () => {
    mockedService.getBillingStatus.mockResolvedValue(buildResponse("canceled"));

    const { result } = renderHook(() => useBillingGate(), {
      wrapper: buildWrapper(),
    });

    await waitFor(() => {
      expect(result.current.billingState).toBe("canceled");
    });
    expect(result.current.accessBucket).toBe("hard_block");
  });
});
