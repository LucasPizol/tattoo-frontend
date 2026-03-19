"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import { forwardRef, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MdCalendarMonth } from "react-icons/md";
import { PopoverInputWrapper } from "../../PopoverInputWrapper";
import { Button } from "../Button";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type FormInputProps = {
  field: string;
  noForm?: false;
};

type NoFormInputProps = {
  noForm: true;
  field?: never;
};

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  (FormInputProps | NoFormInputProps) & {
    label?: React.ReactNode;
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    error?: string;
    isDate?: boolean;
    onDebounceChange?: (value: string) => Promise<void> | void;
    loading?: boolean;
    fullWidth?: boolean;
    flex?: number | string;
    disabledHelperText?: string;
    mask?: (value: string) => string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  if ("field" in props) {
    return <FormInput {...(props as FormInputProps)} ref={ref} />;
  }
  return <NoFormInput {...(props as NoFormInputProps)} ref={ref} />;
});

const FormInput = forwardRef<HTMLInputElement, InputProps & FormInputProps>(
  ({
    field,
    label,
    prefixIcon,
    suffixIcon,
    error,
    className,
    isDate,
    onDebounceChange,
    loading,
    fullWidth = false,
    flex,
    disabledHelperText,
    mask,
    onChange,
    ...props
  }) => {
    const {
      register,
      setValue,
      watch,
      formState: { errors },
    } = useFormContext();

    const internalInputRef = useRef<HTMLInputElement | null>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const value = watch(field);

    const showTodayButton = useMemo(() => {
      if (props.type !== "date") return false;

      return value !== new Date().toISOString().split("T")[0];
    }, [props.type, value]);

    const hasValue = useMemo(() => {
      return !!value || !!props.defaultValue;
    }, [value, props.defaultValue]);

    // Quando usePlaceholderShown, não aplicamos classes JS, o CSS controla via :placeholder-shown
    const isLabelFloating = isFocused || hasValue;

    const debounce = useDebounce();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInputValue = e.target.value;
      const maskedValue = mask ? mask(rawInputValue) : rawInputValue;

      const valueToStore =
        props.type === "number" ? Number(maskedValue) : maskedValue;

      e.target.value = valueToStore as string;
      setValue(field, valueToStore);

      onChange?.(e);

      debounce.onChangeDebounce(async () => {
        await onDebounceChange?.(maskedValue);
      });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const registerRest = register(field || "", {
      required: props.required,
      onChange: handleChange,
      onBlur: handleBlur,
      valueAsNumber: props.type === "number",
    });

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    return (
      <PopoverInputWrapper
        disabledHelperText={disabledHelperText}
        disabled={props.disabled}
      >
        <div
          className={cn(styles.input, className, {
            [styles.error]: !!error,
            [styles.loading]: loading,
            [styles.disabled]: props.disabled,
            [styles.hasPrefixIcon]: !!prefixIcon,
            [styles.fullWidth]: fullWidth,
          })}
          style={{ flex }}
        >
          {showTodayButton && (
            <div className={styles.todayButtonWrapper}>
              <Button
                variant="primary"
                size="small"
                className={styles.todayButton}
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  setValue(field, today, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  onChange?.({
                    target: { value: today },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                Hoje
              </Button>
            </div>
          )}

          <div
            className={cn(styles.inputContainer, {
              [styles.focused]: isLabelFloating,
            })}
            onClick={() => {
              internalInputRef.current?.focus();
            }}
          >
            {prefixIcon && (
              <div className={styles.icon} style={{ paddingLeft: 8 }}>
                {prefixIcon}
              </div>
            )}
            <input
              {...registerRest}
              onFocus={handleFocus}
              disabled={loading || props.disabled}
              placeholder={isLabelFloating ? props.placeholder : ""}
              type={props.type}
            />

            {label && (
              <label
                className={cn(styles.label, {
                  [styles.floating]: isLabelFloating,
                })}
                htmlFor={props.id}
              >
                {label}
                {props.required && <span className={styles.required}>*</span>}
              </label>
            )}

            {isDate && (
              <>
                <input
                  ref={dateRef}
                  type="date"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  onChange={(e) => {
                    const date = new Date(`${e.target.value}T00:00:00`);
                    const formattedDate = date.toLocaleDateString("pt-BR");

                    setValue(field, formattedDate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    onChange?.({
                      target: {
                        value: formattedDate,
                        name: props.name,
                      },
                      nativeEvent: e.nativeEvent,
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
                <div
                  className={styles.icon}
                  style={{ paddingRight: 8, cursor: "pointer" }}
                  onClick={() => {
                    if (dateRef.current) {
                      dateRef.current.showPicker();
                    }
                  }}
                >
                  <MdCalendarMonth />
                </div>
              </>
            )}
            {suffixIcon && !loading && (
              <div className={styles.icon} style={{ paddingRight: 8 }}>
                {suffixIcon}
              </div>
            )}
            {loading && (
              <div className={styles.icon} style={{ paddingRight: 12 }}>
                <Loading size={16} />
              </div>
            )}
          </div>
          {errors[field] && (
            <p className={styles.errorMessage}>
              {errors[field]?.message as string}
            </p>
          )}
        </div>
      </PopoverInputWrapper>
    );
  },
);

export const NoFormInput = forwardRef<
  HTMLInputElement,
  InputProps & NoFormInputProps
>(
  (
    {
      field,
      label,
      prefixIcon,
      suffixIcon,
      error,
      className,
      isDate,
      onDebounceChange,
      loading,
      fullWidth = false,
      flex,
      disabledHelperText,
      mask,
      onChange,
      ...props
    },
    ref,
  ) => {
    const internalInputRef = useRef<HTMLInputElement | null>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const debounce = useDebounce();

    const displayValue = useMemo(() => {
      if (props.value == null || props.value === "") return undefined;
      const stringValue = String(props.value);
      return mask ? mask(stringValue) : stringValue;
    }, [props.value, mask]);

    const showTodayButton = useMemo(() => {
      if (props.type !== "date") return false;

      return displayValue !== new Date().toISOString().split("T")[0];
    }, [props.type, displayValue]);

    const hasValue = useMemo(() => {
      return !!displayValue || !!props.defaultValue;
    }, [displayValue, props.defaultValue]);

    // Quando usePlaceholderShown, não aplicamos classes JS, o CSS controla via :placeholder-shown
    const isLabelFloating = isFocused || hasValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInputValue = e.target.value;
      const maskedValue = mask ? mask(rawInputValue) : rawInputValue;

      onChange?.({
        ...e,
        target: {
          ...e.target,
          value: maskedValue,
        },
      });

      debounce.onChangeDebounce(async () => {
        await onDebounceChange?.(maskedValue);
      });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    return (
      <PopoverInputWrapper
        disabledHelperText={disabledHelperText}
        disabled={props.disabled}
      >
        <div
          className={cn(styles.input, className, {
            [styles.error]: !!error,
            [styles.loading]: loading,
            [styles.disabled]: props.disabled,
            [styles.hasPrefixIcon]: !!prefixIcon,
            [styles.fullWidth]: fullWidth,
          })}
          style={{ flex }}
        >
          {showTodayButton && (
            <div className={styles.todayButtonWrapper}>
              <Button
                variant="primary"
                size="small"
                className={styles.todayButton}
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  onChange?.({
                    target: { value: today },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                Hoje
              </Button>
            </div>
          )}

          <div
            className={cn(styles.inputContainer, {
              [styles.focused]: isLabelFloating,
            })}
            onClick={() => {
              internalInputRef.current?.focus();
            }}
          >
            {prefixIcon && (
              <div className={styles.icon} style={{ paddingLeft: 8 }}>
                {prefixIcon}
              </div>
            )}
            <input
              {...props}
              ref={ref}
              value={displayValue}
              onFocus={handleFocus}
              onChange={handleChange}
              disabled={loading || props.disabled}
              placeholder={isLabelFloating ? props.placeholder : ""}
            />

            {label && (
              <label
                className={cn(styles.label, {
                  [styles.floating]: isLabelFloating,
                })}
                htmlFor={props.id}
              >
                {label}
                {props.required && <span className={styles.required}>*</span>}
              </label>
            )}

            {isDate && (
              <>
                <input
                  ref={dateRef}
                  type="date"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  onChange={(e) => {
                    const date = new Date(`${e.target.value}T00:00:00`);
                    const formattedDate = date.toLocaleDateString("pt-BR");

                    onChange?.({
                      target: { value: formattedDate },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
                <div
                  className={styles.icon}
                  style={{ paddingRight: 8, cursor: "pointer" }}
                  onClick={() => {
                    if (dateRef.current) {
                      dateRef.current.showPicker();
                    }
                  }}
                >
                  <MdCalendarMonth />
                </div>
              </>
            )}
            {suffixIcon && !loading && (
              <div className={styles.icon} style={{ paddingRight: 8 }}>
                {suffixIcon}
              </div>
            )}
            {loading && (
              <div className={styles.icon} style={{ paddingRight: 8 }}>
                <Loading size={16} />
              </div>
            )}
          </div>
        </div>
      </PopoverInputWrapper>
    );
  },
);

Input.displayName = "Input";
