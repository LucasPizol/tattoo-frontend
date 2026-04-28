import { AxiosError } from "axios";
import { api } from "@/services/api";
import { type BillingStatus, billingStatusSchema } from "@/schemas/billing";
import type {
  BillingState,
  CheckoutErrorCode,
  PortalErrorCode,
} from "./types";

export type { BillingState, CheckoutErrorCode, PortalErrorCode };

export class CheckoutSessionError extends Error {
  readonly code: CheckoutErrorCode;
  readonly status: number | null;

  constructor(
    code: CheckoutErrorCode,
    status: number | null,
    message?: string,
  ) {
    super(message ?? code);
    this.name = "CheckoutSessionError";
    this.code = code;
    this.status = status;
  }
}

export class PortalSessionError extends Error {
  readonly code: PortalErrorCode;
  readonly status: number | null;

  constructor(code: PortalErrorCode, status: number | null, message?: string) {
    super(message ?? code);
    this.name = "PortalSessionError";
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

const mapStatusToPortalCode = (
  status: number | undefined,
): PortalErrorCode => {
  switch (status) {
    case 422:
      return "no_billing_account";
    case 502:
      return "stripe_unavailable";
    default:
      return "unknown";
  }
};

export const createPortalSession = async (): Promise<{ url: string }> => {
  try {
    const response = await api.post<{ url: string }>(
      "/api/billing/portal_session",
      {},
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const code = mapStatusToPortalCode(status);
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;
      throw new PortalSessionError(code, status ?? null, message);
    }
    throw new PortalSessionError("unknown", null, (error as Error)?.message);
  }
};

export const getBillingStatus = async (): Promise<BillingStatus> => {
  const raw = await api.get<unknown>("/api/billing/status");
  return billingStatusSchema.parse(raw);
};

// Parse PlanPrice data from billing status response
export interface ParsedPlanPrices {
  [planName: string]: {
    monthly?: { lookupKey: string; unitAmount: number };
    yearly?: { lookupKey: string; unitAmount: number };
  };
}

export const billingService = {
  createPortalSession,
  getBillingStatus,
};

export const createEmbeddedCheckoutSession = async (
  priceLookupKey: string,
  returnUrl: string,
): Promise<{ client_secret: string }> => {
  try {
    const response = await api.post<{ client_secret: string }>(
      "/api/billing/checkout_session",
      { price_lookup_key: priceLookupKey, return_url: returnUrl, ui_mode: "embedded" },
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
