import { api } from "@/services/api";

export type OnboardingStepName =
  | "whatsapp"
  | "first_client"
  | "first_order"
  | "instagram"
  | "team";

export type OnboardingStatusResponse = {
  completed_at: string | null;
  steps: {
    whatsapp: { completed: boolean; completed_at: string | null };
    first_client: { completed: boolean; completed_at: string | null };
    first_order: { completed: boolean; completed_at: string | null };
    instagram: { completed: boolean; completed_at: string | null };
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
