import { AxiosError } from "axios";
import { api } from "@/services/api";
import {
  type BillingStatus,
  billingStatusSchema,
} from "@/schemas/billing";

/**
 * Typed error thrown by createCheckoutSession so the UI can branch
 * per the WI#3 state matrix (already_subscribed, price_unavailable,
 * stripe_unavailable, etc).
 */
export type CheckoutErrorCode =
  | "already_subscribed"
  | "price_unavailable"
  | "stripe_unavailable"
  | "unknown";

export class CheckoutSessionError extends Error {
  readonly code: CheckoutErrorCode;
  readonly status: number | null;

  constructor(code: CheckoutErrorCode, status: number | null, message?: string) {
    super(message ?? code);
    this.name = "CheckoutSessionError";
    this.code = code;
    this.status = status;
  }
}

const mapStatusToCode = (status: number | undefined): CheckoutErrorCode => {
  switch (status) {
    case 409:
      return "already_subscribed";
    case 422:
      return "price_unavailable";
    case 502:
      return "stripe_unavailable";
    default:
      return "unknown";
  }
};

/**
 * POST /api/billing/checkout_session
 *
 * Returns the Stripe-hosted Checkout URL for the current Company.
 * Body is intentionally empty for WI#3 (Solo monthly is the only price).
 *
 * Errors are normalized to a CheckoutSessionError with a typed `code`
 * the UI can switch on.
 */
export const createCheckoutSession = async (): Promise<{ url: string }> => {
  try {
    const response = await api.post<{ url: string }>(
      "/api/billing/checkout_session",
      {},
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const code = mapStatusToCode(status);
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;
      throw new CheckoutSessionError(code, status ?? null, message);
    }
    throw new CheckoutSessionError("unknown", null, (error as Error)?.message);
  }
};

/**
 * GET /api/billing/status
 *
 * Returns the (narrow) billing snapshot for the current Company.
 * Validated through zod so the UI never has to guess the shape.
 */
export const getBillingStatus = async (): Promise<BillingStatus> => {
  const raw = await api.get<unknown>("/api/billing/status");
  return billingStatusSchema.parse(raw);
};

export const billingService = {
  createCheckoutSession,
  getBillingStatus,
};
