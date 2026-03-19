import axios from "axios";
import type { AddressViaCep } from "../../types/address";

export const fetchAddressByZipCode = async (zipCode: string): Promise<AddressViaCep> => {
  const value = zipCode.replace(/[^\d]/g, "");
  const response = await axios.get<AddressViaCep>(
    `https://viacep.com.br/ws/${value}/json/`
  );
  return response.data;
};
