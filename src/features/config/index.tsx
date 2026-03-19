import { ConfirmModal } from "@/components/ConfirmModal";
import { Form } from "@/components/Form";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useSessionContext } from "@/context/useSession";
import type { UserConfigForm } from "@/schemas/user-config";
import { api } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useConfigForm } from "./hooks/useConfigForm";
import styles from "./styles.module.scss";

export const Config = () => {
  const [confirmation, setConfirmation] = useState("");
  const form = useConfigForm();

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
        birth_date_discount_percentage:
          session.user.config.birthDateDiscountPercentage ?? 0,
        product_percentage_variation:
          session.user.config.productPercentageVariation,
      });
    }
  }, [session?.user]);

  return (
    <PageWrapper title="Configurações">
      <Card title="Configurações">
        <Form onSubmit={onSubmit} form={form} className={styles.form}>
          <Input
            field="birth_date_discount_percentage"
            label="Porcentagem de desconto de aniversário"
            type="number"
            className={styles.input}
          />
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
    </PageWrapper>
  );
};
