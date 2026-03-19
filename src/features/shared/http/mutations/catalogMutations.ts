import axios from "axios";
import type { CatalogType } from "../../types/catalog";

export const fetchCatalog = async (type: CatalogType): Promise<Blob> => {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const response = await axios.get(`${baseURL}/catalogs/${type}`, {
    responseType: "blob",
    withCredentials: true,
    headers: {
      Accept: "application/pdf",
    },
  });

  return response.data;
};
