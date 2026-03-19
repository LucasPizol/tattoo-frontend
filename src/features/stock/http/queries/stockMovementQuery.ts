import { useQueryPagination } from "@/hooks/useQueryPagination";
import type { Pagination } from "@/models/Pagination";
import { api } from "@/services/api";
import type { StockMovement, StockMovementFilters } from "../../types";

export const useStockMovementListQuery = (initialFilters?: Partial<StockMovementFilters>) =>
  useQueryPagination<StockMovement, StockMovementFilters>({
    queryKey: ["stock_movements"],
    queryFn: (pagination: Pagination & { q?: StockMovementFilters }) =>
      api.get("/api/stock_movements", pagination),
    initialFilters: {
      product_name_cont: "",
      created_at_gteq: "",
      created_at_lteq: "",
      movement_type_in: [],
      ...initialFilters,
    },
  });
