import type { StockMovement, StockMovementMovementType } from "@/features/stock/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useStockMovementListQuery } from "../http/queries/stockMovementQuery";
import { useDeleteStockMovement } from "../http/mutations/stockMovementMutations";

const filterSchema = z.object({
  product_name_cont: z.string().optional(),
  created_at_gteq: z.string().optional(),
  created_at_lteq: z.string().optional(),
  movement_type_in: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
});

type FilterSchema = z.infer<typeof filterSchema>;

export const useStockMovement = () => {
  const form = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      product_name_cont: "",
      created_at_gteq: "",
      created_at_lteq: "",
      movement_type_in: [],
    },
  });

  const { mutateAsync: deleteStockMovement, isPending: isDestroying } = useDeleteStockMovement();

  const { data, isLoading, refetch, onChangeFilters, pagination, filters } =
    useStockMovementListQuery();

  const onFinishFilters = useCallback(
    (data: FilterSchema) => {
      onChangeFilters({
        ...filters,
        ...data,
        movement_type_in: data.movement_type_in?.map(
          (type) => type.value,
        ) as unknown as StockMovementMovementType[],
      });
    },
    [onChangeFilters, filters],
  );

  const handleDestroyStockMovement = useCallback(
    async (stockMovement: StockMovement) => {
      await deleteStockMovement(stockMovement.id);
    },
    [deleteStockMovement],
  );

  return {
    stockMovements: data,
    isLoading,
    pagination,
    refetch,
    handleDestroyStockMovement,
    isDestroying,
    onFinishFilters,
    form,
  };
};
