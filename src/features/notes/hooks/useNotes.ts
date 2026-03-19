import { NotesFiltersSchema, type NotesFilters } from "@/schemas/notes/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNotesListQuery } from "../http/queries/notesQuery";

export const useNotes = () => {
  const [filters, setFilters] = useState<NotesFilters>(
    NotesFiltersSchema.defaultValues as NotesFilters
  );

  const filtersForm = useForm<NotesFilters>({
    resolver: zodResolver(NotesFiltersSchema.schema),
    defaultValues: NotesFiltersSchema.defaultValues,
  });

  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useNotesListQuery(filters);

  const onFinishFilters = (filters: NotesFilters) => {
    setFilters(filters);
  };

  return {
    notes: notes?.notes ?? [],
    isLoading,
    error,
    filtersForm,
    onFinishFilters,
    refetch,
  };
};
