import { useClient } from "@/features/clients/hooks/useClient";
import { PartialAddClient } from "@/features/order/components/PartialAddClient";
import { ClientSchema, type ClientForm } from "@/schemas/client";
import { api } from "@/services/api";
import type { Client, ClientShowResponse } from "@/features/clients/types";
import { masks } from "@/utils/masks";
import { showError } from "@/utils/show-error";
import { useCallback, useMemo } from "react";
import { PopoverInputWrapper } from "../PopoverInputWrapper";
import { SearchableSelect } from "../SearchableSelect";
import { Button } from "../ui/Button";
import { useModal } from "../ui/Modal/useModal";
import styles from "./styles.module.scss";

type ClientSelectorProps = {
  value?: { id: number; name: string };
  onChange: (client?: { id: number; name: string }) => void | Promise<void>;
  placeholder?: string;
  label?: string;
  selectCondition?: (client: Client) => boolean;
  disabled?: boolean;
  disabledHelperText?: string;
  uncreatable?: boolean;
  link?: {
    to: string;
    label: string;
  };
  isLoading?: boolean;
};

export const ClientSelector = ({
  value,
  onChange,
  placeholder,
  label,
  selectCondition,
  disabled,
  disabledHelperText,
  isLoading,
  uncreatable = false,
  link,
}: ClientSelectorProps) => {
  const { modalProps, open, form } = useModal<ClientForm, Client>({
    onSubmit: async (data) => {
      await onSaveClient(data);
    },
    schema: ClientSchema.schema,
    initialValues: ClientSchema.defaultValues,
  });

  const onSaveClient = useCallback(
    async (data: ClientForm) => {
      try {
        const newClient = await api.post<ClientShowResponse>("/api/clients", {
          client: {
            name: data.name,
            phone: masks.formatPhone(data.phone || ""),
            cpf: masks.formatCpf(data.cpf || ""),
            birth_date: data.birthDate,
            gender: data.gender,
            indicated_by_id: data.indicatedBy?.id,
          },
        });

        await onChange?.({
          id: newClient.client.id,
          name: newClient.client.name,
        });
      } catch (error) {
        showError(error, form);
        throw error;
      }
    },
    [form]
  );

  const {
    clients: clientsData,
    isLoading: isLoadingClients,
    onFinishFilters,
  } = useClient({
    enableOnMount: true,
  });

  const clientsOptions = useMemo(() => {
    const clients = clientsData || [];

    const filteredClients = selectCondition
      ? clients.filter(selectCondition)
      : clients;

    const options = filteredClients.map((client) => ({
      label: client.name,
      value: client.id,
    }));

    if (value?.id) {
      options.unshift({
        label: value.name,
        value: value.id,
      });
    }

    return options;
  }, [clientsData, value, selectCondition]);

  return (
    <>
      <PopoverInputWrapper
        disabledHelperText={disabledHelperText}
        disabled={disabled}
      >
        <SearchableSelect
          label={label || "Selecione um cliente"}
          placeholder={placeholder || "Selecione um cliente"}
          disabled={disabled}
          isLoading={isLoading || isLoadingClients}
          options={clientsOptions || []}
          value={value?.id}
          link={link}
          mask={(value) => {
            return isNaN(Number(value?.[0])) ? value : masks.formatCpf(value);
          }}
          onSelect={async ({ value, label }) => {
            await onChange?.({
              id: value,
              name: label,
            });
          }}
          onSearch={async (value) => {
            await onFinishFilters({
              name_or_email_or_phone_cont: value,
            });
          }}
          className={styles.select}
          createItem={
            uncreatable
              ? undefined
              : (searchTerm) => (
                <Button
                  onClick={() =>
                    open({
                      name: isNaN(Number(searchTerm[0]))
                        ? searchTerm
                        : undefined,
                      cpf: isNaN(Number(searchTerm[0]))
                        ? undefined
                        : searchTerm,
                    })
                  }
                >
                  Adicionar Cliente Parcial
                </Button>
              )
          }
        />
      </PopoverInputWrapper>

      <PartialAddClient {...modalProps} />
    </>
  );
};
