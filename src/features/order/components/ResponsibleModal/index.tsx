import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { Select } from "@/components/ui/Select";
import type { Client } from "@/services/requests/client/types";
import { ResponsibleRequests } from "@/services/requests/responsible";
import { masks } from "@/utils/masks";
import toast from "react-hot-toast";
import styles from "./styles.module.scss";

type ResponsibleModalProps = {
  onSave: () => void;
  client?: Client;
};

export const ResponsibleModal = ({ onSave, client }: ResponsibleModalProps) => {
  const { modalProps, open } = useModal({
    onSubmit: async (data) => {
      const responsiblePayload = {
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        birth_date: data.birthDate,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        client_id: client?.id ?? 0,
      };

      try {
        await ResponsibleRequests.create(responsiblePayload);
        toast.success("Responsável salvo com sucesso");
        onSave();
      } catch (error) {
        toast.error("Erro ao salvar responsável");
      }
    },
  });

  return (
    <>
      <Button onClick={() => open()}>Criar Responsável</Button>
      <Modal
        {...modalProps}
        title={`Criando responsável para ${client?.name?.split(" ")[0]}`}
      >
        <Input
          label="Nome"
          placeholder="Nome completo do responsável"
          field="name"
        />
        <div className={styles.row}>
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            field="cpf"
            mask={masks.formatCpf}
            className={styles.cpf}
          />
          <Input
            label="RG"
            placeholder="00.000.000-0"
            field="rg"
            className={styles.rg}
          />
        </div>
        <div className={styles.row}>
          <Input
            label="Data de Nascimento"
            placeholder="00/00/0000"
            field="birthDate"
            mask={masks.formatDate}
            type="text"
            className={styles.birthDate}
          />
          <Select
            label="Gênero"
            field="gender"
            options={[
              { label: "Masculino", value: "masculino" },
              { label: "Feminino", value: "feminino" },
            ]}
            className={styles.gender}
          />
        </div>
        <Input label="Email" placeholder="email@exemplo.com" field="email" />
        <Input
          label="Telefone"
          placeholder="(11) 99999-9999"
          field="phone"
          mask={masks.formatPhone}
        />
      </Modal>
    </>
  );
};
