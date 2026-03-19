import { Form } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { Input } from "@/components/ui/Input";
import { useSessionContext } from "@/context/useSession";
import { useState } from "react";
import {
    MdLock,
    MdPerson,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useSessionForm } from "./hooks/useSessionForm";
import styles from "./styles.module.scss";

export const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { onSubmit, form } = useSessionForm();
  const { loginWithGoogle } = useSessionContext();

  const handleGoogleLogin = async (accessToken: string) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(accessToken);
    } finally {
      setGoogleLoading(false);
    }
  };

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
