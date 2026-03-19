export type Tag = {
  id: number;
  name: string;
  notes?: string;
  parentTag: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  children: Tag[];
};
