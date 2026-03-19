import { Form } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { Input } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import { useSessionContext } from "@/context/useSession";
import type { GoogleNeedsCompanyInfo } from "@/features/session/http/mutations/googleMutations";
import { masks } from "@/utils/masks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdBusiness, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
import { useRegisterForm } from "./hooks/useRegisterForm";
import styles from "./styles.module.scss";

const googleCompanySchema = z.object({
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(18, "CNPJ inválido"),
});

type GoogleCompanyForm = z.infer<typeof googleCompanySchema>;

const STEPS = [{ label: "Empresa" }, { label: "Usuário" }];

export const Register = () => {
  const { form, step, nextStep, prevStep, onSubmit } = useRegisterForm();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleData, setGoogleData] = useState<GoogleNeedsCompanyInfo["google_data"] | null>(null);
  const { loginWithGoogle, completeGoogleRegistration } = useSessionContext();

  const googleCompanyForm = useForm<GoogleCompanyForm>({
    resolver: zodResolver(googleCompanySchema),
    defaultValues: { company_name: "", cnpj: "" },
  });

  const handleGoogleAuth = async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle(accessToken);
      if (result?.needs_company_info) {
        setGoogleData(result.google_data);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleCompanySubmit = async (data: GoogleCompanyForm) => {
    if (!googleData) return;
    await completeGoogleRegistration({
      company_name: data.company_name,
      cnpj: data.cnpj,
      name: googleData.name,
      email: googleData.email,
      google_uid: googleData.google_uid,
    });
  };

  if (googleData) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.icon}>🌈</span>
            <h1 className={styles.title}>Quase lá!</h1>
            <p className={styles.subtitle}>
              Olá, <strong>{googleData.name}</strong>! Só precisamos de mais algumas informações.
            </p>
          </div>

          <Form className={styles.form} onSubmit={handleGoogleCompanySubmit} form={googleCompanyForm}>
            <Input
              field="company_name"
              label="Nome da empresa"
              prefixIcon={<MdBusiness />}
              error={googleCompanyForm.formState.errors.company_name?.message}
              required
            />
            <Input
              field="cnpj"
              label="CNPJ"
              prefixIcon={<MdBusiness />}
              mask={masks.formatCnpj}
              error={googleCompanyForm.formState.errors.cnpj?.message}
              required
            />
            <div className={styles.actions}>
              <Button
                type="submit"
                disabled={googleCompanyForm.formState.isSubmitting}
                loading={googleCompanyForm.formState.isSubmitting}
              >
                Criar conta
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🌈</span>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Preencha os dados para começar</p>
        </div>

        <GoogleButton
          onSuccess={handleGoogleAuth}
          loading={googleLoading}
          label="Cadastrar com Google"
        />

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <Stepper steps={STEPS} currentStep={step} />

        <Form className={styles.form} onSubmit={onSubmit} form={form}>
          {step === 0 && (
            <>
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
              <div className={styles.actions}>
                <Button type="button" onClick={nextStep}>
                  Próximo
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
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
                <Button type="button" variant="secondary" onClick={prevStep}>
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}
                >
                  Criar conta
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className={styles.footer}>
          Já tem uma conta?
          <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
};
