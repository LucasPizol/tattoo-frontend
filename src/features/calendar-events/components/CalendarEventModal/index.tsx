import { Accordeon } from "@/components/ui/Accordeon";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import type { CalendarEventForm } from "@/schemas/calendar-event";
import type { CalendarEvent } from "../../types";
import { masks } from "@/utils/masks";
import { useEffect, useMemo, useRef } from "react";
import styles from "./styles.module.scss";
import { IconButton } from "@/components/ui/IconButton";
import { MdDelete } from "react-icons/md";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useCalendarEventMutation } from "../../hooks/useCalendarEventMutation";

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const ptBrToUtc = (date: string, time: string) => {
  const [day, month, year] = date.split("/");
  const [hour, minute] = time.split(":");
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  localDate.setHours(localDate.getHours() - 3);
  return localDate.toISOString();
};

type CalendarEventModalProps = ModalPropsForm<
  CalendarEventForm,
  CalendarEvent | null
>;

export const CalendarEventModal = (props: CalendarEventModalProps) => {
  const { deleteCalendarEvent } = useCalendarEventMutation();
  const clientName = capitalize(
    props.form?.watch("clientName") || "{{nome_cliente}}",
  );
  const title = props.form?.watch("title") || "{{titulo_evento}}";
  const startAt = props.form?.watch("startAt") || "{{data do evento}}";
  const startTime = props.form?.watch("startTime") || "{{hora do evento}}";
  const initializedWitIndex = useRef(-1);

  const messageTemplates = useMemo(() => {
    return [
      `Olá, ${clientName}! 👋

Espero que esteja tudo bem com você!

Gostaria de confirmar seu agendamento:
📅 *Data:* ${startAt}
🕐 *Horário:* ${startTime}
📋 *Serviço:* ${title}

Estamos ansiosos para recebê-lo(a)!

Se precisar reagendar ou tiver alguma dúvida, é só me avisar. Estamos à disposição! 😊`,

      `Oi, ${clientName}! 😊

Só passando aqui para confirmar seu agendamento conosco:

📅 Data: ${startAt}
🕐 Horário: ${startTime}
✨ Serviço: ${title}

Ficamos felizes em atendê-lo(a)!

Qualquer alteração ou dúvida, pode me chamar. Até breve! 👋`,

      `Olá, ${clientName}!

Espero que esteja bem! 😊

Vim aqui para lembrá-lo(a) do seu agendamento:
• Data: ${startAt}
• Horário: ${startTime}
• Serviço: ${title}

Contamos com sua presença!

Se precisar de algo, estou à disposição. Te vejo em breve! 💜`,

      `Oi ${clientName}! 👋

Tudo certo?

Só um lembrete sobre seu agendamento:
📆 ${startAt} às ${startTime}
🎯 ${title}

Será um prazer recebê-lo(a)!

Em caso de dúvidas ou necessidade de reagendamento, pode me chamar. Estamos aqui para ajudar! 😊`,

      `Olá, ${clientName}!

Espero que esteja tudo ótimo! ✨

Confirmando seu agendamento:
📅 *Quando:* ${startAt}
⏰ *Horário:* ${startTime}
🎨 *Serviço:* ${title}

Se surgir qualquer coisa, é só falar comigo. Estamos à disposição! 💫`,
    ];
  }, [clientName, title, startAt, startTime]);

  useEffect(() => {
    if (!props.isOpen) {
      initializedWitIndex.current = -1;
      return;
    }

    const currentMessage = props.form?.watch("whatsappMessage");

    if (
      !currentMessage &&
      initializedWitIndex.current === -1 &&
      messageTemplates.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * messageTemplates.length);
      props.form?.setValue("whatsappMessage", messageTemplates[randomIndex]);
      initializedWitIndex.current = randomIndex;
    }

    if (initializedWitIndex.current !== -1 && currentMessage) {
      props.form?.setValue(
        "whatsappMessage",
        messageTemplates[initializedWitIndex.current],
      );
    }
  }, [messageTemplates, props.form, props.isOpen]);

  const baseError = (
    props.form?.formState.errors as { base?: { message: string } }
  ).base;

  const handleDelete = async () => {
    if (!props.currentReference?.id) return;
    await deleteCalendarEvent.mutateAsync(props.currentReference?.id);
    props.onClose();
  };

  return (
    <Modal {...props} title={
      <div className={styles.modalTitleContainer}>
        <h2>Evento</h2>
        {props.currentReference?.id && (
            <ConfirmModal
              trigger={
                <IconButton aria-label="Fechar" type="button">
                  <MdDelete size={26} color="red" />
                </IconButton>
              }
              onSave={handleDelete}
              title="Excluir evento"
              danger
            >
              <p>Tem certeza que deseja excluir o evento?</p>
            </ConfirmModal>
          )
        }

      </div>
    }>
      <Input label="Título" field="title" />
      <div className={styles.rowContainer}>
        <Input
          label="Nome do cliente"
          field="clientName"
          className={styles.rowItem}
        />
        <Input
          label="Celular"
          field="phone"
          mask={masks.formatPhone}
          className={styles.rowItem}
        />
      </div>
      <TextArea label="Descrição" field="description" rows={4} />
      <Select
        label="Tipo"
        field="type"
        options={[
          { label: "Perfuração", value: "piercing" },
          { label: "Venda", value: "sell" },
        ]}
      />

      <div className={styles.rowContainer}>
        <Input
          label="Data"
          field="startAt"
          mask={masks.formatDate}
          type="text"
          isDate
        />
        <Input
          label="Início"
          field="startTime"
          mask={masks.formatTime}
          type="text"
          className={styles.rowItem}
          onChange={(e) => {
            const formattedValue = e.target.value;
            if (formattedValue.length === 5) {
              const [hourStr, minStr] = formattedValue.split(":");
              let hour = parseInt(hourStr, 10);
              if (!isNaN(hour)) {
                hour = (hour + 1) % 24;
                const endHourStr = hour.toString().padStart(2, "0");
                const endTime = `${endHourStr}:${minStr}`;
                props.form?.setValue("endTime", endTime);
              }
            }
          }}
        />
        <Input
          label="Término"
          field="endTime"
          mask={masks.formatTime}
          type="text"
          className={styles.rowItem}
        />
      </div>
      {baseError && <Alert type="error">{baseError.message}</Alert>}
      {props.form?.watch("phone") && (
        <Accordeon title="Opções">
          <div className={styles.accordionContent}>
            <Checkbox
              label="Enviar mensagem do WhatsApp"
              field="sendWhatsappMessage"
            />
            <TextArea
              label="Mensagem do WhatsApp"
              field="whatsappMessage"
              rows={10}
              disabled={!props.form?.watch("sendWhatsappMessage")}
            />
          </div>
        </Accordeon>
      )}
    </Modal>
  );
};
