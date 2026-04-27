import { FiltersCard } from "@/components/FiltersCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/ui/DateRangePicker";
import { Select } from "@/components/ui/Select";
import type { DashboardFilter } from "@/services/requests/dashboard/types";
import { memo, useState } from "react";
import { MdDateRange, MdSearch } from "react-icons/md";
import { useDashboardFilter } from "../../hooks/useDashboardFilter";
import styles from "../../styles.module.scss";

type DashboardFiltersProps = {
  onFiltersChange: (filters: DashboardFilter) => void;
};

const QUICK_RANGES = [
  { label: "Esta semana", value: "this_week" },
  { label: "Semana passada", value: "last_week" },
  { label: "Este mês", value: "this_month" },
  { label: "Mês passado", value: "last_month" },
  { label: "Este ano", value: "this_year" },
  { label: "Ano passado", value: "last_year" },
] satisfies { label: string; value: string }[];

type QuickRangeValue = (typeof QUICK_RANGES)[number]["value"];

export const DashboardFilters = memo(
  ({ onFiltersChange }: DashboardFiltersProps) => {
    const { form, onSubmit } = useDashboardFilter(onFiltersChange);

    const [quickRange, setQuickRange] = useState<QuickRangeValue | undefined>();

    const toBRDate = (date: Date | null) => {
      if (!date) return undefined;
      return date.toLocaleDateString("pt-BR");
    };

    const getCurrentRangeFromForm = (): DateRange => {
      const startStr = form.watch("paid_at_gteq");
      const endStr = form.watch("paid_at_lteq");

      const parse = (value?: string) => {
        if (!value) return null;
        const [day, month, year] = value.split("/");
        if (!day || !month || !year) return null;
        return new Date(Number(year), Number(month) - 1, Number(day));
      };

      return {
        startDate: parse(startStr),
        endDate: parse(endStr),
      };
    };

    const handleRangeChange = (range: DateRange) => {
      form.setValue("paid_at_gteq", toBRDate(range.startDate));
      form.setValue("paid_at_lteq", toBRDate(range.endDate));

      onSubmit(form.getValues());
    };

    const applyQuickRange = (value: QuickRangeValue) => {
      const today = new Date();
      const startOfDay = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const endOfDay = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

      let start: Date = startOfDay(today);
      let end: Date = endOfDay(today);

      switch (value) {
        case "this_week": {
          const current = startOfDay(today);
          const day = current.getDay(); // 0 (Dom) - 6 (Sáb)
          const diffToMonday = (day + 6) % 7;
          start = new Date(current);
          start.setDate(current.getDate() - diffToMonday);
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          break;
        }
        case "last_week": {
          const current = startOfDay(today);
          const day = current.getDay();
          const diffToMonday = (day + 6) % 7;
          end = new Date(current);
          end.setDate(current.getDate() - diffToMonday - 1);
          start = new Date(end);
          start.setDate(end.getDate() - 6);
          break;
        }
        case "this_month": {
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
        }
        case "last_month": {
          const month = today.getMonth() - 1;
          const year =
            month < 0 ? today.getFullYear() - 1 : today.getFullYear();
          const realMonth = (month + 12) % 12;
          start = new Date(year, realMonth, 1);
          end = new Date(year, realMonth + 1, 0);
          break;
        }
        case "this_year": {
          start = new Date(today.getFullYear(), 0, 1);
          end = new Date(today.getFullYear(), 11, 31);
          break;
        }
        case "last_year": {
          const year = today.getFullYear() - 1;
          start = new Date(year, 0, 1);
          end = new Date(year, 11, 31);
          break;
        }
      }

      start = startOfDay(start);
      end = endOfDay(end);

      setQuickRange(value);
      handleRangeChange({ startDate: start, endDate: end });
    };

    return (
      <Card
        title="Filtro de Período"
        icon={<MdDateRange />}
        className={styles.filterCard}
      >
        <FiltersCard
          form={form}
          onFinishFilters={onSubmit}
          alignItems="center"
          className={styles.filterCard}
        >
          <div className={styles.filterItems}>
            <Select
              label="Período rápido"
              options={QUICK_RANGES}
              value={quickRange}
              placeholder="Selecione um período"
              onSelect={(option) =>
                applyQuickRange(option.value as QuickRangeValue)
              }
            />
            <DateRangePicker
              value={getCurrentRangeFromForm()}
              onChange={handleRangeChange}
              className={styles.input}
            />
          </div>
          <Button
            className={styles.filterButton}
            variant="primary"
            prefixIcon={<MdSearch />}
            size="small"
            type="submit"
          >
            Buscar
          </Button>
        </FiltersCard>
      </Card>
    );
  },
);

DashboardFilters.displayName = "DashboardFilters";
