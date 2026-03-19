type ColumnProps = {
  flex?: number | string;
  children: React.ReactNode;
  span?: number;
};

export const Column = ({ flex, children, span }: ColumnProps) => {
  return <div style={{ flex, gridColumn: `span ${span}` }}>{children}</div>;
};
