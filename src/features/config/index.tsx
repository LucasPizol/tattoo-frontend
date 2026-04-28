import { ConfirmModal } from "@/components/ConfirmModal";
import { Form } from "@/components/Form";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { useSessionContext } from "@/context/useSession";
import { useTheme, type ThemeMode } from "@/context/ThemeContext";
import type { UserConfigForm } from "@/schemas/user-config";
import { api } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubscriptionCard } from "./components/SubscriptionCard";
import { useConfigForm } from "./hooks/useConfigForm";
import { PaymentMethodsContent } from "@/features/payment-methods/PaymentMethodsContent";
import { TagsContent } from "@/features/tags/TagsContent";
import { CategoriesContent } from "@/features/categories/CategoriesContent";
import styles from "./styles.module.scss";
import { Select } from "@/components/ui/Select";

const GeralTab = () => {
  const [confirmation, setConfirmation] = useState("");
  const form = useConfigForm();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { session, updateUserConfig } = useSessionContext();
  const queryClient = useQueryClient();

  const onSubmit = async (data: UserConfigForm) => {
    await updateUserConfig(data);

    await queryClient.invalidateQueries({
      predicate: (query) =>
        typeof query.queryKey?.[0] === "string" &&
        query.queryKey[0].toLowerCase().includes("products"),
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.reset({
        product_percentage_variation:
          session.user.config.productPercentageVariation,
      });
    }
  }, [session?.user]);

  return (
    <div className={styles.configContainer}>
      <Card title="Aparência">
        <div className={styles.themeRow}>
          <Select
            label="Tema da interface"
            options={[
              { label: "Escuro (padrão)", value: "dark" },
              { label: "Claro", value: "light" },
              { label: "Seguir o sistema", value: "system" },
            ]}
            value={theme}
            onSelect={(option) => setTheme(option.value as ThemeMode)}
          />
        </div>
        <p className={styles.themeHint}>
          Aplicado agora:{" "}
          {resolvedTheme === "dark" ? "modo escuro" : "modo claro"}.
        </p>
      </Card>
      <Card title="Configurações">
        <Form onSubmit={onSubmit} form={form} className={styles.form}>
          <Input
            field="product_percentage_variation"
            label="Porcentagem de variação de preço de produtos"
            type="number"
            className={styles.input}
            suffixIcon={
              <ConfirmModal
                title="Aplicar preço"
                onSave={async () => {
                  await api.post("/api/company_config/apply_price");
                }}
                trigger={
                  <Button variant="secondary" size="small" type="button">
                    Aplicar preço a todos os produtos
                  </Button>
                }
                disabled={confirmation !== "aplicar preco"}
              >
                <p>Tem certeza que deseja aplicar o preço?</p>
                <br />
                <p>
                  <strong>
                    A porcentagem de{" "}
                    {form.getValues("product_percentage_variation")}% será
                    aplicada a todos os produtos, e isso não poderá ser
                    desfeito.
                  </strong>
                </p>
                <br />
                <p>
                  Digite <b>aplicar preco</b> para confirmar
                </p>
                <br />
                <Input
                  label="Confirmação"
                  type="text"
                  field="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                />
              </ConfirmModal>
            }
          />
          <Button
            type="submit"
            variant="primary"
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
          >
            Salvar
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export const Config = () => (
  <PageWrapper title="Configurações">
    <Tabs>
      <Tabs.Tab label="Geral">
        <GeralTab />
      </Tabs.Tab>
      <Tabs.Tab label="Conta">
        <SubscriptionCard />
      </Tabs.Tab>
      <Tabs.Tab label="Financeiro">
        <PaymentMethodsContent />
      </Tabs.Tab>
      <Tabs.Tab label="Categorias">
        <CategoriesContent />
      </Tabs.Tab>
      <Tabs.Tab label="Tags">
        <TagsContent />
      </Tabs.Tab>
    </Tabs>
  </PageWrapper>
);
