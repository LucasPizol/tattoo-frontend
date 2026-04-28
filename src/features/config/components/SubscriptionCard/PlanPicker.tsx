import { useState } from "react";
import { MdCheck, MdPerson, MdGroups, MdStarRate } from "react-icons/md";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";

type PlanOption = "solo" | "studio";
type BillingInterval = "monthly" | "yearly";

interface PlanPrice {
  lookupKey: string;
  unitAmount: number;
}

interface PlanPickerProps {
  prices?: Record<string, Record<string, PlanPrice>>;
  isLoading: boolean;
  onSelectPlan: (priceLookupKey: string) => void;
  isCheckoutPending: boolean;
  initialPlan?: PlanOption;
  initialInterval?: BillingInterval;
}

const PLANS = {
  solo: {
    label: "Solo",
    tagline: "Para o artista independente",
    icon: MdPerson,
    benefits: [
      "Agenda e agendamentos ilimitados",
      "Cadastro de clientes ilimitado",
      "Controle de pedidos e pagamentos",
      "Gestão de estoque",
      "Até 100 mensagens de confirmação no WhatsApp",
      "14 dias grátis para começar",
    ],
  },
  studio: {
    label: "Studio",
    tagline: "Para studios com equipe",
    icon: MdGroups,
    featured: true,
    benefits: [
      "Tudo do plano Solo",
      "Até 500 mensagens de confirmação no WhatsApp",
      "Comissões por artista com split configurável",
      "Roles e permissões por usuário",
      "Sincronização com Google Agenda",
      "Sorteios pelo Instagram",
      "Relatório de vendas com IA",
      "Prévia de tatuagens no cliente por IA (até 25 por mês)",
    ],
  },
} as const;

const formatPrice = (centAmount: number): string => {
  const reais = Math.floor(centAmount / 100);
  return `R$ ${reais.toLocaleString("pt-BR")}`;
};

const monthlyEquivalent = (yearlyCent: number): string => {
  const monthly = Math.floor(yearlyCent / 12 / 100);
  return `R$ ${monthly.toLocaleString("pt-BR")}`;
};

export const PlanPicker = ({
  prices,
  isLoading,
  onSelectPlan,
  isCheckoutPending,
  initialPlan,
  initialInterval = "yearly",
}: PlanPickerProps) => {
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | undefined>(initialPlan);

  if (isLoading) {
    return (
      <div className={styles.skeleton} aria-busy="true" aria-label="Carregando">
        <div className={styles.skeletonHeadline} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonButton} />
      </div>
    );
  }

  const soloMonthly = prices?.solo?.monthly;
  const soloYearly = prices?.solo?.yearly;
  const studioMonthly = prices?.studio?.monthly;
  const studioYearly = prices?.studio?.yearly;

  if (!prices || !soloMonthly) {
    return (
      <div className={styles.pickerError}>
        Planos indisponíveis no momento. Contate o suporte.
      </div>
    );
  }

  const handleSelect = (plan: PlanOption) => {
    const price =
      interval === "monthly" ? prices[plan]?.monthly : prices[plan]?.yearly;
    if (price?.lookupKey) {
      setSelectedPlan(plan);
      onSelectPlan(price.lookupKey);
    }
  };

  const planRows: Array<{
    key: PlanOption;
    monthly?: PlanPrice;
    yearly?: PlanPrice;
  }> = [
    { key: "solo", monthly: soloMonthly, yearly: soloYearly },
    { key: "studio", monthly: studioMonthly, yearly: studioYearly },
  ];

  return (
    <div className={styles.planPicker}>
      <div className={styles.intervalToggle} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={interval === "monthly"}
          className={cn(styles.intervalButton, {
            [styles.intervalButtonActive]: interval === "monthly",
          })}
          onClick={() => setInterval("monthly")}
        >
          Mensal
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={interval === "yearly"}
          className={cn(styles.intervalButton, {
            [styles.intervalButtonActive]: interval === "yearly",
          })}
          onClick={() => setInterval("yearly")}
        >
          Anual
          <span className={styles.intervalSavings}>−17%</span>
        </button>
      </div>

      <div className={styles.planCards}>
        {planRows.map((row) => {
          const meta = PLANS[row.key];
          const price = interval === "monthly" ? row.monthly : row.yearly;
          const Icon = meta.icon;
          const featured = "featured" in meta && meta.featured;
          const unavailable = !price;

          const isSelected = selectedPlan === row.key;

          return (
            <div
              key={row.key}
              className={cn(styles.planCard, {
                [styles.planCardFeatured]: featured,
                [styles.planCardSelected]: isSelected,
              })}
              aria-label={`Plano ${meta.label}`}
            >
              {featured && (
                <span className={styles.featuredBadge}>
                  <MdStarRate size={12} />
                  Mais popular
                </span>
              )}

              <header className={styles.planHeader}>
                <span className={styles.planIcon}>
                  <Icon size={20} />
                </span>
                <div>
                  <h4 className={styles.planTitle}>{meta.label}</h4>
                  <p className={styles.planTagline}>{meta.tagline}</p>
                </div>
              </header>

              <div className={styles.priceBlock}>
                {unavailable ? (
                  <p className={styles.unavailable}>Indisponível no momento</p>
                ) : (
                  <>
                    <span className={styles.priceValue}>
                      {interval === "monthly"
                        ? formatPrice(price.unitAmount)
                        : monthlyEquivalent(price.unitAmount)}
                    </span>
                    <span className={styles.priceSuffix}>/mês</span>
                    {interval === "yearly" && (
                      <span className={styles.priceFooter}>
                        Cobrado {formatPrice(price.unitAmount)}/ano
                      </span>
                    )}
                  </>
                )}
              </div>

              <ul className={styles.planBenefits}>
                {meta.benefits.map((b) => (
                  <li key={b}>
                    <MdCheck size={16} className={styles.benefitCheck} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={featured ? "secondary" : "primary"}
                fullWidth
                onClick={() => handleSelect(row.key)}
                loading={isCheckoutPending && isSelected}
                disabled={isCheckoutPending || unavailable}
              >
                {isSelected ? `Plano selecionado` : `Assinar ${meta.label}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
