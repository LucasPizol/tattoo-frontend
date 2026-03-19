import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { type NotesForm } from "@/schemas/notes";
import {
    NotePriorityLabel,
    NoteStatus,
    type Note as NoteType,
} from "../../types";
import { masks } from "@/utils/masks";
import { useUpdateNoteStatus } from "../../http/mutations/noteMutations";
import { MdAccessTime, MdDelete, MdEdit, MdPriorityHigh } from "react-icons/md";
import styles from "./styles.module.scss";

type NoteProps = {
  note: NoteType;
  openModal: (values?: NotesForm, reference?: NoteType | null) => void;
  openDeleteModal: (reference?: NoteType | null) => void;
};

export const Note = ({ note, openModal, openDeleteModal }: NoteProps) => {
  const isCompleted = note.status === NoteStatus.COMPLETED;
  const isOverdue =
    note.dueDate && new Date(note.dueDate) < new Date() && !isCompleted;

  const updateNoteStatus = useUpdateNoteStatus();

  const handleToggleComplete = () => {
    const newStatus =
      note.status === NoteStatus.COMPLETED
        ? NoteStatus.OPEN
        : NoteStatus.COMPLETED;

    updateNoteStatus.mutate({ id: note.id, status: newStatus });
  };

  return (
    <div className={`${styles.note} ${isCompleted ? styles.completed : ""}`}>
      <div className={styles.header}>
        <Checkbox
          field="status"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
          disabled={updateNoteStatus.isPending}
          noForm
        />

        <div className={styles.priority}>
          <MdPriorityHigh className={styles[`priority-${note.priority}`]} />
          <span className={styles.priorityText}>
            {NotePriorityLabel[note.priority]}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{note.title}</h3>
        {note.description && (
          <p className={styles.description}>{note.description}</p>
        )}
      </div>

      {note.dueDate && (
        <div className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>
          <MdAccessTime />
          <span>Vencimento: {masks.formatDate(note.dueDate)}</span>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          prefixIcon={<MdEdit />}
          onClick={() =>
            openModal({
              title: note.title,
              description: note.description,
              status: note.status,
              priority: note.priority,
              due_date: note.dueDate,
            })
          }
        >
          Editar
        </Button>
        <Button prefixIcon={<MdDelete />} onClick={() => openDeleteModal(note)}>
          Deletar
        </Button>
      </div>
    </div>
  );
};
