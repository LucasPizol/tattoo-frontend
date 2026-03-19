import type { SortableOrder } from "@/components/ui/Table";
import { api } from "@/services/api";
import type { Indication } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useIndicationList = () => {
  const [settedFilters, setSettedFilters] = useState<{ s: string }>({ s: "" });

  const { data, isLoading, error } = useQuery({
    queryKey: ["indications", settedFilters],
    queryFn: () => api.get<{ indications: Indication[] }>("/api/indications", { q: settedFilters }),
  });

  return {
    indications: data?.indications ?? [],
    isLoading,
    error,
    onSort: (sort: { key: string; order: SortableOrder }) => {
      if (!sort.order) {
        setSettedFilters({ ...settedFilters, s: "" });
        return;
      }

      setSettedFilters({ ...settedFilters, s: `${sort.key} ${sort.order}` });
    },
  };
};
