import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, useForm, type UseFormReturn } from "react-hook-form";
import type { ZodSchema } from "zod";
import { Form } from "../../Form";
import styles from "./styles.module.scss";

type RowFormProps<T extends FieldValues> = {
  children: (form: UseFormReturn<T>) => React.ReactNode;
  onSubmit: (data: T) => void;
  schema: ZodSchema<T>;
};

export const RowForm = <T extends FieldValues>({
  children,
  schema,
  onSubmit,
}: RowFormProps<T>) => {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
  });

  return (
    <Form form={form} onSubmit={onSubmit} className={styles.rowFormWrapper}>
      {children(form)}
    </Form>
  );
};
