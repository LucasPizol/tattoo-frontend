"use client";

import { buildErrors } from "@/utils/build-errors";
import { cn } from "@/utils/cn";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { Visible } from "../../Visible";
import { Button } from "../Button";
import styles from "./styles.module.scss";

type Option<T> = {
  label: string;
  value: string;
} & T;

type CreateItemProps = {
  label?: string;
  onClick: () => void;
};

interface MultiSelectProps<T> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  error?: string;
  options: Option<T>[];
  renderOption?: (option: Option<T>) => React.ReactNode;
  onSelect?: (option: Option<T> | null, options: Option<T>[]) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  clear?: boolean;
  createItem?: CreateItemProps;
  field: string;
}

export const MultiSelect = <T,>({
  label,
  prefixIcon,
  error,
  options,
  renderOption,
  onSelect,
  onClear,
  placeholder,
  className,
  required,
  id,
  clear = true,
  createItem,
  field,
}: MultiSelectProps<T>) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const errorMessage = buildErrors(field, errors);

  const { fields, append, remove } = useFieldArray({
    control: control,
    keyName: field,
    name: field as never,
  });

  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const selectedOptions = fields.map((field) => ({
    label: field.label,
    value: field.value,
  }));

  const isLabelFloating = isOpen || selectedOptions.length > 0;

  const isSelected = useCallback(
    (option: Option<T>) => watch(field).includes(option.value),
    [watch(field), field],
  );

  const onChange = async (option: Option<T> | null) => {
    const selected = fields.findIndex((f) => f.value === option?.value);

    if (selected !== -1) {
      remove(selected);
      onSelect?.(
        option,
        selectedOptions.filter((o) => o.value !== option?.value) as Option<T>[],
      );
      return;
    }

    append({
      label: option?.label,
      value: option?.value,
    });
    onSelect?.(option, [
      ...selectedOptions,
      option as Option<T>,
    ] as Option<T>[]);
  };

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      setTimeout(updateDropdownPosition, 0);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current?.contains(event.target as Node) ||
        dropdownRef.current?.contains(event.target as Node)
      )
        return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className={styles.selectContent__options}
        style={{
          position: "absolute",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Visible condition={!!createItem}>
          <Button
            className={styles.createItem}
            variant="primary"
            onClick={() => createItem?.onClick()}
          >
            {createItem?.label || "Criar novo"}
          </Button>
        </Visible>

        {options.map((option) => (
          <div
            key={option.value}
            className={cn(styles.option, {
              [styles.option_selected]: isSelected(option),
            })}
            onClick={(e) => {
              e.stopPropagation();
              onChange(option);
            }}
          >
            {renderOption ? renderOption(option) : option.label}
          </div>
        ))}
      </div>,
      document.querySelector("#modal-root") as HTMLElement,
    );
  };

  return (
    <div
      className={cn(styles.select, className, {
        [styles.error]: !!error,
      })}
    >
      <div
        className={cn(styles.selectContainer, {
          [styles.selectContainer_open]: isOpen,
          [styles.focused]: isLabelFloating,
        })}
        onClick={handleToggle}
        ref={selectRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle(e as any);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        {label && (
          <label
            className={cn(styles.label, {
              [styles.floating]: isLabelFloating,
            })}
            htmlFor={id}
          >
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {prefixIcon && (
          <div className={styles.icon} style={{ paddingLeft: 8 }}>
            {prefixIcon}
          </div>
        )}

        <div
          className={cn(styles.selectContent, {
            [styles.selectContent_open]: isOpen,
          })}
        >
          <div className={styles.selectContent__selected}>
            {selectedOptions.length ? (
              <div className={styles.tagsContainer}>
                {selectedOptions.map((option, index) => (
                  <div key={`${option.value}-${index}`} className={styles.tag}>
                    <span className={styles.tagLabel} title={option.label}>
                      {option.label}
                    </span>
                    <button
                      className={styles.tagRemove}
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                      type="button"
                      title={`Remover ${option.label}`}
                    >
                      <MdClose size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles.placeholder}>
                {isLabelFloating ? placeholder : ""}
              </span>
            )}
          </div>
        </div>

        <Visible condition={clear && !!selectedOptions.length}>
          <div
            className={styles.icon}
            style={{ paddingRight: 8 }}
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
          >
            {clear && (
              <MdClose
                className={styles.icon_clear}
                size={16}
                style={{ color: "var(--text-tertiary)", cursor: "pointer" }}
              />
            )}
          </div>
        </Visible>
      </div>
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage as string}</p>
      )}
      {renderDropdown()}
    </div>
  );
};
