import type { Address } from "../address/types";
import type { Responsible } from "../responsible/types";

export type Client = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender?: string;
  maritalStatus?: string;
  allergicReactions?: boolean;
  healthNotes?: string | null;
  hasHealthConditions?: boolean;
  instagramProfile?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
  responsible?: Responsible;
  addresses?: Address[];
  healthConditions?: {
    name: string;
    value: string;
  }[];
};

export type Guardian = {
  name: string;
  cpf: string;
  rg?: string;
  birth_date: string;
  gender: string;
  email?: string;
  phone: string;
};

export type ClientCreatePayload = {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  gender?: string | null;
  marital_status?: string | null;
  instagram_profile?: string;
  allergic_reactions?: boolean;
  health_notes?: string | null;
  observations?: string | null;
  guardian?: Guardian;
  indicated_by_id?: number | null;
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  totalValue: string;
  paymentMethod: string;
  orderProducts: {
    id: number;
    quantity: number;
    value: string;
    product: {
      id: number;
      name: string;
      categories: string[];
      images: {
        url: string;
        id: number;
        thumbnailUrl: string;
      }[];
    };
  }[];
};

export type ClientIndexResponse = {
  clients: Client[];
};

export type ClientShowResponse = {
  client: Client & {
    responsible: Responsible;
    orders: Order[];
    isLowerAge: boolean;
    age: number;
    indicatedBy: {
      id: number;
      name: string;
    };
  };
};

export type ClientEditResponse = {
  client: Client & {
    responsible: Responsible;
    isLowerAge: boolean;
    age: number;
    indicatedBy: {
      id: number;
      name: string;
    };
  };
};
