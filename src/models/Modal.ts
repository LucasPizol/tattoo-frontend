export type ModalProps<T> = {
  isOpen?: boolean;
  onClose: () => void;
  onSave: () => void;
  data?: T;
};
