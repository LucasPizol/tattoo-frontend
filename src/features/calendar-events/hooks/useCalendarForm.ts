import { useModal } from "@/components/ui/Modal/useModal";
import {
  CalendarEventSchema,
  type CalendarEventForm,
} from "@/schemas/calendar-event";
import type { CalendarEvent } from "../types";
import { showError } from "@/utils/show-error";
import { ptBrToUtc } from "../components/CalendarEventModal";
import { useCalendarEventMutation } from "./useCalendarEventMutation";

export const useCalendarForm = () => {
  const { open, close, modalProps, form } = useModal<
    CalendarEventForm,
    CalendarEvent | null
  >({
    onSubmit: async (data, reference) => {
      await handleSaveCalendarEvent(data, reference ?? null);
    },
    initialValues: CalendarEventSchema.defaultValues,
    schema: CalendarEventSchema.schema,
  });

  const { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } =
    useCalendarEventMutation();

  const handleSaveCalendarEvent = async (
    data: CalendarEventForm,
    reference: CalendarEvent | null
  ) => {
    try {
      if (reference) {
        await updateCalendarEvent.mutateAsync({
          description: data.description || "",
          end_at: ptBrToUtc(data.startAt, data.endTime),
          event_type: data.type,
          start_at: ptBrToUtc(data.startAt, data.startTime),
          title: data.title,
          id: reference.id,
          client_id: data.clientId,
          phone: data.phone,
          client_name: data.clientName,
          whatsapp_message: data.whatsappMessage,
          send_whatsapp_message: data.sendWhatsappMessage,
        });
      } else {
        await createCalendarEvent.mutateAsync({
          description: data.description || "",
          end_at: ptBrToUtc(data.startAt, data.endTime),
          event_type: data.type,
          start_at: ptBrToUtc(data.startAt, data.startTime),
          title: data.title,
          phone: data.phone,
          client_name: data.clientName,
          whatsapp_message: data.whatsappMessage,
          send_whatsapp_message: data.sendWhatsappMessage,
        });
      }
      form.reset(CalendarEventSchema.defaultValues);
    } catch (error) {
      showError(error, form);
      throw error;
    }
  };

  return {
    form,
    open,
    close,
    modalProps,
    deleteCalendarEvent,
  };
};
