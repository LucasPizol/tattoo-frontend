import {
  ClientFiltersSchema,
  type ClientFilters,
} from "@/schemas/client/filters";
import type { Client } from "@/features/clients/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useClientListQuery } from "../http/queries/clientQuery";
import { useDeleteClient } from "../http/mutations/clientMutations";

type UseClientProps = {
  enabled?: boolean;
  enableOnMount?: boolean;
};

export const useClient = ({
  enabled = true,
  enableOnMount = true,
}: UseClientProps = {}) => {
  const { mutateAsync: deleteClient, isPending: isDestroying } = useDeleteClient();

  const form = useForm<ClientFilters>({
    resolver: zodResolver(ClientFiltersSchema.schema),
    defaultValues: ClientFiltersSchema.defaultValues,
  });

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    onChangeFilters,
    filters,
    pagination,
  } = useClientListQuery({ enabled: enabled && enableOnMount });

  const onFinishFilters = useCallback(
    (filters: ClientFilters) => {
      const isCpf = !isNaN(Number(filters.name_or_email_or_phone_cont?.[0]));

      const filtersToSet = {
        ...filters,
        cpf_matches: isCpf
          ? filters.name_or_email_or_phone_cont?.replace(/\D/g, "")
          : undefined,
        name_or_email_or_phone_cont: isCpf
          ? undefined
          : filters.name_or_email_or_phone_cont || undefined,
        birthday_month_eq: filters.birthday_month_eq || undefined,
      };

      onChangeFilters(filtersToSet as ClientFilters);
    },
    [onChangeFilters],
  );

  const onDestroyClient = useCallback(
    async (client: Client) => {
      await deleteClient(client.id);
    },
    [deleteClient],
  );

  return {
    clients: data,
    isLoading: isLoading || isRefetching,
    pagination,
    refetch,
    onDestroyClient,
    isDestroying,
    form,
    onFinishFilters,
    filters,
  };
};
