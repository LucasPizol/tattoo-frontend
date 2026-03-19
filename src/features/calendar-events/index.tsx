import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { MdAdd } from "react-icons/md";
import { CalendarEventModal } from "./components/CalendarEventModal";
import { useCalendarEventListQuery } from "./http/queries/calendarEventsQuery";
import { useCalendarForm } from "./hooks/useCalendarForm";
import styles from "./styles.module.scss";

const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const simplifyTime = (date: string) => {
  const dateObj = new Date(date);
  dateObj.setHours(dateObj.getHours() + 3);

  return dateObj.toTimeString().slice(0, 5);
};

const getEndTime = (startTime: string) => {
  if (!startTime) return "";

  const [hourStr, minStr] = startTime.split(":");
  let hour = parseInt(hourStr, 10);
  hour = (hour + 1) % 24;
  const endHourStr = hour.toString().padStart(2, "0");
  return `${endHourStr}:${minStr}`;
};

export const CalendarEvents = () => {
  const { open, modalProps } = useCalendarForm();

  const { data } = useCalendarEventListQuery({
    start_at_gteq: startOfMonth.toISOString(),
    end_at_lteq: endOfMonth.toISOString(),
  });

  return (
    <PageWrapper
      title="Agenda"
      subtitle="Gerencie os eventos de sua agenda"
      actions={
        <Button
          prefixIcon={<MdAdd />}
          onClick={() => {
            open({
              title: "",
              description: "",
              type: undefined,
              clientId: undefined,
              startAt: new Date().toLocaleDateString("pt-BR"),
              startTime: undefined,
              endTime: undefined,
            });
          }}
        >
          Novo evento
        </Button>
      }
      containerClassName={styles.calendarEventsContainer}
    >
      <Calendar
        events={data.map((event) => ({
          ...event,
          displayTitle: event.displayTitle,
          startAt: event.startAt,
          endAt: event.endAt,
          date: event.startAt,
        }))}
        onEventClick={(data) => {
          open({
            title: data.title,
            description: data.description,
            type: data.eventType.value,
            clientId: data.client?.id,
            startAt: new Date(data.startAt).toLocaleDateString("pt-BR"),
            startTime: simplifyTime(data.startAt),
            endTime: simplifyTime(data.endAt),
            phone: data.phone,
            clientName: data.clientName,
            whatsappMessage: data.whatsappMessage,
            sendWhatsappMessage: data.sendWhatsappMessage,
          }, data);
        }}
        onDateClick={(date) => {
          open({
            startAt: date,
            startTime: undefined,
            endTime: undefined,
          });
        }}
        onAddEvent={(date, time) => {
          open({
            startAt: date,
            startTime: time || "",
            endTime: getEndTime(time || ""),
          });
        }}
        initialMonth={today.getMonth()}
        initialYear={today.getFullYear()}
      />
      <CalendarEventModal {...modalProps} />
    </PageWrapper>
  );
};
