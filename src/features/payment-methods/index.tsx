import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { Table } from "@/components/ui/Table";
import { useMobile } from "@/hooks/useMobile";
import type { PaymentMethod } from "./types";
import { masks } from "@/utils/masks";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { usePaymentMethodForm } from "./hooks/usePaymentMethodForm";
import { usePaymentMethodList } from "./hooks/usePaymentMethodList";
import styles from "./styles.module.scss";

export const PaymentMethods = () => {
  const isMobile = useMobile();
  const { paymentMethods, refetch, isLoading, form, onFinishFilters } =
    usePaymentMethodList();

  const { open, modalProps, handleDestroyPaymentMethod } =
    usePaymentMethodForm();

  const { open: openDestroyModal, modalProps: destroyModalProps } = useModal<
    PaymentMethod,
    PaymentMethod
  >({
    onSubmit: async (data) => {
      await handleDestroyPaymentMethod(data);
    },
  });

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (paymentMethod: PaymentMethod) => (
        <strong>{paymentMethod.name}</strong>
      ),
    },
    {
      key: "taxes",
      label: "Taxa",
      render: (paymentMethod: PaymentMethod) => {
        return `${paymentMethod.taxes.toFixed(2)}%`;
      },
    },
    {
      key: "createdAt",
      label: "Data de Cadastro",
      render: (paymentMethod: PaymentMethod) => {
        return new Date(paymentMethod.createdAt).toLocaleDateString("pt-BR");
      },
    },
    {
      key: "actions",
      label: isMobile ? " " : "Ações",
      align: "center" as const,
      maxWidth: isMobile ? "75px" : "120px",
      render: (paymentMethod: PaymentMethod) => {
        return (
          <div className={styles.actions}>
            <IconButton
              onClick={() =>
                open(
                  {
                    name: paymentMethod.name,
                    taxes: paymentMethod.taxes.toString(),
                  },
                  paymentMethod,
                )
              }
            >
              <MdEdit size={24} />
            </IconButton>
            <IconButton onClick={() => openDestroyModal(paymentMethod)}>
              <MdDelete size={24} />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Métodos de Pagamento"
      subtitle="Gerencie seus métodos de pagamento e mantenha as informações atualizadas"
      actions={<Button onClick={() => open()}>Novo Método de Pagamento</Button>}
    >
      <FiltersCard form={form} onFinishFilters={onFinishFilters}>
        <Input
          field="name_cont"
          placeholder="Digite"
          label="Buscar métodos de pagamento..."
          prefixIcon={<MdSearch />}
          className={styles.searchInput}
          onDebounceChange={async (value) => {
            onFinishFilters({
              name_cont: value,
            });
          }}
        />
      </FiltersCard>
      <Table
        columns={columns}
        data={paymentMethods || []}
        loading={isLoading}
      />

      <Modal {...destroyModalProps} title="Excluir Método de Pagamento">
        <p>Tem certeza que deseja excluir este método de pagamento?</p>
      </Modal>

      <Modal {...modalProps} title="Novo Método de Pagamento">
        <Input
          field="name"
          label="Nome"
          placeholder="Nome do método de pagamento"
        />
        <Input
          field="taxes"
          label="Impostos"
          mask={masks.formatPercentage}
          placeholder="Taxa sobre o método de pagamento"
        />
      </Modal>
    </PageWrapper>
  );
};
