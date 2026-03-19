import { Form } from "@/components/Form";
import { cn } from "@/utils/cn";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { MdFilterList } from "react-icons/md";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useModal } from "../ui/Modal/useModal";
import styles from "./styles.module.scss";

type FiltersCardProps<T extends FieldValues> = {
  onFinishFilters: (filters: T) => void;
  form: UseFormReturn<T>;
  children: React.ReactNode;
  alignItems?: "flex-end" | "flex-start" | "center";
  className?: string;
  popupContent?: React.ReactNode;
};

export const FiltersCard = <T extends FieldValues>({
  onFinishFilters,
  form,
  children,
  alignItems = "flex-end",
  className,
  popupContent,
}: FiltersCardProps<T>) => {
  const { open, close, modalProps } = useModal<T>({
    onSubmit: (data) => {
      onFinishFilters(data as T);
      close();
    },
  });

  return (
    <Form
      className={cn(styles.filters, className)}
      style={{ alignItems }}
      onSubmit={(data) => {
        onFinishFilters(data as T);
      }}
      form={form}
    >
      {children}

      {!!popupContent && (
        <>
          <Button
            variant="secondary"
            prefixIcon={<MdFilterList />}
            size="medium"
            type="button"
            onClick={() => open()}
          >
            Filtros
          </Button>
          <Modal
            {...modalProps}
            title="Selecione os filtros"
            submitLabel="Aplicar"
            form={form}
          >
            {popupContent}
          </Modal>
        </>
      )}
    </Form>
  );
};
