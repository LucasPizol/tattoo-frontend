import { Select } from "@/components/ui/Select";
import type { Stock } from "@/services/requests/products/types";
import { useEffect } from "react";
import type { SelectedProductInOrder } from "..";

type OwnerSelectProps = {
  options: { label: string; value: string; stock: Stock }[];
  onSelect: (product: SelectedProductInOrder) => void;
  product: SelectedProductInOrder;
};

export const OwnerSelect = ({
  options,
  onSelect,
  product,
}: OwnerSelectProps) => {
  useEffect(() => {
    if (options.length === 1) {
      onSelect({
        ...product,
        stock: options[0].stock,
      });
    }
  }, [options.length]);

  return (
    <Select
      field="stockId"
      options={options}
      value={options.length === 1 ? options[0].value : undefined}
      label="Selecione"
      placeholder="Selecione"
      required
      onSelect={(value) => {
        onSelect({
          ...product,
          stock: value?.stock,
        });
      }}
    />
  );
};
