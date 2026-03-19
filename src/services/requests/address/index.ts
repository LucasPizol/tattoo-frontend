import { api } from "@/services/api";
import axios from "axios";
import type { AddressViaCep } from "./types";

const search = async (zipCode: string) => {
  const value = zipCode.replace(/[^\d]/g, "");
  const response = await axios.get<AddressViaCep>(
    `https://viacep.com.br/ws/${value}/json/`
  );
  return response.data;
};

export const AddressRequests = {
  search,
  delete: (id: number) => api.delete(`/api/addresses/${id}`),
};
