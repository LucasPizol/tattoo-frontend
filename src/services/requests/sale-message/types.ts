export type SaleMessage = {
  id: number;
  scheduledAt: string;
};

export type SaleMessageCreatePayload = {
  scheduled_at: string;
  order_id: number;
};
