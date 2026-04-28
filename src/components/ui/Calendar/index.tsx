import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import z from "zod";
import { Form } from "../../Form";
import { Visible } from "../../Visible";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Select } from "../Select";
import styles from "./styles.module.scss";

export interface CalendarEvent {
  id: number;
  title: string;
  displayTitle?: string;
  description?: string;
  startAt: string;
  endAt: string;
  color?: string;
}

type CalendarView = "month" | "week";

type CalendarProps<T extends CalendarEvent> = {
  events?: T[];
  onEventClick?: (event: T) => void;
  onDateClick?: (date: string) => void;
  onAddEvent?: (date: string, time?: string) => void;
  className?: string;
  initialMonth?: number;
  initialYear?: number;
  initialView?: CalendarView;
};

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const today = new Date();

export const Calendar = <T extends CalendarEvent>({
  events = [],
  onEventClick,
  onDateClick,
  onAddEvent,
  className,
  initialMonth,
  initialYear,
  initialView = "month",
}: CalendarProps<T>) => {
  const form = useForm<{ month: number; year: number }>({
    resolver: zodResolver(
      z.object({
        month: z.number().min(0).max(11),
        year: z.number().min(1900),
      }),
    ),
    defaultValues: {
      month: initialMonth ?? today.getMonth(),
      year: initialYear ?? today.getFullYear(),
    },
  });

  const currentMonth = form.watch("month");
  const currentYear = form.watch("year");

  const [view, setView] = useState<CalendarView>(initialView);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const date = new Date(today);
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    return date;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
  };

  const isToday = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date: string): CalendarEvent[] => {
    return events.filter(
      (event) => getDateFromDateTime(event.startAt) === date,
    );
  };

  const parseDateTime = (dateTimeStr: string): Date => {
    const cleanStr = dateTimeStr.replace(" ", "T");
    return new Date(cleanStr);
  };

  const getTimeFromDateTime = (dateTimeStr: string): string => {
    const date = parseDateTime(dateTimeStr);
    return date.toTimeString().slice(0, 5);
  };

  const getDateFromDateTime = (dateTimeStr: string): string => {
    const date = parseDateTime(dateTimeStr);
    return formatDate(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const startDate = parseDateTime(event.startAt);
    const endDate = parseDateTime(event.endAt);

    // Converter para horas decimais (ex: 14:30 = 14.5)
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

    // Ajustar para o horário de início do calendário (7h)
    const adjustedStartHour = startHour - 7;
    const adjustedEndHour = endHour - 7;
    const duration = adjustedEndHour - adjustedStartHour;

    // Altura dos slots de hora baseada no tamanho da tela
    const hourSlotHeight = isMobile ? 50 : 60;

    // Calcular posição top baseada na hora de início ajustada
    const top = Math.max(adjustedStartHour * hourSlotHeight, 0);

    // Calcular altura baseada na duração, com mínimo de 1 slot
    const height = duration * hourSlotHeight;

    return {
      top,
      height,
      startTime: getTimeFromDateTime(event.startAt),
      endTime: getTimeFromDateTime(event.endAt),
    };
  };

  const getEventsForWeek = (weekStart: Date): CalendarEvent[] => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventStart = parseDateTime(event.startAt);
      return eventStart >= weekStart && eventStart <= weekEnd;
    });
  };

  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = useMemo(() => {
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

    const days: Array<{
      day: number;
      date: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }> = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const month = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      const date = formatDate(year, month, day);

      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: isToday(year, month, day),
        events: getEventsForDate(date),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(currentYear, currentMonth, day);
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday: isToday(currentYear, currentMonth, day),
        events: getEventsForDate(date),
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const month = currentMonth === 11 ? 0 : currentMonth + 1;
      const year = currentMonth === 11 ? currentYear + 1 : currentYear;
      const date = formatDate(year, month, day);

      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: isToday(year, month, day),
        events: getEventsForDate(date),
      });
    }

    return days;
  }, [currentMonth, currentYear, events]);

  const goToToday = () => {
    if (view === "month") {
      form.setValue("month", today.getMonth());
      form.setValue("year", today.getFullYear());
    } else {
      const date = new Date(today);
      const day = date.getDay();
      date.setDate(date.getDate() - day);
      setCurrentWeekStart(date);
      form.setValue("month", date.getMonth());
      form.setValue("year", date.getFullYear());
    }
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
    form.setValue("month", newWeekStart.getMonth());
    form.setValue("year", newWeekStart.getFullYear());
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
    form.setValue("month", newWeekStart.getMonth());
    form.setValue("year", newWeekStart.getFullYear());
  };

  const goToPreviousMonth = () => {
    if (view === "month") {
      if (currentMonth === 0) {
        form.setValue("month", 11);
        form.setValue("year", currentYear - 1);
      } else {
        form.setValue("month", currentMonth - 1);
      }
    } else {
      goToPreviousWeek();
    }
  };

  const goToNextMonth = () => {
    if (view === "month") {
      if (currentMonth === 11) {
        form.setValue("month", 0);
        form.setValue("year", currentYear + 1);
      } else {
        form.setValue("month", currentMonth + 1);
      }
    } else {
      goToNextWeek();
    }
  };

  const handleDateClick = (date: string, isCurrentMonth: boolean) => {
    if (view === "month" && !isCurrentMonth) return;
    onDateClick?.(date);
  };

  const handleAddEvent = (
    date: string,
    isCurrentMonth: boolean,
    time?: string,
  ) => {
    if (view === "month" && !isCurrentMonth) return;
    onAddEvent?.(date, time);
  };

  // Handler para clique na grade de horários da visualização semanal
  const handleWeekTimeClick = (date: Date, hour: number) => {
    const dateStr = formatDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    onAddEvent?.(dateStr, timeStr);
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentWeekStart);
    const weekEvents = getEventsForWeek(currentWeekStart);
    const hours = Array.from({ length: 15 }, (_, i) => i + 7);

    return (
      <div className={styles.weekView}>
        <div className={cn(styles.weekHeader, styles.weekHeaderWeek)}>
          <div></div>
          {weekDays.map((date, index) => (
            <div key={index} className={styles.weekDay}>
              <div className={styles.weekDayName}>
                {WEEKDAYS[date.getDay()]}
              </div>
              <div
                className={cn(styles.weekDayNumber, {
                  [styles.today]: isToday(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                  ),
                })}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.weekGrid}>
          <div className={styles.timeColumn}>
            {hours.map((hour) => (
              <div key={hour} className={styles.timeSlot}>
                <span className={styles.timeLabel}>
                  {hour === 0
                    ? "12am"
                    : hour < 12
                      ? `${hour}am`
                      : hour === 12
                        ? "12pm"
                        : `${hour - 12}pm`}
                </span>
              </div>
            ))}
          </div>

          {weekDays.map((date, dayIndex) => {
            const dateStr = formatDate(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            );
            const dayEvents = weekEvents.filter(
              (event) => getDateFromDateTime(event.startAt) === dateStr,
            );

            return (
              <div key={dayIndex} className={styles.dayColumn}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={styles.hourSlot}
                    onClick={() => handleWeekTimeClick(date, hour)}
                  />
                ))}

                {dayEvents.map((event) => {
                  const position = calculateEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      className={styles.weekEvent}
                      style={{
                        top: position.top,
                        height: position.height,
                        ...(event.color ? { backgroundColor: event.color, borderLeftColor: event.color } : {}),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event as T);
                      }}
                      title={`${event.title}\n${position.startTime} - ${
                        position.endTime
                      }${event.description ? `\n${event.description}` : ""}`}
                    >
                      <div className={styles.weekEventContent}>
                        <div className={styles.weekEventTitle}>
                          {event.displayTitle || event.title}
                        </div>
                        <div className={styles.weekEventTime}>
                          {position.startTime} - {position.endTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const showTodayButton = useMemo(() => {
    if (view === "month") {
      return (
        new Date().getMonth() !== currentMonth ||
        new Date().getFullYear() !== currentYear
      );
    }

    const lastDayOfWeek = new Date(currentWeekStart);

    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);
    const today = new Date();

    return (
      today.getTime() < currentWeekStart.getTime() ||
      today.getTime() > lastDayOfWeek.getTime()
    );
  }, [view, currentMonth, currentYear, currentWeekStart]);

  return (
    <div className={cn(styles.calendar, className)}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <IconButton
            onClick={goToPreviousMonth}
            aria-label="Mês anterior"
            className={styles.navigationButton}
          >
            <MdChevronLeft size={20} color="currentColor" />
          </IconButton>

          <Form
            onSubmit={(_data) => {}}
            form={form}
            className={styles.monthYear}
          >
            <Select
              field="month"
              containerClassName={styles.monthSelect}
              options={MONTHS.map((month, index) => ({
                label: month,
                value: index,
              }))}
            />

            <Select
              field="year"
              containerClassName={styles.yearSelect}
              options={Array.from(
                { length: 21 },
                (_, i) => currentYear - 10 + i,
              ).map((year) => ({
                label: year.toString(),
                value: year,
              }))}
            />
          </Form>

          <IconButton
            onClick={goToNextMonth}
            aria-label="Próximo mês"
            className={styles.navigationButton}
          >
            <MdChevronRight size={20} color="currentColor" />
          </IconButton>
        </div>

        <div className={styles.viewControls}>
          <Button
            variant="secondary"
            size="medium"
            outline={view !== "month"}
            onClick={() => setView("month")}
          >
            Mês
          </Button>
          <Button
            variant="secondary"
            outline={view !== "week"}
            size="medium"
            onClick={() => setView("week")}
          >
            Semana
          </Button>

          <Visible condition={showTodayButton}>
            <Button
              variant="secondary"
              outline
              size="medium"
              onClick={goToToday}
            >
              Hoje
            </Button>
          </Visible>
        </div>
      </div>

      {view === "month" ? (
        <>
          <div className={styles.weekHeader}>
            {WEEKDAYS.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map((dayInfo, index) => (
              <div
                key={index}
                className={cn(styles.dayCell, {
                  [styles.otherMonth]: !dayInfo.isCurrentMonth,
                  [styles.today]: dayInfo.isToday,
                  [styles.hasEvents]: dayInfo.events.length > 0,
                })}
                onClick={() => {
                  const date = new Date(dayInfo.date);
                  date.setDate(date.getDate() + 1);
                  handleDateClick(
                    date.toLocaleDateString(),
                    dayInfo.isCurrentMonth,
                  );
                }}
              >
                <div className={styles.dayNumber}>{dayInfo.day}</div>

                <div className={styles.eventsContainer}>
                  {dayInfo.events.map((event) => (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={event.color ? { backgroundColor: event.color, borderLeftColor: event.color } : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event as T);
                      }}
                      title={`${event.title}${
                        event.description ? ` - ${event.description}` : ""
                      }`}
                    >
                      <span className={styles.eventTitle}>{event.title}</span>
                      {event.startAt && (
                        <span className={styles.eventTime}>
                          {getTimeFromDateTime(event.startAt)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {dayInfo.isCurrentMonth && onAddEvent && (
                  <button
                    className={styles.addEventBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      const date = new Date(dayInfo.date);
                      date.setDate(date.getDate() + 1);
                      handleDateClick(
                        date.toLocaleDateString(),
                        dayInfo.isCurrentMonth,
                      );
                      handleAddEvent(
                        date.toLocaleDateString(),
                        dayInfo.isCurrentMonth,
                      );
                    }}
                    title="Adicionar evento"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        renderWeekView()
      )}
    </div>
  );
};
