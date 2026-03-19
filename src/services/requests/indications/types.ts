export type Indication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalIndications: number;
  totalIndicationsWhoBought: number;
  totalValue: {
    value: number;
    currency: string;
    formatted: string;
  };
};
