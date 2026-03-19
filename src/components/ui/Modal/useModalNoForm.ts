import { useCallback, useMemo, useState } from "react";
import type { ModalPropsNoForm } from ".";

type OnSubmit<C> = (reference: C | null) => void | Promise<void>;

export type UseModalOptions<C> = {
  onSubmit?: OnSubmit<C>;
  onOpen?: (reference: C | null) => void;
  noForm?: true;
};

export type UseModalReturn<C> = {
  open: (reference?: C | null) => void;
  close: () => void;
  isOpen: boolean;
  modalProps: Pick<ModalPropsNoForm<C>, "isOpen" | "onClose"> & {
    onSubmit?: OnSubmit<C>;
    currentReference?: C | null;
  };
  currentReference?: C | null;
};

export const useModalNoForm = <C>(
  options: UseModalOptions<C> = {}
): UseModalReturn<C> => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState<C | null>(null);

  const open = useCallback(
    (reference?: C | null) => {
      options.onOpen?.(reference ?? null);
      setCurrentReference(reference ?? null);
      setIsOpen(true);
    },
    [options.onOpen]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentReference(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    await options.onSubmit?.(currentReference);
  }, [options.onSubmit, currentReference]);

  const modalProps = useMemo(
    () => ({
      isOpen,
      onClose: close,
      onSubmit: handleSubmit,
      currentReference,
    }),
    [isOpen, close, handleSubmit]
  );

  return {
    open,
    close,
    isOpen,
    modalProps,
    currentReference,
  };
};
