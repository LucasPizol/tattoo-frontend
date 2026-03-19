import { api } from "@/services/api";
import type {
  AgeResponse,
  TagsPercentageResponse,
  ClientSellsResponse,
  DashboardFilter,
  MaterialsResponse,
  OrderCountResponse,
  ProductSellsResponse,
  ProductTypesResponse,
  ReportResponse,
  SellersResponse,
  SummariesResponse,
  ValuesEvolutionResponse,
} from "./types";

const tagsPercentage = async (filter: DashboardFilter) => {
  return await api.get<TagsPercentageResponse>(
    "/api/dashboard/tags",
    { q: filter }
  );
};

const orderCount = async (filter: DashboardFilter) => {
  return await api.get<OrderCountResponse>("/api/dashboard/order_counts", {
    q: filter,
  });
};

const productSells = async (filter: DashboardFilter) => {
  return await api.get<ProductSellsResponse>("/api/dashboard/product_sells", {
    q: filter,
  });
};

const valuesEvolution = async (filter: DashboardFilter) => {
  return await api.get<ValuesEvolutionResponse>(
    "/api/dashboard/values_evolutions",
    { q: filter }
  );
};

const materials = async (filter: DashboardFilter) => {
  return await api.get<MaterialsResponse>("/api/dashboard/materials", {
    q: filter,
  });
};

const clientSells = async (filter: DashboardFilter) => {
  return await api.get<ClientSellsResponse>("/api/dashboard/client_sells", {
    q: filter,
  });
};

const summaries = async (filter: DashboardFilter) => {
  return await api.get<SummariesResponse>("/api/dashboard/summaries", {
    q: filter,
  });
};

const sellers = async (filter: DashboardFilter) => {
  return await api.get<SellersResponse>("/api/dashboard/sellers", {
    q: filter,
  });
};

const age = async (filter: DashboardFilter) => {
  return await api.get<AgeResponse>("/api/dashboard/age", {
    q: filter,
  });
};

const report = async () => {
  return await api.get<ReportResponse>("/api/dashboard/reports");
};

const adjustSellers = async () => {
  return await api.put<void>("/api/dashboard/sellers/adjust_sellers");
};

const adjustShipmentReceivedValue = async () => {
  return await api.put<void>(
    "/api/dashboard/sellers/adjust_shipment_received_value"
  );
};

const productTypes = async (filter: DashboardFilter) => {
  return await api.get<ProductTypesResponse>("/api/dashboard/product_types", {
    q: filter,
  });
};

export const DashboardRequests = {
  tagsPercentage,
  orderCount,
  productSells,
  valuesEvolution,
  materials,
  clientSells,
  summaries,
  sellers,
  age,
  report,
  adjustSellers,
  adjustShipmentReceivedValue,
  productTypes,
};
