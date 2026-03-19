import { useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import InnerModal from "./InnerModal";

export type ModalSize = "small" | "medium" | "large";

type ModalPropsBase<C> = {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: ModalSize;
  children?: React.ReactNode;
  showFooter?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  currentReference?: C | null;
  className?: string;
  disabled?: boolean;
  fullScreen?: boolean;
  leftFooterContent?: React.ReactNode;
};

export type ModalPropsNoForm<C> = ModalPropsBase<C>;

export type ModalPropsForm<T extends FieldValues, C> = ModalPropsBase<C> & {
  form?: UseFormReturn<T>;
  onSubmit?: (data: T, reference: C | null) => void | Promise<void>;
};

export const Modal = <T extends FieldValues, C>(
  props: ModalPropsForm<T, C> | ModalPropsNoForm<C>,
) => {
  const { isOpen, onClose, closeOnEscape } = props;

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  if ("form" in props) {
    return <ModalForm<T, C> {...props} />;
  }
  return <ModalNoForm<C> {...(props as ModalPropsNoForm<C>)} />;
};

const ModalForm = <T extends FieldValues, C>(props: ModalPropsForm<T, C>) => {
  return createPortal(
    <InnerModal {...props} />,
    document.querySelector("#modal-root") as HTMLElement,
  );
};

const ModalNoForm = <C,>(props: ModalPropsNoForm<C>) => {
  return createPortal(
    <InnerModal {...props} noForm />,
    document.querySelector("#modal-root") as HTMLElement,
  );
};

Modal.displayName = "Modal";
