export type Category = {
  id: number;
  name: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryPayload = {
  name: string;
  notes?: string;
};

export type CategoryFilters = {
  name_cont?: string;
};
