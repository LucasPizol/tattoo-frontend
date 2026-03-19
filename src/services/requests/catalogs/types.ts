export const CatalogType = {
  CLIENT: "client",
  INTERNAL: "internal",
};

export type CatalogType = (typeof CatalogType)[keyof typeof CatalogType];
