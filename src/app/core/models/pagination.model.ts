export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
  exchangeRate?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
