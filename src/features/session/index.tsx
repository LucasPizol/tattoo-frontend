import { Form } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { Input } from "@/components/ui/Input";
import { useSessionContext } from "@/context/useSession";
import type { GoogleNeedsCompanyInfo } from "@/features/session/http/mutations/googleMutations";
import { masks } from "@/utils/masks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    MdBusiness,
    MdLock,
    MdPerson,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useSessionForm } from "./hooks/useSessionForm";
import styles from "./styles.module.scss";

const googleCompanySchema = z.object({
  company_name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(18, "CNPJ inválido"),
});

type GoogleCompanyForm = z.infer<typeof googleCompanySchema>;

export const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleData, setGoogleData] = useState<GoogleNeedsCompanyInfo["google_data"] | null>(null);
  const { onSubmit, form } = useSessionForm();
  const { loginWithGoogle, completeGoogleRegistration } = useSessionContext();

  const googleCompanyForm = useForm<GoogleCompanyForm>({
    resolver: zodResolver(googleCompanySchema),
    defaultValues: { company_name: "", cnpj: "" },
  });

  const handleGoogleLogin = async (accessToken: string) => {
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
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🌈</span>
            </div>
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
            <Button
              type="submit"
              disabled={googleCompanyForm.formState.isSubmitting}
              loading={googleCompanyForm.formState.isSubmitting}
            >
              Criar conta
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🌈</span>
          </div>
          <h1 className={styles.title}>Bem-vindo de volta</h1>
          <p className={styles.subtitle}>
            Entre com suas credenciais para continuar
          </p>
        </div>

        <GoogleButton
          onSuccess={handleGoogleLogin}
          loading={googleLoading}
          label="Entrar com Google"
        />

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <Form className={styles.form} onSubmit={onSubmit} form={form}>
          <Input
            field="username"
            type="text"
            label="Nome de usuário"
            prefixIcon={<MdPerson />}
            error={form.formState.errors.username?.message}
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
          />

          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkboxText}>Lembrar de mim</span>
            </label>
            <a href="#" className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
          >
            Entrar
          </Button>
        </Form>

        <p className={styles.registerLink}>
          Não tem uma conta?{" "}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
