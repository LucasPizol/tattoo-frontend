export type Campaign = {
  id: number;
  name: string;
  description: string;
  indicationsOrders: boolean;
  campaingType: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCampaignPayload = {
  name: string;
  description: string;
  indicationsOrders: boolean;
  campaingType: string;
  active: boolean;
};

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;
