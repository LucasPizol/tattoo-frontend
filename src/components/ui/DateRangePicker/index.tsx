import { cn } from "@/utils/cn";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdCalendarToday, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./styles.module.scss";

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

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = "Selecione um período",
  className,
  label,
  disabled = false,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [startMonth, setStartMonth] = useState(today.getMonth());
  const [startYear, setStartYear] = useState(today.getFullYear());
  const [selectedStart, setSelectedStart] = useState<Date | null>(
    value?.startDate || null,
  );
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(
    value?.endDate || null,
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sincroniza com value externo
  useEffect(() => {
    if (value) {
      setSelectedStart(value.startDate);
      setSelectedEnd(value.endDate);
    }
  }, [value]);

  // Fecha popover ao clicar fora
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger = !triggerRef.current?.contains(target);
      const isOutsidePopover = !popoverRef.current?.contains(target);

      if (isOutsideTrigger && isOutsidePopover) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Calcula segundo mês (mês seguinte ao primeiro)
  const endMonth = useMemo(() => {
    if (startMonth === 11) return 0;
    return startMonth + 1;
  }, [startMonth]);

  const endYear = useMemo(() => {
    if (startMonth === 11) return startYear + 1;
    return startYear;
  }, [startMonth, startYear]);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatInputValue = (): string => {
    if (!selectedStart && !selectedEnd) return "";
    if (selectedStart && selectedEnd) {
      return `${formatDate(selectedStart)} - ${formatDate(selectedEnd)}`;
    }
    if (selectedStart) {
      return `${formatDate(selectedStart)} - ...`;
    }
    return "";
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const isDateStart = (date: Date): boolean => {
    if (!selectedStart) return false;
    return (
      date.getDate() === selectedStart.getDate() &&
      date.getMonth() === selectedStart.getMonth() &&
      date.getFullYear() === selectedStart.getFullYear()
    );
  };

  const isDateEnd = (date: Date): boolean => {
    if (!selectedEnd) return false;
    return (
      date.getDate() === selectedEnd.getDate() &&
      date.getMonth() === selectedEnd.getMonth() &&
      date.getFullYear() === selectedEnd.getFullYear()
    );
  };

  const isDateInHoverRange = (date: Date): boolean => {
    if (!selectedStart || selectedEnd || !hoverDate) return false;
    const start = selectedStart < hoverDate ? selectedStart : hoverDate;
    const end = selectedStart < hoverDate ? hoverDate : selectedStart;
    return date >= start && date <= end;
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCalendarDays = (month: number, year: number) => {
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInMonth = getDaysInMonth(month, year);
    const daysInPrevMonth = getDaysInMonth(month - 1, year);

    const days: Array<{
      day: number;
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Dias do mês anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Dias do próximo mês para completar a grade
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Inicia nova seleção
      setSelectedStart(date);
      setSelectedEnd(null);
      setHoverDate(null);
    } else if (selectedStart && !selectedEnd) {
      // Completa a seleção
      if (date < selectedStart) {
        // Se clicou em data anterior, inverte
        setSelectedEnd(selectedStart);
        setSelectedStart(date);
      } else {
        setSelectedEnd(date);
      }
      setHoverDate(null);
    }
  };

  const handleDateHover = (date: Date) => {
    if (selectedStart && !selectedEnd) {
      setHoverDate(date);
    }
  };

  const handleDone = () => {
    if (selectedStart && selectedEnd) {
      onChange?.({
        startDate: selectedStart,
        endDate: selectedEnd,
      });
    }
    setIsOpen(false);
    setHoverDate(null);
  };

  const handleClear = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setHoverDate(null);
    onChange?.({
      startDate: null,
      endDate: null,
    });
  };

  const handleToday = () => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    setSelectedStart(todayDate);
    setSelectedEnd(todayDate);
    setHoverDate(null);
  };

  const goToPreviousMonth = () => {
    if (startMonth === 0) {
      setStartMonth(11);
      setStartYear(startYear - 1);
    } else {
      setStartMonth(startMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (startMonth === 11) {
      setStartMonth(0);
      setStartYear(startYear + 1);
    } else {
      setStartMonth(startMonth + 1);
    }
  };

  const startDays = useMemo(
    () => getCalendarDays(startMonth, startYear),
    [startMonth, startYear],
  );

  const endDays = useMemo(
    () => getCalendarDays(endMonth, endYear),
    [endMonth, endYear],
  );

  const renderCalendar = (
    month: number,
    year: number,
    days: typeof startDays,
  ) => {
    return (
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <button
            className={styles.navButton}
            onClick={goToPreviousMonth}
            type="button"
          >
            <MdChevronLeft size={20} />
          </button>
          <div className={styles.monthYear}>
            {MONTHS[month]} {year}
          </div>
          <button
            className={styles.navButton}
            onClick={goToNextMonth}
            type="button"
          >
            <MdChevronRight size={20} />
          </button>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((dayInfo, index) => {
            const isDisabled = isDateDisabled(dayInfo.date);
            const isInRange =
              isDateInRange(dayInfo.date) || isDateInHoverRange(dayInfo.date);
            const isStart = isDateStart(dayInfo.date);
            const isEnd = isDateEnd(dayInfo.date);

            return (
              <button
                key={index}
                type="button"
                className={cn(styles.day, {
                  [styles.otherMonth]: !dayInfo.isCurrentMonth,
                  [styles.today]: dayInfo.isToday,
                  [styles.disabled]: isDisabled,
                  [styles.inRange]: isInRange,
                  [styles.start]: isStart,
                  [styles.end]: isEnd,
                })}
                onClick={() => handleDateClick(dayInfo.date)}
                onMouseEnter={() => handleDateHover(dayInfo.date)}
                disabled={isDisabled}
              >
                {dayInfo.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const calculatePopoverPosition = () => {
    if (!triggerRef.current || !popoverRef.current) {
      return { top: 0, left: 0 };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Posição inicial: abaixo do trigger, alinhado à esquerda
    let left = triggerRect.left + scrollX;
    let top = triggerRect.bottom + scrollY + 8;

    // Verifica se o popover vai sair da tela à direita
    const popoverWidth = popoverRect.width || 600; // fallback para min-width do CSS
    const rightEdge = triggerRect.left + popoverWidth;

    if (rightEdge > viewportWidth) {
      // Ajusta para alinhar à direita do trigger
      left = triggerRect.right + scrollX - popoverWidth;

      // Se ainda sair da tela, alinha à direita da viewport
      if (left < scrollX) {
        left = scrollX + viewportWidth - popoverWidth - 16; // 16px de margem
      }
    }

    // Verifica se o popover vai sair da tela à esquerda
    if (left < scrollX) {
      left = scrollX + 16; // 16px de margem
    }

    // Verifica se o popover vai sair da tela embaixo
    const popoverHeight = popoverRect.height || 500; // fallback estimado
    const bottomEdge = triggerRect.bottom + popoverHeight + 8;

    if (bottomEdge > viewportHeight + scrollY) {
      // Posiciona acima do trigger
      top = triggerRect.top + scrollY - popoverHeight - 8;

      // Se ainda sair da tela, alinha ao topo da viewport
      if (top < scrollY) {
        top = scrollY + 16; // 16px de margem
      }
    }

    return { top, left };
  };

  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      setPopoverPosition(calculatePopoverPosition());
    }
  }, [isOpen, startMonth, startYear]);

  // Recalcula posição quando a janela é redimensionada ou scrollado
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setPopoverPosition(calculatePopoverPosition());
    };

    const handleScroll = () => {
      setPopoverPosition(calculatePopoverPosition());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className={cn(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div ref={triggerRef} className={styles.trigger}>
        <Input
          noForm
          value={formatInputValue()}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          prefixIcon={<MdCalendarToday />}
          className={styles.input}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={styles.popover}
            style={{
              position: "absolute",
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              zIndex: 9999,
              visibility:
                popoverPosition.top !== 0 && popoverPosition.left !== 0
                  ? "visible"
                  : "hidden",
            }}
          >
            <div className={styles.popoverContent}>
              <div className={styles.calendarsContainer}>
                {renderCalendar(startMonth, startYear, startDays)}
                {renderCalendar(endMonth, endYear, endDays)}
              </div>
              <div className={styles.actions}>
                <Button variant="primary" onClick={handleDone}>
                  Concluído
                </Button>
                <div className={styles.secondaryActions}>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={handleToday}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={handleClear}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
