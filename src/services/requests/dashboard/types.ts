import type { MoneyValue } from "../orders/types";

export type DashboardFilter = {
  paid_at_gteq?: string;
  paid_at_lteq?: string;
};

export type TagsPercentageResponse = {
  tags: {
    [key: string]: number;
  };
};

export type OrderCountResponse = {
  orderCount: number;
};

export type ProductSellsResponse = {
  productSells: {
    [key: string]: number;
  };
};

export type MaterialsResponse = {
  materials: {
    [key: string]: number;
  };
};

export type ClientSellsResponse = {
  clientSells: {
    [key: string]: number;
  };
};

export type ValuesEvolutionResponse = {
  valuesEvolution: {
    [key: string]: number;
  };
  usersEvolution: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type SummariesResponse = {
  summary: string;
};

export type SellersResponse = {
  sellers: {
    name: string;
    valueExpected: MoneyValue;
    valueReceived: MoneyValue;
    holdingShipmentValue: MoneyValue;
    debt: MoneyValue;
    inDebt: boolean;
  }[];
};

export type AgeResponse = {
  age: number;
};

export type ReportResponse = {
  report: {
    id: number;
    content: string;
  };
};

export type ProductTypesResponse = {
  productTypes: {
    [key: string]: number;
  };
};
