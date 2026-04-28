import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useSessionContext } from "@/context/useSession";
import { useEntitlement } from "@/hooks/useEntitlement";
import {
  CheckoutSessionError,
  createOnboardingCheckoutSession,
  billingService,
} from "@/services/requests/billing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useOnboarding } from "./hooks/useOnboarding";
import type { OnboardingStepName } from "@/services/requests/onboarding";
import { BILLING_STATUS_QUERY_KEY } from "@/features/config/components/SubscriptionCard/useSubscription";
import styles from "./styles.module.scss";

type StepDef = {
  name: OnboardingStepName;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTarget: string;
  successNote?: string;
};

const BASE_STEPS: StepDef[] = [
  {
    name: "first_client",
    title: "Cadastre seu primeiro cliente",
    description: "Adicione um cliente para começar a agendar e vender.",
    ctaLabel: "Adicionar cliente",
    ctaTarget: "/clientes/novo",
  },
  {
    name: "first_product",
    title: "Cadastre seu primeiro produto",
    description: "Adicione um produto ou serviço ao catálogo do seu studio.",
    ctaLabel: "Adicionar produto",
    ctaTarget: "/produtos",
  },
  {
    name: "first_appointment",
    title: "Crie seu primeiro agendamento",
    description: "Agende uma sessão ou atendimento na sua agenda.",
    ctaLabel: "Abrir agenda",
    ctaTarget: "/agenda",
  },
];

const STUDIO_STEP: StepDef = {
  name: "team",
  title: "Convide sua equipe",
  description: "Adicione artistas e recepcionistas ao seu studio.",
  ctaLabel: "Convidar artista",
  ctaTarget: "/equipe",
};

const ProgressBar = ({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) => (
  <div className={styles.progressWrapper}>
    <div className={styles.progressSegments}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`${styles.progressSegment} ${i < completed ? styles.progressSegmentFilled : ""}`}
        />
      ))}
    </div>
    <Typography.Caption className={styles.progressLabel}>
      {completed} de {total}
    </Typography.Caption>
  </div>
);

const TrialCTACard = () => {
  const queryClient = useQueryClient();
  const { data: billingStatus, isLoading } = useQuery({
    queryKey: BILLING_STATUS_QUERY_KEY,
    queryFn: billingService.getBillingStatus,
  });

  const checkoutMutation = useMutation({
    mutationFn: createOnboardingCheckoutSession,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => {
      if (error instanceof CheckoutSessionError) {
        if (error.code === "already_subscribed") {
          queryClient.invalidateQueries({ queryKey: BILLING_STATUS_QUERY_KEY });
          return;
        }
        if (error.code === "price_unavailable") {
          toast.error("Plano indisponível no momento. Contate o suporte.");
          return;
        }
      }
      toast.error("Não foi possível iniciar o checkout. Tente novamente.");
    },
  });

  if (isLoading) return null;

  const isActive =
    billingStatus?.has_active_subscription &&
    (billingStatus.status === "active" || billingStatus.status === "trialing");

  if (isActive) {
    return (
      <div className={styles.trialCard}>
        <div className={styles.trialCardActive}>
          <MdCheckCircle size={20} color="var(--color-success, #22c55e)" />
          <Typography.Body2>Plano ativo. Aproveite o Rainbow!</Typography.Body2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.trialCard}>
      <div className={styles.trialCardContent}>
        <Typography.Body1 className={styles.trialTitle}>
          Teste gratuito de 14 dias com acesso completo ao Studio
        </Typography.Body1>
        <Typography.Body2 className={styles.trialDescription}>
          Adicione um cartão para continuar após o teste.
        </Typography.Body2>
        <Button
          onClick={() => checkoutMutation.mutate()}
          loading={checkoutMutation.isPending}
          size="small"
        >
          Ativar plano
        </Button>
      </div>
    </div>
  );
};

type StepCardProps = {
  step: StepDef;
  completed: boolean;
  skipped: boolean;
  onSkip: () => void;
};

