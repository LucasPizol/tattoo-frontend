import { ClientSelector } from "@/components/ClientSelector";
import { Input } from "@/components/ui/Input";
import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ClientOptions, type ClientForm } from "@/schemas/client";
import type { Client } from "@/services/requests/client/types";
import { masks } from "@/utils/masks";
import styles from "./styles.module.scss";

type PartialAddClientProps = ModalPropsForm<ClientForm, Client>;
export const PartialAddClient = (props: PartialAddClientProps) => {
  const indicatedBy = props.form?.watch("indicatedBy");

  return (
    <Modal {...props} title="Adicionar Cliente Parcial">
      <div className={styles.form}>
        <Input label="Nome" placeholder="Nome do cliente" field="name" />
        <Input
          label="Telefone"
          placeholder="Telefone do cliente"
          field="phone"
          mask={masks.formatPhone}
        />
        <Input
          label="CPF"
          placeholder="CPF do cliente"
          field="cpf"
          mask={masks.formatCpf}
        />
        <Input
          label="Data de Nascimento"
          type="text"
          placeholder="DD/MM/AAAA"
          field="birthDate"
          mask={masks.formatDate}
        />
        <Select
          label="Gênero"
          placeholder="Gênero do cliente"
          field="gender"
          options={ClientOptions.genderOptions}
        />
        <ClientSelector
          label="Indicado por"
          placeholder="Selecione um cliente"
          uncreatable
          value={
            indicatedBy?.id
              ? { id: indicatedBy.id, name: indicatedBy.name ?? "" }
              : undefined
          }
          onChange={(client) => {
            if (!client) {
              props.form?.setValue("indicatedBy", undefined);
              return;
            }
            props.form?.setValue("indicatedBy", {
              id: client.id,
              name: client.name,
            });
          }}
        />
      </div>
    </Modal>
  );
};
