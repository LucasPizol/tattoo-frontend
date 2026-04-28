/**
 * NOTE: Vitest is not yet configured in this repo (WI#3.2). Authored
 * against vitest + React Testing Library; serves as executable spec
 * for the WI#5 frontend gate brief §2.6 + §2.7. Highest-signal case
 * is the "already on /configuracoes" guard — that prevents the
 * post-checkout polling infinite-loop trap.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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
import { BillingGate } from "./index";

const mockedService = billingService as unknown as {
  getBillingStatus: ReturnType<typeof vi.fn>;
};

const ConfigPage = () => <div data-testid="config-page">Configurações</div>;
const AgendaPage = () => <div data-testid="agenda-page">Agenda</div>;

const renderWithRouter = (initialPath: string) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const tree = (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialPath]}>
        <BillingGate>
          <Routes>
            <Route path="/configuracoes" element={<ConfigPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
          </Routes>
        </BillingGate>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(tree);
};

const response = (billing_state: string) => ({
  has_active_subscription: false,
  status: billing_state === "no_subscription" ? null : billing_state,
  billing_state,
  plan_lookup_key: null,
  current_period_end: null,
  trial_end: null,
  cancel_at_period_end: null,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BillingGate — hard block", () => {
  it("redirects to /configuracoes when hard_block on /agenda", async () => {
    mockedService.getBillingStatus.mockResolvedValue(
      response("no_subscription"),
    );

    renderWithRouter("/agenda");

    await waitFor(() => {
      expect(screen.getByTestId("config-page")).toBeInTheDocument();
    });
    expect(screen.queryByTestId("agenda-page")).not.toBeInTheDocument();
  });

  it("does NOT redirect when hard_block AND already on /configuracoes (loop guard)", async () => {
    mockedService.getBillingStatus.mockResolvedValue(
      response("no_subscription"),
    );

    renderWithRouter("/configuracoes");

    await waitFor(() => {
      expect(screen.getByTestId("config-page")).toBeInTheDocument();
    });
    // Critical invariant: rendering /configuracoes must NOT bounce us
    // through Navigate again. This is the post-checkout polling
    // anti-loop guard from brief §2.7.
  });
});

describe("BillingGate — soft block", () => {
  it("renders banner AND children on past_due", async () => {
    mockedService.getBillingStatus.mockResolvedValue(response("past_due"));

    renderWithRouter("/agenda");

    await waitFor(() => {
      expect(screen.getByTestId("agenda-page")).toBeInTheDocument();
    });
    expect(screen.getByText("Pagamento pendente")).toBeInTheDocument();
  });
});
