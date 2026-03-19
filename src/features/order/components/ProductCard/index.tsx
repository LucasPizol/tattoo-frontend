import { Visible } from "@/components/Visible";
import type { ProductWithMaterial } from "@/services/requests/products/types";
import { cn } from "@/utils/cn";
import { MdAdd, MdImage } from "react-icons/md";
import styles from "./styles.module.scss";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";

type ProductCardProps = {
  product: ProductWithMaterial;
  onSelect?: (productId: number) => void;
  disabled?: boolean;
  className?: string;
  isSelected?: boolean;
  onAddStock?: () => void;
};

export const ProductCard = ({
  product,
  onSelect,
  disabled: disabledProp,
  className,
  isSelected,
  onAddStock,
}: ProductCardProps) => {
  const totalStock = product.stock.reduce(
    (acc, stock) => acc + stock.quantity,
    0,
  );

  const isOutOfStock = useMemo(() => {
    return product.stock.every((stock) => stock.quantity === 0);
  }, [product.stock]);

  const disabled = useMemo(() => {
    return isOutOfStock || disabledProp;
  }, [isOutOfStock, disabledProp]);

  return (
    <div className={styles.productCardContainer}>
      <div
        key={product.id}
        className={cn(styles.productCard, className, {
          [styles.disabled]: disabled,
          [styles.selected]: isSelected,
        })}
        onClick={() => {
          if (disabled) return;
          onSelect?.(product.id);
        }}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <div className={styles.productImage}>
          <Visible condition={product.images.length > 0}>
            <img
              src={product.images[0]?.thumbnailUrl || product.images[0]?.url}
              alt={product.name}
            />
          </Visible>

          <Visible condition={product.images.length === 0}>
            <div className={styles.productImagePlaceholder}>
              <MdImage />
            </div>
          </Visible>

          <div className={styles.materialInfo}>
            <span className={styles.materialName}>{product.material.name}</span>
          </div>
        </div>

        <div className={styles.productData}>
          <div className={styles.cardHeader}>
            <h3 className={styles.productName}>{product.name}</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.priceInfo}>
              <span className={styles.price}>{product.value.formatted}</span>
              <span className={styles.stockCount}>{totalStock} un.</span>
            </div>
          </div>
        </div>
      </div>
      <Visible condition={isOutOfStock}>
        <Button
          size="small"
          className={styles.outOfStockButton}
          onClick={onAddStock}
        >
          <MdAdd />
        </Button>
      </Visible>
    </div>
  );
};
