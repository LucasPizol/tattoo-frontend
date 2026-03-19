import { cn } from "@/utils/cn";
import { Suspense, useRef, useState, type ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { MdClose } from "react-icons/md";
import type { ModalSize } from ".";
import { Form } from "../../Form";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Loading } from "../Loading";
import styles from "./styles.module.scss";

type InnerModalProps = {
  form?: UseFormReturn<any>;
  onSubmit?: (data: any, reference: any | null) => void | Promise<void>;
  title?: ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
  size?: ModalSize;
  currentReference?: any;
  showFooter?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  disabled?: boolean;
  fullScreen?: boolean;
  noForm?: boolean;
  leftFooterContent?: React.ReactNode;
};

const InnerModal = ({
  form,
  onSubmit,
  title,
  noForm = false,
  children,
  onClose,
  currentReference,
  size = "medium",
  showFooter = true,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  className,
  disabled,
  fullScreen = false,
  leftFooterContent,
}: InnerModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTargetRef.current = e.target;
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Só fecha se o mousedown E o mouseup aconteceram no overlay
    const clickedOnOverlay = e.target === e.currentTarget;
    const mouseDownOnOverlay = mouseDownTargetRef.current === e.currentTarget;

    if (clickedOnOverlay && mouseDownOnOverlay) {
      onClose();
    }
  };

  const handleSubmit = async (data: any) => {
    if (!onSubmit) return;

    try {
      setIsLoading(true);
      await onSubmit(data, currentReference ?? null);
      onClose();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(styles.modalOverlay, { [styles.fullScreen]: fullScreen })}
      onMouseDown={handleMouseDown}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(styles.modalContainer, styles[size], className, {
          [styles.fullScreen]: fullScreen,
        })}
      >
        <Suspense
          fallback={
            <div className={styles.loading}>
              <Loading />
            </div>
          }
        >
          {!noForm && form && handleSubmit ? (
            <Form
              form={form}
              onSubmit={handleSubmit}
              className={styles.modalForm}
            >
              {title && (
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>{title}</h2>
                  <IconButton
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    removeMobileAttributes
                  >
                    <MdClose size={20} />
                  </IconButton>
                </div>
              )}

              <div className={styles.modalBody}>{children}</div>

              {showFooter && (
                <div
                  className={styles.modalFooter}
                  style={{
                    justifyContent: leftFooterContent
                      ? "space-between"
                      : "flex-end",
                  }}
                >
                  {leftFooterContent && (
                    <div className={styles.modalFooterContentLeft}>
                      {leftFooterContent}
                    </div>
                  )}
                  <div className={styles.modalFooterActions}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      {cancelLabel}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={isLoading}
                      disabled={disabled}
                    >
                      {submitLabel}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          ) : (
            <>
              {title && (
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>{title}</h2>
                  <IconButton
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                  >
                    <MdClose size={20} />
                  </IconButton>
                </div>
              )}

              <div className={styles.modalBody}>{children}</div>

              {showFooter && (
                <div
                  className={styles.modalFooter}
                  style={{
                    justifyContent: leftFooterContent
                      ? "space-between"
                      : "flex-end",
                  }}
                >
                  {leftFooterContent && (
                    <div className={styles.modalFooterContentLeft}>
                      {leftFooterContent}
                    </div>
                  )}
                  <div className={styles.modalFooterActions}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      {cancelLabel}
                    </Button>
                    {noForm && (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {submitLabel}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default InnerModal;
