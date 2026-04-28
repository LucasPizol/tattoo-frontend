import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeOnboarding,
  completeOnboardingStep,
  getOnboardingStatus,
  type OnboardingStepName,
} from "@/services/requests/onboarding";

export const ONBOARDING_STATUS_QUERY_KEY = ["onboarding", "status"] as const;

export const useOnboarding = () => {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ONBOARDING_STATUS_QUERY_KEY,
    queryFn: getOnboardingStatus,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["session"] });
  };

  const completeStepMutation = useMutation({
    mutationFn: (stepName: OnboardingStepName) =>
      completeOnboardingStep(stepName),
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: invalidate,
  });

  return {
    status: statusQuery.data,
    isLoadingStatus: statusQuery.isLoading,
    completeStep: (name: OnboardingStepName) =>
      completeStepMutation.mutate(name),
    completeStepAsync: (name: OnboardingStepName) =>
      completeStepMutation.mutateAsync(name),
    complete: () => completeMutation.mutate(),
    completeAsync: () => completeMutation.mutateAsync(),
    isCompletingStep: completeStepMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
};
