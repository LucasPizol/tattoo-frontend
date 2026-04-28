import { api } from "@/services/api";

export type OnboardingStepName =
  | "first_client"
  | "first_product"
  | "first_appointment"
  | "team";

export type OnboardingStatusResponse = {
  completed_at: string | null;
  steps: {
    first_client: { completed: boolean; completed_at: string | null };
    first_product: { completed: boolean; completed_at: string | null };
    first_appointment: { completed: boolean; completed_at: string | null };
    team: { completed: boolean; completed_at: string | null };
  };
};

export const getOnboardingStatus = (): Promise<OnboardingStatusResponse> =>
  api.get<OnboardingStatusResponse>("/api/onboarding/status");

export const completeOnboardingStep = (
  stepName: OnboardingStepName,
): Promise<{ completed: boolean; completed_at: string }> =>
  api.post(`/api/onboarding/steps/${stepName}/complete`, {});

export const completeOnboarding = (): Promise<{ completed_at: string }> =>
  api.post("/api/onboarding/complete", {});
