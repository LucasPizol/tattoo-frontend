import { ClientSelector } from "@/components/ClientSelector";
import { Form } from "@/components/Form";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ClientOptions } from "@/schemas/client";
import { masks } from "@/utils/masks";
import { useEffect, useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { AddressForm } from "../../components/AddressForm";
import { useClientForm } from "../../hooks/useClientForm";
import styles from "./styles.module.scss";
import { TextArea } from "@/components/ui/TextArea";

export const ClientForm = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const {
    form,
    isSubmitting,
    setValue,
    watch,
    reset,
    onSaveClient,
    client,
    isLoading,
    addressFields,
    addAddress,
    removeAddress,
  } = useClientForm(Number(id), isEditing);

  const navigate = useNavigate();

  const birthDate = watch("birthDate");

  const isMinor = useMemo(() => {
    if (!birthDate) return false;

    const [day, month, year] = birthDate.split("/");

    const today = new Date();
    const birth = new Date(Number(year), Number(month) - 1, Number(day));
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 < 18;
    }
    return age < 18;
  }, [birthDate, client]);

  useEffect(() => {
    if (isEditing && client) {
      const formValues = {
        ...client,
        rg: client.rg || undefined,
        cpf: masks.formatCpf(client.cpf || "") || undefined,
        birthDate: client.birthDate || undefined,
        email: client.email || undefined,
        phone: masks.formatPhone(client.phone || "") || undefined,
        addresses: client.addresses?.length
          ? client.addresses.map((addr) => ({
              addressId: addr.id || undefined,
              zipCode: addr.zipcode || "",
              street: addr.street || "",
              number: addr.number || "",
              neighborhood: addr.neighborhood || "",
              city: addr.city || "",
              state: addr.state || "",
              complement: addr.complement || "",
            }))
          : [
              {
                zipCode: "",
                street: "",
                number: "",
                neighborhood: "",
                city: "",
                state: "",
                complement: "",
              },
            ],
      };

      client.healthConditions?.forEach((condition) => {
        (formValues as Record<string, unknown>)[condition.value] = true;
      });

      reset(formValues);
    } else if (!isEditing) {
      reset({
        name: "",
        email: "",
        phone: "",
        addresses: [
          {
            zipCode: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            complement: "",
          },
        ],
      });
    }
  }, [client, isEditing, reset]);

  return (
    <PageWrapper
      title={isEditing ? "Editar Cliente" : "Novo Cliente"}
      onBack={() => {
        const canGoBack = window.history.state.idx > 0;

        if (canGoBack) {
          navigate(-1);
        } else {
          navigate("/clientes");
        }
      }}
      subtitle="Gerencie seus clientes e mantenha as informações atualizadas"
    >
      <div className={styles.content}>
        <Form onSubmit={onSaveClient} form={form} className={styles.form}>
          <Card title="Dados Pessoais" className={styles.section}>
            <div className={styles.grid}>
              <Input
                label="Nome Completo"
                placeholder="Nome completo do cliente"
                field="name"
                required
                loading={isLoading}
              />
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                field="cpf"
                mask={masks.formatCpf}
                loading={isLoading}
              />
              <Input
                label="RG"
                placeholder="00.000.000-0"
                field="rg"
                loading={isLoading}
              />
              <Input
                label="Data de Nascimento"
                type="text"
                placeholder="DD/MM/AAAA"
                field="birthDate"
                mask={masks.formatDate}
                loading={isLoading}
              />
              <Select
                label="Gênero"
                placeholder="Selecione o gênero"
                options={ClientOptions.genderOptions}
                field="gender"
                loading={isLoading}
              />
              <Select
                label="Estado Civil"
                placeholder="Selecione o estado civil"
                options={ClientOptions.maritalStatusOptions}
                field="maritalStatus"
                loading={isLoading}
              />
              <Input
                label="Perfil do Instagram"
                placeholder="Perfil do Instagram"
                field="instagramProfile"
                loading={isLoading}
              />
            </div>
          </Card>

          <Card title="Contato" className={styles.section}>
            <div className={styles.grid}>
              <Input
                label="Email"
                type="email"
                placeholder="email@exemplo.com"
                field="email"
                loading={isLoading}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                field="phone"
                mask={masks.formatPhone}
                loading={isLoading}
              />
              <ClientSelector
                isLoading={isLoading}
                label="Cliente"
                placeholder="Selecione um cliente"
                selectCondition={(c) => c.id !== client?.id}
                disabled={
                  isLoading || isSubmitting || !!client?.indicatedBy?.id
                }
                link={
                  client?.indicatedBy
                    ? {
                        to: `/clientes/${client?.indicatedBy?.id}/visualizar`,
                        label: "Detalhes do cliente",
                      }
                    : undefined
                }
                value={
                  client?.indicatedBy
                    ? {
                        id: client?.indicatedBy?.id,
                        name: client?.indicatedBy?.name,
                      }
                    : undefined
                }
                onChange={async (client) => {
                  setValue("indicatedBy", client);
                }}
              />
            </div>
          </Card>

          <Card
            title="Endereços"
            className={styles.section}
            actions={
              <Button
                variant="secondary"
                type="button"
                onClick={addAddress}
                className={styles.addAddressButton}
                prefixIcon={<MdAdd size={18} />}
              >
                Adicionar Endereço
              </Button>
            }
          >
            <div className={styles.addressList}>
              {addressFields.map((field, index) => {
                return (
                  <AddressForm
                    key={field.id}
                    index={index}
                    form={form}
                    onRemove={() => removeAddress(index, field.addressId)}
                    canRemove={addressFields.length > 1}
                    isLoading={isLoading}
                  />
                );
              })}
            </div>
          </Card>

          {/* Informações de Saúde */}
          <Card title="Informações de Saúde" className={styles.section}>
            <div className={styles.healthGrid}>
              <Checkbox
                label="Diabetes"
                disabled={isLoading}
                field="diabetes"
              />
              <Checkbox
                label="Epilepsia"
                disabled={isLoading}
                field="epilepsy"
              />
              <Checkbox
                label="Hemofilia"
                disabled={isLoading}
                field="hemophilia"
              />
              <Checkbox
                label="Vitiligo"
                disabled={isLoading}
                field="vitiligo"
              />
              <Checkbox
                label="Marca-passo"
                disabled={isLoading}
                field="pacemaker"
              />
              <Checkbox
                label="Pressão alta"
                disabled={isLoading}
                field="highBloodPressure"
              />
              <Checkbox
                label="Pressão baixa"
                disabled={isLoading}
                field="lowBloodPressure"
              />
              <Checkbox
                label="Doenças infecto-contagiosas"
                disabled={isLoading}
                field="diseaseInfectiousContagious"
              />
              <Checkbox
                label="Problemas de cicatrização"
                disabled={isLoading}
                field="healingProblems"
              />
              <Checkbox
                label="Reações alérgicas"
                disabled={isLoading}
                field="allergicReactions"
              />
              <Checkbox
                label="Hipersensibilidade a produtos químicos"
                disabled={isLoading}
                field="hypersensitivityToChemicals"
              />
              <Checkbox label="Tendência a quelóide" field="keloidProneness" />
              <Checkbox
                label="Hipoglicemia"
                disabled={isLoading}
                field="hipoglycemia"
              />
            </div>
          </Card>

          <Card title="Observações" className={styles.section}>
            <TextArea
              label="Observações"
              placeholder="Observações"
              field="observations"
              rows={4}
            />
          </Card>

          {isMinor && (
            <Card title="Responsáveis" className={styles.section}>
              <div className={styles.grid}>
                <Input
                  label="Nome do Responsável"
                  placeholder="Nome completo do responsável"
                  field="responsible.name"
                  required
                  loading={isLoading}
                />
                <Input
                  label="CPF do Responsável"
                  placeholder="000.000.000-00"
                  field="responsible.cpf"
                  mask={masks.formatCpf}
                  required
                  loading={isLoading}
                />
                <Input
                  label="RG do Responsável"
                  placeholder="00.000.000-0"
                  field="responsible.rg"
                  loading={isLoading}
                />
                <Input
                  label="Data de Nascimento do Responsável"
                  type="text"
                  placeholder="DD/MM/AAAA"
                  field="responsible.birthDate"
                  mask={masks.formatDate}
                  required
                  loading={isLoading}
                />
                <Select
                  label="Gênero do Responsável"
                  placeholder="Selecione o gênero"
                  options={ClientOptions.genderOptions}
                  value={watch("responsible.gender")}
                  field="responsible.gender"
                  required
                  loading={isLoading}
                />
                <Input
                  label="Email do Responsável"
                  type="email"
                  placeholder="email@exemplo.com"
                  field="responsible.email"
                  loading={isLoading}
                />
                <Input
                  label="Telefone do Responsável"
                  placeholder="(11) 99999-9999"
                  field="responsible.phone"
                  mask={masks.formatPhone}
                  required
                  loading={isLoading}
                />
              </div>
            </Card>
          )}

          <Button type="submit" loading={isSubmitting}>
            Salvar
          </Button>
        </Form>
      </div>
    </PageWrapper>
  );
};