const StepCard = ({ step, completed, skipped, onSkip }: StepCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.stepCard} ${completed ? styles.stepCardCompleted : ""} ${skipped ? styles.stepCardSkipped : ""}`}
    >
      <div className={styles.stepCardIcon}>
        {completed ? (
          <MdCheckCircle size={24} color="var(--color-success, #22c55e)" />
        ) : (
          <MdRadioButtonUnchecked
            size={24}
            color="var(--color-text-muted, #9ca3af)"
          />
        )}
      </div>
      <div className={styles.stepCardBody}>
        <Typography.Body1
          className={`${styles.stepCardTitle} ${completed ? styles.stepCardTitleCompleted : ""}`}
        >
          {step.title}
        </Typography.Body1>
        {!completed && (
          <Typography.Body2 className={styles.stepCardDescription}>
            {step.description}
          </Typography.Body2>
        )}
        {step.successNote && completed && (
          <Typography.Caption className={styles.stepCardSuccessNote}>
            {step.successNote}
          </Typography.Caption>
        )}
      </div>
      {!completed && !skipped && (
        <div className={styles.stepCardActions}>
          <Button size="small" onClick={() => navigate(step.ctaTarget)}>
            {step.ctaLabel}
          </Button>
          <button type="button" className={styles.skipLink} onClick={onSkip}>
            Fazer depois
          </button>
        </div>
      )}
    </div>
  );
};

export const OnboardingPage = () => {
  const { session } = useSessionContext();
  const hasCommissions = useEntitlement("multi_artist_commissions");
  const { status, isLoadingStatus, completeAsync } = useOnboarding();
  const navigate = useNavigate();
  const [skipped, setSkipped] = useState<Set<OnboardingStepName>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const autoCompletedRef = useRef(false);

  const steps = hasCommissions ? [...BASE_STEPS, STUDIO_STEP] : BASE_STEPS;

  const completedCount = status
    ? steps.filter((s) => status.steps[s.name].completed).length
    : 0;

  const allDone =
    status !== undefined && steps.every((s) => status.steps[s.name].completed);

  useEffect(() => {
    if (!allDone || autoCompletedRef.current) return;
    autoCompletedRef.current = true;

    completeAsync()
      .then(() => {
        setCelebrating(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      })
      .catch(() => {
        autoCompletedRef.current = false;
        toast.error(
          "Não foi possível finalizar a configuração. Tente novamente.",
        );
      });
  }, [allDone, completeAsync, navigate]);

  if (!session.isAuthenticated) return null;

  const isAlreadyCompleted =
    session.company.onboarding_completed_at !== null && !celebrating;

  if (isAlreadyCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.completedState}>
          <MdCheckCircle size={48} color="var(--color-success, #22c55e)" />
          <Typography.Title level={2}>
            Configuração já concluída
          </Typography.Title>
          <Typography.Body1>
            Seu studio já está configurado e pronto para usar.
          </Typography.Body1>
          <Link to="/dashboard">
            <Button>Voltar para o painel</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (celebrating) {
    return (
      <div className={styles.container}>
        <div className={styles.celebrationState}>
          <Typography.Title level={2}>
            Tudo pronto! Seu studio está configurado.
          </Typography.Title>
          <Button onClick={() => navigate("/dashboard", { replace: true })}>
            Ir para o painel &rarr;
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TrialCTACard />

      <div className={styles.header}>
        <Typography.Title level={2}>
          Vamos configurar seu studio
        </Typography.Title>
        {!isLoadingStatus && (
          <ProgressBar total={steps.length} completed={completedCount} />
        )}
      </div>

      <div className={styles.steps}>
        {steps.map((step) => (
          <StepCard
            key={step.name}
            step={step}
            completed={status?.steps[step.name].completed ?? false}
            skipped={skipped.has(step.name)}
            onSkip={() => setSkipped((prev) => new Set([...prev, step.name]))}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.skipAll}
        onClick={() => {
          completeAsync()
            .then(() => navigate("/dashboard", { replace: true }))
            .catch(() => {
              toast.error(
                "Não foi possível finalizar a configuração. Tente novamente.",
              );
            });
        }}
      >
        Pular configuração
      </button>
    </div>
  );
};
