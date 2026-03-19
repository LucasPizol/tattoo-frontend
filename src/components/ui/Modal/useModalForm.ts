import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type { ZodSchema } from "zod";
import type { ModalPropsForm } from ".";

export type OnSubmitReturnType<T extends FieldValues, C> = (
  data: T,
  reference: C | null
) => void | Promise<void>;

export type UseModalOptions<T extends FieldValues, C> = {
  initialValues?: DefaultValues<T>;
  schema?: ZodSchema<T>;
  onSubmit?: OnSubmitReturnType<T, C>;
  onOpen?: (reference: C | null) => void;
  form?: UseFormReturn<T>;
  noForm?: false;
};

export type UseModalReturn<T extends FieldValues, C> = {
  open: (values?: DefaultValues<T>, reference?: C | null) => void;
  close: () => void;
  isOpen: boolean;
  modalProps: Pick<ModalPropsForm<T, C>, "isOpen" | "onClose" | "form"> & {
    onSubmit?: OnSubmitReturnType<T, C>;
    currentReference?: C | null;
  };
  currentReference?: C | null;
  form: UseFormReturn<T>;
};

export const useModalForm = <T extends FieldValues, C>(
  options: UseModalOptions<T, C> = {}
): UseModalReturn<T, C> => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState<C | null>(null);

  const form = useForm<T>({
    defaultValues: options.initialValues,
    resolver: options.schema
      ? zodResolver(options.schema as unknown as any)
      : undefined,
  });

  const open = useCallback(
    (values?: DefaultValues<T>, reference?: C | null) => {
      const valuesToUse = values ?? options.initialValues;
      if (valuesToUse) {
        form.reset({...options.initialValues, ...valuesToUse});
      }
      options.onOpen?.(reference ?? null);
      setCurrentReference(reference ?? null);
      setIsOpen(true);
    },
    [options.initialValues, form]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentReference(null);
  }, []);

  const handleSubmit = useCallback(
    async (data: T) => {
      await options.onSubmit?.(data, currentReference);
    },
    [options.onSubmit, currentReference]
  );

  const modalProps = useMemo(
    () => ({
      isOpen,
      onClose: close,
      form,
      onSubmit: handleSubmit,
      currentReference,
    }),
    [isOpen, close, form, handleSubmit]
  );

  return {
    open,
    close,
    isOpen,
    modalProps,
    form,
    currentReference,
  };
};
