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
  PortalSessionError,
  createEmbeddedCheckoutSession,
  createPortalSession,
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

describe("services/billing.createEmbeddedCheckoutSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the client_secret on success", async () => {
    mockedApi.post.mockResolvedValueOnce({
      client_secret: "cs_test_secret_abc",
    });

    const result = await createEmbeddedCheckoutSession(
      "rainbow_solo_monthly_brl",
      "https://app.rainbow.com/register/return",
    );

    expect(result.client_secret).toBe("cs_test_secret_abc");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/billing/checkout_session",
      {
        price_lookup_key: "rainbow_solo_monthly_brl",
        return_url: "https://app.rainbow.com/register/return",
        ui_mode: "embedded",
      },
    );
  });

  it("maps 409 to already_subscribed", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(409));

    await expect(
      createEmbeddedCheckoutSession("rainbow_solo_monthly_brl", "https://app.rainbow.com/register/return"),
    ).rejects.toMatchObject({
      name: "CheckoutSessionError",
      code: "already_subscribed",
      status: 409,
    });
  });

  it("maps 422 to price_unavailable", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(422));

    await expect(
      createEmbeddedCheckoutSession("rainbow_solo_monthly_brl", "https://app.rainbow.com/register/return"),
    ).rejects.toMatchObject({
      code: "price_unavailable",
      status: 422,
    });
  });

  it("maps 502 to stripe_unavailable", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(502));

    await expect(
      createEmbeddedCheckoutSession("rainbow_solo_monthly_brl", "https://app.rainbow.com/register/return"),
    ).rejects.toMatchObject({
      code: "stripe_unavailable",
      status: 502,
    });
  });

  it("wraps non-axios errors as CheckoutSessionError(unknown)", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("network blip"));

    await expect(
      createEmbeddedCheckoutSession("rainbow_solo_monthly_brl", "https://app.rainbow.com/register/return"),
    ).rejects.toBeInstanceOf(CheckoutSessionError);
  });
});

describe("services/billing.createPortalSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the URL on success", async () => {
    mockedApi.post.mockResolvedValueOnce({
      url: "https://billing.stripe.com/p/session/test_abc",
    });

    const result = await createPortalSession();

    expect(result.url).toBe("https://billing.stripe.com/p/session/test_abc");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/api/billing/portal_session",
      {},
    );
  });

  it("maps 422 to no_billing_account", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(422));

    await expect(createPortalSession()).rejects.toMatchObject({
      name: "PortalSessionError",
      code: "no_billing_account",
      status: 422,
    });
  });

  it("instantiates a PortalSessionError on axios failure", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(502));

    await expect(createPortalSession()).rejects.toBeInstanceOf(
      PortalSessionError,
    );
  });

  it("maps 502 to stripe_unavailable", async () => {
    mockedApi.post.mockRejectedValueOnce(buildAxiosError(502));

    await expect(createPortalSession()).rejects.toMatchObject({
      name: "PortalSessionError",
      code: "stripe_unavailable",
      status: 502,
    });
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
