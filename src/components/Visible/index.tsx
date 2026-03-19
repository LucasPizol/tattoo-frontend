type VisibleProps = {
  children: React.ReactNode;
  condition: boolean | undefined | null;
};

export const Visible = ({ children, condition }: VisibleProps) => {
  return condition ? children : null;
};
