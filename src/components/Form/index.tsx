"use client";

import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  className?: string;
  onSubmit: (data: T) => void | Promise<void>;
  form: UseFormReturn<T, any, T>;
  style?: React.CSSProperties;
};

export const Form = <T extends FieldValues>({
  children,
  onSubmit,
  form,
  ...props
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.displayName = "Form";
