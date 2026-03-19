import type { DashboardFilter } from "@/features/dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const currentDate = new Date();

const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);
const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
);

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const getDefaultFilters = (): DashboardFilter => ({
  paid_at_gteq: formatDate(firstDayOfMonth),
  paid_at_lteq: formatDate(lastDayOfMonth),
});

export const useDashboardFilter = (
  onFiltersChange: (filters: DashboardFilter) => void
) => {
  const form = useForm<DashboardFilter>({
    resolver: zodResolver(
      z.object({
        paid_at_gteq: z.string().optional(),
        paid_at_lteq: z.string().optional(),
      })
    ),
    defaultValues: {
      paid_at_gteq: firstDayOfMonth.toLocaleDateString("pt-BR"),
      paid_at_lteq: lastDayOfMonth.toLocaleDateString("pt-BR"),
    },
  });

  const onSubmit = (data: DashboardFilter) => {
    const convertDate = (date: string) => {
      const [day, month, year] = date.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    };

    onFiltersChange({
      paid_at_gteq: data.paid_at_gteq
        ? formatDate(convertDate(data.paid_at_gteq))
        : formatDate(firstDayOfMonth),
      paid_at_lteq: data.paid_at_lteq
        ? formatDate(convertDate(data.paid_at_lteq))
        : formatDate(lastDayOfMonth),
    });
  };

  return {
    form,
    onSubmit,
  };
};
