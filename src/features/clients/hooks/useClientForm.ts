import { AddressSchema, type AddressForm } from "@/schemas/address";
import { ClientSchema } from "@/schemas/client";
import { ResponsibleSchema } from "@/schemas/responsible";
import { api } from "@/services/api";
import type { ClientShowResponse, ClientEditResponse } from "@/features/clients/types";
import { showError } from "@/utils/show-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useCreateClient, useUpdateClient } from "../http/mutations/clientMutations";
import { useDeleteAddress } from "@/features/shared/http/mutations/addressMutations";

const emptyAddress: AddressForm = {
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  complement: "",
};

export const useClientForm = (clientId?: number, isEditing = false) => {
  const navigate = useNavigate();
  const { mutateAsync: createClient } = useCreateClient();
  const { mutateAsync: updateClient } = useUpdateClient();
  const { mutateAsync: deleteAddress } = useDeleteAddress();

  const formSchema = ClientSchema.schema.extend({
    addresses: z.array(AddressSchema.schema),
    responsible: ResponsibleSchema.schema.optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...ClientSchema.defaultValues,
      addresses: [emptyAddress],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const { data: clientData, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () =>
      isEditing
        ? api.get<ClientEditResponse>(`/api/clients/${clientId!}/edit`)
        : api.get<ClientShowResponse>(`/api/clients/${clientId!}`),
    enabled: !!clientId,
  });

  const client = clientData?.client;

  const onSaveClient = async (data: FormData) => {
    const addresses = data.addresses?.map((addr) => ({
      id: addr.addressId,
      street: addr.street,
      number: addr.number,
      complement: addr.complement,
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
      zipcode: addr.zipCode,
    }));

    const clientPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      rg: data.rg,
      birth_date: data.birthDate,
      gender: data.gender,
      marital_status: data.maritalStatus,
      diabetes: data.diabetes,
      epilepsy: data.epilepsy,
      hemophilia: data.hemophilia,
      vitiligo: data.vitiligo,
      pacemaker: data.pacemaker,
      high_blood_pressure: data.highBloodPressure,
      low_blood_pressure: data.lowBloodPressure,
      disease_infectious_contagious: data.diseaseInfectiousContagious,
      healing_problems: data.healingProblems,
      allergic_reactions: data.allergicReactions,
      hypersensitivity_to_chemicals: data.hypersensitivityToChemicals,
      keloid_proneness: data.keloidProneness,
      hipoglycemia: data.hipoglycemia,
      instagram_profile: data.instagramProfile,
      indicated_by_id: data.indicatedBy?.id,
      observations: data.observations,
    };

    const responsiblePayload = data.responsible
      ? {
          name: data.responsible?.name,
          cpf: data.responsible?.cpf,
          rg: data.responsible?.rg,
          birth_date: data.responsible?.birthDate,
          gender: data.responsible?.gender,
          email: data.responsible?.email,
          phone: data.responsible?.phone,
        }
      : undefined;

    try {
      if (clientId) {
        await updateClient({
          id: clientId,
          payload: { client: clientPayload, responsible: responsiblePayload, addresses },
        });
      } else {
        await createClient({
          client: clientPayload,
          addresses,
          responsible: responsiblePayload,
        });
        navigate(`/clientes`);
      }
    } catch (error) {
      showError(error, form);
      throw error;
    }
  };

  const responsible = form.watch("responsible");

  const isResponsibleEmpty = useMemo(() => {
    return (
      !responsible ||
      (!responsible.name &&
        !responsible.cpf &&
        !responsible.rg &&
        !responsible.birthDate &&
        !responsible.gender &&
        !responsible.email &&
        !responsible.phone)
    );
  }, [responsible]);

  useEffect(() => {
    if (isResponsibleEmpty) form.setValue("responsible", undefined);
  }, [isResponsibleEmpty, responsible]);

  const addAddress = () => {
    append(emptyAddress);
  };

  const removeAddress = async (index: number, id?: number) => {
    if (fields.length > 1) {
      remove(index);
    }

    if (id) await deleteAddress(id);
  };

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    onSaveClient,
    register: form.register,
    setValue: form.setValue,
    watch: form.watch,
    reset: form.reset,
    client,
    isLoading,
    addressFields: fields,
    addAddress,
    removeAddress,
  };
};
