import { Input } from "@/components/ui/Input";
import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import type { NotesForm } from "@/schemas/notes";
import type { Note } from "../../types";
import {
    NotePriorityLabel,
    NoteStatus,
    NoteStatusLabel,
} from "../../types";
import { masks } from "@/utils/masks";

type NotesModalProps = ModalPropsForm<NotesForm, Note>;

export const NotesModal = (props: NotesModalProps) => {
  return (
    <Modal
      title={props.currentReference ? "Editar nota" : "Nova nota"}
      {...props}
    >
      <Input field="title" name="title" label="Título" autoFocus />
      <TextArea field="description" name="description" label="Descrição" />
      <Select
        label="Status"
        field="status"
        options={Object.entries(NoteStatusLabel).map(([key, value]) => ({
          label: value,
          value: key as NoteStatus,
        }))}
      />
      <Select
        label="Prioridade"
        field="priority"
        options={Object.entries(NotePriorityLabel).map(([key, value]) => ({
          label: value,
          value: key,
        }))}
      />
      <Input
        field="due_date"
        mask={masks.formatDate}
        isDate
        label="Data de vencimento"
      />
    </Modal>
  );
};
