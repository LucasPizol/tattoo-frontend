import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/Form";
import { Input } from "@/components/ui/Input";
import {
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useAcceptInviteForm } from "@/features/accept-invite/hooks/useAcceptInviteForm";
import styles from "./styles.module.scss";

export const AcceptInvite = () => {
  const { form, onSubmit } = useAcceptInviteForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🌈</span>
          <h1 className={styles.title}>Criar sua conta</h1>
          <p className={styles.subtitle}>
            Você foi convidado! Preencha os dados abaixo para ativar seu acesso.
          </p>
        </div>

        <Form className={styles.form} form={form} onSubmit={onSubmit}>
          <Input
            field="name"
            type="text"
            label="Nome completo"
            prefixIcon={<MdPerson />}
            error={form.formState.errors.name?.message}
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

          <Button type="submit" loading={form.formState.isSubmitting}>
            Aceitar convite
          </Button>
        </Form>
      </div>
    </div>
  );
};
