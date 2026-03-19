import type { Pagination, PaginationResponse } from "@/models/Pagination";
import type { ClientFilters } from "@/schemas/client/filters";
import { api } from "@/services/api";
import type { AddressCreatePayload } from "../address/types";
import type {
  Client,
  ClientCreatePayload,
  ClientEditResponse,
  ClientShowResponse,
} from "./types";

type ClientErrors = {
  [K in
    | keyof ClientCreatePayload
    | keyof AddressCreatePayload
    | keyof Partial<ClientCreatePayload>]: string;
};

export const ClientRequests = {
  create: (
    payload: ClientCreatePayload,
    addresses?: AddressCreatePayload[],
    responsiblePayload?: Partial<ClientCreatePayload>
  ) =>
    api.post<ClientShowResponse, ClientErrors>("/api/clients", {
      client: payload,
      addresses,
      responsible: responsiblePayload,
    }),
  index: (data: Pagination & { q?: ClientFilters }) =>
    api.get<PaginationResponse<Client>>("/api/clients", data),
  show: (id: number) => api.get<ClientShowResponse>(`/api/clients/${id}`),
  edit: (id: number) => api.get<ClientEditResponse>(`/api/clients/${id}/edit`),
  update: (
    id: number,
    clientPayload: Partial<ClientCreatePayload>,
    responsiblePayload?: Partial<ClientCreatePayload>,
    addresses?: AddressCreatePayload[]
  ) =>
    api.put<ClientShowResponse, ClientErrors>(`/api/clients/${id}`, {
      client: clientPayload,
      responsible: responsiblePayload,
      addresses,
    }),
  delete: (id: number) => api.delete(`/api/clients/${id}`),
};
