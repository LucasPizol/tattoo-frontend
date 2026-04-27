"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useOptionalFormContext } from "@/hooks/useOptionalFormContext";
import { cn } from "@/utils/cn";
import { forwardRef, useMemo, useRef } from "react";
import { MdCalendarMonth } from "react-icons/md";
import { PopoverInputWrapper } from "../../PopoverInputWrapper";
import { Button } from "../Button";
import { Label } from "../Label";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  field?: string;
  noForm?: boolean;
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      field,
      noForm,
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
    const formCtx = useOptionalFormContext();
    const hasForm = !!formCtx && !!field && !noForm;

    const internalInputRef = useRef<HTMLInputElement | null>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const debounce = useDebounce();

    const formValue = hasForm ? formCtx.watch(field) : undefined;
    const formErrors = hasForm ? formCtx.formState.errors : {};

    const displayValue = useMemo(() => {
      if (hasForm) return undefined;
      if (props.value == null || props.value === "") return undefined;
      const stringValue = String(props.value);
      return mask ? mask(stringValue) : stringValue;
    }, [hasForm, props.value, mask]);

    const currentValue = hasForm ? formValue : displayValue;

    const showTodayButton = useMemo(() => {
      if (props.type !== "date") return false;
      const today = new Date().toISOString().split("T")[0];
      return currentValue !== today;
    }, [props.type, currentValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInputValue = e.target.value;
      const maskedValue = mask ? mask(rawInputValue) : rawInputValue;

      if (hasForm) {
        const valueToStore =
          props.type === "number" ? Number(maskedValue) : maskedValue;
        e.target.value = valueToStore as string;
        formCtx.setValue(field, valueToStore);
      }

      if (!hasForm) {
        onChange?.({
          ...e,
          target: { ...e.target, value: maskedValue },
        });
      } else {
        onChange?.(e);
      }

      debounce.onChangeDebounce(async () => {
        await onDebounceChange?.(maskedValue);
      });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e);
    };

    const registerRest = hasForm
      ? formCtx.register(field, {
          required: props.required,
          onChange: handleChange,
          onBlur: handleBlur,
          valueAsNumber: props.type === "number",
        })
      : undefined;

    const fieldError = hasForm ? formErrors[field] : undefined;
    const resolvedError = error || (fieldError?.message as string | undefined);

    const handleTodayClick = () => {
      const today = new Date().toISOString().split("T")[0];
      if (hasForm) {
        formCtx.setValue(field, today, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      onChange?.({
        target: { value: today },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(`${e.target.value}T00:00:00`);
      const formattedDate = date.toLocaleDateString("pt-BR");

      if (hasForm) {
        formCtx.setValue(field, formattedDate, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      onChange?.({
        target: { value: formattedDate, name: props.name },
        nativeEvent: e.nativeEvent,
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const inputProps = registerRest
      ? {
          ...registerRest,
          disabled: loading || props.disabled,
          placeholder: props.placeholder,
          type: props.type,
        }
      : {
          ...props,
          ref,
          value: displayValue,
          onChange: handleChange,
          disabled: loading || props.disabled,
          placeholder: props.placeholder,
        };

    return (
      <PopoverInputWrapper
        disabledHelperText={disabledHelperText}
        disabled={props.disabled}
      >
        <div
          className={cn(styles.input, className, {
            [styles.error]: !!resolvedError,
            [styles.loading]: loading,
            [styles.disabled]: props.disabled,
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
                onClick={handleTodayClick}
              >
                Hoje
              </Button>
            </div>
          )}

          {label && (
            <Label
              htmlFor={props.id}
              required={props.required}
              disabled={props.disabled}
              error={!!resolvedError}
            >
              {label}
            </Label>
          )}
          <div
            className={styles.inputContainer}
            onClick={() => internalInputRef.current?.focus()}
          >
            {prefixIcon && (
              <div className={styles.icon} style={{ paddingLeft: 8 }}>
                {prefixIcon}
              </div>
            )}
            <input {...inputProps} />

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
                  onChange={handleDateChange}
                />
                <div
                  className={styles.icon}
                  style={{ paddingRight: 8, cursor: "pointer" }}
                  onClick={() => dateRef.current?.showPicker()}
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
          {resolvedError && (
            <p className={styles.errorMessage}>{resolvedError}</p>
          )}
        </div>
      </PopoverInputWrapper>
    );
  },
);

Input.displayName = "Input";
