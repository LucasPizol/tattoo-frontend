import axios from "axios";
import type { CatalogType } from "./types";

export const CatalogsRequests = {
  show: async (type: CatalogType) => {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const response = await axios.get(`${baseURL}/catalogs/${type}`, {
      responseType: "blob",
      withCredentials: true,
      headers: {
        Accept: "application/pdf",
      },
    });

    return response.data;
  },
};
