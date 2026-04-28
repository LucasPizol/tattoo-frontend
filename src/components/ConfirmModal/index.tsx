import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useModal } from "../ui/Modal/useModal";

type ConfirmModalProps = {
  onSave: () => Promise<void>;
  title?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  label?: string;
  fullWidthLabel?: boolean;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export const ConfirmModal = ({
  onSave,
  title = "Confirmar ação",
  children,
  trigger,
  label,
  fullWidthLabel = false,
  danger = false,
  disabled = false,
}: ConfirmModalProps) => {
  const { open, close, modalProps } = useModal({
    noForm: true,
    onSubmit: async () => {
      await onSave();
      close();
    },
  });

  return (
    <>
      <Modal
        {...modalProps}
        title={title}
        disabled={disabled}
        submitDanger={danger}
      >
        {children || <p>Tem certeza que deseja realizar esta ação?</p>}
      </Modal>
      {trigger ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            open();
          }}
          style={{ width: fullWidthLabel ? "100%" : undefined }}
        >
          {trigger}
        </div>
      ) : (
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            open();
          }}
          fullWidth={fullWidthLabel}
          danger={danger}
        >
          {label}
        </Button>
      )}
    </>
  );
};
