export const NoteStatus = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus];

export const NotePriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const NoteStatusLabel = {
  [NoteStatus.OPEN]: "Aberto",
  [NoteStatus.IN_PROGRESS]: "Em andamento",
  [NoteStatus.COMPLETED]: "Concluído",
};

export const NotePriorityLabel = {
  [NotePriority.LOW]: "Baixa",
  [NotePriority.MEDIUM]: "Média",
  [NotePriority.HIGH]: "Alta",
};

export type NotePriority = (typeof NotePriority)[keyof typeof NotePriority];

export type Note = {
  id: string;
  title: string;
  description: string;
  status: NoteStatus;
  priority: NotePriority;
  dueDate: string;
  completedAt: string;
};

export type AddNoteRequest = {
  title: string;
  description: string;
  status: NoteStatus;
  priority: string;
  due_date: string;
};

export type UpdateNoteRequest = Partial<AddNoteRequest>;

export type NoteFilters = {
  title_or_description_cont?: string;
  status_in?: NoteStatus[];
  priority_in?: NotePriority[];
  due_date_gte?: string;
  due_date_lte?: string;
};
