import {
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
} from "../http/mutations/calendarEventMutations";
import { useMemo } from "react";

export const useCalendarEventMutation = () => {
  const createCalendarEvent = useCreateCalendarEvent();
  const updateCalendarEvent = useUpdateCalendarEvent();
  const deleteCalendarEvent = useDeleteCalendarEvent();

  const failureReason = useMemo(() => {
    return {
      ...createCalendarEvent.failureReason,
      ...updateCalendarEvent.failureReason,
      ...deleteCalendarEvent.failureReason,
    };
  }, [
    createCalendarEvent.failureReason,
    updateCalendarEvent.failureReason,
    deleteCalendarEvent.failureReason,
  ]);

  return {
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    errors: Object.keys(failureReason).length > 0 ? failureReason : null,
    resetErrors: () => {
      createCalendarEvent.reset();
      updateCalendarEvent.reset();
      deleteCalendarEvent.reset();
    },
  };
};
