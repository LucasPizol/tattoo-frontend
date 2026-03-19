"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdKeyboardArrowDown, MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import { Loading } from "../ui/Loading";
import { Visible } from "../Visible";
import styles from "./styles.module.scss";

type Option<T> = {
  label: string;
  value: string | number;
} & T;

interface SearchableSelectProps<T> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  error?: string;
  options: Option<T>[];
  renderOption?: (option: Option<T>) => React.ReactNode;
  onSelect?: (option: Option<T>) => void;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  clear?: boolean;
  createItem?: (searchTerm: string) => React.ReactNode;
  initialValue?: Option<T>;
  value?: string | number;
  disabled?: boolean;
  containerClassName?: string;
  isLoading?: boolean;
  onOpen?: () => void;
  onClear?: () => void;
  noResultsText?: string;
  searchTerm?: string;
  setSearchTerm?: (searchTerm: string) => void;
  link?: {
    to: string;
    label: string;
  };
  mask?: (value: string) => string;
}

export const SearchableSelect = <T,>({
  label,
  prefixIcon,
  error,
  options,
  renderOption,
  onSelect,
  onSearch,
  placeholder,
  searchPlaceholder = "Buscar...",
  className,
  required,
  id,
  clear = true,
  createItem,
  initialValue,
  value,
  disabled,
  containerClassName,
  isLoading,
  onOpen,
  onClear,
  noResultsText = "Nenhum resultado encontrado",
  searchTerm: externalSearchTerm,
  setSearchTerm: setExternalSearchTerm,
  link,
  mask,
}: SearchableSelectProps<T>) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option<T> | null>(
    initialValue || null
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const debounce = useDebounce();

  const isLabelFloating = isOpen || !!selectedOption;

  useEffect(() => {
    if (externalSearchTerm) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  const onChange = (option: Option<T>, isClear?: boolean) => {
    if ((!isOpen && !isClear) || option?.value === selectedOption?.value)
      return;

    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
    setSearchTerm("");
    setExternalSearchTerm?.("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setExternalSearchTerm?.("");
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
    if (disabled) return;
    onOpen?.();

    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      setTimeout(() => {
        updateDropdownPosition();
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setExternalSearchTerm?.(value);
    setIsDebouncing(true);

    debounce.onChangeDebounce(async () => {
      await onSearch?.(value);

      setTimeout(() => {
        setIsDebouncing(false);
      }, 200);
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm("");
    setExternalSearchTerm?.("");
    onClear?.();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClose);
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    }

    return () => {
      document.removeEventListener("click", handleClose);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      setSelectedOption(
        options.find((option) => option.value === value) || null
      );
    }
  }, [value, options]);

  const RenderCreateItem = () => {
    if (!createItem) return null;
    return createItem(searchTerm);
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
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
        <div className={styles.searchContainer}>
          <Input
            ref={inputRef}
            field="search"
            prefixIcon={<MdSearch size={16} />}
            mask={mask}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <RenderCreateItem />

        {isLoading || isDebouncing ? (
          <div className={styles.loading}>
            <Loading size={16} />
          </div>
        ) : options.length > 0 ? (
          options.map((option) => (
            <div
              key={option.value}
              className={cn(styles.option, {
                [styles.option_selected]:
                  option.value === selectedOption?.value,
              })}
              onClick={() => onChange(option)}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            {!!searchTerm ? noResultsText : "Digite para buscar"}
          </div>
        )}
      </div>,
      document.querySelector("#modal-root") as HTMLElement
    );
  };

  return (
    <div
      className={cn(styles.select, className, {
        [styles.error]: !!error,
        [styles.disabled]: disabled,
        [styles.isLoading]: isLoading,
      })}
    >
      <div
        ref={selectRef}
        className={cn(styles.selectContainer, {
          [styles.selectContainer_open]: isOpen,
          [styles.focused]: isLabelFloating,
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
            {selectedOption?.label ? (
              <span className={styles.selectContent__selectedText}>
                {selectedOption.label}
              </span>
            ) : (
              <span className={styles.placeholder}>
                {isLabelFloating ? placeholder : ""}
              </span>
            )}
          </div>
        </div>

        {isLoading && (
          <div className={styles.icon}>
            <Loading size={16} />
          </div>
        )}

        <Visible condition={clear && !!selectedOption && !disabled && !isLoading}>
          <div
            className={styles.icon}
            style={{ paddingRight: 8 }}
            onClick={handleClear}
          >
            <MdClose
              className={styles.icon_clear}
              size={16}
              style={{ color: "#777", cursor: "pointer" }}
            />
          </div>
        </Visible>

        {link && (
          <div className={styles.icon} style={{ paddingRight: 8 }}>
            <Link to={link!.to} className={styles.link}>
              {link?.label}
            </Link>
          </div>
        )}

        <div className={styles.icon} style={{ paddingRight: 8 }}>
          <MdKeyboardArrowDown
            className={cn(styles.arrowIcon, {
              [styles.arrowIcon_open]: isOpen,
            })}
            size={16}
          />
        </div>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {renderDropdown()}
    </div>
  );
};
