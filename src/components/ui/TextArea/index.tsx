import { cn } from "@/utils/cn";
import { forwardRef, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "./styles.module.scss";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  error?: string;
  field: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { label, prefixIcon, suffixIcon, error, field, className, ...props },
    ref
  ) => {
    const {
      register,
      setValue,
      watch,
      formState: { errors },
    } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);

    const mainRef = useRef<HTMLDivElement>(null);
    const inputRef = ref || mainRef;

    const hasValue = useMemo(() => {
      return !!props.value || !!props.defaultValue;
    }, [props.value, props.defaultValue]);

    const isLabelFloating = isFocused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      props.onChange?.(e);
      setValue(field, e.target.value);
    };

    return (
      <div
        className={cn(styles.textArea, className, {
          [styles.error]: !!error,
          [styles.focused]: isLabelFloating,
          [styles.disabled]: props.disabled,
        })}
      >
        <div
          className={styles.textAreaContainer}
          onClick={() => {
            (
              inputRef as unknown as React.RefObject<HTMLTextAreaElement>
            )?.current?.focus();
          }}
        >
          {prefixIcon}
          <textarea
            {...register(field, { onBlur: handleBlur, onChange: handleChange })}
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            {...props}
            value={watch(field)}
            onFocus={handleFocus}
            placeholder={isLabelFloating ? props.placeholder : ""}
          />
          {suffixIcon}
          {label && (
            <label
              className={cn(styles.label, {
                [styles.floating]: !!isLabelFloating,
              })}
              htmlFor={props.id}
              onClick={() => {
                (
                  inputRef as unknown as React.RefObject<HTMLTextAreaElement>
                )?.current?.focus();
              }}
            >
              {label}
              {props.required && <span className={styles.required}>*</span>}
            </label>
          )}
        </div>
        {errors[field] && (
          <p className={styles.error}>{errors[field]?.message as string}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
