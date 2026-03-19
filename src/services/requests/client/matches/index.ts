import { api } from "@/services/api";
import type { ClientShowResponse } from "../types";

export const ClientMatchesRequests = {
  index: (cpf: string) =>
    api.get<ClientShowResponse>(`/api/clients/matches`, {
      params: {
        cpf,
      },
    }),
};
