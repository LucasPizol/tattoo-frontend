/**
 * NOTE: Vitest is not yet configured in this repo. These tests are
 * authored against the vitest API (`vi.mock`, `it`, `expect`, etc.) and
 * will run as soon as vitest + @testing-library/react are installed and
 * a `vitest.config.ts` is added. Until then they serve as executable
 * spec for the service layer.
 *
 * To enable: `bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom`
 * and add `test: { environment: "jsdom" }` to vite config.
 */
import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  CheckoutSessionError,
  createCheckoutSession,
  getBillingStatus,
} from ".";
import { api } from "@/services/api";

vi.mock("@/services/api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockedApi = api as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

const buildAxiosError = (
  status: number,
  payload: Record<string, unknown> = {},
): AxiosError => {
  const error = new AxiosError("Request failed");
  error.response = {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() } as never,
    data: payload,
  };
  return error;
};

describe("services/billing.createCheckoutSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the URL on success", async () => {
    mockedApi.post.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });

    const result = await createCheckoutSession();

    expect(result.url).toBe("https://checkout.stripe.com/c/pay/cs_test_123");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/billing/checkout_session",
      {},
    );
  });

  it("maps 409 to already_subscribed", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(409));

    await expect(createCheckoutSession()).rejects.toMatchObject({
      name: "CheckoutSessionError",
      code: "already_subscribed",
      status: 409,
    });
  });

  it("maps 422 to price_unavailable", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(422));

    await expect(createCheckoutSession()).rejects.toMatchObject({
      code: "price_unavailable",
      status: 422,
    });
  });

  it("maps 502 to stripe_unavailable", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(502));

    await expect(createCheckoutSession()).rejects.toMatchObject({
      code: "stripe_unavailable",
      status: 502,
    });
  });

  it("maps unknown statuses to unknown", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(418));

    await expect(createCheckoutSession()).rejects.toMatchObject({
      code: "unknown",
    });
  });

  it("wraps non-axios errors as CheckoutSessionError(unknown)", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("network blip"));

    await expect(createCheckoutSession()).rejects.toBeInstanceOf(
      CheckoutSessionError,
    );
  });
});

describe("services/billing.getBillingStatus", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("parses a fully populated trialing response", async () => {
    mockedApi.get.mockResolvedValueOnce({
      has_active_subscription: true,
      status: "trialing",
      plan_lookup_key: "rainbow_solo",
      current_period_end: "2026-05-11T00:00:00Z",
      trial_end: "2026-05-11T00:00:00Z",
      cancel_at_period_end: false,
    });

    const result = await getBillingStatus();

    expect(result.has_active_subscription).toBe(true);
    expect(result.status).toBe("trialing");
    expect(result.plan_lookup_key).toBe("rainbow_solo");
  });

  it("parses an empty response (no subscription)", async () => {
    mockedApi.get.mockResolvedValueOnce({
      has_active_subscription: false,
      status: null,
      plan_lookup_key: null,
      current_period_end: null,
      trial_end: null,
      cancel_at_period_end: null,
    });

    const result = await getBillingStatus();

    expect(result.has_active_subscription).toBe(false);
    expect(result.status).toBeNull();
  });

  it("rejects malformed payloads at the schema layer", async () => {
    mockedApi.get.mockResolvedValueOnce({
      has_active_subscription: "yes", // wrong type
      status: "trialing",
    });

    await expect(getBillingStatus()).rejects.toThrow();
  });
});
