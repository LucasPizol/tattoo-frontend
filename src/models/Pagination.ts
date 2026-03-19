export type Pagination = {
  per_page: number;
  page: number;
};

export type PaginationResponse<T> = {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
};
