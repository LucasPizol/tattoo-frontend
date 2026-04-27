"use client";

import { useOptionalFormContext } from "@/hooks/useOptionalFormContext";
import { cn } from "@/utils/cn";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdKeyboardArrowDown, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { PopoverInputWrapper } from "../../PopoverInputWrapper";
import { Visible } from "../../Visible";
import { Button } from "../Button";
import { Label } from "../Label";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

const SELECT_CLOSE_EVENT = "select:close-others";

type Option<T> = {
  label: string;
  value: string | number;
} & T;

type CreateItemProps =
  | { label?: string; onClick: () => void }
  | ((searchTerm: string) => React.ReactNode);

type SelectProps<T> = {
  field?: string;
  noForm?: boolean;
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  disabledHelperText?: string;
  error?: string;
  options: Option<T>[];
  renderOption?: (option: Option<T>) => React.ReactNode;
  onSelect?: (option: Option<T>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  clear?: boolean;
  createItem?: CreateItemProps;
  initialValue?: Option<T>;
  value?: string | number;
  disabled?: boolean;
  containerClassName?: string;
  loading?: boolean;
  onOpen?: () => void;
  onClear?: () => void;
  link?: {
    to: string;
    label: string;
  };
  valueAsNumber?: boolean;
  searchable?: boolean;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  noResultsText?: string;
  searchMask?: (value: string) => string;
};

export const Select = <T,>({
  field,
  noForm,
  label,
  disabledHelperText,
  prefixIcon,
  error,
  options,
  renderOption,
  onSelect,
  placeholder,
  className,
  required,
  id,
  clear = true,
  createItem,
  initialValue,
  disabled,
  containerClassName,
  loading,
  onOpen,
  onClear,
  link,
  value,
  valueAsNumber = false,
  searchable = true,
  onSearch,
  searchPlaceholder = "Buscar...",
  noResultsText = "Nenhum resultado encontrado",
  searchMask,
}: SelectProps<T>) => {
  const formCtx = useOptionalFormContext();
  const hasForm = !!formCtx && !!field && !noForm;

  const instanceId = useId();
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option<T> | null>(
    initialValue || null,
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm || onSearch) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(term),
    );
  }, [options, searchTerm, searchable, onSearch]);

  const onChange = (option: Option<T>, isClear?: boolean) => {
    if ((!isOpen && !isClear) || option?.value === selectedOption?.value)
      return;
    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    onOpen?.();

    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      document.dispatchEvent(
        new CustomEvent(SELECT_CLOSE_EVENT, { detail: instanceId }),
      );
      setTimeout(() => {
        updateDropdownPosition();
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const val = searchMask ? searchMask(raw) : raw;
    setSearchTerm(val);
    onSearch?.(val);
  };

  useEffect(() => {
    const onCloseOthers = (e: Event) => {
      if ((e as CustomEvent).detail !== instanceId) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener(SELECT_CLOSE_EVENT, onCloseOthers);

    if (isOpen) {
      document.addEventListener("click", handleClose);
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    }

    return () => {
      document.removeEventListener(SELECT_CLOSE_EVENT, onCloseOthers);
      document.removeEventListener("click", handleClose);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  const fieldValue = hasForm ? formCtx.watch(field) : undefined;
  const formErrors = hasForm ? formCtx.formState.errors : {};

  useEffect(() => {
    if (hasForm && fieldValue !== undefined) {
      const data = options.find(
        (option) =>
          option.value === (valueAsNumber ? Number(fieldValue) : fieldValue),
      );
      if (!data && !selectedOption) setSelectedOption(data || null);
      if (data) setSelectedOption(data);
    } else if (hasForm && fieldValue === undefined) {
      setSelectedOption(null);
    }
  }, [options, fieldValue, hasForm]);

  useEffect(() => {
    if (!hasForm && value !== undefined) {
      setSelectedOption(
        options.find((option) => option.value === value) || null,
      );
    }
  }, [value, options, hasForm]);

  useEffect(() => {
    if (selectedOptionRef.current) {
      selectedOptionRef.current?.scrollIntoView({ block: "center" });
    }
  }, [selectedOptionRef.current]);

  const fieldError = hasForm ? formErrors[field] : undefined;
  const resolvedError = error || (fieldError?.message as string | undefined);

  const renderCreateItem = () => {
    if (!createItem) return null;
    if (typeof createItem === "function") return createItem(searchTerm);
    return (
      <Button
        className={styles.createItem}
        variant="primary"
        onClick={() => createItem.onClick()}
      >
        {createItem.label || "Criar novo"}
      </Button>
    );
  };

  const handleOptionClick = (option: Option<T>) => {
    onChange(option);
    if (hasForm) {
      formCtx.setValue(
        field,
        valueAsNumber ? Number(option.value) : option.value,
      );
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    if (hasForm) {
      formCtx.setValue(field, undefined);
    }
    setSelectedOption(null);
    setIsOpen(false);
  };

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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {searchable && (
          <div className={styles.searchContainer}>
            <MdSearch size={16} className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {renderCreateItem()}

        {loading ? (
          <div className={styles.loading}>
            <Loading size={16} />
          </div>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              ref={
                option.value === selectedOption?.value
                  ? selectedOptionRef
                  : null
              }
              key={option.value}
              className={cn(styles.option, {
                [styles.option_selected]:
                  option.value === selectedOption?.value,
              })}
              onClick={() => handleOptionClick(option)}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))
        ) : searchable ? (
          <div className={styles.noResults}>{noResultsText}</div>
        ) : null}
      </div>,
      document.querySelector("#modal-root") as HTMLElement,
    );
  };

  return (
    <PopoverInputWrapper
      disabledHelperText={disabledHelperText}
      disabled={disabled}
    >
      <div
        className={cn(styles.select, className, {
          [styles.error]: !!resolvedError,
          [styles.disabled]: disabled,
          [styles.loadingContainer]: loading,
        })}
      >
        {label && (
          <Label
            htmlFor={id}
            required={required}
            disabled={disabled}
            error={!!resolvedError}
          >
            {label}
          </Label>
        )}
        <div
          ref={selectRef}
          className={cn(styles.selectContainer, {
            [styles.selectContainer_open]: isOpen,
            [containerClassName || ""]: !!containerClassName,
          })}
          onClick={handleToggle}
          tabIndex={0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle(e as any);
            } else if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
        >
          {prefixIcon && (
            <div className={styles.icon} style={{ paddingLeft: 8 }}>
              {prefixIcon}
            </div>
          )}

          <div className={styles.selectIcon}>
            <MdKeyboardArrowDown
              className={cn(styles.selectIcon_svg, {
                [styles.selectIcon_open]: isOpen,
              })}
            />
          </div>

          <div
            className={cn(styles.selectContent, {
              [styles.selectContent_open]: isOpen,
            })}
          >
            <div className={styles.selectContent__selected}>
              {selectedOption ? (
                renderOption ? (
                  renderOption(selectedOption)
                ) : (
                  selectedOption.label
                )
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </div>
          </div>

          {loading && (
            <div className={styles.icon}>
              <Loading size={16} />
            </div>
          )}

          <Visible
            condition={clear && !!selectedOption && !disabled && !loading}
          >
            <div
              className={styles.icon}
              style={{ paddingRight: 8 }}
              onClick={handleClear}
            >
              {clear && (
                <MdClose
                  className={styles.icon_clear}
                  size={16}
                  style={{ color: "#777", cursor: "pointer" }}
                />
              )}
            </div>
          </Visible>
        </div>
        {link && !loading && (
          <Link to={link.to} className={styles.link}>
            {link.label}
          </Link>
        )}
        {resolvedError && (
          <p className={styles.errorMessage}>{resolvedError}</p>
        )}
        {renderDropdown()}
      </div>
    </PopoverInputWrapper>
  );
};
