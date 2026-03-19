import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Table } from "@/components/ui/Table";
import { useEffect, useState } from "react";
import type { SelectedProductInOrder } from "..";
import { OwnerSelect } from "./OwnerSelect";

type MissingStockTableProps = {
  missingStockProducts: SelectedProductInOrder[];
  onSelect: (product: SelectedProductInOrder) => void;
  initialSelectedProducts: SelectedProductInOrder[];
};

export const MissingStockTable = ({
  missingStockProducts,
  onSelect,
  initialSelectedProducts,
}: MissingStockTableProps) => {
  const [initialMissingProducts, setInitialMissingProducts] = useState<
    SelectedProductInOrder[]
  >(initialSelectedProducts);

  const getStocks = (product: SelectedProductInOrder) => {
    return (
      product.product?.stock
        ?.filter(
          (stock) =>
            stock.quantity > 0 &&
            !initialSelectedProducts.some(
              (p) =>
                p.product.id === product.product.id && p.stock?.id === stock.id
            )
        )
        .sort((a, b) => a.user.name.localeCompare(b.user.name)) || []
    );
  };

  useEffect(() => {
    setInitialMissingProducts(missingStockProducts);
  }, []);

  const tableColumns = [
    {
      key: "images",
      label: " ",
      minWidth: "94px",
      maxWidth: "94px",
      padding: "4px",
      render: (product: SelectedProductInOrder) => {
        return <ImagePreview images={product.product.images} />;
      },
    },
    {
      key: "product",
      label: "Produto",
      render: (product: SelectedProductInOrder) => (
        <p>{product.product.name}</p>
      ),
    },
    {
      key: "stockSelect",
      label: "Selecionar dono",
      render: (product: SelectedProductInOrder) => {
        const options = getStocks(product).map((stock) => ({
          label: stock.user.name.split(" ")[0],
          value: stock.id.toString(),
          stock: stock,
        }));

        return (
          <OwnerSelect
            options={options}
            onSelect={onSelect}
            product={product}
          />
        );
      },
    },
  ];

  return <Table columns={tableColumns} data={initialMissingProducts} />;
};
