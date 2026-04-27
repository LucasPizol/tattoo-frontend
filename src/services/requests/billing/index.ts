import { AxiosError } from "axios";
import { api } from "@/services/api";
import {
  type BillingStatus,
  billingStatusSchema,
} from "@/schemas/billing";
import type { CheckoutErrorCode } from "./types";

export type { CheckoutErrorCode };

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

export const getBillingStatus = async (): Promise<BillingStatus> => {
  const raw = await api.get<unknown>("/api/billing/status");
  return billingStatusSchema.parse(raw);
};

export const billingService = {
  createCheckoutSession,
  getBillingStatus,
};
