"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFormContext } from "react-hook-form";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { PopoverInputWrapper } from "../../PopoverInputWrapper";
import { Visible } from "../../Visible";
import { Button } from "../Button";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type Option<T> = {
  label: string;
  value: string | number;
} & T;

type CreateItemProps = {
  label?: string;
  onClick: () => void;
};

type SelectNoFormProps = {
  noForm: true;
  field?: never;
};

type SelectFormProps = {
  noForm?: false;
  field: string;
};

type SelectProps<T> = (SelectNoFormProps | SelectFormProps) & {
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
};

export const Select = <T,>(props: SelectProps<T>) => {
  if (props.noForm) {
    return <SelectNoForm {...props} />;
  }
  return <SelectForm {...props} />;
};

export const SelectForm = <T,>({
  label,
  field,
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
  valueAsNumber = false,
}: SelectProps<T> & SelectFormProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option<T> | null>(
    initialValue || null,
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const isLabelFloating = isOpen || !!selectedOption;

  const onChange = (option: Option<T>, isClear?: boolean) => {
    if ((!isOpen && !isClear) || option?.value === selectedOption?.value)
      return;
    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
      setTimeout(updateDropdownPosition, 0);
    }
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

  const fieldValue = watch(field);

  useEffect(() => {
    if (fieldValue !== undefined) {
      const data = options.find(
        (option) =>
          option.value === (valueAsNumber ? Number(fieldValue) : fieldValue),
      );

      if (!data && !selectedOption) setSelectedOption(data || null);
      if (data) setSelectedOption(data);
    } else {
      setSelectedOption(null);
    }
  }, [options, fieldValue]);

  useEffect(() => {
    if (selectedOptionRef.current) {
      selectedOptionRef.current?.scrollIntoView({ block: "center" });
    }
  }, [selectedOptionRef.current]);

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
        <Visible condition={!!createItem}>
          <Button
            className={styles.createItem}
            variant="primary"
            onClick={() => createItem?.onClick()}
          >
            {createItem?.label || "Criar novo"}
          </Button>
        </Visible>

        {loading ? (
          <div className={styles.loading}>
            <Loading size={16} />
          </div>
        ) : (
          options.map((option) => (
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
              onClick={() => {
                onChange(option);
                setValue(
                  field,
                  valueAsNumber ? Number(option.value) : option.value,
                );
              }}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))
        )}
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
          [styles.error]: !!error,
          [styles.disabled]: disabled,
          [styles.loadingContainer]: loading,
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
                <span className={styles.placeholder}>
                  {isLabelFloating ? placeholder : ""}
                </span>
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
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
                setValue(field, undefined);
                setSelectedOption(null);
              }}
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
        {errors[field] && (
          <p className={styles.errorMessage}>
            {errors[field]?.message as string}
          </p>
        )}
        {renderDropdown()}
      </div>
    </PopoverInputWrapper>
  );
};

export const SelectNoForm = <T,>({
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
}: SelectProps<T> & SelectNoFormProps) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option<T> | null>(
    initialValue || null,
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const isLabelFloating = isOpen || !!selectedOption;

  const onChange = (option: Option<T>, isClear?: boolean) => {
    if ((!isOpen && !isClear) || option?.value === selectedOption?.value)
      return;
    setSelectedOption(option);
    onSelect?.(option);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
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
      setTimeout(updateDropdownPosition, 0);
    }
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
    if (selectedOptionRef.current) {
      selectedOptionRef.current?.scrollIntoView({ block: "center" });
    }
  }, [selectedOptionRef.current]);

  useEffect(() => {
    if (value) {
      setSelectedOption(
        options.find((option) => option.value === value) || null,
      );
    }
  }, [value, options]);

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
        <Visible condition={!!createItem}>
          <Button
            className={styles.createItem}
            variant="primary"
            onClick={() => createItem?.onClick()}
          >
            {createItem?.label || "Criar novo"}
          </Button>
        </Visible>

        {loading ? (
          <div className={styles.loading}>
            <Loading />
          </div>
        ) : (
          options.map((option) => (
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
              onClick={() => {
                onChange(option);
              }}
            >
              {renderOption ? renderOption(option) : option.label}
            </div>
          ))
        )}
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
          [styles.error]: !!error,
          [styles.disabled]: disabled,
          [styles.loadingContainer]: loading,
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
                <span className={styles.placeholder}>
                  {isLabelFloating ? placeholder : ""}
                </span>
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
              onClick={(e) => {
                e.stopPropagation();
                onClear?.();
                setSelectedOption(null);
                setIsOpen(false);
              }}
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
        {renderDropdown()}
      </div>
    </PopoverInputWrapper>
  );
};
