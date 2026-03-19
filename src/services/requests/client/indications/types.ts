export type Indication = {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalPaidOrders: number;
  indicatedAt: string;
  totalValue: {
    value: number;
    currency: string;
    formatted: string;
  };
};
