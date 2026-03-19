import { api } from "@/services/api";
import type { Contract, ContractDetail } from "./types";

const pending = async () => {
  const response = await api.get<{ contract: Contract | null }>("/api/contracts/pending");
  return response.contract;
};

const show = async (id: number) => {
  const response = await api.get<{ contract: ContractDetail }>(`/api/contracts/${id}`);
  return response.contract;
};

const sign = async (id: number, signature: string) => {
  const response = await api.post<{ message: string }>(`/api/contracts/${id}/sign`, {
    signature,
  });
  return response.message;
};

export const ContractRequests = {
  pending,
  show,
  sign,
};
