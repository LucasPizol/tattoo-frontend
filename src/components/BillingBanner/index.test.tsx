/**
 * NOTE: Vitest is not yet configured in this repo (WI#3.2). Authored
 * against vitest + React Testing Library; serves as executable spec
 * for the WI#5 frontend banner brief §2.6.
 */
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
  };
});

import { BillingBanner } from "./index";

const buildWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe("BillingBanner — copy table", () => {
  it("renders past_due headline + 'Gerenciar cobrança' CTA", () => {
    const Wrapper = buildWrapper();
    render(
      <Wrapper>
        <BillingBanner state="past_due" />
      </Wrapper>,
    );

    expect(screen.getByText("Pagamento pendente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atualize seu meio de pagamento para evitar suspensão.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gerenciar cobrança" }),
    ).toBeInTheDocument();
  });

  it("renders incomplete headline with NO CTA", () => {
    const Wrapper = buildWrapper();
    render(
      <Wrapper>
        <BillingBanner state="incomplete" />
      </Wrapper>,
    );

    expect(screen.getByText("Confirmando seu pagamento")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Acesso completo durante a confirmação. Pode levar até 3 dias úteis.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
