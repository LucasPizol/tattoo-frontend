import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/components/ui/Modal/useModal";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { NotesSchema, type NotesForm } from "@/schemas/notes";
import type {
  AddNoteRequest,
  NotePriority,
  NoteStatus,
  Note as NoteType,
} from "./types";
import {
  NotePriorityLabel,
  NoteStatusLabel,
} from "./types";
import { MdAdd, MdStickyNote2 } from "react-icons/md";
import { Note } from "./components/Note";
import { NotesModal } from "./components/NotesModal";
import { useNotes } from "./hooks/useNotes";
import { useCreateNote, useUpdateNote, useDeleteNote } from "./http/mutations/noteMutations";
import styles from "./styles.module.scss";

export const Notes = () => {
  const { mutateAsync: createNote } = useCreateNote();
  const { mutateAsync: updateNote } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  const { modalProps, open } = useModal<NotesForm, NoteType>({
    initialValues: NotesSchema.defaultValues,
    schema: NotesSchema.schema,
    onSubmit: async (data, reference) => {
      if (reference) {
        await updateNote({ id: reference.id, payload: data });
      } else {
        await createNote(data as AddNoteRequest);
      }
    },
  });
  const { modalProps: destroyModalProps, open: openDestroyModal } = useModal<
    NoteType,
    NoteType
  >({
    onSubmit: async (data) => {
      await deleteNote(data.id);
    },
  });

  const { filtersForm, onFinishFilters, notes } = useNotes();

  return (
    <PageWrapper
      title="Notas"
      actions={
        <Button prefixIcon={<MdAdd />} onClick={() => open()}>
          Nova nota
        </Button>
      }
    >
      <FiltersCard form={filtersForm} onFinishFilters={onFinishFilters}>
        <Input
          field="title_or_description_cont"
          label="Título"
          onDebounceChange={async (value) => {
            onFinishFilters({
              title_or_description_cont: value,
            });
          }}
        />
        <MultiSelect
          label="Status"
          field="status_in"
          options={Object.entries(NoteStatusLabel).map(([key, value]) => ({
            label: value,
            value: key as NoteStatus,
          }))}
          onSelect={async (_option, selectedOptions) => {
            onFinishFilters({
              status_in: selectedOptions.map((o) => ({
                label: o.label,
                value: o.value as NoteStatus,
              })),
            });
          }}
        />
        <MultiSelect
          label="Prioridade"
          field="priority_in"
          options={Object.entries(NotePriorityLabel).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
          onSelect={async (_option, selectedOptions) => {
            onFinishFilters({
              priority_in: selectedOptions.map((o) => ({
                label: o.label,
                value: o.value as NotePriority,
              })),
            });
          }}
        />
      </FiltersCard>

      <div className={styles.notesGrid}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            <MdStickyNote2 />
            <h3>Nenhuma nota encontrada</h3>
            <p>Clique em "Nova nota" para começar a organizar suas ideias!</p>
          </div>
        ) : (
          notes.map((noteItem) => (
            <Note
              key={noteItem.id}
              note={noteItem}
              openModal={(values) => open(values, noteItem)}
              openDeleteModal={() => openDestroyModal(noteItem)}
            />
          ))
        )}
      </div>

      <NotesModal {...modalProps} />
      <Modal {...destroyModalProps} title="Deletar nota">
        <span>Tem certeza que deseja deletar a nota?</span>
      </Modal>
    </PageWrapper>
  );
};
