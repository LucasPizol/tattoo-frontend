import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type EditableCellProps = {
  value: string | number;
  type?: "number" | "text";
  min?: number;
  max?: number;
  onBlur?: (value: string | number) => Promise<void>;
  mask?: (value: string | number) => string | number;
  renderLabel?: (value: string | number) => React.ReactNode;
  alignment?: "left" | "center" | "right";
  className?: string;
};

export const EditableCell = ({
  value: initialValue,
  type,
  min,
  max,
  onBlur,
  mask,
  renderLabel,
  alignment = "center",
  className,
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChangedValue, setHasChangedValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async (v: string | number) => {
    const newValue = mask ? mask(v) : v;

    if (!hasChangedValue) {
      setIsEditing(false);
      return;
    }

    setValue(newValue);
    if (onBlur) await onBlur(newValue);
    setIsEditing(false);
    setHasChangedValue(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      handleBlur(value);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        mask={(v) => (mask ? String(mask(v)) : String(v))}
        onChange={async (e) => {
          let newValue = mask ? mask(e.target.value) : e.target.value;

          if (type === "number") {
            const includesPlusSign = (newValue as string).includes("+");
            const includesMinusSign = (newValue as string).includes("-");

            newValue = (newValue as string).replace(/\D/g, "");
            newValue = includesPlusSign
              ? "+" + newValue
              : includesMinusSign
                ? "-" + newValue
                : newValue;
          }

          if (newValue && max && Number(newValue) > max) {
            newValue = max.toString();
          }

          if (newValue && min && Number(newValue) < min) {
            newValue = min.toString();
          }

          if (newValue !== value) {
            setValue(newValue);
            setHasChangedValue(true);
          }
        }}
        onBlur={(e) =>
          handleBlur(!e.target.value ? String(min || "1") : e.target.value)
        }
        onKeyDown={handleKeyDown}
        className={cn(styles.editableInput, className)}
        max={max}
      />
    );
  }

  return (
    <div className={cn(styles.cell, className)} onClick={handleClick}>
      <span
        className={cn(styles.cellValue, {
          [styles.left]: alignment === "left",
          [styles.right]: alignment === "right",
          [styles.center]: alignment === "center",
        })}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {renderLabel ? renderLabel(value) : mask ? mask(value) : value}
      </span>
    </div>
  );
};
