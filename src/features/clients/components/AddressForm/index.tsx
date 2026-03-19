import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchAddressByZipCode } from "@/features/shared/http/queries/addressQuery";
import { masks } from "@/utils/masks";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdDelete, MdLocationOn } from "react-icons/md";
import styles from "./styles.module.scss";

type AddressFormProps = {
  index: number;
  // biome-ignore lint/suspicious/noExplicitAny: form type is complex
  form: UseFormReturn<any>;
  onRemove: () => void;
  canRemove: boolean;
  isLoading?: boolean;
};

export const AddressForm = ({
  index,
  form,
  onRemove,
  canRemove,
  isLoading,
}: AddressFormProps) => {
  const fieldPrefix = `addresses.${index}` as const;

  const onSearchAddress = async (zipCode: string) => {
    try {
      const response = await fetchAddressByZipCode(zipCode);
      form.setValue(`${fieldPrefix}.street`, response.logradouro);
      form.setValue(`${fieldPrefix}.neighborhood`, response.bairro);
      form.setValue(`${fieldPrefix}.city`, response.localidade);
      form.setValue(`${fieldPrefix}.state`, response.uf);
      form.setValue(`${fieldPrefix}.complement`, response.complemento);
      form.setValue(`${fieldPrefix}.number`, "");
    } catch (error) {
      toast.error("Erro ao buscar endereço");
    }
  };

  const addressErrors = form.formState.errors.addresses;

  return (
    <div className={styles.addressCard}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <MdLocationOn size={18} />
          <span>Endereço {index + 1}</span>
        </div>
        {canRemove && (
          <Button
            variant="secondary"
            type="button"
            onClick={onRemove}
            className={styles.removeButton}
          >
            <MdDelete size={18} />
            Remover
          </Button>
        )}
      </div>

      <div className={styles.grid}>
        <Input
          label="CEP"
          placeholder="00000-000"
          field={`${fieldPrefix}.zipCode`}
          mask={masks.formatCep}
          onDebounceChange={onSearchAddress}
          loading={isLoading}
        />
        <Input
          label="Rua"
          placeholder="Rua"
          field={`${fieldPrefix}.street`}
          loading={isLoading}
        />
        <Input
          label="Número"
          placeholder="Número"
          field={`${fieldPrefix}.number`}
          loading={isLoading}
        />
        <Input
          label="Complemento"
          placeholder="Complemento"
          field={`${fieldPrefix}.complement`}
          loading={isLoading}
        />
        <Input
          label="Bairro"
          placeholder="Bairro"
          field={`${fieldPrefix}.neighborhood`}
          loading={isLoading}
        />
        <Input
          label="Cidade"
          placeholder="Cidade"
          field={`${fieldPrefix}.city`}
          loading={isLoading}
        />
        <Input
          label="Estado"
          placeholder="Estado"
          field={`${fieldPrefix}.state`}
          loading={isLoading}
        />
      </div>

      <div className={styles.errors}>
        {addressErrors && (
          <Alert type="error">
            {addressErrors.message as string}
          </Alert>
        )}
      </div>
    </div>
  );
};
