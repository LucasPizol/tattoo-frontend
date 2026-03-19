"use client";

import { cn } from "@/utils/cn";
import { forwardRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "./styles.module.scss";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  layout?: "horizontal" | "vertical";
  onCheckedChange?: (value: boolean) => void | Promise<void>;
  field: string;
  checked?: boolean;
  noForm?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ noForm, layout = "horizontal", ...props }, ref) => {
    if (noForm) {
      return <UnFormCheckbox {...props} ref={ref} />;
    }
    return <FormCheckbox {...props} ref={ref} />;
  },
);

const FormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className,
      layout = "horizontal",
      onCheckedChange,
      field,
      checked,
      noForm = false,
      ...props
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);
    const { register, setValue, formState, watch } = useFormContext();

    return (
      <div
        className={cn(styles.checkbox, className, {
          [styles.error]: !!error,
          [styles.vertical]: layout === "vertical",
          [styles.disabled]: props.disabled,
        })}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.checkboxContainer}>
          <input
            {...register(field)}
            {...props}
            checked={checked !== undefined ? checked : watch(field)}
            disabled={formState.isSubmitting || props.disabled || loading}
            ref={ref}
            type="checkbox"
            className={styles.input}
            id={field}
            onChange={async (e) => {
              try {
                setLoading(true);
                if (onCheckedChange) {
                  await onCheckedChange(e.target.checked);
                } else {
                  setValue(field, e.target.checked);
                }
                props.onChange?.(e);
              } catch (error) {
                throw error;
              } finally {
                setLoading(false);
              }
            }}
          />
          {label && (
            <label
              className={cn(styles.label, {
                [styles.horizontal]: layout === "horizontal",
                [styles.vertical]: layout === "vertical",
              })}
              htmlFor={field}
            >
              {label}
              {props.required && <span className={styles.required}>*</span>}
            </label>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  },
);

const UnFormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className,
      layout = "horizontal",
      onCheckedChange,
      field,
      checked,
      noForm = false,
      ...props
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);
    return (
      <div
        className={cn(styles.checkbox, className, {
          [styles.error]: !!error,
          [styles.vertical]: layout === "vertical",
          [styles.disabled]: props.disabled,
        })}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.checkboxContainer}>
          <input
            {...props}
            checked={checked}
            disabled={props.disabled || loading}
            ref={ref}
            type="checkbox"
            className={styles.input}
            id={field}
            onChange={async (e) => {
              try {
                setLoading(true);
                if (onCheckedChange) {
                  await onCheckedChange(e.target.checked);
                }
                props.onChange?.(e);
              } catch (error) {
                throw error;
              } finally {
                setLoading(false);
              }
            }}
          />
          {label && (
            <label className={styles.label} htmlFor={field}>
              {label}
              {props.required && <span className={styles.required}>*</span>}
            </label>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
