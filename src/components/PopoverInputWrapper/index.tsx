import { Popover } from "../ui/Popover";

type PopoverInputWrapperProps = {
  children: React.ReactNode;
  disabledHelperText?: string;
  disabled?: boolean;
};

export const PopoverInputWrapper = ({
  children,
  disabledHelperText,
  disabled,
}: PopoverInputWrapperProps) => {
  if (!disabled || !disabledHelperText) return children;

  return <Popover content={disabledHelperText}>{children}</Popover>;
};
