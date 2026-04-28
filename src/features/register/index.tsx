import { Form } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import { PlanPicker } from "@/features/config/components/SubscriptionCard/PlanPicker";
import { FOCUS_OPTIONS } from "@/schemas/register";
import { masks } from "@/utils/masks";
import { useState } from "react";
import {
  MdBusiness,
  MdEmail,
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { EmbeddedCheckoutStep } from "./components/EmbeddedCheckoutStep";
import styles from "./styles.module.scss";

const STEPS = [
  { label: "Plano" },
  { label: "Conta" },
  { label: "Pagamento" },
];

const KNOWN_PLAN_PRICES = {
  solo: {
    monthly: { lookupKey: "rainbow_solo_monthly_brl", unitAmount: 7900 },
    yearly: { lookupKey: "rainbow_solo_yearly_brl", unitAmount: 79000 },
  },
  studio: {
    monthly: { lookupKey: "rainbow_studio_monthly_brl", unitAmount: 19900 },
    yearly: { lookupKey: "rainbow_studio_yearly_brl", unitAmount: 199000 },
  },
};

export const Register = () => {
  const { form, step, selectedLookupKey, selectPlan, nextStep, prevStep } =
    useRegisterForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountSubmit = async () => {
    setIsSubmitting(true);
    try {
      await nextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCheckoutStep = step === 2;

  return (
    <div className={styles.container}>
      <div className={isCheckoutStep ? styles.cardWide : styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🌈</span>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>
            {step === 0 && "Escolha o plano ideal para o seu studio"}
            {step === 1 && "Preencha seus dados para criar a conta"}
            {step === 2 && "Finalize com seus dados de pagamento"}
          </p>
        </div>

        {step === 0 && (
          <p className={styles.googleComingSoon}>
            Cadastro por Google em breve. Use e-mail e senha por enquanto.
          </p>
        )}

        <Stepper steps={STEPS} currentStep={step} />

        {step === 0 && (
          <>
            <PlanPicker
              prices={KNOWN_PLAN_PRICES}
              isLoading={false}
              onSelectPlan={selectPlan}
              isCheckoutPending={false}
              initialPlan="studio"
              initialInterval="monthly"
            />
            <div className={styles.footer}>
              Já tem uma conta?
              <Link to="/login">Entrar</Link>
            </div>
          </>
        )}

        {step === 1 && (
          <Form className={styles.form} onSubmit={() => {}} form={form}>
            <Input
              field="company_name"
              label="Nome da empresa"
              prefixIcon={<MdBusiness />}
              error={form.formState.errors.company_name?.message}
              required
            />
            <Input
              field="cnpj"
              label="CNPJ"
              prefixIcon={<MdBusiness />}
              mask={masks.formatCnpj}
              error={form.formState.errors.cnpj?.message}
              required
            />
            <div className={styles.focusGroup}>
              <span className={styles.focusLabel}>Foco do studio</span>
              <div className={styles.focusOptions}>
                {FOCUS_OPTIONS.map((opt) => (
                  <label key={opt.value} className={styles.focusOption}>
                    <input
                      type="radio"
                      value={opt.value}
                      {...form.register("focus")}
                      className={styles.focusRadio}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className={styles.focusHint}>
                Essa escolha define as tags sugeridas no começo. Não altera o
                preço do plano, não bloqueia nenhum recurso, e você pode editar
                tudo depois. Use "Ambos" se não tiver certeza.
              </p>
            </div>
            <Input
              field="full_name"
              label="Nome completo"
              prefixIcon={<MdPerson />}
              error={form.formState.errors.full_name?.message}
              required
            />
            <Input
              field="email"
              type="email"
              label="E-mail"
              prefixIcon={<MdEmail />}
              error={form.formState.errors.email?.message}
              required
            />
            <Input
              field="password"
              type={showPassword ? "text" : "password"}
              label="Senha"
              prefixIcon={<MdLock />}
              suffixIcon={
                showPassword ? (
                  <MdVisibilityOff
                    onClick={() => setShowPassword(false)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <MdVisibility
                    onClick={() => setShowPassword(true)}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
              error={form.formState.errors.password?.message}
              required
            />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleAccountSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Continuar
              </Button>
            </div>

            <div className={styles.footer}>
              Já tem uma conta?
              <Link to="/login">Entrar</Link>
            </div>
          </Form>
        )}

        {step === 2 && selectedLookupKey && (
          <EmbeddedCheckoutStep priceLookupKey={selectedLookupKey} />
        )}
      </div>
    </div>
  );
};
